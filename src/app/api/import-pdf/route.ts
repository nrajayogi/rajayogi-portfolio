import { NextRequest, NextResponse } from "next/server";

export const runtime = 'nodejs'; // Force Node.js runtime for pdf-parse
export const dynamic = 'force-dynamic';

if (!global.DOMMatrix) {
    global.DOMMatrix = class DOMMatrix {
        constructor() { }
        toString() { return "matrix(1, 0, 0, 1, 0, 0)"; }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
}
// @ts-expect-error -- Polyfill for missing Canvas in Node
if (!global.Canvas) {
    // @ts-expect-error -- Polyfill for missing Canvas in Node
    global.Canvas = class Canvas {
        getContext() { return { fillText: () => { }, measureText: () => ({ width: 0 }) }; }
    }
}

// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfModule = require("pdf-parse/lib/pdf-parse.js");
const pdf = pdfModule;

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ success: false, message: "No file uploaded" }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const slideTexts: string[] = [];

        // v1.1.1 uses a simple function call
        await pdf(buffer, {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            pagerender: function (pageData: any) {
                return pageData.getTextContent()
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    .then(function (textContent: any) {
                        let lastY, text = '';
                        // PDF parse items access
                        for (const item of textContent.items) {
                            if (item.str?.trim()) {
                                text += item.str + ' ';
                            }
                            // Naive line break detection
                            if (lastY !== item.transform[5] && lastY) {
                                text += '\n';
                            }
                            lastY = item.transform[5];
                        }
                        slideTexts.push(text);
                        return text;
                    });
            }
        });

        // Now slideTexts should have one entry per page
        const slides = slideTexts.map((text) => {
            // Basic formatting: Title detection (first line)
            const lines = text.split('\n').filter(l => l.trim().length > 0);
            if (lines.length === 0) return "<h2>Image/Empty Slide</h2>";

            const title = lines[0];
            const body = lines.slice(1).join('<br />');

            return `<h2>${title}</h2><p>${body}</p>`;
        });

        return NextResponse.json({ success: true, slides });

    } catch (error) {
        console.error("PDF Parsing Error:", error);
        return NextResponse.json({ success: false, message: "Failed to parse PDF" }, { status: 500 });
    }
}
