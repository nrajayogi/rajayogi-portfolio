import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCountryFlag, getCountryName, humanReadableAccess } from "@/lib/geo-utils";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        // 1. Overall Metrics
        const totalViews = await prisma.pageView.count();

        // Unique Visitors
        const uniqueVisitorsGroup = await prisma.pageView.groupBy({
            by: ['ipHash'],
        });
        const uniqueVisitors = uniqueVisitorsGroup.length;

        // Active right now (within last 5 minutes)
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        const activeNow = await prisma.pageView.count({
            where: { createdAt: { gte: fiveMinutesAgo } }
        });

        // Today's views
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const viewsToday = await prisma.pageView.count({
            where: { createdAt: { gte: startOfToday } }
        });

        // Last 7 days views
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const viewsLast7Days = await prisma.pageView.count({
            where: { createdAt: { gte: sevenDaysAgo } }
        });

        // Last 30 days views
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const viewsLast30Days = await prisma.pageView.count({
            where: { createdAt: { gte: thirtyDaysAgo } }
        });

        // 2. Recent Live Visitors Log (latest 40 visits)
        const recentRaw = await prisma.pageView.findMany({
            take: 40,
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                createdAt: true,
                path: true,
                action: true,
                pageTitle: true,
                country: true,
                city: true,
                region: true,
                latitude: true,
                longitude: true,
                device: true,
                browser: true,
                os: true,
                referrer: true,
                ipHash: true,
                isp: true
            }
        });

        const recentVisitors = recentRaw.map(v => {
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

        // 3. Top Countries
        const topCountriesRaw = await prisma.pageView.groupBy({
            by: ['country'],
            _count: { country: true },
            orderBy: { _count: { country: 'desc' } },
            take: 8
        });

        const topCountries = topCountriesRaw.map(c => {
            const count = c._count.country;
            const percentage = totalViews > 0 ? Math.round((count / totalViews) * 100) : 0;
            return {
                countryCode: c.country || "Unknown",
                countryName: getCountryName(c.country),
                flag: getCountryFlag(c.country),
                count,
                percentage
            };
        });

        // 4. Top Cities
        const topCitiesRaw = await prisma.pageView.groupBy({
            by: ['city', 'country'],
            _count: { city: true },
            where: { city: { not: null } },
            orderBy: { _count: { city: 'desc' } },
            take: 8
        });

        const topCities = topCitiesRaw.map(c => ({
            city: c.city || "Unknown",
            countryName: getCountryName(c.country),
            flag: getCountryFlag(c.country),
            count: c._count.city
        }));

        // 5. Device Distribution
        const devicesRaw = await prisma.pageView.groupBy({
            by: ['device'],
            _count: { device: true },
            orderBy: { _count: { device: 'desc' } }
        });

        const devices = devicesRaw.map(d => ({
            device: d.device || "Desktop",
            count: d._count.device,
            percentage: totalViews > 0 ? Math.round((d._count.device / totalViews) * 100) : 0
        }));

        // 6. Top Pages
        const topPagesRaw = await prisma.pageView.groupBy({
            by: ['path'],
            _count: { path: true },
            orderBy: { _count: { path: 'desc' } },
            take: 6
        });

        const topPages = topPagesRaw.map(p => ({
            path: p.path,
            count: p._count.path,
            percentage: totalViews > 0 ? Math.round((p._count.path / totalViews) * 100) : 0
        }));

        // 7. Last 7 Days Timeline Activity
        const timeline: Array<{ day: string; views: number }> = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const start = new Date(date);
            start.setHours(0, 0, 0, 0);
            const end = new Date(date);
            end.setHours(23, 59, 59, 999);

            const dayViews = await prisma.pageView.count({
                where: {
                    createdAt: {
                        gte: start,
                        lte: end
                    }
                }
            });

            timeline.push({
                day: date.toLocaleDateString("en-US", { weekday: "short", month: "numeric", day: "numeric" }),
                views: dayViews
            });
        }

        return NextResponse.json({
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
        });

    } catch (error) {
        console.error("Stats error:", error);
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }
}
