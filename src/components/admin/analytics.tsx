"use client";

import React, { useEffect, useState, useCallback } from "react";
import { 
    Globe, 
    Smartphone, 
    Monitor, 
    Tablet, 
    ArrowUpRight, 
    RefreshCw, 
    Compass, 
    Calendar,
    Activity,
    Layers,
    Share2,
    ShieldCheck,
    Clock
} from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, AreaChart, Area } from "recharts";

interface VisitorLog {
    id: string;
    createdAt: string;
    path: string;
    country: string;
    city: string | null;
    region: string | null;
    flag: string;
    countryName: string;
    cityDisplay: string;
    deviceDisplay: string;
    browserDisplay: string;
    osDisplay: string;
    referrer: string | null;
    maskedIp: string;
}

interface CountryStat {
    countryCode: string;
    countryName: string;
    flag: string;
    count: number;
    percentage: number;
}

interface CityStat {
    city: string;
    countryName: string;
    flag: string;
    count: number;
}

interface DeviceStat {
    device: string;
    count: number;
    percentage: number;
}

interface PageStat {
    path: string;
    count: number;
    percentage: number;
}

interface TimelinePoint {
    day: string;
    views: number;
}

interface AnalyticsPayload {
    totalViews: number;
    uniqueVisitors: number;
    viewsToday: number;
    viewsLast7Days: number;
    viewsLast30Days: number;
    topCountries: CountryStat[];
    topCities: CityStat[];
    devices: DeviceStat[];
    topPages: PageStat[];
    recentVisitors: VisitorLog[];
    timeline: TimelinePoint[];
}

function timeAgo(dateString: string): string {
    const diff = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
}

export function Analytics() {
    const [data, setData] = useState<AnalyticsPayload | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
    const [filterDevice, setFilterDevice] = useState<string>("all");

    const fetchData = useCallback(async (showRefreshing = false) => {
        if (showRefreshing) setRefreshing(true);
        try {
            const res = await fetch("/api/analytics/stats", { cache: "no-store" });
            if (!res.ok) throw new Error("API failed");
            const json: AnalyticsPayload = await res.json();
            setData(json);
            setLastUpdated(new Date());
        } catch (err) {
            console.error("Analytics fetch error:", err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
        // Auto-refresh every 30 seconds
        const interval = setInterval(() => {
            fetchData();
        }, 30000);
        return () => clearInterval(interval);
    }, [fetchData]);

    if (loading) {
        return (
            <div className="min-h-full bg-slate-950 p-8 flex flex-col items-center justify-center text-slate-400 gap-3">
                <RefreshCw size={24} className="animate-spin text-blue-500" />
                <p className="text-sm font-mono tracking-wider uppercase">Loading live visitor tracker...</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-full bg-slate-950 p-8 flex flex-col items-center justify-center text-slate-400 gap-4">
                <p className="text-rose-400">Failed to load visitor tracking data.</p>
                <button
                    onClick={() => fetchData(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-blue-500"
                >
                    Retry Connection
                </button>
            </div>
        );
    }

    const topCountry = data.topCountries?.[0];
    const mobileShare = data.devices?.find(d => d.device === "Mobile")?.percentage || 0;
    const desktopShare = data.devices?.find(d => d.device === "Desktop")?.percentage || 0;

    const filteredVisitors = data.recentVisitors.filter(v => {
        if (filterDevice === "all") return true;
        return v.deviceDisplay.toLowerCase() === filterDevice.toLowerCase();
    });

    return (
        <div className="h-full bg-slate-950 text-slate-100 overflow-y-auto p-6 sm:p-8 selection:bg-blue-600 selection:text-white">
            
            {/* Top Bar: Title & Live Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-800/80">
                <div>
                    <div className="flex items-center gap-3">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                        </span>
                        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
                            <span>Live Visitor Tracker</span>
                        </h1>
                    </div>
                    <p className="text-slate-400 text-xs sm:text-sm mt-1">
                        Real-time visitor origin, geolocation, device telemetry & path tracking
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden md:flex flex-col text-right text-[11px] text-slate-500 font-mono">
                        <span>Updated: {lastUpdated.toLocaleTimeString()}</span>
                        <span className="text-emerald-400/80 font-semibold">Pulse: 30s Auto-Sync</span>
                    </div>

                    <button
                        onClick={() => fetchData(true)}
                        disabled={refreshing}
                        className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 hover:text-white transition-all text-xs font-semibold flex items-center gap-2 cursor-pointer disabled:opacity-50"
                        title="Force refresh"
                    >
                        <RefreshCw size={14} className={refreshing ? "animate-spin text-blue-400" : "text-slate-400"} />
                        <span>{refreshing ? "Refreshing..." : "Live Refresh"}</span>
                    </button>
                </div>
            </div>

            {/* 1. Core KPIs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                {/* Total Views */}
                <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-900/60 border border-slate-800/80 hover:border-blue-500/30 transition-all">
                    <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase tracking-wider mb-3">
                        <span>Total Views</span>
                        <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
                            <Layers size={16} />
                        </span>
                    </div>
                    <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                        {data.totalViews.toLocaleString()}
                    </div>
                    <div className="mt-2 text-xs text-slate-400 flex items-center gap-1.5">
                        <span className="text-blue-400 font-bold">{data.uniqueVisitors.toLocaleString()}</span>
                        <span>unique visitors</span>
                    </div>
                </div>

                {/* Today's Activity */}
                <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-900/60 border border-slate-800/80 hover:border-emerald-500/30 transition-all">
                    <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase tracking-wider mb-3">
                        <span>Today&apos;s Traffic</span>
                        <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                            <Activity size={16} />
                        </span>
                    </div>
                    <div className="text-3xl sm:text-4xl font-black text-emerald-400 tracking-tight">
                        +{data.viewsToday.toLocaleString()}
                    </div>
                    <div className="mt-2 text-xs text-slate-400 flex items-center gap-1.5">
                        <span className="text-slate-300 font-semibold">{data.viewsLast7Days.toLocaleString()}</span>
                        <span>views past 7 days</span>
                    </div>
                </div>

                {/* Top Country Origin */}
                <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-900/60 border border-slate-800/80 hover:border-amber-500/30 transition-all">
                    <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase tracking-wider mb-3">
                        <span>Top Geolocation</span>
                        <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                            <Globe size={16} />
                        </span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2 truncate">
                        <span>{topCountry?.flag || "🌐"}</span>
                        <span className="truncate">{topCountry?.countryName || "Worldwide"}</span>
                    </div>
                    <div className="mt-2 text-xs text-slate-400 flex items-center gap-1.5">
                        <span className="text-amber-400 font-bold">{topCountry?.percentage || 0}%</span>
                        <span>of all portfolio traffic</span>
                    </div>
                </div>

                {/* Device Split */}
                <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-900/60 border border-slate-800/80 hover:border-purple-500/30 transition-all">
                    <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase tracking-wider mb-3">
                        <span>Device Ratio</span>
                        <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
                            <Smartphone size={16} />
                        </span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
                        <span>{desktopShare}% <span className="text-xs font-normal text-slate-400">Desk</span></span>
                        <span className="text-slate-600">/</span>
                        <span className="text-purple-400">{mobileShare}% <span className="text-xs font-normal text-slate-400">Mob</span></span>
                    </div>
                    <div className="mt-2 text-xs text-slate-400">
                        Optimized for spatial desktop & touch
                    </div>
                </div>
            </div>

            {/* 2. Charts & Geography Split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                
                {/* 7-Day Visitor Velocity (2 Columns) */}
                <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-base font-bold text-white flex items-center gap-2">
                                <Calendar size={16} className="text-blue-400" />
                                <span>7-Day Visitor Velocity</span>
                            </h2>
                            <p className="text-xs text-slate-400 mt-0.5">Daily pageviews across your portfolio</p>
                        </div>
                        <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            30-Day Total: {data.viewsLast30Days}
                        </span>
                    </div>

                    <div className="h-[240px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.timeline}>
                                <defs>
                                    <linearGradient id="velocityGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis 
                                    dataKey="day" 
                                    stroke="#64748b" 
                                    fontSize={11} 
                                    tickLine={false} 
                                    axisLine={false} 
                                />
                                <YAxis 
                                    stroke="#64748b" 
                                    fontSize={11} 
                                    tickLine={false} 
                                    axisLine={false} 
                                    allowDecimals={false}
                                />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: '#0F172A', 
                                        borderColor: '#334155', 
                                        borderRadius: '12px',
                                        fontSize: '12px'
                                    }}
                                    itemStyle={{ color: '#93C5FD' }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="views" 
                                    name="Views"
                                    stroke="#3B82F6" 
                                    strokeWidth={3}
                                    fillOpacity={1} 
                                    fill="url(#velocityGradient)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Countries Ranking (1 Column) */}
                <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-bold text-white flex items-center gap-2">
                            <Compass size={16} className="text-amber-400" />
                            <span>Top Countries</span>
                        </h2>
                        <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500">
                            Ranked
                        </span>
                    </div>

                    <div className="space-y-3.5 my-auto">
                        {data.topCountries && data.topCountries.length > 0 ? (
                            data.topCountries.slice(0, 5).map((c, idx) => (
                                <div key={idx} className="space-y-1">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="flex items-center gap-2 font-medium text-slate-200">
                                            <span>{c.flag}</span>
                                            <span>{c.countryName}</span>
                                        </span>
                                        <span className="font-mono text-slate-400">
                                            {c.count} <span className="text-[10px] text-slate-500">({c.percentage}%)</span>
                                        </span>
                                    </div>
                                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                                        <div 
                                            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-400"
                                            style={{ width: `${Math.max(c.percentage, 4)}%` }}
                                        />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-8 text-center text-xs text-slate-500 italic">
                                Waiting for incoming visits...
                            </div>
                        )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                        <span>Coverage: {data.topCountries?.length || 0} regions</span>
                        <span className="text-emerald-400 font-semibold">Active Geolocation</span>
                    </div>
                </div>

            </div>

            {/* 3. Real-Time Visitor Live Feed (Where the website was opened) */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-800/80">
                    <div>
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <Activity size={18} className="text-emerald-400" />
                            <span>Live Visitor Activity Log</span>
                        </h2>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Real-time chronologic log of every location opening your portfolio
                        </p>
                    </div>

                    {/* Device Filter Buttons */}
                    <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                        {["all", "desktop", "mobile"].map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setFilterDevice(filter)}
                                className={`px-3 py-1 rounded-lg uppercase tracking-wider font-semibold text-[10px] transition-all cursor-pointer ${
                                    filterDevice === filter
                                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                                        : "text-slate-400 hover:text-white"
                                }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Live Visitor Feed Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300">
                        <thead>
                            <tr className="border-b border-slate-800/80 text-[10px] font-mono uppercase tracking-widest text-slate-500">
                                <th className="pb-3 pl-2">Location & Flag</th>
                                <th className="pb-3">Path Visited</th>
                                <th className="pb-3">Device / Browser</th>
                                <th className="pb-3">Referrer</th>
                                <th className="pb-3 text-right pr-2">Visited</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {filteredVisitors.length > 0 ? (
                                filteredVisitors.map((visit) => (
                                    <tr key={visit.id} className="hover:bg-slate-800/40 transition-colors group">
                                        
                                        {/* Geolocation */}
                                        <td className="py-3.5 pl-2">
                                            <div className="flex items-center gap-2.5">
                                                <span className="text-xl">{visit.flag}</span>
                                                <div>
                                                    <div className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                                                        {visit.cityDisplay}
                                                    </div>
                                                    <div className="text-[10px] text-slate-500">
                                                        {visit.countryName}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Page Visited */}
                                        <td className="py-3.5">
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono text-[11px]">
                                                <span>{visit.path}</span>
                                                <ArrowUpRight size={11} />
                                            </span>
                                        </td>

                                        {/* Device / OS */}
                                        <td className="py-3.5">
                                            <div className="flex items-center gap-2">
                                                <span className="p-1 rounded bg-slate-800 text-slate-300">
                                                    {visit.deviceDisplay === "Mobile" ? (
                                                        <Smartphone size={13} />
                                                    ) : visit.deviceDisplay === "Tablet" ? (
                                                        <Tablet size={13} />
                                                    ) : (
                                                        <Monitor size={13} />
                                                    )}
                                                </span>
                                                <div className="text-[11px]">
                                                    <span className="font-medium text-slate-200">{visit.browserDisplay}</span>
                                                    <span className="text-slate-500"> · {visit.osDisplay}</span>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Referrer */}
                                        <td className="py-3.5">
                                            <span className="text-[11px] font-mono text-slate-400">
                                                {visit.referrer || "Direct"}
                                            </span>
                                        </td>

                                        {/* Timestamp */}
                                        <td className="py-3.5 text-right pr-2">
                                            <div className="text-xs font-mono text-emerald-400 font-medium">
                                                {timeAgo(visit.createdAt)}
                                            </div>
                                            <div className="text-[10px] text-slate-600 font-mono">
                                                {new Date(visit.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </td>

                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-slate-500 italic">
                                        No visitor sessions recorded yet. Open your portfolio in another browser or phone to see live tracking!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 4. Top Cities & Top Pages Split */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
                
                {/* Top Cities */}
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                    <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                        <Globe size={15} className="text-emerald-400" />
                        <span>Top Cities Exploring Your Work</span>
                    </h3>

                    <div className="space-y-2.5">
                        {data.topCities && data.topCities.length > 0 ? (
                            data.topCities.map((city, i) => (
                                <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                                    <div className="flex items-center gap-2 text-xs font-medium text-slate-200">
                                        <span>{city.flag}</span>
                                        <span>{city.city}</span>
                                        <span className="text-slate-500 text-[10px]">({city.countryName})</span>
                                    </div>
                                    <span className="text-xs font-mono text-emerald-400 font-bold">
                                        {city.count} {city.count === 1 ? 'visit' : 'visits'}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="py-6 text-center text-xs text-slate-500 italic">
                                City telemetry will appear as visitors arrive.
                            </div>
                        )}
                    </div>
                </div>

                {/* Top Visited Pages */}
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                    <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                        <Layers size={15} className="text-blue-400" />
                        <span>Most Explored Case Studies & Pages</span>
                    </h3>

                    <div className="space-y-2.5">
                        {data.topPages && data.topPages.length > 0 ? (
                            data.topPages.map((page, i) => (
                                <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                                    <span className="text-xs font-mono text-blue-400 truncate max-w-[200px] sm:max-w-[260px]">
                                        {page.path}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-mono text-white font-bold">
                                            {page.count}
                                        </span>
                                        <span className="text-[10px] text-slate-500 font-mono">
                                            ({page.percentage}%)
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-6 text-center text-xs text-slate-500 italic">
                                Page analytics will populate as routes are viewed.
                            </div>
                        )}
                    </div>
                </div>

            </div>

        </div>
    );
}
