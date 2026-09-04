// Geolocation and device parsing utilities

export const COUNTRY_NAMES: Record<string, string> = {
    NL: "Netherlands",
    IN: "India",
    US: "United States",
    GB: "United Kingdom",
    DE: "Germany",
    FR: "France",
    CA: "Canada",
    AU: "Australia",
    SG: "Singapore",
    AE: "United Arab Emirates",
    CH: "Switzerland",
    SE: "Sweden",
    ES: "Spain",
    IT: "Italy",
    JP: "Japan",
    KR: "South Korea",
    BR: "Brazil",
    IE: "Ireland",
    DK: "Denmark",
    BE: "Belgium",
    AT: "Austria",
    PL: "Poland",
    FI: "Finland",
    NO: "Norway",
    PT: "Portugal",
    NZ: "New Zealand",
    IL: "Israel",
    ZA: "South Africa",
    MX: "Mexico",
    TW: "Taiwan",
    HK: "Hong Kong"
};

export function getCountryFlag(countryCode?: string | null): string {
    if (!countryCode || countryCode === "Unknown" || countryCode.length !== 2) {
        return "🌐";
    }
    const code = countryCode.toUpperCase();
    const offset = 127397;
    try {
        return String.fromCodePoint(...[...code].map(c => c.charCodeAt(0) + offset));
    } catch {
        return "🌐";
    }
}

export function getCountryName(countryCode?: string | null): string {
    if (!countryCode || countryCode === "Unknown") return "Unknown Location";
    return COUNTRY_NAMES[countryCode.toUpperCase()] || countryCode;
}

// Timezone to Country & City fallback for when headers aren't available
export const TIMEZONE_MAP: Record<string, { country: string; city: string; region: string; lat: number; lng: number }> = {
    "Europe/Amsterdam": { country: "NL", city: "Amsterdam", region: "North Holland", lat: 52.3676, lng: 4.9041 },
    "Europe/Brussels": { country: "BE", city: "Brussels", region: "Brussels", lat: 50.8503, lng: 4.3517 },
    "Europe/Berlin": { country: "DE", city: "Berlin", region: "Berlin", lat: 52.5200, lng: 13.4050 },
    "Europe/London": { country: "GB", city: "London", region: "England", lat: 51.5074, lng: -0.1278 },
    "Europe/Paris": { country: "FR", city: "Paris", region: "Île-de-France", lat: 48.8566, lng: 2.3522 },
    "Europe/Zurich": { country: "CH", city: "Zurich", region: "Zurich", lat: 47.3769, lng: 8.5417 },
    "Europe/Stockholm": { country: "SE", city: "Stockholm", region: "Stockholm", lat: 59.3293, lng: 18.0686 },
    "Europe/Dublin": { country: "IE", city: "Dublin", region: "Leinster", lat: 53.3498, lng: -6.2603 },
    "Europe/Madrid": { country: "ES", city: "Madrid", region: "Madrid", lat: 40.4168, lng: -3.7038 },
    "Europe/Rome": { country: "IT", city: "Rome", region: "Lazio", lat: 41.9028, lng: 12.4964 },
    "Asia/Kolkata": { country: "IN", city: "India", region: "India", lat: 20.5937, lng: 78.9629 },
    "Asia/Calcutta": { country: "IN", city: "India", region: "India", lat: 20.5937, lng: 78.9629 },
    "Asia/Singapore": { country: "SG", city: "Singapore", region: "Singapore", lat: 1.3521, lng: 103.8198 },
    "Asia/Dubai": { country: "AE", city: "Dubai", region: "Dubai", lat: 25.2048, lng: 55.2708 },
    "Asia/Tokyo": { country: "JP", city: "Tokyo", region: "Kanto", lat: 35.6762, lng: 139.6503 },
    "America/New_York": { country: "US", city: "New York", region: "New York", lat: 40.7128, lng: -74.0060 },
    "America/Chicago": { country: "US", city: "Chicago", region: "Illinois", lat: 41.8781, lng: -87.6298 },
    "America/Los_Angeles": { country: "US", city: "Los Angeles", region: "California", lat: 34.0522, lng: -118.2437 },
    "America/San_Francisco": { country: "US", city: "San Francisco", region: "California", lat: 37.7749, lng: -122.4194 },
    "America/Toronto": { country: "CA", city: "Toronto", region: "Ontario", lat: 43.6532, lng: -79.3832 },
    "America/Vancouver": { country: "CA", city: "Vancouver", region: "British Columbia", lat: 49.2827, lng: -123.1207 },
    "Australia/Sydney": { country: "AU", city: "Sydney", region: "New South Wales", lat: -33.8688, lng: 151.2093 }
};

export function parseDevice(userAgent?: string | null): { device: string; browser: string; os: string } {
    if (!userAgent) {
        return { device: "Desktop", browser: "Unknown", os: "Unknown" };
    }

    // 1. Device detection
    let device = "Desktop";
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent)) {
        device = "Tablet";
    } else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(userAgent)) {
        device = "Mobile";
    }

    // 2. OS detection
    let os = "Other";
    if (/Windows/i.test(userAgent)) os = "Windows";
    else if (/iPhone|iPad|iPod/i.test(userAgent)) os = "iOS";
    else if (/Macintosh|Mac OS X/i.test(userAgent)) os = "macOS";
    else if (/Android/i.test(userAgent)) os = "Android";
    else if (/Linux/i.test(userAgent)) os = "Linux";

    // 3. Browser detection
    let browser = "Other";
    if (/Edg/i.test(userAgent)) browser = "Edge";
    else if (/Chrome/i.test(userAgent) && !/Edg/i.test(userAgent)) browser = "Chrome";
    else if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) browser = "Safari";
    else if (/Firefox/i.test(userAgent)) browser = "Firefox";
    else if (/Opera|OPR/i.test(userAgent)) browser = "Opera";

    return { device, browser, os };
}
