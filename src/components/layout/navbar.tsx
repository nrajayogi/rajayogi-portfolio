"use client";

import { useState } from "react";
import Link from "next/link";

import { X } from "lucide-react";
import { MenuOverlay } from "./menu-overlay";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);



    return (
        <>
            {/* Transition Curtain */}


            {/* 1. Top Left: Brand */}
            <Link
                href="/"
                className="fixed top-8 left-8 z-[60] text-sm font-semibold tracking-widest uppercase text-white mix-blend-difference hover:opacity-80 transition-opacity flex items-center gap-2"
            >
                <span>Rajayogi Nandina</span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" title="Available for roles" />
            </Link>

            {/* 2. Top Right: Theme Toggle */}
            <div className="fixed top-8 right-8 z-[70] hidden md:block">
                <ThemeToggle />
            </div>

            {/* 3. Top Center: Menu Controls */}
            {/* We use distinct fixed positioning to align the Pill exactly Center, and Icon offset to right */}

            {/* Menu Pill - Centered exactly */}
            <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="fixed top-6 left-1/2 -translate-x-1/2 z-[60] h-12 bg-[#1A1A1A]/80 backdrop-blur-xl border border-white/10 hover:bg-[#1A1A1A] transition-all rounded-xl px-6 w-[90%] md:w-[400px] flex items-center justify-between shadow-2xl"
            >
                <span className="text-[10px] text-white/90 font-medium tracking-widest uppercase pl-1">Menu</span>
                <div className="flex items-center justify-center w-6 h-6">
                    {isMenuOpen ? (
                        <X size={16} className="text-white" strokeWidth={1.5} />
                    ) : (
                        <div className="flex flex-col gap-[4px] items-end w-5">
                            <span className="w-full h-[1px] bg-white/90 rounded-full" />
                            <span className="w-full h-[1px] bg-white/90 rounded-full" />
                        </div>
                    )}
                </div>
            </button>




            {/* Dropdown Overlay Menu */}
            <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        </>
    );
}
