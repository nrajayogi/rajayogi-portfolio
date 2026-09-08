"use client";

import React, { useEffect, useState, useCallback, useTransition } from "react";
import { 
    MapPin, 
    Globe, 
    ExternalLink, 
    RefreshCw, 
    Radio, 
    Smartphone, 
    Monitor, 
    Clock, 
    ArrowUpRight,
    Search,
    Navigation,
    Compass
} from "lucide-react";

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
    flag: string;
    countryName: string;
    cityDisplay: string;
    regionDisplay: string;
    fullLocationDisplay: string;
    humanTitle: string;
    deviceDisplay: string;
    browserDisplay: string;
    osDisplay: string;
    isp?: string | null;
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

interface AnalyticsPayload {
    totalViews: number;
    uniqueVisitors: number;
    activeNow: number;
    viewsToday: number;
    topCountries: CountryStat[];
    topCities: CityStat[];
    recentVisitors: VisitorLog[];
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
    const [searchQuery, setSearchQuery] = useState("");
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
            console.error("Location fetch error:", err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    // 3-second real-time location sync
    useEffect(() => {
        fetchData();
        if (!autoSync) return;
        const interval = setInterval(() => {
            fetchData();
        }, 3000);
        return () => clearInterval(interval);
    }, [fetchData, autoSync]);

    if (loading) {
        return (
            <div className="min-h-full bg-slate-950 p-12 flex flex-col items-center justify-center text-slate-400 gap-3">
                <RefreshCw size={26} className="animate-spin text-blue-500" />
                <p className="text-sm font-mono tracking-widest uppercase">Connecting to live location stream...</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-full bg-slate-950 p-12 flex flex-col items-center justify-center text-slate-400 gap-4">
                <p className="text-rose-400">Failed to load location data.</p>
                <button
                    onClick={() => fetchData(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-[4px] text-xs font-semibold uppercase tracking-wider hover:bg-blue-500 cursor-pointer"
                >
                    Retry Connection
                </button>
            </div>
        );
    }

    const latest = data.recentVisitors?.[0];
    const topCountry = data.topCountries?.[0];
    const topCity = data.topCities?.[0];

    // Filter by city or country search query
    const filteredVisitors = (data.recentVisitors || []).filter(v => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
            v.fullLocationDisplay.toLowerCase().includes(q) ||
            v.countryName.toLowerCase().includes(q) ||
            v.cityDisplay.toLowerCase().includes(q) ||
            (v.regionDisplay && v.regionDisplay.toLowerCase().includes(q))
        );
    });

    return (
        <div className="h-full bg-slate-950 text-slate-100 overflow-y-auto p-6 sm:p-10 selection:bg-blue-600 selection:text-white font-sans">
            
            {/* Header: Title & Auto-Sync Pulse */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-800/80">
                <div>
                    <div className="flex items-center gap-3">
                        <span className="relative flex h-3.5 w-3.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80"></span>
                            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
                        </span>
                        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
                            <span>Portfolio Access Location Tracker</span>
                        </h1>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-bold flex items-center gap-1">
                            <Radio size={12} className="animate-pulse" />
                            <span>LIVE 3s</span>
                        </span>
                    </div>
                    <p className="text-slate-400 text-xs sm:text-sm mt-1">
                        Real-time tracking of every global city, region, and country where your portfolio is opened.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setAutoSync(!autoSync)}
                        className={`px-3.5 py-1.5 rounded-[4px] border text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                            autoSync 
                                ? "bg-emerald-950/40 text-emerald-300 border-emerald-800/60" 
                                : "bg-slate-900 text-slate-400 border-slate-800"
                        }`}
                        title="Toggle live 3-second location polling"
                    >
                        <span className={`w-2 h-2 rounded-full ${autoSync ? "bg-emerald-400 animate-pulse" : "bg-slate-600"}`} />
                        <span>Live Sync: {autoSync ? "ON" : "PAUSED"}</span>
                    </button>

                    <button
                        onClick={() => fetchData(true)}
                        disabled={refreshing}
                        className="px-4 py-2 rounded-[4px] bg-blue-600 hover:bg-blue-500 text-white transition-all text-xs font-semibold flex items-center gap-2 cursor-pointer disabled:opacity-50 shadow-md shadow-blue-600/20"
                    >
                        <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
                        <span>Refresh</span>
                    </button>
                </div>
            </div>

            {/* 1. LATEST LOCATION HERO CARD (Most Recent Access) */}
            {latest && (
                <div className="p-6 rounded-[4px] bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-900 border border-blue-500/30 mb-8 shadow-2xl relative overflow-hidden">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                        <div className="flex items-start gap-4">
                            <span className="text-4xl sm:text-5xl select-none leading-none">{latest.flag}</span>
                            <div>
                                <div className="flex items-center gap-2 text-blue-400 text-xs font-mono uppercase tracking-wider font-semibold">
                                    <MapPin size={14} className="text-rose-400" />
                                    <span>Most Recent Portfolio Access</span>
                                    <span className="text-slate-500">·</span>
                                    <span className="text-emerald-400 font-bold">{timeAgo(latest.createdAt)}</span>
                                </div>
                                <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                                    {latest.fullLocationDisplay}
                                </h2>
                                <div className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-3">
                                    <span>Route: <strong className="text-slate-200 font-mono">{latest.path}</strong></span>
                                    <span>Device: <strong className="text-slate-200">{latest.deviceDisplay}</strong> ({latest.browserDisplay})</span>
                                    {latest.isp && <span>Network: <strong className="text-slate-200">{latest.isp}</strong></span>}
                                </div>
                            </div>
                        </div>

                        {latest.latitude && latest.longitude && (
                            <a
                                href={`https://www.google.com/maps?q=${latest.latitude},${latest.longitude}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[4px] bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shrink-0 self-start md:self-center shadow-lg shadow-blue-600/30 cursor-pointer"
                            >
                                <Navigation size={14} />
                                <span>Open Pin in Google Maps</span>
                                <ExternalLink size={12} />
                            </a>
                        )}
                    </div>
                </div>
            )}

            {/* 2. THREE LOCATION SUMMARY PILLS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
                
                {/* Active Browsing Locations */}
                <div className="p-5 rounded-[4px] bg-slate-900 border border-slate-800">
                    <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                        <span>Active Locations (5m)</span>
                        <Radio size={14} className="text-emerald-400 animate-pulse" />
                    </div>
                    <div className="text-3xl font-black text-white">
                        {data.activeNow || 1}
                    </div>
                    <p className="text-xs text-emerald-400/90 mt-1 font-medium">
                        Opening portfolio right now
                    </p>
                </div>

                {/* Top Origin Country */}
                <div className="p-5 rounded-[4px] bg-slate-900 border border-slate-800">
                    <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                        <span>Top Country</span>
                        <Globe size={14} className="text-blue-400" />
                    </div>
                    <div className="text-2xl font-black text-white flex items-center gap-2 truncate">
                        <span>{topCountry?.flag || "🌐"}</span>
                        <span className="truncate">{topCountry?.countryName || "Unknown"}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                        <strong className="text-blue-400">{topCountry?.count || 0} accesses</strong> ({topCountry?.percentage || 0}% of all visits)
                    </p>
                </div>

                {/* Top Origin City */}
                <div className="p-5 rounded-[4px] bg-slate-900 border border-slate-800">
                    <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                        <span>Top City</span>
                        <MapPin size={14} className="text-amber-400" />
                    </div>
                    <div className="text-2xl font-black text-white flex items-center gap-2 truncate">
                        <span>{topCity?.flag || "📍"}</span>
                        <span className="truncate">{topCity?.city || "Enschede"}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                        <strong className="text-amber-400">{topCity?.count || 0} accesses</strong> ({topCity?.countryName || "Netherlands"})
                    </p>
                </div>

            </div>

            {/* 3. LIVE LOCATION ACCESS FEED (Chronological Where Website Was Opened) */}
            <div className="p-6 rounded-[4px] bg-slate-900 border border-slate-800 mb-8 shadow-xl">
                
                {/* Search / Filter Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-5 border-b border-slate-800/80">
                    <div>
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <MapPin size={18} className="text-rose-400" />
                            <span>Location Access Log</span>
                        </h2>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Every location that opened your portfolio, sorted in real-time.
                        </p>
                    </div>

                    <div className="relative w-full sm:w-72">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Filter by city, region, or country..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-[4px] pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>
                </div>

                {/* Locations Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300">
                        <thead>
                            <tr className="border-b border-slate-800/80 text-[10px] font-mono uppercase tracking-widest text-slate-500">
                                <th className="pb-3 pl-2">Location (City, State, Country)</th>
                                <th className="pb-3">Map Pin</th>
                                <th className="pb-3">Page Opened</th>
                                <th className="pb-3">Device</th>
                                <th className="pb-3 text-right pr-2">When Opened</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {filteredVisitors.length > 0 ? (
                                filteredVisitors.map((v) => {
                                    const isRecent = Math.floor((Date.now() - new Date(v.createdAt).getTime()) / 1000) < 60;
                                    return (
                                        <tr key={v.id} className={`hover:bg-slate-800/50 transition-colors ${isRecent ? "bg-emerald-950/15" : ""}`}>
                                            
                                            {/* Flag + Location */}
                                            <td className="py-3.5 pl-2">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-2xl select-none">{v.flag}</span>
                                                    <div>
                                                        <div className="font-bold text-white text-sm">
                                                            {v.fullLocationDisplay}
                                                        </div>
                                                        <div className="text-[10px] text-slate-500 font-mono">
                                                            {v.cityDisplay} · {v.countryName}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Map Link */}
                                            <td className="py-3.5">
                                                {v.latitude && v.longitude ? (
                                                    <a
                                                        href={`https://www.google.com/maps?q=${v.latitude},${v.longitude}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[4px] bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 text-[11px] font-mono transition-colors"
                                                    >
                                                        <MapPin size={11} className="text-rose-400" />
                                                        <span>{v.latitude.toFixed(2)}, {v.longitude.toFixed(2)}</span>
                                                        <ExternalLink size={10} />
                                                    </a>
                                                ) : (
                                                    <span className="text-slate-600 text-[11px] font-mono">Edge Header</span>
                                                )}
                                            </td>

                                            {/* Page Opened */}
                                            <td className="py-3.5">
                                                <span className="font-mono text-[11px] text-blue-400 px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
                                                    {v.path}
                                                </span>
                                            </td>

                                            {/* Device */}
                                            <td className="py-3.5">
                                                <div className="flex items-center gap-1.5 text-slate-300">
                                                    {v.deviceDisplay === "Mobile" ? <Smartphone size={13} /> : <Monitor size={13} />}
                                                    <span>{v.deviceDisplay}</span>
                                                </div>
                                            </td>

                                            {/* Timestamp */}
                                            <td className="py-3.5 text-right pr-2 font-mono">
                                                <div className={`font-semibold ${isRecent ? "text-emerald-400" : "text-slate-300"}`}>
                                                    {timeAgo(v.createdAt)}
                                                </div>
                                                <div className="text-[10px] text-slate-500">
                                                    {new Date(v.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </td>

                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={5} className="py-10 text-center text-slate-500 italic">
                                        No locations found matching &quot;{searchQuery}&quot;.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

            </div>

            {/* 4. CITIES & COUNTRIES BREAKDOWN (Side by Side) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
                
                {/* Top Cities */}
                <div className="p-6 rounded-[4px] bg-slate-900 border border-slate-800">
                    <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                        <MapPin size={15} className="text-rose-400" />
                        <span>Cities Opening Your Portfolio</span>
                    </h3>

                    <div className="space-y-2.5">
                        {data.topCities && data.topCities.length > 0 ? (
                            data.topCities.map((c, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-[4px] bg-slate-950 border border-slate-800/80">
                                    <div className="flex items-center gap-2.5 text-xs font-semibold text-white">
                                        <span className="text-lg">{c.flag}</span>
                                        <span>{c.city}</span>
                                        <span className="text-slate-500 font-normal text-[11px]">({c.countryName})</span>
                                    </div>
                                    <span className="text-xs font-mono text-emerald-400 font-bold">
                                        {c.count} {c.count === 1 ? 'access' : 'accesses'}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="py-6 text-center text-xs text-slate-500 italic">
                                City breakdown will populate as visitors arrive.
                            </div>
                        )}
                    </div>
                </div>

                {/* Top Countries */}
                <div className="p-6 rounded-[4px] bg-slate-900 border border-slate-800">
                    <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                        <Globe size={15} className="text-blue-400" />
                        <span>Countries Opening Your Portfolio</span>
                    </h3>

                    <div className="space-y-3">
                        {data.topCountries && data.topCountries.length > 0 ? (
                            data.topCountries.map((c, i) => (
                                <div key={i} className="space-y-1">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="flex items-center gap-2 font-medium text-slate-200">
                                            <span>{c.flag}</span>
                                            <span>{c.countryName}</span>
                                        </span>
                                        <span className="font-mono text-slate-400 text-xs">
                                            {c.count} accesses ({c.percentage}%)
                                        </span>
                                    </div>
                                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                                        <div 
                                            className="h-full rounded-full bg-blue-500"
                                            style={{ width: `${Math.max(c.percentage, 5)}%` }}
                                        />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-6 text-center text-xs text-slate-500 italic">
                                Country breakdown will populate as visitors arrive.
                            </div>
                        )}
                    </div>
                </div>

            </div>

        </div>
    );
}
