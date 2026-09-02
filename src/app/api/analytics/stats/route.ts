import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        // 1. Total Views
        const totalViews = await prisma.pageView.count();

        // 2. Unique Visitors (Distinct IP Hashes)
        // Prisma `groupBy` is great for this
        const uniqueVisitors = (await prisma.pageView.groupBy({
            by: ['ipHash'],
        })).length;

        // 3. Views Last 30 Days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const viewsLast30Days = await prisma.pageView.count({
            where: {
                createdAt: {
                    gte: thirtyDaysAgo
                }
            }
        });

        // 4. Top Pages
        const topPagesRaw = await prisma.pageView.groupBy({
            by: ['path'],
            _count: {
                path: true
            },
            orderBy: {
                _count: {
                    path: 'desc'
                }
            },
            take: 5
        });

        const topPages = topPagesRaw.map(p => ({
            path: p.path,
            count: p._count.path
        }));

        // 5. Top Countries
        const topCountriesRaw = await prisma.pageView.groupBy({
            by: ['country'],
            _count: {
                country: true
            },
            orderBy: {
                _count: {
                    country: 'desc'
                }
            },
            take: 5
        });

        const topCountries = topCountriesRaw.map(c => ({
            country: c.country || "Unknown",
            count: c._count.country
        }));

        const data = {
            totalViews,
            uniqueVisitors,
            viewsLast30Days,
            viewsLast7Days: 0, // Placeholder
            topPages,
            topCountries
        };

        return NextResponse.json(data);

    } catch (error) {
        console.error("Stats error:", error);
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }
}
