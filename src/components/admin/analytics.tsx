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
    Tablet,
    Clock, 
    ArrowUpRight,
    Search,
    Navigation,
    Compass,
    ShieldCheck,
    Cpu,
    Layers,
    Activity,
    CheckCircle2,
    Info,
    X,
    ChevronRight,
    Eye,
    BarChart3,
    Mail,
    Terminal,
    Zap,
    Sparkles
} from "lucide-react";
import { Inbox } from "./inbox";

export interface VisitorLog {
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

interface TimelineItem {
    day: string;
    views: number;
}

interface AnalyticsPayload {
    totalViews: number;
    uniqueVisitors: number;
    activeNow: number;
    viewsToday: number;
    topCountries: CountryStat[];
    topCities: CityStat[];
    recentVisitors: VisitorLog[];
    timeline?: TimelineItem[];
}

interface DiagnosticResult {
    success: boolean;
    detectedIp: string;
    country: string;
    countryName: string;
    flag: string;
    city: string;
    region: string;
    latitude: number;
    longitude: number;
    isp: string;
    edgeNode: string;
    tier: string;
    timestamp: string;
    headersFound: Record<string, string>;
}

function timeAgo(dateString: string): string {
    const diff = Math.max(0, Math.floor((Date.now() - new Date(dateString).getTime()) / 1000));
    if (diff < 10) return "Just now";
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
}

// Projection helper for SVG World Map: Converts (lat, lng) to (x%, y%)
function projectCoords(lat: number | null | undefined, lng: number | null | undefined) {
    if (lat == null || lng == null) return { x: 50, y: 50 };
    // Equirectangular projection
    const x = Math.max(2, Math.min(98, ((lng + 180) / 360) * 100));
    const y = Math.max(5, Math.min(95, ((90 - lat) / 180) * 100));
    return { x, y };
}

export function Analytics({ activeTab = "radar" }: { activeTab?: "radar" | "trace" | "traffic" | "messages" }) {
    const [tab, setTab] = useState<"radar" | "trace" | "traffic" | "messages">(activeTab);
    const [data, setData] = useState<AnalyticsPayload | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
    const [searchQuery, setSearchQuery] = useState("");
    const [autoSync, setAutoSync] = useState(true);
    const [selectedVisitor, setSelectedVisitor] = useState<VisitorLog | null>(null);
    const [hoveredPin, setHoveredPin] = useState<VisitorLog | null>(null);
    const [, startTransition] = useTransition();

    // Diagnostic state
    const [diagnosticRunning, setDiagnosticRunning] = useState(false);
    const [diagnosticData, setDiagnosticData] = useState<DiagnosticResult | null>(null);

    const fetchData = useCallback(async (showIndicator = false) => {
        if (showIndicator) setRefreshing(true);
        try {
            const res = await fetch("/api/analytics/stats", { cache: "no-store" });
            if (res.status === 401) {
                window.location.href = "/admin/login";
                return;
            }
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

    const runDiagnostic = async () => {
        setDiagnosticRunning(true);
        try {
            const res = await fetch("/api/analytics/diagnose", { cache: "no-store" });
            if (res.status === 401) {
                window.location.href = "/admin/login";
                return;
            }
            if (res.ok) {
                const json: DiagnosticResult = await res.json();
                setDiagnosticData(json);
            }
        } catch (err) {
            console.error("Diagnostic error:", err);
        } finally {
            setDiagnosticRunning(false);
        }
    };

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
            (v.regionDisplay && v.regionDisplay.toLowerCase().includes(q)) ||
            v.path.toLowerCase().includes(q)
        );
    });

    // Unique locations with coordinates for the radar map
    const mappedLocations = (data.recentVisitors || []).filter(v => v.latitude != null && v.longitude != null);

    return (
        <div className="h-full bg-slate-950 text-slate-100 overflow-y-auto p-6 sm:p-10 selection:bg-blue-600 selection:text-white font-sans relative">
            
            {/* Top Navigation Tabs */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-800/80">
                <div>
                    <div className="flex items-center gap-3">
                        <span className="relative flex h-3.5 w-3.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80"></span>
                            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
                        </span>
                        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
                            <span>Portfolio Command & Location Radar</span>
                        </h1>
                        <span className="px-2.5 py-0.5 rounded-[4px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-bold flex items-center gap-1">
                            <Radio size={12} className="animate-pulse" />
                            <span>LIVE TELEMETRY</span>
                        </span>
                    </div>
                    <p className="text-slate-400 text-xs sm:text-sm mt-1">
                        Definitive tracking of every location where your portfolio is opened and forensic inspection of how it is traced.
                    </p>
                </div>

                {/* View Switcher Tabs */}
                <div className="flex flex-wrap items-center gap-2 bg-slate-900 border border-slate-800 p-1 rounded-[4px]">
                    <button
                        onClick={() => setTab("radar")}
                        className={`px-3.5 py-1.5 rounded-[4px] text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                            tab === "radar"
                                ? "bg-blue-600 text-white shadow-sm"
                                : "text-slate-400 hover:text-white"
                        }`}
                    >
                        <MapPin size={13} />
                        <span>Live Locations & Radar</span>
                    </button>

                    <button
                        onClick={() => setTab("trace")}
                        className={`px-3.5 py-1.5 rounded-[4px] text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                            tab === "trace"
                                ? "bg-blue-600 text-white shadow-sm"
                                : "text-slate-400 hover:text-white"
                        }`}
                    >
                        <Cpu size={13} />
                        <span>How It&apos;s Traced (Architecture)</span>
                    </button>

                    <button
                        onClick={() => setTab("traffic")}
                        className={`px-3.5 py-1.5 rounded-[4px] text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                            tab === "traffic"
                                ? "bg-blue-600 text-white shadow-sm"
                                : "text-slate-400 hover:text-white"
                        }`}
                    >
                        <BarChart3 size={13} />
                        <span>Traffic & Audience</span>
                    </button>

                    <button
                        onClick={() => setTab("messages")}
                        className={`px-3.5 py-1.5 rounded-[4px] text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                            tab === "messages"
                                ? "bg-blue-600 text-white shadow-sm"
                                : "text-slate-400 hover:text-white"
                        }`}
                    >
                        <Mail size={13} />
                        <span>Contact Messages</span>
                    </button>
                </div>
            </div>

            {/* TAB 1: LIVE LOCATION RADAR & ACCESS FEED */}
            {tab === "radar" && (
                <div className="space-y-8">
                    
                    {/* Live Sync Controls Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-[4px] bg-slate-900 border border-slate-800">
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-mono text-slate-400">
                                Last telemetry sync: <strong className="text-slate-200">{lastUpdated.toLocaleTimeString()}</strong>
                            </span>
                            <span className="text-slate-700">|</span>
                            <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                <span>Edge Gateway: Active</span>
                            </span>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setAutoSync(!autoSync)}
                                className={`px-3 py-1.5 rounded-[4px] border text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                                    autoSync 
                                        ? "bg-emerald-950/40 text-emerald-300 border-emerald-800/60" 
                                        : "bg-slate-950 text-slate-400 border-slate-800"
                                }`}
                            >
                                <span className={`w-2 h-2 rounded-full ${autoSync ? "bg-emerald-400 animate-pulse" : "bg-slate-600"}`} />
                                <span>Live 3s Polling: {autoSync ? "ON" : "PAUSED"}</span>
                            </button>

                            <button
                                onClick={() => fetchData(true)}
                                disabled={refreshing}
                                className="px-3.5 py-1.5 rounded-[4px] bg-blue-600 hover:bg-blue-500 text-white transition-all text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                            >
                                <RefreshCw size={12} className={refreshing ? "animate-spin" : ""} />
                                <span>Refresh Now</span>
                            </button>
                        </div>
                    </div>

                    {/* INTERACTIVE GLOBAL RADAR WORLD MAP */}
                    <div className="p-6 rounded-[4px] bg-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800/80">
                            <div>
                                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                                    <Globe size={16} className="text-blue-400" />
                                    <span>Interactive Global Radar Map (Where Website Was Opened)</span>
                                </h3>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Real-time coordinates mapped onto world parallels and meridians. Hover or click any coordinate pin to inspect trace.
                                </p>
                            </div>
                            <span className="text-xs font-mono text-cyan-400 font-bold bg-cyan-950/40 border border-cyan-800/60 px-2.5 py-1 rounded-[4px]">
                                {mappedLocations.length} Mapped Coordinate Pins
                            </span>
                        </div>

                        {/* Visual World Radar Canvas */}
                        <div className="relative w-full aspect-[21/9] min-h-[280px] sm:min-h-[340px] bg-slate-950 rounded-[4px] border border-slate-800/80 overflow-hidden flex items-center justify-center select-none">
                            {/* Radar Grid Overlay */}
                            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px]" />
                            
                            {/* Latitude / Longitude Parallels & Meridians */}
                            <svg className="absolute inset-0 w-full h-full stroke-slate-800/60 stroke-[0.5]" preserveAspectRatio="none">
                                <line x1="0%" y1="25%" x2="100%" y2="25%" strokeDasharray="4 4" />
                                <line x1="0%" y1="50%" x2="100%" y2="50%" strokeDasharray="2 2" stroke="#3b82f6" strokeOpacity="0.4" />
                                <line x1="0%" y1="75%" x2="100%" y2="75%" strokeDasharray="4 4" />
                                <line x1="25%" y1="0%" x2="25%" y2="100%" strokeDasharray="4 4" />
                                <line x1="50%" y1="0%" x2="50%" y2="100%" strokeDasharray="2 2" stroke="#3b82f6" strokeOpacity="0.4" />
                                <line x1="75%" y1="0%" x2="75%" y2="100%" strokeDasharray="4 4" />
                            </svg>

                            {/* World Continent Silhouettes (Subtle Vector Overlay) */}
                            <div className="absolute inset-0 flex items-center justify-around opacity-15 pointer-events-none font-mono text-[80px] font-black text-slate-700 tracking-tighter">
                                <span>AMERICAS</span>
                                <span>EMEA</span>
                                <span>APAC</span>
                            </div>

                            {/* Coordinate Pins */}
                            {mappedLocations.map((v, i) => {
                                const { x, y } = projectCoords(v.latitude, v.longitude);
                                const isLatest = i === 0;

                                return (
                                    <div
                                        key={v.id}
                                        style={{ left: `${x}%`, top: `${y}%` }}
                                        className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10"
                                        onClick={() => setSelectedVisitor(v)}
                                        onMouseEnter={() => setHoveredPin(v)}
                                        onMouseLeave={() => setHoveredPin(null)}
                                    >
                                        {/* Outer Radar Pulse Ring */}
                                        <span className={`absolute -inset-2 rounded-full opacity-75 animate-ping ${isLatest ? "bg-rose-500" : "bg-blue-400"}`} />
                                        
                                        {/* Inner Hotspot Marker */}
                                        <div className={`relative flex items-center justify-center w-5 h-5 rounded-full border shadow-lg transition-transform group-hover:scale-150 ${
                                            isLatest 
                                                ? "bg-rose-500 border-white text-white" 
                                                : "bg-blue-500 border-cyan-300 text-white"
                                        }`}>
                                            <span className="text-[10px] select-none">{v.flag}</span>
                                        </div>

                                        {/* Floating Badge */}
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center pointer-events-none z-30">
                                            <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700 p-2 rounded-[4px] text-center whitespace-nowrap shadow-2xl">
                                                <div className="font-bold text-xs text-white flex items-center gap-1.5 justify-center">
                                                    <span>{v.flag}</span>
                                                    <span>{v.cityDisplay}</span>
                                                </div>
                                                <div className="text-[10px] text-cyan-400 font-mono">
                                                    {v.latitude?.toFixed(2)}°, {v.longitude?.toFixed(2)}°
                                                </div>
                                                <div className="text-[9px] text-slate-400">
                                                    {timeAgo(v.createdAt)} · {v.deviceDisplay}
                                                </div>
                                                <div className="text-[9px] text-emerald-400 font-mono mt-0.5 font-bold">
                                                    CLICK TO INSPECT TRACE ↗
                                                </div>
                                            </div>
                                            <div className="w-2 h-2 bg-slate-900 border-r border-b border-slate-700 transform rotate-45 -mt-1" />
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Hover Inspector Pill on Canvas Bottom */}
                            <div className="absolute bottom-3 left-4 right-4 bg-slate-900/80 backdrop-blur-md border border-slate-800 p-2.5 rounded-[4px] flex items-center justify-between text-xs z-10">
                                <div className="flex items-center gap-2 text-slate-300">
                                    <MapPin size={13} className="text-rose-400" />
                                    <span>
                                        {hoveredPin 
                                            ? `Hovered: ${hoveredPin.fullLocationDisplay} (${hoveredPin.latitude?.toFixed(3)}, ${hoveredPin.longitude?.toFixed(3)})` 
                                            : `Active Tracking: ${mappedLocations.length} locations plotted. Click any pin to open full trace forensics.`}
                                    </span>
                                </div>
                                <span className="text-[10px] font-mono text-slate-500 uppercase">
                                    Global Coordinate Engine
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* MOST RECENT ACCESS CARD */}
                    {latest && (
                        <div className="p-6 rounded-[4px] bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-900 border border-blue-500/30 shadow-2xl relative overflow-hidden">
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

                                <div className="flex flex-wrap items-center gap-2">
                                    <button
                                        onClick={() => setSelectedVisitor(latest)}
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-[4px] bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-600/30 cursor-pointer"
                                    >
                                        <Eye size={13} />
                                        <span>Inspect Full Trace</span>
                                    </button>

                                    {latest.latitude && latest.longitude && (
                                        <a
                                            href={`https://www.google.com/maps?q=${latest.latitude},${latest.longitude}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[4px] bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-medium transition-all"
                                        >
                                            <Navigation size={13} />
                                            <span>Google Maps</span>
                                            <ExternalLink size={11} className="text-slate-400" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* THREE LOCATION SUMMARY PILLS */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                        
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
                                Active visitor session right now
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

                    {/* LIVE LOCATION ACCESS FEED TABLE */}
                    <div className="p-6 rounded-[4px] bg-slate-900 border border-slate-800 shadow-xl">
                        
                        {/* Search / Filter Bar */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-5 border-b border-slate-800/80">
                            <div>
                                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                    <MapPin size={18} className="text-rose-400" />
                                    <span>Real-Time Location Access Feed</span>
                                </h2>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Chronological stream of every location opening your website. Click any row to inspect complete forensic trace.
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
                                        <th className="pb-3 pl-2">Location & Geographic Origin</th>
                                        <th className="pb-3">Coordinates (Lat/Lng)</th>
                                        <th className="pb-3">Route Opened</th>
                                        <th className="pb-3">Device / Browser</th>
                                        <th className="pb-3 text-center">Trace Forensic</th>
                                        <th className="pb-3 text-right pr-2">When Opened</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/50">
                                    {filteredVisitors.length > 0 ? (
                                        filteredVisitors.map((v) => {
                                            const isRecent = Math.floor((Date.now() - new Date(v.createdAt).getTime()) / 1000) < 60;
                                            return (
                                                <tr 
                                                    key={v.id} 
                                                    onClick={() => setSelectedVisitor(v)}
                                                    className={`hover:bg-slate-800/60 transition-colors cursor-pointer ${isRecent ? "bg-emerald-950/15" : ""}`}
                                                >
                                                    
                                                    {/* Flag + Location */}
                                                    <td className="py-3.5 pl-2">
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-2xl select-none">{v.flag}</span>
                                                            <div>
                                                                <div className="font-bold text-white text-sm flex items-center gap-1.5">
                                                                    <span>{v.fullLocationDisplay}</span>
                                                                </div>
                                                                <div className="text-[10px] text-slate-500 font-mono">
                                                                    {v.cityDisplay} · {v.countryName} {v.isp ? `· ${v.isp}` : ""}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Coordinates */}
                                                    <td className="py-3.5 font-mono">
                                                        {v.latitude && v.longitude ? (
                                                            <span className="inline-flex items-center gap-1 text-cyan-400 bg-cyan-950/30 px-2 py-0.5 rounded-[4px] border border-cyan-900/50 text-[11px]">
                                                                <Compass size={11} />
                                                                <span>{v.latitude.toFixed(2)}°, {v.longitude.toFixed(2)}°</span>
                                                            </span>
                                                        ) : (
                                                            <span className="text-slate-500 text-[11px]">Edge Node Geocoded</span>
                                                        )}
                                                    </td>

                                                    {/* Page Opened */}
                                                    <td className="py-3.5">
                                                        <span className="font-mono text-[11px] text-blue-400 px-2 py-0.5 rounded-[4px] bg-blue-500/10 border border-blue-500/20">
                                                            {v.path}
                                                        </span>
                                                    </td>

                                                    {/* Device */}
                                                    <td className="py-3.5">
                                                        <div className="flex items-center gap-1.5 text-slate-300">
                                                            {v.deviceDisplay === "Mobile" ? <Smartphone size={13} /> : <Monitor size={13} />}
                                                            <span>{v.deviceDisplay}</span>
                                                            <span className="text-slate-500 text-[11px]">({v.browserDisplay})</span>
                                                        </div>
                                                    </td>

                                                    {/* Trace Forensic Action */}
                                                    <td className="py-3.5 text-center">
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[4px] bg-blue-600/20 text-blue-300 border border-blue-500/30 text-[11px] font-semibold hover:bg-blue-600/40 transition-colors">
                                                            <ShieldCheck size={12} className="text-emerald-400" />
                                                            <span>Inspect Trace</span>
                                                        </span>
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
                                            <td colSpan={6} className="py-10 text-center text-slate-500 italic">
                                                No locations found matching &quot;{searchQuery}&quot;.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                    </div>

                    {/* CITIES & COUNTRIES BREAKDOWN */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Top Cities */}
                        <div className="p-6 rounded-[4px] bg-slate-900 border border-slate-800">
                            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                                <MapPin size={15} className="text-rose-400" />
                                <span>Top Cities Opening Your Portfolio</span>
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
                                <span>Top Countries Opening Your Portfolio</span>
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
                                            <div className="w-full h-1.5 rounded-[4px] bg-slate-800 overflow-hidden">
                                                <div 
                                                    className="h-full rounded-[4px] bg-blue-500"
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
            )}

            {/* TAB 2: HOW IT IS TRACED (ARCHITECTURE & DIAGNOSTIC TESTER) */}
            {tab === "trace" && (
                <div className="space-y-8 max-w-5xl mx-auto">
                    
                    {/* Hero Header */}
                    <div className="p-8 rounded-[4px] bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-900 border border-blue-500/30">
                        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold mb-2">
                            <Cpu size={16} />
                            <span>Forensic Telemetry Architecture</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                            How Your Website Traces Visitor Locations
                        </h2>
                        <p className="text-slate-300 text-sm mt-2 leading-relaxed max-w-3xl">
                            Every time someone visits your portfolio, a high-accuracy, 4-tier detection pipeline determines their geographic origin without violating user privacy. Below is the exact technical trace mechanism and an interactive diagnostic tester.
                        </p>
                    </div>

                    {/* INTERACTIVE DIAGNOSTIC CONNECTION TESTER */}
                    <div className="p-6 rounded-[4px] bg-slate-900 border border-slate-800 shadow-xl space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                            <div>
                                <h3 className="text-base font-bold text-white flex items-center gap-2">
                                    <Zap size={18} className="text-amber-400" />
                                    <span>Interactive Telemetry Diagnostic (Test Your Device Right Now)</span>
                                </h3>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Click the button below to run the real-time tracing pipeline on your current connection and verify your live location headers.
                                </p>
                            </div>

                            <button
                                onClick={runDiagnostic}
                                disabled={diagnosticRunning}
                                className="px-5 py-2.5 rounded-[4px] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer disabled:opacity-50 shrink-0"
                            >
                                <Sparkles size={14} className={diagnosticRunning ? "animate-spin" : ""} />
                                <span>{diagnosticRunning ? "Probing Edge..." : "Run Diagnostic Trace on My Device"}</span>
                            </button>
                        </div>

                        {/* Diagnostic Results Display */}
                        {diagnosticData ? (
                            <div className="p-5 rounded-[4px] bg-slate-950 border border-blue-500/30 space-y-4">
                                <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-3">
                                    <span className="font-mono text-emerald-400 font-bold flex items-center gap-2">
                                        <CheckCircle2 size={15} />
                                        <span>DIAGNOSTIC TRACE COMPLETE</span>
                                    </span>
                                    <span className="text-slate-400 font-mono">Edge Node: {diagnosticData.edgeNode}</span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                                    <div className="p-3.5 rounded-[4px] bg-slate-900 border border-slate-800">
                                        <span className="text-[10px] uppercase font-mono text-slate-500 block mb-1">Resolved Location</span>
                                        <div className="font-bold text-sm text-white flex items-center gap-1.5">
                                            <span>{diagnosticData.flag}</span>
                                            <span>{diagnosticData.city}, {diagnosticData.countryName}</span>
                                        </div>
                                    </div>

                                    <div className="p-3.5 rounded-[4px] bg-slate-900 border border-slate-800">
                                        <span className="text-[10px] uppercase font-mono text-slate-500 block mb-1">GPS Coordinates</span>
                                        <div className="font-mono text-sm text-cyan-400 font-bold">
                                            {diagnosticData.latitude.toFixed(4)}°, {diagnosticData.longitude.toFixed(4)}°
                                        </div>
                                    </div>

                                    <div className="p-3.5 rounded-[4px] bg-slate-900 border border-slate-800">
                                        <span className="text-[10px] uppercase font-mono text-slate-500 block mb-1">ISP / Carrier</span>
                                        <div className="font-mono text-sm text-amber-300 truncate font-semibold">
                                            {diagnosticData.isp}
                                        </div>
                                    </div>

                                    <div className="p-3.5 rounded-[4px] bg-slate-900 border border-slate-800">
                                        <span className="text-[10px] uppercase font-mono text-slate-500 block mb-1">Detection Tier</span>
                                        <div className="font-mono text-xs text-emerald-400 font-semibold truncate">
                                            {diagnosticData.tier}
                                        </div>
                                    </div>
                                </div>

                                {/* Raw Headers Table */}
                                <div>
                                    <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-2 font-bold">
                                        Inspected Edge Headers:
                                    </span>
                                    <div className="bg-slate-900 p-3 rounded-[4px] border border-slate-800 text-[11px] font-mono space-y-1 overflow-x-auto text-slate-300">
                                        {Object.entries(diagnosticData.headersFound).map(([k, v]) => (
                                            <div key={k} className="flex gap-2">
                                                <span className="text-blue-400">{k}:</span>
                                                <span className="text-slate-200">{v}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="p-8 text-center text-slate-500 text-xs italic bg-slate-950/60 rounded-[4px] border border-slate-800">
                                Click &quot;Run Diagnostic Trace on My Device&quot; above to inspect how your connection is resolved right now.
                            </div>
                        )}
                    </div>

                    {/* 4-TIER TRACING PIPELINE SCHEMATIC */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Tier 1 */}
                        <div className="p-6 rounded-[4px] bg-slate-900 border border-slate-800 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="px-2.5 py-1 rounded-[4px] bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-mono font-bold">
                                    TIER 1 · PRIMARY
                                </span>
                                <Globe size={18} className="text-blue-400" />
                            </div>
                            <h4 className="text-base font-bold text-white">Vercel Anycast Edge Geolocation</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                When a user requests your portfolio, Vercel&apos;s closest global Anycast CDN node inspects TCP handshake metadata. The node injects authoritative edge headers directly into the serverless function:
                            </p>
                            <div className="bg-slate-950 p-3 rounded-[4px] border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1">
                                <div><span className="text-blue-400">x-vercel-ip-country</span> → Two-letter code (NL, US, IN)</div>
                                <div><span className="text-blue-400">x-vercel-ip-city</span> → City name (Enschede, Amsterdam)</div>
                                <div><span className="text-blue-400">x-vercel-ip-latitude</span> → Exact decimal latitude</div>
                                <div><span className="text-blue-400">x-vercel-ip-longitude</span> → Exact decimal longitude</div>
                            </div>
                        </div>

                        {/* Tier 2 */}
                        <div className="p-6 rounded-[4px] bg-slate-900 border border-slate-800 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="px-2.5 py-1 rounded-[4px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-bold">
                                    TIER 2 · FALLBACK
                                </span>
                                <Terminal size={18} className="text-emerald-400" />
                            </div>
                            <h4 className="text-base font-bold text-white">Public IP Subnet Geocoding API</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                If edge headers are missing, masked by a corporate proxy, or during development, the telemetry pipeline queries the <code className="text-emerald-400">freeipapi.com</code> public geolocation engine using the client&apos;s public IP:
                            </p>
                            <div className="bg-slate-950 p-3 rounded-[4px] border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1">
                                <div><span className="text-emerald-400">City / State</span> → Resolved from ISP BGP subnets</div>
                                <div><span className="text-emerald-400">ISP / ASN</span> → Provider (KPN, Airtel, Comcast)</div>
                                <div><span className="text-emerald-400">Latency</span> → Sub-50ms execution</div>
                            </div>
                        </div>

                        {/* Tier 3 */}
                        <div className="p-6 rounded-[4px] bg-slate-900 border border-slate-800 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="px-2.5 py-1 rounded-[4px] bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-mono font-bold">
                                    TIER 3 · TRIANGULATION
                                </span>
                                <Clock size={18} className="text-purple-400" />
                            </div>
                            <h4 className="text-base font-bold text-white">Browser Temporal &amp; Locale Triangulation</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                The client-side tracker evaluates <code className="text-purple-400">Intl.DateTimeFormat().resolvedOptions().timeZone</code> and browser language. This cross-references against our internal coordinate matrix (`TIMEZONE_MAP`) to ensure impossible VPN locations are validated.
                            </p>
                            <div className="bg-slate-950 p-3 rounded-[4px] border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1">
                                <div><span className="text-purple-400">Timezone Offset</span> → UTC offset verification</div>
                                <div><span className="text-purple-400">Centroid Lat/Lng</span> → Regional centroid validation</div>
                            </div>
                        </div>

                        {/* Tier 4 */}
                        <div className="p-6 rounded-[4px] bg-slate-900 border border-slate-800 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="px-2.5 py-1 rounded-[4px] bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-mono font-bold">
                                    TIER 4 · SESSION TRAIL
                                </span>
                                <Layers size={18} className="text-amber-400" />
                            </div>
                            <h4 className="text-base font-bold text-white">Navigation Trail &amp; Device Fingerprint</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Beyond geography, each visitor log captures their full interaction session: entry page (`/work/lift-me-up`), referrer domain (LinkedIn, Google, GitHub), hardware category (Desktop/Mobile), and interaction events (CV Dossier modal opened, 3D audio toggled).
                            </p>
                            <div className="bg-slate-950 p-3 rounded-[4px] border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1">
                                <div><span className="text-amber-400">SHA-256 IP Hash</span> → Anonymized unique visitor ID</div>
                                <div><span className="text-amber-400">User-Agent</span> → Parsed OS, Browser, and Engine</div>
                            </div>
                        </div>

                    </div>

                </div>
            )}

            {/* TAB 3: TRAFFIC & AUDIENCE ANALYTICS */}
            {tab === "traffic" && (
                <div className="space-y-8 max-w-5xl mx-auto">
                    
                    {/* Top Stats Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="p-5 rounded-[4px] bg-slate-900 border border-slate-800">
                            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-1">Total Page Views</span>
                            <div className="text-3xl font-black text-white">{data.totalViews}</div>
                            <span className="text-[11px] text-slate-400">All-time tracked sessions</span>
                        </div>
                        <div className="p-5 rounded-[4px] bg-slate-900 border border-slate-800">
                            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-1">Unique Visitors</span>
                            <div className="text-3xl font-black text-cyan-400">{data.uniqueVisitors}</div>
                            <span className="text-[11px] text-slate-400">Distinct IP fingerprints</span>
                        </div>
                        <div className="p-5 rounded-[4px] bg-slate-900 border border-slate-800">
                            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-1">Views Today</span>
                            <div className="text-3xl font-black text-emerald-400">{data.viewsToday}</div>
                            <span className="text-[11px] text-slate-400">Today&apos;s active traffic</span>
                        </div>
                        <div className="p-5 rounded-[4px] bg-slate-900 border border-slate-800">
                            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-1">Active Now</span>
                            <div className="text-3xl font-black text-rose-400">{data.activeNow}</div>
                            <span className="text-[11px] text-slate-400">Within last 5 minutes</span>
                        </div>
                    </div>

                    {/* 7-DAY TIMELINE CHART */}
                    {data.timeline && data.timeline.length > 0 && (
                        <div className="p-6 rounded-[4px] bg-slate-900 border border-slate-800 shadow-xl space-y-4">
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                                <Activity size={16} className="text-blue-400" />
                                <span>7-Day Visitor Volume History</span>
                            </h3>

                            <div className="h-44 flex items-end justify-between gap-2 pt-6 border-b border-slate-800 pb-2">
                                {data.timeline.map((item, idx) => {
                                    const maxVal = Math.max(...(data.timeline || []).map(t => t.views), 10);
                                    const heightPct = Math.max(8, (item.views / maxVal) * 100);

                                    return (
                                        <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                                            <div className="text-[11px] font-mono text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {item.views}
                                            </div>
                                            <div 
                                                className="w-full max-w-[40px] bg-blue-600 group-hover:bg-blue-400 rounded-[4px] transition-all"
                                                style={{ height: `${heightPct}%` }}
                                            />
                                            <span className="text-[10px] font-mono text-slate-500 whitespace-nowrap">
                                                {item.day}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* DEVICE BREAKDOWN */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-5 rounded-[4px] bg-slate-900 border border-slate-800 flex items-center gap-4">
                            <div className="p-3 rounded-[4px] bg-blue-500/10 text-blue-400">
                                <Monitor size={24} />
                            </div>
                            <div>
                                <span className="text-xs font-mono text-slate-400 uppercase">Desktop Visitors</span>
                                <div className="text-2xl font-bold text-white mt-0.5">
                                    {(data.recentVisitors || []).filter(v => v.deviceDisplay === "Desktop").length}
                                </div>
                            </div>
                        </div>

                        <div className="p-5 rounded-[4px] bg-slate-900 border border-slate-800 flex items-center gap-4">
                            <div className="p-3 rounded-[4px] bg-emerald-500/10 text-emerald-400">
                                <Smartphone size={24} />
                            </div>
                            <div>
                                <span className="text-xs font-mono text-slate-400 uppercase">Mobile Visitors</span>
                                <div className="text-2xl font-bold text-white mt-0.5">
                                    {(data.recentVisitors || []).filter(v => v.deviceDisplay === "Mobile").length}
                                </div>
                            </div>
                        </div>

                        <div className="p-5 rounded-[4px] bg-slate-900 border border-slate-800 flex items-center gap-4">
                            <div className="p-3 rounded-[4px] bg-purple-500/10 text-purple-400">
                                <Tablet size={24} />
                            </div>
                            <div>
                                <span className="text-xs font-mono text-slate-400 uppercase">Tablet Visitors</span>
                                <div className="text-2xl font-bold text-white mt-0.5">
                                    {(data.recentVisitors || []).filter(v => v.deviceDisplay === "Tablet").length}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            )}

            {/* TAB 4: CONTACT MESSAGES */}
            {tab === "messages" && (
                <div className="h-[750px] rounded-[4px] border border-slate-800 overflow-hidden shadow-2xl">
                    <Inbox />
                </div>
            )}

            {/* SLIDE-OVER TRACE INSPECTOR DRAWER (When Visitor Row or Pin is Clicked) */}
            {selectedVisitor && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end">
                    <div className="w-full max-w-xl h-full bg-slate-900 border-l border-slate-800 p-6 sm:p-8 overflow-y-auto space-y-6 shadow-2xl flex flex-col justify-between">
                        
                        <div className="space-y-6">
                            {/* Drawer Header */}
                            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                                <div className="flex items-center gap-3">
                                    <span className="text-3xl">{selectedVisitor.flag}</span>
                                    <div>
                                        <h3 className="text-lg font-black text-white">{selectedVisitor.fullLocationDisplay}</h3>
                                        <p className="text-xs text-slate-400 font-mono">
                                            Telemetry ID: {selectedVisitor.id}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedVisitor(null)}
                                    className="p-2 rounded-[4px] bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Section 1: Exact Geolocation */}
                            <div className="p-4 rounded-[4px] bg-slate-950 border border-slate-800 space-y-3">
                                <span className="text-xs font-mono text-blue-400 uppercase tracking-wider font-bold block">
                                    1. Geographic Coordinates &amp; Map Pin
                                </span>
                                <div className="grid grid-cols-2 gap-3 text-xs">
                                    <div>
                                        <span className="text-slate-500 block">Latitude</span>
                                        <span className="font-mono text-white font-bold">{selectedVisitor.latitude ?? "Edge Geocoded"}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-500 block">Longitude</span>
                                        <span className="font-mono text-white font-bold">{selectedVisitor.longitude ?? "Edge Geocoded"}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-500 block">City &amp; Region</span>
                                        <span className="text-white font-medium">{selectedVisitor.cityDisplay}, {selectedVisitor.regionDisplay}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-500 block">Country</span>
                                        <span className="text-white font-medium">{selectedVisitor.countryName} ({selectedVisitor.country})</span>
                                    </div>
                                </div>

                                {selectedVisitor.latitude && selectedVisitor.longitude && (
                                    <div className="flex gap-2 pt-2 border-t border-slate-800/80">
                                        <a
                                            href={`https://www.google.com/maps?q=${selectedVisitor.latitude},${selectedVisitor.longitude}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
                                        >
                                            <Navigation size={12} />
                                            <span>Open Google Maps</span>
                                            <ExternalLink size={10} />
                                        </a>
                                        <a
                                            href={`https://www.openstreetmap.org/?mlat=${selectedVisitor.latitude}&mlon=${selectedVisitor.longitude}#map=14/${selectedVisitor.latitude}/${selectedVisitor.longitude}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium"
                                        >
                                            <Compass size={12} />
                                            <span>OpenStreetMap</span>
                                        </a>
                                    </div>
                                )}
                            </div>

                            {/* Section 2: How It Was Traced */}
                            <div className="p-4 rounded-[4px] bg-slate-950 border border-slate-800 space-y-3">
                                <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-bold block">
                                    2. Trace Detection Layer
                                </span>
                                <div className="space-y-2 text-xs">
                                    <div className="flex justify-between border-b border-slate-800 pb-1.5">
                                        <span className="text-slate-400">Detection Method:</span>
                                        <span className="text-white font-mono font-semibold">
                                            {selectedVisitor.latitude ? "Tier 1 Edge Headers + Geo-IP API" : "Tier 3 Timezone Fallback"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between border-b border-slate-800 pb-1.5">
                                        <span className="text-slate-400">Internet Carrier / ISP:</span>
                                        <span className="text-white font-mono font-semibold">{selectedVisitor.isp || "Vercel Anycast Edge"}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-slate-800 pb-1.5">
                                        <span className="text-slate-400">Anonymized Visitor Hash:</span>
                                        <span className="text-cyan-400 font-mono">{selectedVisitor.id.slice(0, 16)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: User Journey & Action */}
                            <div className="p-4 rounded-[4px] bg-slate-950 border border-slate-800 space-y-3">
                                <span className="text-xs font-mono text-amber-400 uppercase tracking-wider font-bold block">
                                    3. User Session &amp; Interaction Trail
                                </span>
                                <div className="space-y-2 text-xs">
                                    <div className="flex justify-between border-b border-slate-800 pb-1.5">
                                        <span className="text-slate-400">Page Route:</span>
                                        <span className="text-blue-400 font-mono font-bold">{selectedVisitor.path}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-slate-800 pb-1.5">
                                        <span className="text-slate-400">Action Triggered:</span>
                                        <span className="text-white font-medium">{selectedVisitor.action || "PAGE_VIEW"}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-slate-800 pb-1.5">
                                        <span className="text-slate-400">Content Title:</span>
                                        <span className="text-white font-medium truncate max-w-[280px]">
                                            {selectedVisitor.pageTitle || selectedVisitor.humanTitle}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">When Opened:</span>
                                        <span className="text-emerald-400 font-mono font-bold">
                                            {new Date(selectedVisitor.createdAt).toLocaleString()} ({timeAgo(selectedVisitor.createdAt)})
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Section 4: Device & Environment */}
                            <div className="p-4 rounded-[4px] bg-slate-950 border border-slate-800 space-y-3">
                                <span className="text-xs font-mono text-purple-400 uppercase tracking-wider font-bold block">
                                    4. Device &amp; Client Environment
                                </span>
                                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                                    <div className="p-2.5 rounded-[4px] bg-slate-900 border border-slate-800">
                                        <span className="text-[10px] text-slate-500 block">Device</span>
                                        <span className="font-bold text-white">{selectedVisitor.deviceDisplay}</span>
                                    </div>
                                    <div className="p-2.5 rounded-[4px] bg-slate-900 border border-slate-800">
                                        <span className="text-[10px] text-slate-500 block">Browser</span>
                                        <span className="font-bold text-white">{selectedVisitor.browserDisplay}</span>
                                    </div>
                                    <div className="p-2.5 rounded-[4px] bg-slate-900 border border-slate-800">
                                        <span className="text-[10px] text-slate-500 block">Operating System</span>
                                        <span className="font-bold text-white">{selectedVisitor.osDisplay}</span>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className="pt-4 border-t border-slate-800">
                            <button
                                onClick={() => setSelectedVisitor(null)}
                                className="w-full py-2.5 rounded-[4px] bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors cursor-pointer"
                            >
                                Close Trace Forensics
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}
