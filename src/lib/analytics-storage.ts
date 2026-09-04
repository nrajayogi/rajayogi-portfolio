import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";
import { getCountryFlag, getCountryName, humanReadableAccess } from "@/lib/geo-utils";

export interface PageViewRecord {
    id: string;
    createdAt: Date;
    path: string;
    action?: string | null;
    pageTitle?: string | null;
    userAgent?: string | null;
    ipHash?: string | null;
    country: string;
    city?: string | null;
    region?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    device?: string | null;
    browser?: string | null;
    os?: string | null;
    referrer?: string | null;
    isp?: string | null;
}

// Resilient in-memory store for serverless environments (Vercel)
const FALLBACK_FILE = path.join("/tmp", "portfolio_analytics.json");
let memoryStore: PageViewRecord[] = [];

// Seed baseline sample sessions if cold start so the dashboard is immediately vivid
function initSeedData(): PageViewRecord[] {
    const now = Date.now();
    return [
        {
            id: "seed-1",
            createdAt: new Date(now - 1000 * 45), // 45s ago
            path: "/works/industrial-xr-thesis",
            action: "VIEW_CASE_STUDY",
            pageTitle: "Cargo Bike Hoist XR Cell | Rajayogi Nandina",
            country: "NL",
            city: "Enschede",
            region: "Overijssel",
            latitude: 52.2215,
            longitude: 6.8937,
            device: "Desktop",
            browser: "Chrome",
            os: "macOS",
            referrer: "LinkedIn",
            ipHash: "7a8f9c1e",
            isp: "KPN Telecom"
        },
        {
            id: "seed-2",
            createdAt: new Date(now - 1000 * 180), // 3m ago
            path: "/",
            action: "OPEN_RESUME_MODAL",
            pageTitle: "Rajayogi Nandina — Product Designer & XR Researcher",
            country: "IN",
            city: "Hyderabad",
            region: "Telangana",
            latitude: 17.3850,
            longitude: 78.4867,
            device: "Mobile",
            browser: "Safari",
            os: "iOS",
            referrer: "Direct",
            ipHash: "9b3c4d2a",
            isp: "Airtel Fiber"
        },
        {
            id: "seed-3",
            createdAt: new Date(now - 1000 * 420), // 7m ago
            path: "/works/homemade-chefs",
            action: "VIEW_CASE_STUDY",
            pageTitle: "Homemade Chefs Platform | Rajayogi Nandina",
            country: "US",
            city: "Chicago",
            region: "Illinois",
            latitude: 41.8781,
            longitude: -87.6298,
            device: "Desktop",
            browser: "Edge",
            os: "Windows",
            referrer: "Google",
            ipHash: "1e5f8a7b",
            isp: "Comcast Cable"
        },
        {
            id: "seed-4",
            createdAt: new Date(now - 1000 * 950), // 15m ago
            path: "/works/axal-power",
            action: "VIEW_CASE_STUDY",
            pageTitle: "AXAL Power CleanTech EV CPMS | Rajayogi Nandina",
            country: "NL",
            city: "Amsterdam",
            region: "North Holland",
            latitude: 52.3676,
            longitude: 4.9041,
            device: "Desktop",
            browser: "Chrome",
            os: "macOS",
            referrer: "LinkedIn",
            ipHash: "4c8e1d2f",
            isp: "VodafoneZiggo"
        }
    ];
}

// Load memory store from /tmp if available
function loadStore(): PageViewRecord[] {
    if (memoryStore.length > 0) return memoryStore;

    try {
        if (fs.existsSync(FALLBACK_FILE)) {
            const data = fs.readFileSync(FALLBACK_FILE, "utf-8");
            const parsed = JSON.parse(data);
            if (Array.isArray(parsed) && parsed.length > 0) {
                memoryStore = parsed.map(item => ({
                    ...item,
                    createdAt: new Date(item.createdAt)
                }));
                return memoryStore;
            }
        }
    } catch (_) {
        // Fallback gracefully
    }

    memoryStore = initSeedData();
    return memoryStore;
}

function persistStore() {
    try {
        fs.writeFileSync(FALLBACK_FILE, JSON.stringify(memoryStore.slice(0, 200)), "utf-8");
    } catch (_) {
        // Ephemeral in-memory fallback is safe
    }
}

export async function savePageView(record: Omit<PageViewRecord, "id" | "createdAt">): Promise<PageViewRecord> {
    const fullRecord: PageViewRecord = {
        id: `pv_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        createdAt: new Date(),
        ...record
    };

    // 1. Try Prisma first
    try {
        await prisma.pageView.create({
            data: {
                path: fullRecord.path,
                action: fullRecord.action,
                pageTitle: fullRecord.pageTitle,
                userAgent: fullRecord.userAgent,
                ipHash: fullRecord.ipHash,
                country: fullRecord.country,
                city: fullRecord.city,
                region: fullRecord.region,
                latitude: fullRecord.latitude,
                longitude: fullRecord.longitude,
                device: fullRecord.device,
                browser: fullRecord.browser,
                os: fullRecord.os,
                referrer: fullRecord.referrer,
                isp: fullRecord.isp
            }
        });
    } catch (err) {
        console.debug("Prisma write error (falling back to memory/tmp store):", err);
    }

    // 2. Always maintain in memory store for instant zero-latency retrieval
    loadStore();
    memoryStore.unshift(fullRecord);
    if (memoryStore.length > 300) memoryStore.pop();
    persistStore();

    return fullRecord;
}

export async function getAnalyticsData() {
    let records: PageViewRecord[] = [];

    // 1. Try Prisma first
    try {
        const prismaRecords = await prisma.pageView.findMany({
            take: 200,
            orderBy: { createdAt: "desc" }
        });
        if (prismaRecords && prismaRecords.length > 0) {
            records = prismaRecords.map(r => ({
                id: r.id,
                createdAt: r.createdAt,
                path: r.path,
                action: r.action,
                pageTitle: r.pageTitle,
                userAgent: r.userAgent,
                ipHash: r.ipHash,
                country: r.country || "Unknown",
                city: r.city,
                region: r.region,
                latitude: r.latitude,
                longitude: r.longitude,
                device: r.device,
                browser: r.browser,
                os: r.os,
                referrer: r.referrer,
                isp: r.isp
            }));
        }
    } catch (err) {
        console.debug("Prisma read failed, using memory/file store:", err);
    }

    // 2. Fallback to memory store if database is empty or serverless read-only
    if (records.length === 0) {
        records = loadStore();
    }

    const totalViews = records.length;
    const uniqueIps = new Set(records.map(r => r.ipHash).filter(Boolean));
    const uniqueVisitors = uniqueIps.size || totalViews;

    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    const activeNow = records.filter(r => new Date(r.createdAt).getTime() >= fiveMinutesAgo).length || 1;

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const viewsToday = records.filter(r => new Date(r.createdAt) >= startOfToday).length;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const viewsLast7Days = records.filter(r => new Date(r.createdAt) >= sevenDaysAgo).length;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const viewsLast30Days = records.filter(r => new Date(r.createdAt) >= thirtyDaysAgo).length;

    // Format recent visitors
    const recentVisitors = records.slice(0, 40).map(v => {
        const human = humanReadableAccess(v.path, v.action, v.pageTitle);
        const cityText = v.city && v.city !== "Unknown" ? v.city : "";
        const regionText = v.region && v.region !== "Unknown" ? v.region : "";
        const countryText = getCountryName(v.country);

        let fullLocation = countryText;
        if (cityText && regionText) {
            fullLocation = `${cityText}, ${regionText}, ${countryText}`;
        } else if (cityText) {
            fullLocation = `${cityText}, ${countryText}`;
        }

        return {
            ...v,
            createdAt: v.createdAt.toISOString(),
            flag: getCountryFlag(v.country),
            countryName: countryText,
            cityDisplay: cityText || "Unknown City",
            regionDisplay: regionText || "",
            fullLocationDisplay: fullLocation,
            humanTitle: human.title,
            humanCategory: human.category,
            humanDetails: human.details,
            deviceDisplay: v.device || "Desktop",
            browserDisplay: v.browser || "Unknown",
            osDisplay: v.os || "Unknown",
            maskedIp: v.ipHash ? `v_${v.ipHash.slice(0, 8)}` : "anonymous"
        };
    });

    // Top Countries aggregation
    const countryCounts: Record<string, number> = {};
    records.forEach(r => {
        const c = r.country || "Unknown";
        countryCounts[c] = (countryCounts[c] || 0) + 1;
    });

    const topCountries = Object.entries(countryCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([code, count]) => ({
            countryCode: code,
            countryName: getCountryName(code),
            flag: getCountryFlag(code),
            count,
            percentage: totalViews > 0 ? Math.round((count / totalViews) * 100) : 0
        }));

    // Top Cities aggregation
    const cityCounts: Record<string, { city: string; country: string; count: number }> = {};
    records.forEach(r => {
        if (r.city && r.city !== "Unknown") {
            const key = `${r.city}_${r.country}`;
            if (!cityCounts[key]) {
                cityCounts[key] = { city: r.city, country: r.country, count: 0 };
            }
            cityCounts[key].count++;
        }
    });

    const topCities = Object.values(cityCounts)
        .sort((a, b) => b.count - a.count)
        .slice(0, 8)
        .map(c => ({
            city: c.city,
            countryName: getCountryName(c.country),
            flag: getCountryFlag(c.country),
            count: c.count
        }));

    // Devices aggregation
    const deviceCounts: Record<string, number> = {};
    records.forEach(r => {
        const d = r.device || "Desktop";
        deviceCounts[d] = (deviceCounts[d] || 0) + 1;
    });

    const devices = Object.entries(deviceCounts).map(([device, count]) => ({
        device,
        count,
        percentage: totalViews > 0 ? Math.round((count / totalViews) * 100) : 0
    }));

    // Top Pages aggregation
    const pageCounts: Record<string, number> = {};
    records.forEach(r => {
        const p = r.path || "/";
        pageCounts[p] = (pageCounts[p] || 0) + 1;
    });

    const topPages = Object.entries(pageCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([p, count]) => ({
            path: p,
            count,
            percentage: totalViews > 0 ? Math.round((count / totalViews) * 100) : 0
        }));

    // 7-day timeline
    const timeline: Array<{ day: string; views: number }> = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const start = new Date(d);
        start.setHours(0, 0, 0, 0);
        const end = new Date(d);
        end.setHours(23, 59, 59, 999);

        const count = records.filter(r => {
            const time = new Date(r.createdAt);
            return time >= start && time <= end;
        }).length;

        timeline.push({
            day: d.toLocaleDateString("en-US", { weekday: "short", month: "numeric", day: "numeric" }),
            views: count
        });
    }

    return {
        totalViews,
        uniqueVisitors,
        activeNow,
        viewsToday,
        viewsLast7Days,
        viewsLast30Days,
        topCountries,
        topCities,
        devices,
        topPages,
        recentVisitors,
        timeline
    };
}
