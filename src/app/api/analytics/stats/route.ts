import { NextRequest, NextResponse } from "next/server";
import { getAnalyticsData } from "@/lib/analytics-storage";
import { verifyAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    const session = await verifyAdminSession(request);
    if (!session) {
        return NextResponse.json(
            { error: "Unauthorized access to telemetry analytics" },
            { status: 401 }
        );
    }

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
