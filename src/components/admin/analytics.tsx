"use client";

import React, { useEffect, useState, useCallback, useTransition } from "react";
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
    Clock,
    FileText,
    Download,
    Eye,
    MapPin,
    ExternalLink,
    Zap,
    X,
    Filter,
    Shield,
    Radio
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

interface VisitorLog {
    id: string;
    createdAt: string;
    path: string;
    action?: string | null;
    pageTitle?: string | null;
    country: string;
    city: string | null;
    region: string | null;
    latitude?: number | null;
    longitude?: number | null;
    isp?: string | null;
    flag: string;
    countryName: string;
    cityDisplay: string;
    regionDisplay: string;
    fullLocationDisplay: string;
    humanTitle: string;
    humanCategory: string;
    humanDetails: string;
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
    activeNow: number;
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
    const diff = Math.max(0, Math.floor((Date.now() - new Date(dateString).getTime()) / 1000));
    if (diff < 10) return "Just now";
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
    const [selectedVisitor, setSelectedVisitor] = useState<VisitorLog | null>(null);
    const [filterCategory, setFilterCategory] = useState<string>("all");
    const [autoSync, setAutoSync] = useState(true);
    const [, startTransition] = useTransition();

    const fetchData = useCallback(async (showIndicator = false) => {
        if (showIndicator) setRefreshing(true);
        try {
            const res = await fetch("/api/analytics/stats", { cache: "no-store" });
            if (!res.ok) throw new Error("API failed");
            const json: AnalyticsPayload = await res.json();
            startTransition(() => {
                setData(json);
                setLastUpdated(new Date());
            });
        } catch (err) {
            console.error("Telemetry fetch error:", err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    // REAL-TIME ENGINE: High-frequency 3-second live polling
    useEffect(() => {
        fetchData();
        if (!autoSync) return;

        const interval = setInterval(() => {
            fetchData();
        }, 3000); // 3-second real-time pulse

        return () => clearInterval(interval);
    }, [fetchData, autoSync]);

    if (loading) {
        return (
            <div className="min-h-full bg-slate-950 p-8 flex flex-col items-center justify-center text-slate-400 gap-3">
                <RefreshCw size={26} className="animate-spin text-blue-500" />
                <p className="text-sm font-mono tracking-widest uppercase">Connecting to live visitor telemetry...</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-full bg-slate-950 p-8 flex flex-col items-center justify-center text-slate-400 gap-4">
                <p className="text-rose-400">Failed to establish connection to tracking stream.</p>
                <button
                    onClick={() => fetchData(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-blue-500 cursor-pointer"
                >
                    Retry Connection
                </button>
            </div>
        );
    }

    const topCountry = data.topCountries?.[0];
    const mobileShare = data.devices?.find(d => d.device === "Mobile")?.percentage || 0;
    const desktopShare = data.devices?.find(d => d.device === "Desktop")?.percentage || 0;

    // Filter visitors based on category
    const filteredVisitors = data.recentVisitors.filter(v => {
        if (filterCategory === "all") return true;
        if (filterCategory === "cases") return v.path.startsWith("/works/");
        if (filterCategory === "cv") return v.action?.includes("RESUME");
        if (filterCategory === "mobile") return v.deviceDisplay === "Mobile";
        return true;
    });

    return (
        <div className="h-full bg-slate-950 text-slate-100 overflow-y-auto p-6 sm:p-8 selection:bg-blue-600 selection:text-white relative font-sans">
            
            {/* Header: Title & Real-Time Sync Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-800/80">
                <div>
                    <div className="flex items-center gap-3">
                        <span className="relative flex h-3.5 w-3.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80"></span>
                            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
                        </span>
                        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
                            <span>Live Visitor Radar & Telemetry</span>
                        </h1>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-bold flex items-center gap-1">
                            <Radio size={12} className="animate-pulse" />
                            <span>REAL-TIME 3s</span>
                        </span>
                    </div>
                    <p className="text-slate-400 text-xs sm:text-sm mt-1">
                        Tracking exact global locations, accessed case studies, CV downloads, and device intelligence as they happen.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setAutoSync(!autoSync)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                            autoSync 
                                ? "bg-emerald-950/40 text-emerald-300 border-emerald-800/60" 
                                : "bg-slate-900 text-slate-400 border-slate-800"
                        }`}
                        title="Toggle live 3-second polling"
                    >
                        <span className={`w-2 h-2 rounded-full ${autoSync ? "bg-emerald-400 animate-pulse" : "bg-slate-600"}`} />
                        <span>Live Sync: {autoSync ? "ON (3s)" : "PAUSED"}</span>
                    </button>

                    <button
                        onClick={() => fetchData(true)}
                        disabled={refreshing}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-all text-xs font-semibold flex items-center gap-2 cursor-pointer disabled:opacity-50 shadow-md shadow-blue-600/20"
                        title="Force sync now"
                    >
                        <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
                        <span>Sync Now</span>
                    </button>
                </div>
            </div>

            {/* 1. Core KPIs: Active Now, Total Views, Top Origin, Device Share */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                
                {/* Active Right Now */}
                <div className="p-5 rounded-2xl bg-gradient-to-b from-emerald-950/30 to-slate-900 border border-emerald-500/30 hover:border-emerald-500/60 transition-all shadow-lg shadow-emerald-950/20">
                    <div className="flex items-center justify-between text-emerald-400 text-xs font-mono uppercase tracking-wider mb-2">
                        <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                            Active Now
                        </span>
                        <Activity size={16} />
                    </div>
                    <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                        {data.activeNow || (data.viewsToday > 0 ? 1 : 0)}
                    </div>
                    <div className="mt-2 text-xs text-emerald-300/80 font-medium">
                        Browsing in last 5 minutes
                    </div>
                </div>

                {/* Total Views */}
                <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-900/60 border border-slate-800 hover:border-blue-500/30 transition-all">
                    <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase tracking-wider mb-2">
                        <span>Total Views</span>
                        <Layers size={16} className="text-blue-400" />
                    </div>
                    <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                        {data.totalViews.toLocaleString()}
                    </div>
                    <div className="mt-2 text-xs text-slate-400 flex items-center gap-1.5">
                        <span className="text-blue-400 font-bold">{data.uniqueVisitors.toLocaleString()}</span>
                        <span>unique individuals</span>
                    </div>
                </div>

                {/* Top Origin Location */}
                <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-900/60 border border-slate-800 hover:border-amber-500/30 transition-all">
                    <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase tracking-wider mb-2">
                        <span>Primary Origin</span>
                        <Globe size={16} className="text-amber-400" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2 truncate">
                        <span>{topCountry?.flag || "🌐"}</span>
                        <span className="truncate">{topCountry?.countryName || "Worldwide"}</span>
                    </div>
                    <div className="mt-2 text-xs text-slate-400 flex items-center gap-1.5">
                        <span className="text-amber-400 font-bold">{topCountry?.percentage || 0}%</span>
                        <span>of global visitor footprint</span>
                    </div>
                </div>

                {/* Device Split */}
                <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-900/60 border border-slate-800 hover:border-purple-500/30 transition-all">
                    <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase tracking-wider mb-2">
                        <span>Hardware Split</span>
                        <Smartphone size={16} className="text-purple-400" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
                        <span>{desktopShare}% <span className="text-xs font-normal text-slate-400">Desk</span></span>
                        <span className="text-slate-600">/</span>
                        <span className="text-purple-400">{mobileShare}% <span className="text-xs font-normal text-slate-400">Mob</span></span>
                    </div>
                    <div className="mt-2 text-xs text-slate-400">
                        Spatial desktop & responsive touch
                    </div>
                </div>

            </div>

            {/* 2. REAL-TIME ACTIVITY FEED: WHAT WAS ACCESSED & EXACT LOCATION */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 mb-8 shadow-xl">
                
                {/* Section Header & Interactive Filter Tabs */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 mb-5 border-b border-slate-800/80">
                    <div>
                        <div className="flex items-center gap-2">
                            <Zap size={18} className="text-amber-400 fill-amber-400/20" />
                            <h2 className="text-lg font-bold text-white">
                                Live Session Log: Location & Content Accessed
                            </h2>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Click on any session row to inspect exact coordinates, full address, and telemetry details.
                        </p>
                    </div>

                    {/* Filter Pills */}
                    <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                        {[
                            { id: "all", label: "All Events" },
                            { id: "cases", label: "Case Studies" },
                            { id: "cv", label: "CV Dossier" },
                            { id: "mobile", label: "Mobile" }
                        ].map((btn) => (
                            <button
                                key={btn.id}
                                onClick={() => setFilterCategory(btn.id)}
                                className={`px-3 py-1 rounded-lg uppercase tracking-wider font-semibold text-[10px] transition-all cursor-pointer ${
                                    filterCategory === btn.id
                                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                                        : "text-slate-400 hover:text-white"
                                }`}
                            >
                                {btn.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table of Live Visits */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300">
                        <thead>
                            <tr className="border-b border-slate-800/80 text-[10px] font-mono uppercase tracking-widest text-slate-500">
                                <th className="pb-3 pl-2">Proper Location</th>
                                <th className="pb-3">What Was Accessed</th>
                                <th className="pb-3">Device / Platform</th>
                                <th className="pb-3">Referrer</th>
                                <th className="pb-3 text-right pr-2">When</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {filteredVisitors.length > 0 ? (
                                filteredVisitors.map((visit) => {
                                    const isRecent = Math.floor((Date.now() - new Date(visit.createdAt).getTime()) / 1000) < 60;
                                    return (
                                        <tr 
                                            key={visit.id} 
                                            onClick={() => setSelectedVisitor(visit)}
                                            className={`hover:bg-slate-800/60 transition-colors group cursor-pointer ${
                                                isRecent ? "bg-emerald-950/15" : ""
                                            }`}
                                        >
                                            
                                            {/* PROPER LOCATION */}
                                            <td className="py-3.5 pl-2">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-2xl select-none">{visit.flag}</span>
                                                    <div>
                                                        <div className="font-bold text-white group-hover:text-blue-400 transition-colors flex items-center gap-1.5">
                                                            <span>{visit.fullLocationDisplay}</span>
                                                            {visit.latitude && visit.longitude && (
                                                                <span className="p-0.5 rounded bg-blue-500/10 text-blue-400" title="GPS Pin Available">
                                                                    <MapPin size={10} />
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="text-[10px] text-slate-500 font-mono">
                                                            {visit.isp ? `${visit.isp} · ` : ""}{visit.maskedIp}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* WHAT WAS ACCESSED */}
                                            <td className="py-3.5">
                                                <div className="space-y-1">
                                                    <div className="font-semibold text-white flex items-center gap-1.5">
                                                        {visit.action?.includes("RESUME") ? (
                                                            <span className="p-1 rounded bg-emerald-500/10 text-emerald-400">
                                                                <FileText size={12} />
                                                            </span>
                                                        ) : visit.action?.includes("DOWNLOAD") ? (
                                                            <span className="p-1 rounded bg-amber-500/10 text-amber-400">
                                                                <Download size={12} />
                                                            </span>
                                                        ) : (
                                                            <span className="p-1 rounded bg-blue-500/10 text-blue-400">
                                                                <Eye size={12} />
                                                            </span>
                                                        )}
                                                        <span className="truncate max-w-[280px] sm:max-w-[340px]">
                                                            {visit.humanTitle}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-[10px]">
                                                        <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
                                                            {visit.humanCategory}
                                                        </span>
                                                        <span className="text-slate-500 font-mono">
                                                            {visit.path}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* DEVICE & BROWSER */}
                                            <td className="py-3.5">
                                                <div className="flex items-center gap-2">
                                                    <span className="p-1.5 rounded-lg bg-slate-800 text-slate-300">
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

                                            {/* REFERRER */}
                                            <td className="py-3.5">
                                                <span className="text-[11px] font-mono text-slate-400">
                                                    {visit.referrer || "Direct"}
                                                </span>
                                            </td>

                                            {/* TIMESTAMP */}
                                            <td className="py-3.5 text-right pr-2">
                                                <div className={`text-xs font-mono font-medium ${isRecent ? "text-emerald-400 font-bold" : "text-slate-300"}`}>
                                                    {timeAgo(visit.createdAt)}
                                                </div>
                                                <div className="text-[10px] text-slate-500 font-mono">
                                                    {new Date(visit.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                                </div>
                                            </td>

                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-slate-500 italic">
                                        No visitor sessions matching filter. Real-time events will stream in automatically.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

            </div>

            {/* 3. 7-Day Velocity & Top Geographies */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                
                {/* 7-Day Velocity Chart */}
                <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-base font-bold text-white flex items-center gap-2">
                                <Calendar size={16} className="text-blue-400" />
                                <span>7-Day Visitor Velocity</span>
                            </h2>
                            <p className="text-xs text-slate-400 mt-0.5">Daily pageviews across your portfolio</p>
                        </div>
                        <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            30-Day Volume: {data.viewsLast30Days}
                        </span>
                    </div>

                    <div className="h-[220px] w-full mt-4">
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

                {/* Top Countries Ranking */}
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
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
                        <span>Total Countries: {data.topCountries?.length || 0}</span>
                        <span className="text-emerald-400 font-semibold">Live GPS Mapping</span>
                    </div>
                </div>

            </div>

            {/* 4. VISITOR DEEP DIVE MODAL / INSPECTOR */}
            {selectedVisitor && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl relative">
                        
                        {/* Modal Header */}
                        <div className="flex items-start justify-between pb-4 mb-4 border-b border-slate-800">
                            <div className="flex items-center gap-3">
                                <span className="text-3xl">{selectedVisitor.flag}</span>
                                <div>
                                    <h3 className="font-bold text-white text-base">
                                        {selectedVisitor.fullLocationDisplay}
                                    </h3>
                                    <p className="text-xs text-slate-400 font-mono">
                                        {selectedVisitor.cityDisplay} · {selectedVisitor.countryName}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedVisitor(null)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="space-y-4 text-xs">
                            
                            {/* What was accessed */}
                            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                                <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">
                                    Content Accessed
                                </div>
                                <div className="font-bold text-white text-sm">
                                    {selectedVisitor.humanTitle}
                                </div>
                                <div className="text-slate-400 mt-0.5">
                                    {selectedVisitor.humanDetails}
                                </div>
                                <div className="mt-2 text-[11px] font-mono text-blue-400">
                                    Path: {selectedVisitor.path}
                                </div>
                            </div>

                            {/* Location & GPS */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                                    <span className="text-[10px] text-slate-500 uppercase font-mono block mb-1">
                                        Region / State
                                    </span>
                                    <span className="font-semibold text-white">
                                        {selectedVisitor.regionDisplay || selectedVisitor.countryName}
                                    </span>
                                </div>

                                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                                    <span className="text-[10px] text-slate-500 uppercase font-mono block mb-1">
                                        Map Coordinates
                                    </span>
                                    {selectedVisitor.latitude && selectedVisitor.longitude ? (
                                        <a
                                            href={`https://www.google.com/maps?q=${selectedVisitor.latitude},${selectedVisitor.longitude}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-semibold text-blue-400 hover:underline flex items-center gap-1"
                                        >
                                            <span>{selectedVisitor.latitude.toFixed(2)}, {selectedVisitor.longitude.toFixed(2)}</span>
                                            <ExternalLink size={11} />
                                        </a>
                                    ) : (
                                        <span className="text-slate-500">Country Edge Header</span>
                                    )}
                                </div>
                            </div>

                            {/* Telemetry Hardware */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                                    <span className="text-[10px] text-slate-500 uppercase font-mono block mb-1">
                                        Device & OS
                                    </span>
                                    <span className="font-semibold text-white">
                                        {selectedVisitor.deviceDisplay} · {selectedVisitor.osDisplay}
                                    </span>
                                </div>

                                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                                    <span className="text-[10px] text-slate-500 uppercase font-mono block mb-1">
                                        Browser Engine
                                    </span>
                                    <span className="font-semibold text-white">
                                        {selectedVisitor.browserDisplay}
                                    </span>
                                </div>
                            </div>

                            {/* Timestamp & ISP */}
                            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center font-mono">
                                <div>
                                    <span className="text-[10px] text-slate-500 uppercase block mb-0.5">
                                        Timestamp
                                    </span>
                                    <span className="text-white text-[11px]">
                                        {new Date(selectedVisitor.createdAt).toLocaleString()}
                                    </span>
                                </div>
                                <span className="text-emerald-400 text-xs font-semibold">
                                    {timeAgo(selectedVisitor.createdAt)}
                                </span>
                            </div>

                        </div>

                        {/* Modal Footer */}
                        <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
                            <button
                                onClick={() => setSelectedVisitor(null)}
                                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                            >
                                Close Inspector
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}
