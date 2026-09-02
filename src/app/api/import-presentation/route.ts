import { NextRequest, NextResponse } from "next/server";
import { PresentationSlide, createBlankSlide, createTextElement } from "@/lib/presentation-types";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Polyfills for pdf-parse
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

        const fileName = file.name.toLowerCase();

        if (fileName.endsWith('.pdf')) {
            return await handlePDF(file);
        } else if (fileName.endsWith('.pptx')) {
            return await handlePPTX();
        } else {
            return NextResponse.json({
                success: false,
                message: "Unsupported file format. Please upload PDF or PPTX"
            }, { status: 400 });
        }

    } catch (error) {
        console.error("Import Error:", error);
        return NextResponse.json({
            success: false,
            message: `Failed to import: ${error instanceof Error ? error.message : 'Unknown error'}`
        }, { status: 500 });
    }
}

async function handlePDF(file: File): Promise<NextResponse> {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const slideTexts: string[] = [];

    // Extract text from each page
    await pdf(buffer, {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pagerender: function (pageData: any) {
            return pageData.getTextContent()
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .then(function (textContent: any) {
                    let text = '';
                    const items = textContent.items || [];

                    // Group items by vertical position to maintain layout
                    const lineMap = new Map<number, string[]>();

                    for (const item of items) {
                        if (item.str?.trim()) {
                            const y = Math.round(item.transform[5]);
                            if (!lineMap.has(y)) {
                                lineMap.set(y, []);
                            }
                            lineMap.get(y)!.push(item.str);
                        }
                    }

                    // Sort by Y position (top to bottom) and join
                    const sortedLines = Array.from(lineMap.entries())
                        .sort((a, b) => b[0] - a[0]) // Higher Y = top of page
                        .map(([, words]) => words.join(' '));

                    text = sortedLines.join('\n');
                    slideTexts.push(text);
                    return text;
                });
        }
    });

    // Convert to canvas-based slides
    const slides: PresentationSlide[] = slideTexts.map((text, index) => {
        console.log(`Processing slide ${index + 1}, text length: ${text.length}`);
        const slide = createBlankSlide();

        if (!text.trim()) {
            console.log(`Slide ${index + 1} is empty`);
            // Empty slide - still add a placeholder text
            const placeholderElement = createTextElement({ x: 100, y: 100 });
            placeholderElement.text = `Slide ${index + 1}`;
            placeholderElement.fontSize = 36;
            placeholderElement.fontWeight = 700;
            placeholderElement.size.width = 600;
            placeholderElement.size.height = 60;
            placeholderElement.color = '#94a3b8';
            slide.elements.push(placeholderElement);
            return slide;
        }

        const lines = text.split('\n').filter(l => l.trim().length > 0);

        if (lines.length === 0) {
            console.log(`Slide ${index + 1} has no lines after filtering`);
            return slide;
        }

        console.log(`Slide ${index + 1} has ${lines.length} lines`);

        // First line as title
        const titleText = lines[0].trim();
        const titleElement = createTextElement({ x: 100, y: 100 });
        titleElement.text = titleText;
        titleElement.fontSize = 48;
        titleElement.fontWeight = 700;
        titleElement.size.width = 800;
        titleElement.size.height = 80;
        titleElement.color = '#ffffff';
        slide.elements.push(titleElement);

        // Rest as body text
        if (lines.length > 1) {
            const bodyText = lines.slice(1).join('\n');
            const bodyElement = createTextElement({ x: 100, y: 220 });
            bodyElement.text = bodyText;
            bodyElement.fontSize = 24;
            bodyElement.fontWeight = 400;
            bodyElement.size.width = 800;
            bodyElement.size.height = 600;
            bodyElement.lineHeight = 1.6;
            bodyElement.color = '#e2e8f0';
            slide.elements.push(bodyElement);
        }

        console.log(`Slide ${index + 1} created with ${slide.elements.length} elements`);
        return slide;
    });

    console.log(`Total slides created: ${slides.length}`);
    slides.forEach((slide, i) => {
        console.log(`Slide ${i + 1}: ${slide.elements.length} elements`);
    });

    return NextResponse.json({
        success: true,
        slides,
        message: `Imported ${slides.length} slides from PDF`
    });
}

async function handlePPTX(): Promise<NextResponse> {
    // For PPTX, we'll convert each slide to an image and import as image elements
    // This requires additional libraries like pptx2json or converting via LibreOffice
    // For now, return a helpful message

    return NextResponse.json({
        success: false,
        message: "PPTX import coming soon! For now, please export your PPTX as PDF and import that."
    }, { status: 501 });

    // TODO: Implement PPTX parsing
    // Could use libraries like:
    // - officegen (for reading)
    // - pptxgenjs (for parsing)
    // - Or convert to images server-side using LibreOffice
}
