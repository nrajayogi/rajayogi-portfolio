import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import initialContent from "@/data/content.json";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Try to fetch from DB
        const contentRow = await prisma.content.findUnique({
            where: { id: 1 }
        });

        if (contentRow) {
            return NextResponse.json(JSON.parse(contentRow.data));
        }

        // If no content in DB (first run), return local JSON
        // AND seed it for next time
        try {
            await prisma.content.create({
                data: {
                    id: 1,
                    data: JSON.stringify(initialContent)
                }
            });
            console.log("Seeded database with initial content");
        } catch (seedError) {
            console.error("Error seeding database:", seedError);
        }

        return NextResponse.json(initialContent);

    } catch (error) {
        console.error("Database error, falling back to local JSON:", error);
        // Fallback to file if DB fails
        return NextResponse.json(initialContent);
    }
}
