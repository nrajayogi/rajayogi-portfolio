"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowUpRight, Sun, Moon, Sparkles, Glasses, LayoutGrid, Award, BrainCircuit, Bot, Layers, Compass, GraduationCap, Globe, Zap, FileText, Download, Heart } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

interface MenuOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

export function MenuOverlay({ isOpen, onClose }: MenuOverlayProps) {
    const { setTheme, theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // State for collapsible sections
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        work: true,
        research: true,
        about: false,
        navigation: true
    });

    const toggleSection = (section: string) => {
        setOpenSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const caseStudies = [
        {
            title: "Worker-Centered Industrial XR",
            category: "M.Sc. Thesis · UTwente",
            href: "#work",
            icon: Glasses,
            color: "text-blue-400"
        },
        {
            title: "Homemade Consumer App",
            category: "Behavioral App & GitHub",
            href: "#work",
            icon: Sparkles,
            color: "text-amber-400"
        },
        {
            title: "Homemade Chefs Platform",
            category: "Creator Marketplace · homemadechefs.com",
            href: "https://www.homemadechefs.com/",
            icon: Globe,
            color: "text-[#CCFF00]",
            external: true
        },
        {
            title: "AXAL Power EV Systems",
            category: "CleanTech & CPMS · axalpower.com",
            href: "https://axalpower.com/",
            icon: Zap,
            color: "text-cyan-400",
            external: true
        },
        {
            title: "Nadi Pulse Telemedicine",
            category: "Pure UI/UX Research · Figma",
            href: "#work",
            icon: Heart,
            color: "text-emerald-400"
        }
    ];

    const researchAreas = [
        {
            title: "Spatial Computing",
            desc: "Unity XR & Head-mounted Gaze",
            href: "#research",
            icon: BrainCircuit
        },
        {
            title: "Multimodal Interaction",
            desc: "Voice commands & Spatial Dwell",
            href: "#research",
            icon: Compass
        },
        {
            title: "Workload Ergonomics",
            desc: "NASA-TLX & Cognitive Tracing",
            href: "#research",
            icon: Layers
        },
        {
            title: "High-Density Systems",
            desc: "Design Systems & Architecture",
            href: "#research",
            icon: LayoutGrid
        }
    ];

    const quickNav = [
        { label: "Selected Works", href: "#work" },
        { label: "Vision & Philosophy", href: "#vision" },
        { label: "Research & Capabilities", href: "#research" },
        { label: "Academic Journey & Bio", href: "#about" },
        { label: "Contact & Connect", href: "#contact" },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop - Subtle dark blur to focus on menu */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[55] bg-black/40 backdrop-blur-[4px]"
                    />

                    {/* Menu Dropdown - Positioned below the Top Navbar Pill */}
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.98 }}
                        transition={{ duration: 0.22, ease: "easeOut" }}
                        className="fixed z-[55] top-[84px] left-1/2 -translate-x-1/2 w-[440px] max-w-[92vw] outline-none"
                    >
                        {/* Main Content Box */}
                        <div className="bg-[#141414]/95 backdrop-blur-2xl rounded-2xl border border-white/10 p-6 shadow-2xl overflow-y-auto max-h-[82vh] relative no-scrollbar">

                            {/* Bio Header Badge */}
                            <div className="mb-5 pb-4 border-b border-white/10 flex items-center justify-between">
                                <div>
                                    <h2 className="text-white font-semibold text-sm tracking-wide">Rajayogi Nandina</h2>
                                    <p className="text-[11px] text-white/50 tracking-normal">Product Designer & XR Researcher · Enschede, NL</p>
                                </div>
                                <span className="text-[10px] uppercase font-sans px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                    UTwente M.Sc.
                                </span>
                            </div>

                            {/* SECTION 1: SELECTED WORK */}
                            <div className="mb-4">
                                <button
                                    onClick={() => toggleSection('work')}
                                    className="flex items-center justify-between w-full mb-3 group"
                                >
                                    <h3 className="text-[10px] font-semibold text-white/40 tracking-widest uppercase group-hover:text-white/70 transition-colors">
                                        Selected Work
                                    </h3>
                                    <ChevronDown
                                        size={14}
                                        className={cn(
                                            "text-white/40 transition-transform duration-300",
                                            openSections['work'] ? "rotate-180" : "rotate-0"
                                        )}
                                    />
                                </button>

                                <AnimatePresence>
                                    {openSections['work'] && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                            className="overflow-hidden pl-3 border-l border-white/10 ml-1 space-y-2"
                                        >
                                            <div className="grid grid-cols-1 gap-2 py-1">
                                                {caseStudies.map((study, idx) => {
                                                    const Icon = study.icon;
                                                    return (
                                                        <a
                                                            key={idx}
                                                            href={study.href}
                                                            {...(study.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                                                            onClick={onClose}
                                                            className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/5 hover:border-white/20 transition-all group"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className={cn("p-2 rounded-lg bg-white/5 group-hover:scale-105 transition-transform", study.color)}>
                                                                    <Icon className="w-4 h-4" />
                                                                </div>
                                                                <div className="text-left">
                                                                    <div className="text-xs font-medium text-white group-hover:text-white transition-colors">
                                                                        {study.title}
                                                                    </div>
                                                                    <div className="text-[10px] text-white/40">
                                                                        {study.category}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <ArrowUpRight className="w-3.5 h-3.5 text-white/30 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                                                        </a>
                                                    );
                                                })}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="h-px w-full bg-white/10 mb-4" />

                            {/* SECTION 2: RESEARCH & FOCUS */}
                            <div className="mb-4">
                                <button
                                    onClick={() => toggleSection('research')}
                                    className="flex items-center justify-between w-full mb-3 group"
                                >
                                    <h3 className="text-[10px] font-semibold text-white/40 tracking-widest uppercase group-hover:text-white/70 transition-colors">
                                        Research & Focus
                                    </h3>
                                    <ChevronDown
                                        size={14}
                                        className={cn(
                                            "text-white/40 transition-transform duration-300",
                                            openSections['research'] ? "rotate-180" : "rotate-0"
                                        )}
                                    />
                                </button>

                                <AnimatePresence>
                                    {openSections['research'] && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                            className="overflow-hidden pl-3 border-l border-white/10 ml-1"
                                        >
                                            <div className="grid grid-cols-2 gap-2 py-1">
                                                {researchAreas.map((area, idx) => {
                                                    const Icon = area.icon;
                                                    return (
                                                        <Link
                                                            key={idx}
                                                            href={area.href}
                                                            onClick={onClose}
                                                            className="flex flex-col p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/5 hover:border-white/20 transition-all group"
                                                        >
                                                            <Icon className="w-4 h-4 text-blue-400 mb-1.5 group-hover:text-cyan-300 transition-colors" />
                                                            <span className="text-xs font-medium text-white/90 group-hover:text-white leading-tight">
                                                                {area.title}
                                                            </span>
                                                            <span className="text-[10px] text-white/40 mt-0.5 leading-tight">
                                                                {area.desc}
                                                            </span>
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="h-px w-full bg-white/10 mb-4" />

                            {/* SECTION 3: NAVIGATION */}
                            <div className="mb-5">
                                <button
                                    onClick={() => toggleSection('navigation')}
                                    className="flex items-center justify-between w-full mb-3 group"
                                >
                                    <h3 className="text-[10px] font-semibold text-white/40 tracking-widest uppercase group-hover:text-white/70 transition-colors">
                                        Quick Navigation
                                    </h3>
                                    <ChevronDown
                                        size={14}
                                        className={cn(
                                            "text-white/40 transition-transform duration-300",
                                            openSections['navigation'] ? "rotate-180" : "rotate-0"
                                        )}
                                    />
                                </button>

                                <AnimatePresence>
                                    {openSections['navigation'] && (
                                        <motion.ul
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                            className="space-y-1.5 overflow-hidden pl-3 border-l border-white/10 ml-1"
                                        >
                                            {quickNav.map((item, i) => (
                                                <motion.li
                                                    key={i}
                                                    initial={{ opacity: 0, x: -6 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.05 + (i * 0.02) }}
                                                >
                                                    <Link
                                                        href={item.href}
                                                        onClick={onClose}
                                                        className="text-sm text-white/70 hover:text-white hover:translate-x-1 block py-1 transition-all"
                                                    >
                                                        {item.label}
                                                    </Link>
                                                </motion.li>
                                            ))}
                                        </motion.ul>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Resume / CV Quick Access */}
                            <div className="mb-4">
                                <a
                                    href="/Rajayogi_Nandina_Resume.pdf"
                                    download="Rajayogi_Nandina_Resume.pdf"
                                    onClick={onClose}
                                    className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-emerald-500/10 via-[#CCFF00]/10 to-cyan-500/10 border border-emerald-500/20 hover:border-emerald-500/40 transition-all text-xs font-sans group"
                                >
                                    <div className="flex items-center gap-2.5">
                                        <FileText size={15} className="text-[#CCFF00]" />
                                        <div>
                                            <span className="text-white font-bold block leading-tight">Official Resume / CV</span>
                                            <span className="text-[10px] text-white/50">M.Sc. I-Tech · 6 Industry Roles</span>
                                        </div>
                                    </div>
                                    <span className="flex items-center gap-1 text-[10px] text-[#CCFF00] font-bold group-hover:translate-x-0.5 transition-transform">
                                        <span>PDF</span>
                                        <Download size={12} />
                                    </span>
                                </a>
                            </div>

                            {/* Footer Actions: Contact & Theme Toggle */}
                            <div className="flex gap-2.5 pt-2">
                                <Button
                                    variant="ghost"
                                    className="flex-grow h-11 bg-white/10 border border-white/10 text-white hover:bg-white hover:text-black transition-all duration-300 uppercase tracking-widest text-[10px] font-medium rounded-xl"
                                    asChild
                                    onClick={onClose}
                                >
                                    <Link href="#contact">
                                        Get in Touch
                                    </Link>
                                </Button>

                                <button
                                    onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                                    className="h-11 w-11 flex items-center justify-center bg-white/10 border border-white/10 rounded-xl hover:bg-white/20 transition-all text-white/70 hover:text-white shrink-0"
                                    title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                                >
                                    {mounted ? (
                                        theme === "light" ? <Moon size={18} /> : <Sun size={18} />
                                    ) : (
                                        <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-transparent animate-spin" />
                                    )}
                                </button>
                            </div>

                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
