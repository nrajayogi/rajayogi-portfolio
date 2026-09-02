import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { path, userAgent } = body;

        // 1. Get Headers
        const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
        const country = request.headers.get("x-vercel-ip-country") || "Unknown";
        const city = request.headers.get("x-vercel-ip-city") || null;

        // 2. Hash IP for privacy
        const ipHash = crypto.createHash("sha256").update(ip).digest("hex");

        await prisma.pageView.create({
            data: {
                path,
                userAgent,
                ipHash,
                country,
                city
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Tracking error:", error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
