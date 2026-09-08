import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { parseDevice, TIMEZONE_MAP } from "@/lib/geo-utils";
import { savePageView, updatePageViewEngagement } from "@/lib/analytics-storage";

function detectCompanyFromNetwork(ispOrOrg?: string | null): string | null {
    if (!ispOrOrg) return null;
    const lower = ispOrOrg.toLowerCase();
    
    // Check for high-profile Dutch & international tech/engineering enterprises
    const enterpriseNames = [
        "ASML", "Philips", "Booking.com", "Adyen", "Just Eat", "Takeaway", "Uber",
        "Google", "Apple", "Microsoft", "Amazon", "Meta", "Netflix", "Spotify",
        "Siemens", "Bosch", "NXP", "TomTom", "Rabobank", "ING", "ABN AMRO",
        "KPMG", "Deloitte", "PwC", "EY", "Tesla", "Cisco", "Intel", "NVIDIA",
        "TCS", "Infosys", "Wipro", "Accenture", "Capgemini"
    ];
    for (const ent of enterpriseNames) {
        if (lower.includes(ent.toLowerCase())) {
            return ent;
        }
    }

    // Common residential/telecom/datacenter ISPs to skip
    const genericIsps = [
        "vodafone", "kpn", "ziggo", "t-mobile", "odido", "telekom", "verizon", "at&t", "comcast",
        "charter", "spectrum", "orange", "telefonica", "bt ", "virgin", "free sas",
        "aws", "amazon", "google cloud", "digitalocean", "cloudflare", "ovh", "hetzner",
        "linode", "azure", "fastly", "akamai"
    ];
    for (const g of genericIsps) {
        if (lower.includes(g)) return null;
    }

    // Heuristic: Check if ISP has corporate suffixes
    const corporateKeywords = ["b.v.", "inc.", "corp", "holding", "technologies", "systems", "solutions", "consulting", "institute"];
    for (const kw of corporateKeywords) {
        if (lower.includes(kw)) {
            return ispOrOrg.replace(/,\s*(Inc\.|B\.V\.|Corp|Ltd).*$/i, "").trim();
        }
    }

    return null;
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { 
            path, 
            userAgent, 
            referrer, 
            timeZone, 
            action, 
            pageTitle, 
            clientGeo,
            company,
            durationSeconds,
            scrollDepth,
            sessionId,
            recordId
        } = body;

        // 1. Handle live heartbeat / dwell-time update
        if (action === "HEARTBEAT") {
            await updatePageViewEngagement({
                id: recordId || undefined,
                sessionId: sessionId || undefined,
                path: path || undefined,
                durationSeconds: Number(durationSeconds) || 0,
                scrollDepth: scrollDepth != null ? Number(scrollDepth) : undefined
            });
            return NextResponse.json({ success: true, heartbeat: true });
        }

        // 2. IP extraction
        const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                   request.headers.get("x-real-ip") || 
                   "127.0.0.1";

        // 3. Location Resolution Hierarchy:
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

        // 4. Resolve company from explicit parameter or network heuristic
        let resolvedCompany: string | null = null;
        if (typeof company === "string" && company.trim().length > 0) {
            resolvedCompany = company.trim().slice(0, 80);
        } else {
            resolvedCompany = detectCompanyFromNetwork(isp);
        }

        // 5. Parse Device, Browser, and OS
        const { device, browser, os } = parseDevice(userAgent);

        // 6. Hash IP for visitor privacy
        const ipHash = crypto.createHash("sha256").update(ip).digest("hex").slice(0, 16);

        const saved = await savePageView({
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
            isp: isp || null,
            company: resolvedCompany,
            durationSeconds: Number(durationSeconds) || 0,
            scrollDepth: scrollDepth != null ? Number(scrollDepth) : 0,
            sessionId: sessionId || null
        });

        return NextResponse.json({ 
            success: true, 
            id: saved.id,
            company: saved.company,
            resolvedLocation: { city, country, region } 
        });
    } catch (error) {
        console.debug("Telemetry write non-fatal error:", error);
        return NextResponse.json({ success: true, fallback: true });
    }
}
