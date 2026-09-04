import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { parseDevice, TIMEZONE_MAP } from "@/lib/geo-utils";
import { savePageView } from "@/lib/analytics-storage";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { path, userAgent, referrer, timeZone, action, pageTitle, clientGeo } = body;

        // 1. IP extraction
        const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                   request.headers.get("x-real-ip") || 
                   "127.0.0.1";

        // 2. Location Resolution Hierarchy:
        // Level A: Edge headers (Vercel, Cloudflare)
        let country = request.headers.get("x-vercel-ip-country") || 
                      request.headers.get("cf-ipcountry") || 
                      null;
        let city = request.headers.get("x-vercel-ip-city") || 
                   request.headers.get("cf-ipcity") || 
                   null;
        let region = request.headers.get("x-vercel-ip-country-region") || null;
        let latitude: number | null = request.headers.get("x-vercel-ip-latitude") ? parseFloat(request.headers.get("x-vercel-ip-latitude")!) : null;
        let longitude: number | null = request.headers.get("x-vercel-ip-longitude") ? parseFloat(request.headers.get("x-vercel-ip-longitude")!) : null;
        let isp: string | null = null;

        // Level B: High-Accuracy Client-Resolved Geolocation (if headers are absent/local)
        if ((!city || city === "Unknown" || !country || country === "Unknown") && clientGeo) {
            if (clientGeo.city) city = clientGeo.city;
            if (clientGeo.country) country = clientGeo.country;
            if (clientGeo.region) region = clientGeo.region;
            if (clientGeo.latitude) latitude = Number(clientGeo.latitude);
            if (clientGeo.longitude) longitude = Number(clientGeo.longitude);
            if (clientGeo.isp) isp = clientGeo.isp;
        }

        // Level C: Server-side public IP lookup if still unknown and not localhost
        const isLocalIp = !ip || ip === "127.0.0.1" || ip === "::1" || ip.startsWith("192.168.") || ip.startsWith("10.") || ip.startsWith("172.");
        if ((!city || !country || country === "Unknown") && !isLocalIp) {
            try {
                const geoRes = await fetch(`https://freeipapi.com/api/json/${ip}`, { signal: AbortSignal.timeout(1500) });
                if (geoRes.ok) {
                    const geoData = await geoRes.json();
                    if (geoData.cityName && geoData.cityName !== "-") city = geoData.cityName;
                    if (geoData.countryCode && geoData.countryCode !== "-") country = geoData.countryCode;
                    if (geoData.regionName && geoData.regionName !== "-") region = geoData.regionName;
                    if (geoData.latitude) latitude = Number(geoData.latitude);
                    if (geoData.longitude) longitude = Number(geoData.longitude);
                    if (geoData.isp) isp = geoData.isp;
                }
            } catch (_) {
                // Silently fallback to Level D
            }
        }

        // Level D: Timezone-based Geolocation fallback
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

        await savePageView({
            path: path || "/",
            action: action || "PAGE_VIEW",
            pageTitle: pageTitle || null,
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
            referrer: referrer || "Direct",
            isp: isp || null
        });

        return NextResponse.json({ success: true, resolvedLocation: { city, country, region } });
    } catch (error) {
        console.debug("Telemetry write non-fatal error:", error);
        return NextResponse.json({ success: true, fallback: true });
    }
}
