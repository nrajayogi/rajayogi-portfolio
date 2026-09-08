import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
    const session = await verifyAdminSession(request);
    if (!session) {
        return NextResponse.json(
            { success: false, message: "Unauthorized: Admin session required" },
            { status: 401 }
        );
    }
    try {
        const payload = await request.json();

        // 1. Fetch Existing
        const existing = await prisma.content.findUnique({ where: { id: 1 } });
        let finalData = payload;

        if (existing) {
            try {
                const existingData = JSON.parse(existing.data);
                // Merge new content into existing content to prevent data loss of other sections
                // We overwrite keys that are present in the payload
                finalData = { ...existingData, ...payload };

                // Deep merge specifically for sections that might be partially updated if needed,
                // but for now object-level merge is safer than full override.
                // However, the admin sends the WHOLE content object usually, but let's be safe.
            } catch (e) {
                console.error("Error parsing existing content during merge:", e);
            }
        }

        // 2. Save to Database
        await prisma.content.upsert({
            where: { id: 1 },
            update: { data: JSON.stringify(finalData), updatedAt: new Date() },
            create: { id: 1, data: JSON.stringify(finalData) }
        });

        return NextResponse.json({ success: true, message: "Content merged and saved to database" });
    } catch (error) {
        console.error("Error saving content:", error);
        return NextResponse.json({ success: false, message: "Failed to save content" }, { status: 500 });
    }
}
