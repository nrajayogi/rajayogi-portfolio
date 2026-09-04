"use client";

import { cn } from "@/lib/utils";
import {
    Activity,
    Mail,
    ArrowUpRight,
    LogOut,
    Shield,
    Menu,
    X
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface AdminSidebarProps {
    activeSection: string;
    onSelectSection: (section: string) => void;
    onLogout: () => void;
}

export function AdminSidebar({ activeSection, onSelectSection, onLogout }: AdminSidebarProps) {
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const navItems = [
        { 
            id: "analytics", 
            label: "Live Visitor Radar", 
            icon: Activity,
            badge: "LIVE 3s",
            description: "Real-time global locations & telemetry"
        },
        { 
            id: "inbox", 
            label: "Contact Inquiries", 
            icon: Mail,
            description: "Messages from portfolio contact form"
        },
    ];

    return (
        <>
            {/* Mobile Toggle Bar */}
            <div className="md:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800 text-white">
                <div className="flex items-center gap-2">
                    <Shield size={18} className="text-blue-500" />
                    <span className="font-bold text-sm">Admin Telemetry</span>
                </div>
                <button
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                >
                    {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* Sidebar Desktop & Mobile Drawer */}
            <aside className={cn(
                "fixed md:static inset-y-0 left-0 z-50 w-72 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out",
                isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
            )}>
                {/* Brand Header */}
                <div className="p-6 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                            <Shield size={18} />
                        </div>
                        <div>
                            <h2 className="font-black text-sm text-white tracking-tight">RAJAYOGI NANDINA</h2>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Admin Command Center</p>
                        </div>
                    </div>
                </div>

                {/* Primary Nav Links */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider px-3 mb-2">
                        Telemetry & Communications
                    </div>

                    {navItems.map((item) => {
                        const isActive = activeSection === item.id;
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                onClick={() => {
                                    onSelectSection(item.id);
                                    setIsMobileOpen(false);
                                }}
                                className={cn(
                                    "w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-left transition-all cursor-pointer group",
                                    isActive
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25 font-semibold"
                                        : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-200"
                                )}
                            >
                                <Icon size={18} className={isActive ? "text-white" : "text-slate-400 group-hover:text-blue-400 transition-colors"} />
                                <div className="flex-1 min-w-0">
                                    <div className="text-xs font-medium flex items-center justify-between">
                                        <span>{item.label}</span>
                                        {item.badge && (
                                            <span className={cn(
                                                "text-[9px] font-mono px-1.5 py-0.5 rounded-full",
                                                isActive ? "bg-white/20 text-white" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                            )}>
                                                {item.badge}
                                            </span>
                                        )}
                                    </div>
                                    <p className={cn(
                                        "text-[10px] truncate mt-0.5",
                                        isActive ? "text-blue-100" : "text-slate-500"
                                    )}>
                                        {item.description}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </nav>

                {/* Bottom Actions */}
                <div className="p-4 border-t border-slate-800 space-y-2">
                    {/* View Live Public Site */}
                    <Link
                        href="/"
                        target="_blank"
                        className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800 transition-all group"
                    >
                        <span className="flex items-center gap-2">
                            <span>View Public Site</span>
                        </span>
                        <ArrowUpRight size={14} className="text-slate-500 group-hover:text-white transition-colors" />
                    </Link>

                    {/* Logout Button */}
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 transition-all cursor-pointer"
                    >
                        <LogOut size={14} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>
        </>
    );
}
