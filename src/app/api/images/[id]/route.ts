import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params;
        const id = params.id;

        const image = await prisma.image.findUnique({
            where: { id }
        });

        if (!image) {
            return new NextResponse("Image not found", { status: 404 });
        }

        // Return the image data with correct content type
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return new NextResponse(image.data as any, {
            headers: {
                "Content-Type": image.mimeType,
                "Cache-Control": "public, max-age=31536000, immutable"
            }
        });
    } catch (error) {
        console.error("Serve image error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
