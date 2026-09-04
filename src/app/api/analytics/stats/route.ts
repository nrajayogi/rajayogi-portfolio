import { NextResponse } from "next/server";
import { getAnalyticsData } from "@/lib/analytics-storage";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const stats = await getAnalyticsData();
        return NextResponse.json(stats);
    } catch (error) {
        console.debug("Stats fallback error:", error);
        return NextResponse.json({
            totalViews: 0,
            uniqueVisitors: 0,
            activeNow: 1,
            viewsToday: 0,
            viewsLast7Days: 0,
            viewsLast30Days: 0,
            topCountries: [],
            topCities: [],
            devices: [],
            topPages: [],
            recentVisitors: [],
            timeline: []
        });
    }
}
