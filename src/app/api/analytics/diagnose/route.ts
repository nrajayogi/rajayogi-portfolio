import { NextRequest, NextResponse } from "next/server";
import { getCountryFlag, getCountryName } from "@/lib/geo-utils";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
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

    const countryCode = country || "NL";
    const countryName = getCountryName(countryCode);
    const flag = getCountryFlag(countryCode);

    return NextResponse.json({
        success: true,
        detectedIp: ip,
        country: countryCode,
        countryName,
        flag,
        city: city || "Enschede",
        region: region || "Overijssel",
        latitude: latitude || 52.2404,
        longitude: longitude || 6.8559,
        isp: isp || "Vercel Anycast Edge",
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
