"use client";

import { BarChart3, TrendingUp, Eye, Globe } from "lucide-react";
import { useEffect, useState } from "react";

interface AnalyticsData {
    totalViews: number;
    uniqueVisitors: number;
    viewsLast30Days: number;
    bounceRate: string;
    avgDuration: string;
    topPages: { path: string; views: number }[];
    topCountries: { country: string; count: number }[];
}

export function Analytics() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/analytics/stats")
            .then(res => {
                if (!res.ok) throw new Error("API Failed");
                return res.json();
            })
            .then(setData)
            .catch(err => {
                console.error("Analytics Error:", err);
                setData(null);
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-8 text-slate-400">Loading analytics...</div>;

    if (!data) return <div className="p-8 text-red-400">Failed to load analytics.</div>;

    const metrics = [
        { label: "Total Page Views", value: data.totalViews.toLocaleString(), change: "+100%", icon: Eye, color: "text-purple-500" },
        { label: "Unique Visitors", value: data.uniqueVisitors.toLocaleString(), change: "Distinct Users", icon: Globe, color: "text-emerald-500" },
        { label: "Thirty Day Volume", value: data.viewsLast30Days.toLocaleString(), change: "Active", icon: TrendingUp, color: "text-blue-500" },
    ];

    return (
        <div className="p-8 h-full bg-slate-900 text-slate-100 overflow-y-auto">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <BarChart3 className="text-blue-500" />
                Real-Time Analytics
            </h2>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {metrics.map((m, i) => (
                    <div key={i} className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-2 rounded-lg bg-slate-700/50 ${m.color}`}>
                                <m.icon size={20} />
                            </div>
                            <span className={`text-xs font-medium px-2 py-1 rounded-full bg-slate-700 text-slate-300`}>
                                {m.change}
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold mb-1">{m.value}</h3>
                        <p className="text-slate-400 text-sm">{m.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                {/* Top Pages List */}
                <div className="bg-slate-800 p-8 rounded-xl border border-slate-700">
                    <h3 className="text-lg font-semibold mb-6">Top Pages</h3>
                    <div className="space-y-4">
                        {data.topPages.map((page, i) => (
                            <div key={i} className="flex justify-between items-center p-3 bg-slate-700/30 rounded border border-slate-700/50">
                                <span className="text-sm font-mono text-blue-400">{page.path}</span>
                                <span className="text-sm font-bold text-slate-200">{page.views} views</span>
                            </div>
                        ))}
                        {data.topPages.length === 0 && (
                            <div className="text-slate-500 text-sm italic">No data yet. Visit some pages!</div>
                        )}
                    </div>
                </div>

                {/* Top Countries List */}
                <div className="bg-slate-800 p-8 rounded-xl border border-slate-700">
                    <h3 className="text-lg font-semibold mb-6">Top Locations</h3>
                    <div className="space-y-4">
                        {data.topCountries && data.topCountries.map((c, i) => (
                            <div key={i} className="flex justify-between items-center p-3 bg-slate-700/30 rounded border border-slate-700/50">
                                <span className="text-sm font-medium text-slate-200">{c.country === "Unknown" ? "Unknown Location" : c.country}</span>
                                <span className="text-sm font-bold text-emerald-400">{c.count} visitors</span>
                            </div>
                        ))}
                        {(!data.topCountries || data.topCountries.length === 0) && (
                            <div className="text-slate-500 text-sm italic">No location data yet.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
