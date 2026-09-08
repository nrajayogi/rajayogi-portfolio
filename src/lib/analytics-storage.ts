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
    company?: string | null;
    durationSeconds?: number | null;
    scrollDepth?: number | null;
    sessionId?: string | null;
}

// Resilient in-memory store for serverless environments (Vercel)
const FALLBACK_FILE = path.join("/tmp", "portfolio_analytics.json");
let memoryStore: PageViewRecord[] = [];

// Load memory store from /tmp if available (zero dummy data)
function loadStore(): PageViewRecord[] {
    if (memoryStore.length > 0) return memoryStore;

    try {
        if (fs.existsSync(FALLBACK_FILE)) {
            const data = fs.readFileSync(FALLBACK_FILE, "utf-8");
            const parsed = JSON.parse(data);
            if (Array.isArray(parsed) && parsed.length > 0) {
                // Filter out any legacy seed entries to ensure zero dummy data
                memoryStore = parsed
                    .filter(item => item && !String(item.id).startsWith("seed-"))
                    .map(item => ({
                        ...item,
                        createdAt: new Date(item.createdAt)
                    }));
                return memoryStore;
            }
        }
    } catch (_) {
        // Fallback gracefully
    }

    memoryStore = [];
    return memoryStore;
}

function persistStore() {
    try {
        fs.writeFileSync(FALLBACK_FILE, JSON.stringify(memoryStore.slice(0, 300)), "utf-8");
    } catch (_) {
        // Ephemeral in-memory fallback is safe
    }
}

export async function savePageView(record: Omit<PageViewRecord, "id" | "createdAt">): Promise<PageViewRecord> {
    const fullRecord: PageViewRecord = {
        id: `pv_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        createdAt: new Date(),
        durationSeconds: record.durationSeconds || 0,
        scrollDepth: record.scrollDepth || 0,
        ...record
    };

    // 1. Try Prisma first
    try {
        await prisma.pageView.create({
            data: {
                id: fullRecord.id,
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
                isp: fullRecord.isp,
                company: fullRecord.company,
                durationSeconds: fullRecord.durationSeconds,
                scrollDepth: fullRecord.scrollDepth,
                sessionId: fullRecord.sessionId
            }
        });
    } catch (err) {
        console.debug("Prisma write error (falling back to memory/tmp store):", err);
    }

    // 2. Always maintain in memory store for instant zero-latency retrieval
    loadStore();
    memoryStore.unshift(fullRecord);
    if (memoryStore.length > 400) memoryStore.pop();
    persistStore();

    return fullRecord;
}

export async function updatePageViewEngagement(params: {
    id?: string;
    sessionId?: string;
    path?: string;
    durationSeconds: number;
    scrollDepth?: number;
}) {
    loadStore();
    const target = memoryStore.find(
        r => (params.id && r.id === params.id) || 
             (params.sessionId && r.sessionId === params.sessionId && r.path === params.path)
    );

    if (target) {
        target.durationSeconds = Math.max(target.durationSeconds || 0, params.durationSeconds);
        if (params.scrollDepth != null) {
            target.scrollDepth = Math.max(target.scrollDepth || 0, params.scrollDepth);
        }
        persistStore();
    }

    try {
        if (params.id) {
            await prisma.pageView.update({
                where: { id: params.id },
                data: {
                    durationSeconds: params.durationSeconds,
                    ...(params.scrollDepth != null ? { scrollDepth: params.scrollDepth } : {})
                }
            });
        } else if (params.sessionId && params.path) {
            const match = await prisma.pageView.findFirst({
                where: { sessionId: params.sessionId, path: params.path },
                orderBy: { createdAt: "desc" }
            });
            if (match) {
                await prisma.pageView.update({
                    where: { id: match.id },
                    data: {
                        durationSeconds: Math.max(match.durationSeconds || 0, params.durationSeconds),
                        ...(params.scrollDepth != null ? { scrollDepth: Math.max(match.scrollDepth || 0, params.scrollDepth) } : {})
                    }
                });
            }
        }
    } catch (e) {
        console.debug("Prisma engagement update non-fatal:", e);
    }
}

export async function getAnalyticsData() {
    let records: PageViewRecord[] = [];

    // 1. Try Prisma first
    try {
        const prismaRecords = await prisma.pageView.findMany({
            where: {
                NOT: {
                    id: {
                        startsWith: "seed-"
                    }
                }
            },
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
                isp: r.isp,
                company: r.company,
                durationSeconds: r.durationSeconds,
                scrollDepth: r.scrollDepth,
                sessionId: r.sessionId
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
    const uniqueVisitors = uniqueIps.size;

    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    const activeNow = records.filter(r => new Date(r.createdAt).getTime() >= fiveMinutesAgo).length;

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
            maskedIp: v.ipHash ? `v_${v.ipHash.slice(0, 8)}` : "anonymous",
            company: v.company || null,
            durationSeconds: v.durationSeconds || 0,
            scrollDepth: v.scrollDepth || 0,
            sessionId: v.sessionId || null
        };
    });

    // Top Companies Aggregation
    const companyGroups: Record<string, PageViewRecord[]> = {};
    records.forEach(r => {
        if (r.company && r.company.trim() && r.company.trim().toLowerCase() !== "unknown") {
            const key = r.company.trim();
            if (!companyGroups[key]) companyGroups[key] = [];
            companyGroups[key].push(r);
        }
    });

    const topCompanies = Object.entries(companyGroups).map(([company, group]) => {
        const totalDurationSeconds = group.reduce((acc, curr) => acc + (curr.durationSeconds || 0), 0);
        const maxScrollDepth = Math.max(...group.map(curr => curr.scrollDepth || 0), 0);
        const totalCompanyViews = group.length;
        const avgDuration = Math.round(totalDurationSeconds / (totalCompanyViews || 1));
        const pagesVisited = Array.from(new Set(group.map(curr => curr.path).filter(Boolean)));
        
        const locSet = new Set<string>();
        group.forEach(curr => {
            const cName = getCountryName(curr.country);
            if (curr.city && curr.city !== "Unknown") {
                locSet.add(`${curr.city}, ${cName}`);
            } else if (cName && cName !== "Unknown") {
                locSet.add(cName);
            }
        });

        // Sorted timestamps
        const timestamps = group.map(curr => new Date(curr.createdAt).getTime()).sort((a, b) => a - b);
        const firstSeen = new Date(timestamps[0]).toISOString();
        const lastSeen = new Date(timestamps[timestamps.length - 1]).toISOString();

        let engagementRating: "Deep Read" | "Reviewed" | "Quick Skim" = "Quick Skim";
        if (totalDurationSeconds >= 90 || maxScrollDepth >= 70) {
            engagementRating = "Deep Read";
        } else if (totalDurationSeconds >= 25 || maxScrollDepth >= 40) {
            engagementRating = "Reviewed";
        }

        return {
            company,
            totalViews: totalCompanyViews,
            totalDurationSeconds,
            averageDurationSeconds: avgDuration,
            maxScrollDepth,
            pagesVisited,
            locations: Array.from(locSet),
            firstSeen,
            lastSeen,
            engagementRating
        };
    }).sort((a, b) => b.totalDurationSeconds - a.totalDurationSeconds || new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime());

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
        topCompanies,
        devices,
        topPages,
        recentVisitors,
        timeline
    };
}
