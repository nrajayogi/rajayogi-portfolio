import { NextRequest, NextResponse } from "next/server";
import { getCountryFlag, getCountryName } from "@/lib/geo-utils";
import { verifyAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    const session = await verifyAdminSession(request);
    if (!session) {
        return NextResponse.json(
            { error: "Unauthorized access to telemetry diagnostics" },
            { status: 401 }
        );
    }

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
               request.headers.get("x-real-ip") || 
               "127.0.0.1";

    let country = request.headers.get("x-vercel-ip-country") || request.headers.get("cf-ipcountry") || null;
    let city = request.headers.get("x-vercel-ip-city") || request.headers.get("cf-ipcity") || null;
    let region = request.headers.get("x-vercel-ip-country-region") || null;
    let latitude = request.headers.get("x-vercel-ip-latitude") ? parseFloat(request.headers.get("x-vercel-ip-latitude")!) : null;
    let longitude = request.headers.get("x-vercel-ip-longitude") ? parseFloat(request.headers.get("x-vercel-ip-longitude")!) : null;
    let isp: string | null = null;
    let tier = "Tier 1: Vercel Anycast Edge Header";

    const vercelId = request.headers.get("x-vercel-id") || "local-dev-node";

    if (!country || !city || country === "Unknown") {
        try {
            const isLocalIp = !ip || ip === "127.0.0.1" || ip === "::1" || ip.startsWith("192.168.") || ip.startsWith("10.");
            if (!isLocalIp) {
                const geoRes = await fetch(`https://freeipapi.com/api/json/${ip}`, { signal: AbortSignal.timeout(2000) });
                if (geoRes.ok) {
                    const geoData = await geoRes.json();
                    if (geoData.cityName && geoData.cityName !== "-") city = geoData.cityName;
                    if (geoData.countryCode && geoData.countryCode !== "-") country = geoData.countryCode;
                    if (geoData.regionName && geoData.regionName !== "-") region = geoData.regionName;
                    if (geoData.latitude) latitude = Number(geoData.latitude);
                    if (geoData.longitude) longitude = Number(geoData.longitude);
                    if (geoData.isp) isp = geoData.isp;
                    tier = "Tier 2: Public IP Geocoding API";
                }
            }
        } catch (_) {
            tier = "Tier 3: Timezone Fallback";
        }
    }

    const countryCode = country || null;
    const countryName = countryCode ? getCountryName(countryCode) : "Unresolved Location";
    const flag = countryCode ? getCountryFlag(countryCode) : "🌐";

    return NextResponse.json({
        success: true,
        detectedIp: ip,
        country: countryCode,
        countryName,
        flag,
        city: city || null,
        region: region || null,
        latitude: latitude || null,
        longitude: longitude || null,
        isp: isp || (country ? "Anycast Edge Network" : null),
        edgeNode: vercelId,
        tier,
        timestamp: new Date().toISOString(),
        headersFound: {
            "x-vercel-ip-country": request.headers.get("x-vercel-ip-country") || "(edge lookup)",
            "x-vercel-ip-city": request.headers.get("x-vercel-ip-city") || "(edge lookup)",
            "x-vercel-ip-latitude": request.headers.get("x-vercel-ip-latitude") || "(edge lookup)",
            "x-vercel-ip-longitude": request.headers.get("x-vercel-ip-longitude") || "(edge lookup)",
            "x-vercel-id": vercelId,
            "x-forwarded-for": ip,
            "user-agent": request.headers.get("user-agent") || "Browser Client",
        }
    });
}
