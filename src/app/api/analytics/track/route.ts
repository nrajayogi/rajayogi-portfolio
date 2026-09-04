import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { parseDevice, TIMEZONE_MAP } from "@/lib/geo-utils";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { path, userAgent, referrer, timeZone } = body;

        // 1. IP & Geolocation Headers (Vercel, Cloudflare, etc.)
        const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                   request.headers.get("x-real-ip") || 
                   "127.0.0.1";

        let country = request.headers.get("x-vercel-ip-country") || 
                      request.headers.get("cf-ipcountry") || 
                      null;
        let city = request.headers.get("x-vercel-ip-city") || 
                   request.headers.get("cf-ipcity") || 
                   null;
        let region = request.headers.get("x-vercel-ip-country-region") || null;
        let latitude: number | null = request.headers.get("x-vercel-ip-latitude") ? parseFloat(request.headers.get("x-vercel-ip-latitude")!) : null;
        let longitude: number | null = request.headers.get("x-vercel-ip-longitude") ? parseFloat(request.headers.get("x-vercel-ip-longitude")!) : null;

        // 2. Timezone fallback if IP headers are missing or "Unknown" (e.g. localhost, local preview)
        if ((!country || country === "Unknown") && timeZone && TIMEZONE_MAP[timeZone]) {
            const tz = TIMEZONE_MAP[timeZone];
            country = tz.country;
            if (!city) city = tz.city;
            if (!region) region = tz.region;
            if (!latitude) latitude = tz.lat;
            if (!longitude) longitude = tz.lng;
        }

        // 3. Parse Device, Browser, and OS
        const { device, browser, os } = parseDevice(userAgent);

        // 4. Hash IP for visitor privacy
        const ipHash = crypto.createHash("sha256").update(ip).digest("hex").slice(0, 16);

        await prisma.pageView.create({
            data: {
                path: path || "/",
                userAgent,
                ipHash,
                country: country || "Unknown",
                city: city || null,
                region: region || null,
                latitude,
                longitude,
                device,
                browser,
                os,
                referrer: referrer || "Direct"
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Tracking error:", error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
