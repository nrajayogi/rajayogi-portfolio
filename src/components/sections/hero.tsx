"use client";

import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useResponsive } from "@/hooks/use-responsive";
import { FunkyHeroCanvas } from "./funky-hero-canvas";
import { ArrowDownRight, Volume2, VolumeX, Move, Sparkles, FileText, Download } from "lucide-react";
import { ResumeModal } from "@/components/ui/resume-modal";

// Web Audio API tiny sound synthesizer for tactile feedback
function playSound(type: "pop" | "chime" | "click", audioEnabled: boolean) {
    if (!audioEnabled || typeof window === "undefined") return;
    try {
        const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        const now = ctx.currentTime;

        if (type === "pop") {
            osc.type = "sine";
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
            osc.start(now);
            osc.stop(now + 0.08);
        } else if (type === "chime") {
            osc.type = "triangle";
            osc.frequency.setValueAtTime(587.33, now); // D5
            osc.frequency.setValueAtTime(880, now + 0.04);   // A5
            gain.gain.setValueAtTime(0.08, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
            osc.start(now);
            osc.stop(now + 0.16);
        } else if (type === "click") {
            osc.type = "square";
            osc.frequency.setValueAtTime(1200, now);
            gain.gain.setValueAtTime(0.05, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
            osc.start(now);
            osc.stop(now + 0.03);
        }
    } catch {
        // AudioContext may be restricted by browser before user interaction
    }
}

export function Hero() {
    const containerRef = useRef<HTMLElement>(null);
    const device = useResponsive(containerRef);
    const [audioEnabled, setAudioEnabled] = useState(false);
    const [isResumeOpen, setIsResumeOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const bottomStats = [
        {
            tag: "01 // ACADEMIC",
            label: "M.Sc. Interaction Tech",
            value: "Univ of Twente",
            sub: "Enschede, Netherlands",
            color: "text-[#00F0FF]"
        },
        {
            tag: "02 // THESIS",
            label: "Multimodal XR Assembly",
            value: "Cargo Bike Cell",
            sub: "Hands-Free Voice + Gaze Hoist",
            color: "text-[#FF007F]"
        },
        {
            tag: "03 // BEHAVIORAL",
            label: "Platform Incentive UX",
            value: "Homemade Rewards",
            sub: "Gamified Pick-Up Mechanics",
            color: "text-[#CCFF00]"
        },
        {
            tag: "04 // GLOBAL",
            label: "Cross-Continental",
            value: "3 Design Hubs",
            sub: "NL (UTwente) · USA (UIC) · India",
            color: "text-[#FF9900]"
        }
    ];

    return (
        <section
            ref={containerRef}
            className="relative w-full flex flex-col overflow-hidden bg-[#060608] text-white p-0 m-0 min-h-screen select-none"
        >
            {/* 1. Kinetic Liquid Canvas & Gravitational Grid */}
            <FunkyHeroCanvas />

            {/* 2. Ambient Vignette Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(6,6,8,0.85)_100%)] pointer-events-none z-[2]" />

            {/* 3. Top Architectural Metadata Bar */}
            <div className="absolute top-20 left-6 sm:left-12 right-6 sm:right-12 z-20 flex items-center justify-between pointer-events-auto">
                <div className="flex items-center gap-3">
                    <span className="inline-block w-2 h-2 rounded-full bg-[#CCFF00] animate-pulse" />
                    <span className="font-sans text-[10px] tracking-widest uppercase text-white/50 hidden sm:inline">
                        52.24° N, 6.85° E // TWENTE XR LAB
                    </span>
                    <span className="font-sans text-[10px] tracking-widest uppercase text-white/50 sm:hidden">
                        UTWENTE XR
                    </span>
                </div>

                {/* Tactile Audio FX Switcher */}
                <button
                    onClick={() => {
                        const next = !audioEnabled;
                        setAudioEnabled(next);
                        playSound("pop", next);
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-md transition-all text-[10px] font-sans text-white/70 hover:text-white cursor-pointer"
                    title="Toggle tactile sound synthesis"
                >
                    {audioEnabled ? <Volume2 size={12} className="text-[#CCFF00]" /> : <VolumeX size={12} />}
                    <span>SFX: {audioEnabled ? "ON" : "OFF"}</span>
                </button>
            </div>

            {/* 4. MAIN HERO COMPOSITION */}
            <div className="relative z-10 w-full min-h-[90vh] flex flex-col items-center justify-center pt-28 pb-36 px-4 pointer-events-none">
                
                <div className="max-w-6xl w-full mx-auto flex flex-col items-center text-center relative pointer-events-auto">
                    
                    {/* Editorial Eyebrow Tag */}
                    <motion.div
                        initial={{ opacity: 0, y: -16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-4 inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#CCFF00]/40 bg-[#CCFF00]/10 text-[#CCFF00] text-[10px] sm:text-xs font-sans tracking-widest uppercase shadow-[0_0_20px_rgba(204,255,0,0.15)]"
                    >
                        <Sparkles className="w-3 h-3" />
                        <span>M.Sc. Interaction Tech · Spatial Systems & Industrial HRI</span>
                    </motion.div>

                    {/* Architectural Monumental Headline */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="relative my-2 sm:my-3"
                    >
                        <h1 className="text-6xl sm:text-8xl md:text-9xl lg:text-[10.5rem] font-black tracking-[-0.04em] uppercase leading-[0.84]">
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/60">
                                RAJAYOGI
                            </span>
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] via-[#FF007F] to-[#CCFF00] drop-shadow-[0_10px_35px_rgba(255,0,127,0.3)]">
                                NANDINA
                            </span>
                        </h1>
                    </motion.div>

                    {/* Manifesto Statement with High-Contrast Typography */}
                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="mt-4 sm:mt-6 text-slate-300 text-sm sm:text-base md:text-xl max-w-2xl font-light leading-relaxed px-4"
                    >
                        I design <span className="text-white font-medium underline decoration-[#00F0FF] decoration-2 underline-offset-4">multimodal spatial interfaces</span> and <span className="text-white font-medium underline decoration-[#FF007F] decoration-2 underline-offset-4">intelligent robotic collaboration cells</span> that elevate human workers without adding cognitive strain.
                    </motion.p>

                    {/* Interactive CTAs */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.35 }}
                        className="flex flex-wrap items-center justify-center gap-4 mt-8"
                    >
                        <a
                            href="#work"
                            onClick={() => playSound("click", audioEnabled)}
                            className="px-8 py-3.5 rounded-xl bg-white text-black font-semibold text-xs uppercase tracking-widest hover:bg-[#CCFF00] hover:scale-105 transition-all shadow-xl shadow-white/10 flex items-center gap-2 group"
                        >
                            <span>Explore Selected Works</span>
                            <ArrowDownRight className="w-4 h-4 group-hover:translate-x-1 group-hover:translate-y-1 transition-transform" />
                        </a>
                        <a
                            href="#research"
                            onClick={() => playSound("click", audioEnabled)}
                            className="px-8 py-3.5 rounded-xl bg-white/10 text-white font-medium text-xs uppercase tracking-widest border border-white/15 hover:bg-white/20 hover:scale-105 backdrop-blur-md transition-all"
                        >
                            Research & Thesis
                        </a>
                        <button
                            onClick={() => {
                                setIsResumeOpen(true);
                                playSound("chime", audioEnabled);
                            }}
                            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#CCFF00] via-emerald-400 to-[#00F0FF] text-black font-bold text-xs uppercase tracking-widest hover:brightness-110 hover:scale-105 transition-all shadow-xl shadow-[#CCFF00]/15 flex items-center gap-2 cursor-pointer"
                        >
                            <FileText className="w-4 h-4" />
                            <span>Inspect CV / Resume</span>
                        </button>
                    </motion.div>

                    {/* Drag Helper Notice */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="mt-6 flex items-center gap-1.5 font-sans text-[11px] text-white/40 tracking-wider"
                    >
                        <Move size={12} className="text-[#00F0FF] animate-bounce" />
                        <span>(Grab & drag the holographic artifacts below anywhere on screen!)</span>
                    </motion.div>

                </div>

                {/* 
                  5. TACTILE DRAGGABLE HOLOGRAPHIC STICKERS 
                  Crafted physical-feel artifacts with Framer Motion spring physics!
                  Zero generic emoji pills, 100% bespoke design artifacts.
                */}
                <div className="relative lg:static w-full mt-8 lg:mt-0 px-4 pointer-events-auto overflow-x-auto lg:overflow-visible [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden py-6 lg:py-0">
                    <div className="flex flex-nowrap lg:block items-center gap-4 min-w-max lg:min-w-0 w-full">
                        
                        {/* STICKER 1: UTwente Thesis Security Ticket (Top-Left Floating) */}
                        <motion.div
                            drag
                            dragConstraints={containerRef}
                            dragElastic={0.2}
                            whileHover={{ scale: 1.08, rotate: -2, zIndex: 50 }}
                            whileDrag={{ scale: 1.15, rotate: 0, zIndex: 60 }}
                            onDragStart={() => playSound("pop", audioEnabled)}
                            className="relative lg:absolute lg:top-24 lg:left-6 xl:left-14 cursor-grab active:cursor-grabbing p-4 rounded-xl bg-gradient-to-br from-neutral-100 via-neutral-200 to-cyan-100 text-black border border-white/80 shadow-[0_20px_40px_rgba(0,240,255,0.25)] -rotate-6 lg:-rotate-8 select-none w-64 sm:w-72 shrink-0 z-20"
                        >
                            <div className="flex items-center justify-between border-b border-black/15 pb-2 mb-2">
                                <span className="font-sans text-[10px] font-bold uppercase tracking-wider text-black/70">
                                    UTWENTE // IT-LAB-2025
                                </span>
                                <span className="font-sans text-[9px] px-1.5 py-0.5 rounded bg-black text-white font-bold">
                                    M.Sc. THESIS
                                </span>
                            </div>
                            <div className="font-sans text-xs sm:text-sm font-black tracking-tight leading-tight">
                                CARGO BIKE HOIST XR CELL
                            </div>
                            <div className="text-[10px] text-black/70 mt-1 font-sans">
                                Hands-free gaze targeting & voice elevation control.
                            </div>
                            <div className="mt-3 flex items-center justify-between pt-2 border-t border-black/10">
                                <div className="flex gap-0.5 items-center">
                                    <span className="w-1 h-3.5 bg-black" />
                                    <span className="w-1.5 h-3.5 bg-black" />
                                    <span className="w-0.5 h-3.5 bg-black" />
                                    <span className="w-2 h-3.5 bg-black" />
                                    <span className="w-1 h-3.5 bg-black" />
                                    <span className="w-1.5 h-3.5 bg-black" />
                                </div>
                                <span className="font-sans text-[9px] font-semibold text-black/60">
                                    EMPIRICAL STUDY // N=15
                                </span>
                            </div>
                        </motion.div>

                        {/* STICKER 2: Homemade Chefs Platform (Top-Right Floating) */}
                        <motion.div
                            drag
                            dragConstraints={containerRef}
                            dragElastic={0.2}
                            whileHover={{ scale: 1.08, rotate: 2, zIndex: 50 }}
                            whileDrag={{ scale: 1.15, rotate: 0, zIndex: 60 }}
                            onDragStart={() => playSound("pop", audioEnabled)}
                            className="relative lg:absolute lg:top-36 lg:right-6 xl:right-16 cursor-grab active:cursor-grabbing p-4 rounded-xl bg-[#0F0F14] text-white border-2 border-[#CCFF00] shadow-[0_15px_35px_rgba(204,255,0,0.3)] rotate-4 lg:rotate-6 select-none w-60 sm:w-68 shrink-0 z-20"
                        >
                            <div className="flex items-center justify-between text-[#CCFF00] mb-1 font-sans text-[10px] tracking-widest uppercase">
                                <span>HOMEMADECHEFS.COM</span>
                                <span>LIVE PORTAL</span>
                            </div>
                            <div className="text-lg sm:text-xl font-black text-white tracking-tighter">
                                CHEF MARKETPLACE
                            </div>
                            <p className="text-[10px] text-neutral-400 mt-1">
                                Real-time culinary earnings calculator & food safety dispatch.
                            </p>
                            <a
                                href="https://www.homemadechefs.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="mt-2 text-[10px] font-sans text-[#CCFF00] tracking-wider hover:underline flex items-center gap-1"
                            >
                                <span>[VISIT HOMEMADECHEFS.COM ↗]</span>
                            </a>
                        </motion.div>

                        {/* STICKER 3: AXAL Power CleanTech EV Infrastructure (Bottom-Left Floating) */}
                        <motion.div
                            drag
                            dragConstraints={containerRef}
                            dragElastic={0.2}
                            whileHover={{ scale: 1.08, rotate: -1, zIndex: 50 }}
                            whileDrag={{ scale: 1.15, rotate: 0, zIndex: 60 }}
                            onDragStart={() => playSound("pop", audioEnabled)}
                            className="relative lg:absolute lg:bottom-28 lg:left-8 xl:left-20 cursor-grab active:cursor-grabbing p-4 rounded-xl bg-gradient-to-br from-[#00F0FF] via-[#3B82F6] to-[#8B5CF6] text-white shadow-[0_20px_40px_rgba(0,240,255,0.35)] -rotate-3 lg:-rotate-4 select-none w-60 sm:w-68 border border-white/30 shrink-0 z-20"
                        >
                            <div className="flex items-center justify-between text-white/90 font-sans text-[10px] tracking-widest uppercase pb-1 mb-1 border-b border-white/20">
                                <span>AXALPOWER.COM</span>
                                <span>CLEANTECH</span>
                            </div>
                            <div className="font-bold text-sm sm:text-base tracking-tight">
                                DC FAST CHARGERS & CPMS
                            </div>
                            <div className="text-[10px] text-white/90 mt-0.5">
                                Up to 480kW charging UI & cloud energy management.
                            </div>
                            <a
                                href="https://axalpower.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="mt-2 text-[10px] font-sans text-cyan-200 tracking-wider hover:underline flex items-center gap-1"
                            >
                                <span>[VISIT AXALPOWER.COM ↗]</span>
                            </a>
                        </motion.div>

                        {/* STICKER 4: Homemade Consumer App & Code (Bottom-Right Floating) */}
                        <motion.div
                            drag
                            dragConstraints={containerRef}
                            dragElastic={0.2}
                            whileHover={{ scale: 1.08, rotate: 2, zIndex: 50 }}
                            whileDrag={{ scale: 1.15, rotate: 0, zIndex: 60 }}
                            onDragStart={() => playSound("pop", audioEnabled)}
                            className="relative lg:absolute lg:bottom-32 lg:right-8 xl:right-20 cursor-grab active:cursor-grabbing p-4 rounded-xl bg-gradient-to-br from-amber-300 via-orange-400 to-amber-500 text-black shadow-[0_15px_35px_rgba(255,153,0,0.35)] rotate-5 lg:rotate-6 select-none w-56 sm:w-64 border border-amber-200 shrink-0 z-20"
                        >
                            <div className="font-sans text-[10px] font-bold tracking-widest uppercase text-black/60">
                                REPOSITORIES & APPS
                            </div>
                            <div className="font-black text-sm sm:text-base tracking-tight text-black mt-0.5">
                                HOMEMADE FOOD APP
                            </div>
                            <div className="text-[10px] text-black/80 mt-1 font-sans">
                                React Native, Gemini AI & gamified pickup rewards.
                            </div>
                            <a
                                href="https://github.com/nrajayogi/homemade"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="mt-2 text-[10px] font-sans text-black font-bold tracking-wider hover:underline flex items-center gap-1"
                            >
                                <span>[GITHUB: /HOMEMADE ↗]</span>
                            </a>
                        </motion.div>

                        {/* STICKER 5: DECLASSIFIED CV DOSSIER (Bottom-Center Anchor) */}
                        <motion.div
                            drag
                            dragConstraints={containerRef}
                            dragElastic={0.2}
                            whileHover={{ scale: 1.08, rotate: -2, zIndex: 50 }}
                            whileDrag={{ scale: 1.15, rotate: 0, zIndex: 60 }}
                            onClick={() => {
                                setIsResumeOpen(true);
                                playSound("chime", audioEnabled);
                                if (typeof window !== "undefined" && (window as any).trackPortfolioAction) {
                                    (window as any).trackPortfolioAction("OPEN_RESUME_MODAL", { pageTitle: "CV Dossier // Declassified" });
                                }
                            }}
                            onDragStart={() => playSound("pop", audioEnabled)}
                            className="relative lg:absolute lg:bottom-12 lg:left-1/2 lg:-translate-x-1/2 cursor-pointer active:cursor-grabbing p-4 rounded-xl bg-gradient-to-br from-emerald-500/20 via-[#0E0E14] to-cyan-500/20 text-white border-2 border-emerald-400 shadow-[0_20px_45px_rgba(16,185,129,0.35)] -rotate-5 lg:-rotate-2 select-none w-64 sm:w-72 group shrink-0 z-20"
                        >
                            <div className="flex items-center justify-between border-b border-emerald-400/20 pb-1.5 mb-1.5">
                                <span className="font-sans text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                                    CV DOSSIER // DECLASSIFIED
                                </span>
                                <span className="text-[9px] font-sans px-1.5 py-0.5 rounded bg-emerald-400 text-black font-bold">
                                    OPEN
                                </span>
                            </div>
                            <div className="font-sans text-xs sm:text-sm font-black text-white group-hover:text-emerald-300 transition-colors">
                                RAJAYOGI NANDINA · RESUME
                            </div>
                            <div className="text-[10px] text-neutral-300 mt-1 font-sans">
                                UTwente M.Sc. · 6 Roles · IIT Kanpur · AXAL · Homemade
                            </div>
                            <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-sans text-emerald-400">
                                <span>[INTERACTIVE DOSSIER + PDF ↗]</span>
                                <FileText size={12} />
                            </div>
                        </motion.div>

                    </div>
                </div>

            </div>

            {/* 
              6. EXACT VYANTRAA STATS DOCK - UPGRADED TO BRUTALIST PRECISION
            */}
            <div className={`${device === 'mobile' ? 'relative bg-[#060608]' : 'absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black/95 via-black/60 to-transparent'}`}>
                <div className={`w-full pointer-events-auto ${device === 'mobile' ? 'py-8 border-t border-white/10' : 'md:bg-[#08080f]/90 md:backdrop-blur-2xl md:border-t md:border-white/10'}`}>
                    <div className="container mx-auto px-4">
                        <div className={`grid ${device === 'mobile' ? 'grid-cols-1' : device === 'tablet' ? 'grid-cols-2' : 'grid-cols-4'} ${device !== 'mobile' ? 'divide-x divide-white/10 md:border-x border-white/10' : 'gap-6'}`}>
                            {bottomStats.map((item, index) => (
                                <div
                                    key={index}
                                    onMouseEnter={() => playSound("chime", audioEnabled)}
                                    className={`group relative flex flex-col items-start justify-center transition-all ${device === 'mobile' ? 'border-b border-white/5 pb-6 last:border-0 px-2' : 'py-7 px-8 hover:bg-white/[0.04] cursor-pointer'}`}
                                >
                                    <div className="flex items-center justify-between w-full mb-2">
                                        <span className={`font-sans text-[10px] tracking-widest uppercase font-bold ${item.color}`}>
                                            {item.tag}
                                        </span>
                                        <span className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-white transition-colors" />
                                    </div>
                                    <h3 className="text-white font-semibold text-sm tracking-tight group-hover:text-[#CCFF00] transition-colors">
                                        {item.label}
                                    </h3>
                                    <p className="text-slate-400 text-xs font-normal tracking-wide mt-1">
                                        {item.sub}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Interactive Resume Dossier Modal */}
            <ResumeModal isOpen={isResumeOpen} onClose={() => setIsResumeOpen(false)} />

        </section>
    );
}
