import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyAdminSession } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    const session = await verifyAdminSession(request);
    if (!session) {
        return NextResponse.json(
            { success: false, message: "Unauthorized: Admin session required" },
            { status: 401 }
        );
    }
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
        return NextResponse.json({ success: false, message: "No file uploaded" }, { status: 400 });
    }

    try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Sanitize filename
        const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "");
        const filename = `${Date.now()}-${originalName}`;
        const mimeType = file.type || 'application/octet-stream';

        // Save to Database
        const image = await prisma.image.create({
            data: {
                data: buffer,
                filename: filename,
                mimeType: mimeType
            }
        });

        // Return URL that points to the new serving endpoint
        const fileUrl = `/api/images/${image.id}`;

        return NextResponse.json({ success: true, url: fileUrl });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ success: false, message: "Failed to upload file" }, { status: 500 });
    }
}
