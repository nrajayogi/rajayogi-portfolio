
import { NextRequest, NextResponse } from "next/server";
import JSZip from "jszip";
import { PrismaClient } from "@prisma/client";

export const runtime = 'nodejs'; // Force Node.js runtime for Prisma & Buffer ops
export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ success: false, message: "No file uploaded" }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const zip = await JSZip.loadAsync(arrayBuffer);

        // 1. Find slides
        // PPTX structure: ppt/slides/slide1.xml, slide2.xml, etc.
        const slideFiles = Object.keys(zip.files).filter(path => path.startsWith("ppt/slides/slide") && path.endsWith(".xml"));

        // Sort explicitly by number to ensure order: slide1, slide2, slide10
        slideFiles.sort((a, b) => {
            const numA = parseInt(a.match(/slide(\d+)\.xml/)?.[1] || "0");
            const numB = parseInt(b.match(/slide(\d+)\.xml/)?.[1] || "0");
            return numA - numB;
        });

        const slides: string[] = [];

        for (const slidePath of slideFiles) {
            const slideXml = await zip.file(slidePath)?.async("string");
            if (!slideXml) continue;

            const slideNum = slidePath.match(/slide(\d+)\.xml/)?.[1];
            let slideHtml = "";

            // --- 1. TEXT PARSING (Existing Logic) ---
            const textMatches = slideXml.match(/<a:t[^>]*>(.*?)<\/a:t>/g);
            let hasText = false;

            if (textMatches && textMatches.length > 0) {
                hasText = true;
                const cleanTexts = textMatches.map(t => t.replace(/<\/?a:t[^>]*>/g, ""));

                const title = cleanTexts[0];
                const body = cleanTexts.slice(1);

                slideHtml += `<h2>${title}</h2>`;
                if (body.length > 0) {
                    slideHtml += `<ul>`;
                    body.forEach(line => {
                        if (line.trim()) slideHtml += `<li>${line}</li>`;
                    });
                    slideHtml += `</ul>`;
                }
            }

            // --- 2. IMAGE PARSING (New Logic) ---
            // Look for relationships file: ppt/slides/_rels/slideX.xml.rels
            const relsPath = `ppt/slides/_rels/slide${slideNum}.xml.rels`;
            const relsXml = await zip.file(relsPath)?.async("string");

            if (relsXml) {
                // simple regex to find images: Type=".../image" Target="..."
                // <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="../media/image1.png"/>

                // We want to capture the Target for any relationship of Type image
                const imageRelMatches = [...relsXml.matchAll(/Type="[^"]*\/relationships\/image"[^>]*Target="([^"]*)"/g)];

                for (const match of imageRelMatches) {
                    const relativeTarget = match[1]; // e.g., "../media/image1.png"
                    // Resolve path: ppt/slides/ + ../media/image1.png -> ppt/media/image1.png
                    // Simple replacement: remove ../
                    const targetPath = relativeTarget.replace("../", "ppt/");

                    // Sometimes target is just "media/image1.png" if not relative? Usually it is relative in PPTX.
                    // Fallback normalizer
                    if (!targetPath.startsWith("ppt/")) {
                        // Should verify zip path structure but typically standard is ppt/media
                        // If it's technically absolute in the zip root 'media/image1.png', adapt.
                        // But usually 'ppt/media'.
                        // Let's rely on standard case or try both.
                    }

                    const imgFile = zip.file(targetPath);
                    if (imgFile) {
                        const imgBuffer = await imgFile.async("nodebuffer"); // prisma needs buffer
                        const filename = targetPath.split('/').pop() || "image.png";

                        // Detect mime (basic)
                        const ext = filename.split('.').pop()?.toLowerCase();
                        let mimeType = "image/png";
                        if (ext === "jpg" || ext === "jpeg") mimeType = "image/jpeg";
                        else if (ext === "gif") mimeType = "image/gif";

                        // SAVE TO DB
                        try {
                            const savedImage = await prisma.image.create({
                                data: {
                                    data: imgBuffer,
                                    filename: `slide-${slideNum}-${filename}`,
                                    mimeType: mimeType
                                }
                            });

                            // Append IMG tag
                            slideHtml += `<div class="my-4 flex justify-center"><img src="/api/images/${savedImage.id}" alt="Slide Image" class="max-h-[60vh] rounded-lg shadow-lg" /></div>`;
                            // Mark as having content so we don't show "not supported"
                            hasText = true;
                        } catch (e) {
                            console.error("Failed to save image", e);
                        }
                    }
                }
            }

            if (!hasText) {
                slideHtml = "<h2>(Content Not Parsed)</h2><p>This slide contains elements not yet supported (shapes, smartart, etc).</p>";
            }

            slides.push(slideHtml);
        }

        return NextResponse.json({ success: true, slides });

    } catch (error) {
        console.error("PPTX Parsing Error:", error);
        return NextResponse.json({ success: false, message: "Failed to parse PPTX" }, { status: 500 });
    }
}
