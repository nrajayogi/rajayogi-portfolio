"use client";

import { useState, useEffect } from "react";
import { Analytics } from "@/components/admin/analytics";
import { ThemeProvider } from "@/components/theme-provider";
import { LogOut, ArrowUpRight, MapPin, Radio } from "lucide-react";
import Link from "next/link";

export default function AdminPage() {
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        setIsAuthorized(true);
    }, []);

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
        } catch (e) {
            console.error("Logout error:", e);
        } finally {
            window.location.href = "/admin/login";
        }
    };

    if (!isAuthorized) return null;

    return (
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
            <div className="flex flex-col h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
                
                {/* Clean Top Navigation Bar */}
                <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md flex items-center justify-between px-6 sm:px-10 shrink-0 z-20">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-[4px] bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                            <MapPin size={18} className="text-rose-400" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="font-black text-sm text-white tracking-tight">RAJAYOGI NANDINA</h1>
                                <span className="px-2 py-0.5 rounded-[4px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold flex items-center gap-1">
                                    <Radio size={10} className="animate-pulse" />
                                    <span>LIVE GPS RADAR</span>
                                </span>
                            </div>
                            <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Portfolio Access Location Portal</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/"
                            target="_blank"
                            className="hidden sm:flex items-center gap-1 text-xs text-slate-400 hover:text-white px-3.5 py-1.5 rounded-[4px] border border-slate-800 hover:bg-slate-800/60 transition-colors"
                        >
                            <span>Open Portfolio</span>
                            <ArrowUpRight size={13} />
                        </Link>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 px-3.5 py-1.5 rounded-[4px] border border-rose-500/20 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        >
                            <LogOut size={13} />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </header>

                {/* Pure Location Tracker Main View (Full-Width, Zero Clutter) */}
                <main className="flex-1 overflow-hidden relative">
                    <Analytics />
                </main>

            </div>
        </ThemeProvider>
    );
}
