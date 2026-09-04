"use client";

import { useState, useEffect } from "react";
import { AdminSidebar } from "@/components/admin/sidebar";
import { Analytics } from "@/components/admin/analytics";
import { Inbox } from "@/components/admin/inbox";
import { ThemeProvider } from "@/components/theme-provider";
import { LogOut, ArrowUpRight, ShieldCheck, Radio } from "lucide-react";
import Link from "next/link";

export default function AdminPage() {
    const [activeSection, setActiveSection] = useState<"analytics" | "inbox">("analytics");
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
            <div className="flex flex-col md:flex-row h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
                
                {/* Clean, Focused Sidebar */}
                <AdminSidebar 
                    activeSection={activeSection} 
                    onSelectSection={(sec) => setActiveSection(sec as "analytics" | "inbox")} 
                    onLogout={handleLogout}
                />

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col overflow-hidden bg-slate-950">
                    
                    {/* Top Bar */}
                    <header className="h-14 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md flex items-center justify-between px-6 shrink-0">
                        <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-semibold">
                                <Radio size={12} className="animate-pulse" />
                                <span>TELEMETRY ACTIVE</span>
                            </span>
                            <span className="hidden sm:inline text-xs text-slate-400">
                                Portfolio Command & Analytics Engine
                            </span>
                        </div>

                        <div className="flex items-center gap-3">
                            <Link
                                href="/"
                                target="_blank"
                                className="hidden sm:flex items-center gap-1 text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800 hover:bg-slate-800/60 transition-colors"
                            >
                                <span>Public Site</span>
                                <ArrowUpRight size={13} />
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 px-3 py-1.5 rounded-lg border border-rose-500/20 hover:bg-rose-500/10 transition-colors cursor-pointer"
                            >
                                <LogOut size={13} />
                                <span>Logout</span>
                            </button>
                        </div>
                    </header>

                    {/* Section Content */}
                    <main className="flex-1 overflow-hidden relative">
                        {activeSection === "analytics" && (
                            <div className="h-full overflow-hidden">
                                <Analytics />
                            </div>
                        )}

                        {activeSection === "inbox" && (
                            <div className="h-full overflow-hidden">
                                <Inbox />
                            </div>
                        )}
                    </main>

                </div>

            </div>
        </ThemeProvider>
    );
}
