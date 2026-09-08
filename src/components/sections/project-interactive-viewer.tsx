"use client";

import React, { useState } from "react";
import Image from "next/image";
import { CaseStudy } from "@/data/portfolioData";
import { CaseStudyGallery } from "@/components/ui/case-study-gallery";
import { HomemadeValueCarousel } from "@/components/sections/homemade-value-carousel";
import { 
    ExternalLink, 
    Github, 
    Sparkles, 
    Zap, 
    Eye, 
    Mic, 
    Smartphone, 
    Sliders, 
    CheckCircle2, 
    Activity, 
    Cpu, 
    Gauge, 
    Flame,
    Heart,
    Figma
} from "lucide-react";

interface ProjectInteractiveViewerProps {
    study: CaseStudy;
}

export function ProjectInteractiveViewer({ study }: ProjectInteractiveViewerProps) {
    // 1. Interactive state for Industrial XR Thesis
    const [xrModality, setXrModality] = useState<"gaze" | "voice" | "semi">("voice");
    const [xrElevation, setXrElevation] = useState<number>(1.25);

    // 2. Interactive state for Homemade Chefs
    const [chefDishesPerWeek, setChefDishesPerWeek] = useState<number>(45);
    const [chefDishPrice, setChefDishPrice] = useState<number>(14.50);
    const [chefActiveTab, setChefActiveTab] = useState<"storytelling" | "calculator" | "compliance">("storytelling");

    // 3. Interactive state for AXAL Power
    const [axalChargerType, setAxalChargerType] = useState<"dcplug" | "towerplug">("dcplug");
    const [axalPowerKw, setAxalPowerKw] = useState<number>(380);

    // 4. Interactive state for Homemade Food App
    const [appScreen, setAppScreen] = useState<"feed" | "streak" | "kitchen">("feed");

    // 5. Interactive state for Nadi Pulse
    const [nadiActiveDosha, setNadiActiveDosha] = useState<"vata" | "pitta" | "kapha">("pitta");
    const [nadiPulseRate, setNadiPulseRate] = useState<number>(72);

    const galleryImages = study.galleryImages || [study.coverImage];

    // ==========================================
    // 1. INDUSTRIAL XR ASSEMBLY THESIS
    // ==========================================
    if (study.id === "industrial-xr-thesis") {
        const strainReduction = xrModality === "voice" ? 38 : xrModality === "semi" ? 42 : 24;
        const dwellDuration = xrModality === "gaze" ? "1.2s Dwell" : xrModality === "voice" ? "Instant (Speech)" : "Predictive Path";

        return (
            <div className="bg-card/40 border border-border rounded-[4px] p-6 md:p-8 space-y-8">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
                    <div>
                        <div className="flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider">
                            <Sparkles size={14} />
                            <span>Empirical XR Research Laboratory</span>
                        </div>
                        <h4 className="text-xl font-medium text-foreground mt-1">
                            Multimodal Hoist Interaction & Ergonomic Strain Simulator
                        </h4>
                    </div>
                    <div className="flex items-center gap-2 bg-foreground/5 border border-border px-3.5 py-1.5 rounded-[4px] text-xs text-muted-foreground">
                        <Activity size={14} className="text-emerald-500 animate-pulse" />
                        <span>N=15 Study · UTwente Robotics Lab</span>
                    </div>
                </div>

                {/* Main Visual Showcase */}
                <CaseStudyGallery 
                    images={galleryImages} 
                    title={study.title} 
                    annotation="Unity 3D Industrial Assembly Simulation Cell"
                />

                {/* Interactive Controls & Telemetry */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-2">
                    
                    {/* Live Telemetry Card */}
                    <div className="lg:col-span-7 p-6 rounded-[4px] bg-black/60 border border-border space-y-4">
                        <div className="flex items-center justify-between text-xs border-b border-white/10 pb-3">
                            <span className="text-white font-medium flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                                <span>SPATIAL HOIST TARGET: LOCKED</span>
                            </span>
                            <span className="text-cyan-400 font-mono">TOLERANCE: ±2.0mm</span>
                        </div>
                        <div className="grid grid-cols-3 gap-3 text-center">
                            <div className="p-3 rounded-[4px] bg-white/5 border border-white/10">
                                <span className="text-[11px] text-muted-foreground block">Active Height</span>
                                <span className="text-xl font-bold text-cyan-400">{xrElevation.toFixed(2)}m</span>
                            </div>
                            <div className="p-3 rounded-[4px] bg-white/5 border border-white/10">
                                <span className="text-[11px] text-muted-foreground block">Trigger Mode</span>
                                <span className="text-xl font-bold text-primary uppercase text-sm mt-1 block">{xrModality}</span>
                            </div>
                            <div className="p-3 rounded-[4px] bg-white/5 border border-white/10">
                                <span className="text-[11px] text-muted-foreground block">Workload</span>
                                <span className="text-xl font-bold text-emerald-400">-{strainReduction}%</span>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>NASA-TLX Ergonomic Load Reduction:</span>
                                <span className="text-emerald-400 font-medium">-{strainReduction}% Cognitive Strain</span>
                            </div>
                            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                                <div 
                                    className="bg-emerald-500 h-full transition-all duration-300 rounded-full"
                                    style={{ width: `${strainReduction * 2}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Interactive Controls */}
                    <div className="lg:col-span-5 space-y-4">
                        <div>
                            <label className="text-xs font-semibold text-foreground block mb-2">
                                1. Select Interaction Modality:
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                <button
                                    onClick={() => setXrModality("voice")}
                                    className={`p-2.5 rounded-[4px] text-xs font-medium border text-center transition-all cursor-pointer ${
                                        xrModality === "voice" 
                                            ? "bg-primary text-primary-foreground border-primary shadow-sm" 
                                            : "bg-card border-border text-muted-foreground hover:text-foreground"
                                    }`}
                                >
                                    <Mic size={14} className="mx-auto mb-1" />
                                    <span>Voice Assist</span>
                                </button>
                                <button
                                    onClick={() => setXrModality("gaze")}
                                    className={`p-2.5 rounded-[4px] text-xs font-medium border text-center transition-all cursor-pointer ${
                                        xrModality === "gaze" 
                                            ? "bg-primary text-primary-foreground border-primary shadow-sm" 
                                            : "bg-card border-border text-muted-foreground hover:text-foreground"
                                    }`}
                                >
                                    <Eye size={14} className="mx-auto mb-1" />
                                    <span>Gaze Dwell</span>
                                </button>
                                <button
                                    onClick={() => setXrModality("semi")}
                                    className={`p-2.5 rounded-[4px] text-xs font-medium border text-center transition-all cursor-pointer ${
                                        xrModality === "semi" 
                                            ? "bg-primary text-primary-foreground border-primary shadow-sm" 
                                            : "bg-card border-border text-muted-foreground hover:text-foreground"
                                    }`}
                                >
                                    <Sliders size={14} className="mx-auto mb-1" />
                                    <span>Semi-Auto</span>
                                </button>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center text-xs mb-1.5">
                                <span className="font-semibold text-foreground">2. Hoist Elevation:</span>
                                <span className="text-primary font-medium">{xrElevation.toFixed(2)} meters</span>
                            </div>
                            <input
                                type="range"
                                min="0.5"
                                max="2.5"
                                step="0.05"
                                value={xrElevation}
                                onChange={(e) => setXrElevation(parseFloat(e.target.value))}
                                className="w-full accent-primary cursor-pointer"
                            />
                        </div>
                    </div>

                </div>
            </div>
        );
    }

    // ==========================================
    // 2. HOMEMADE CHEFS PLATFORM
    // ==========================================
    if (study.id === "homemade-chefs") {
        const monthlyEarnings = Math.round(chefDishesPerWeek * chefDishPrice * 4.33);
        const annualTakeHome = Math.round(monthlyEarnings * 12 * 0.85);

        return (
            <div className="bg-card/40 border border-border rounded-[4px] p-6 md:p-8 space-y-8">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
                    <div>
                        <div className="flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider">
                            <Sparkles size={14} />
                            <span>Production Platform & Creator System</span>
                        </div>
                        <h4 className="text-xl font-medium text-foreground mt-1">
                            Homemade Chefs Live Platform & Visual Showcase
                        </h4>
                    </div>
                    <div className="flex items-center gap-2">
                        <a
                            href="https://www.homemadechefs.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[4px] bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-all shadow-sm"
                        >
                            <span>Visit homemadechefs.com</span>
                            <ExternalLink size={13} />
                        </a>
                    </div>
                </div>

                {/* Image Gallery Showcase */}
                <CaseStudyGallery 
                    images={galleryImages} 
                    title={study.title} 
                    annotation="Production Platform, Creator Dashboards & Branded Packaging System"
                />

                {/* Mode Tabs */}
                <div className="flex border-b border-border gap-4 text-xs font-medium pt-2 overflow-x-auto">
                    <button
                        onClick={() => setChefActiveTab("storytelling")}
                        className={`pb-2.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                            chefActiveTab === "storytelling" ? "border-primary text-primary font-semibold" : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        3D Storytelling Carousel (What Homemade Provides)
                    </button>
                    <button
                        onClick={() => setChefActiveTab("calculator")}
                        className={`pb-2.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                            chefActiveTab === "calculator" ? "border-primary text-primary font-semibold" : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        Interactive Earnings Forecaster
                    </button>
                    <button
                        onClick={() => setChefActiveTab("compliance")}
                        className={`pb-2.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                            chefActiveTab === "compliance" ? "border-primary text-primary font-semibold" : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        Dutch NVWA Food Safety Verification
                    </button>
                </div>

                {chefActiveTab === "storytelling" && (
                    <div className="rounded-[4px] overflow-hidden border border-border bg-card/60">
                        <HomemadeValueCarousel />
                    </div>
                )}

                {chefActiveTab === "calculator" && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        <div className="lg:col-span-6 space-y-5">
                            <div>
                                <div className="flex justify-between text-xs mb-1.5">
                                    <span className="font-semibold text-foreground">Weekly Meals Prepared:</span>
                                    <span className="text-primary font-bold">{chefDishesPerWeek} dishes/week</span>
                                </div>
                                <input
                                    type="range"
                                    min="15"
                                    max="120"
                                    step="5"
                                    value={chefDishesPerWeek}
                                    onChange={(e) => setChefDishesPerWeek(parseInt(e.target.value))}
                                    className="w-full accent-primary cursor-pointer"
                                />
                            </div>

                            <div>
                                <div className="flex justify-between text-xs mb-1.5">
                                    <span className="font-semibold text-foreground">Average Price Per Portion:</span>
                                    <span className="text-primary font-bold">€{chefDishPrice.toFixed(2)}</span>
                                </div>
                                <input
                                    type="range"
                                    min="8"
                                    max="25"
                                    step="0.5"
                                    value={chefDishPrice}
                                    onChange={(e) => setChefDishPrice(parseFloat(e.target.value))}
                                    className="w-full accent-primary cursor-pointer"
                                />
                            </div>

                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Tested with 20+ active home chefs in Enschede and Twente. Transparent margin modeling reduced cook drop-off during onboarding by 42%.
                            </p>
                        </div>

                        {/* Forecast Summary Card */}
                        <div className="lg:col-span-6 p-6 rounded-[4px] bg-black/60 border border-border space-y-4 shadow-xl">
                            <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                                Estimated Culinary Revenue
                            </span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl sm:text-4xl font-bold text-foreground">
                                    €{monthlyEarnings.toLocaleString()}
                                </span>
                                <span className="text-xs text-muted-foreground">/ month gross</span>
                            </div>
                            <div className="pt-3 border-t border-white/10 grid grid-cols-2 gap-4 text-xs">
                                <div>
                                    <span className="text-muted-foreground block mb-0.5">Est. Annual Net:</span>
                                    <span className="text-emerald-400 font-bold text-base">€{annualTakeHome.toLocaleString()}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground block mb-0.5">Cook Revenue Split:</span>
                                    <span className="text-foreground font-bold text-base">85% / 15%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {chefActiveTab === "compliance" && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        <div className="p-4 rounded-[4px] bg-black/60 border border-border space-y-2">
                            <div className="flex items-center gap-2 text-primary font-semibold">
                                <CheckCircle2 size={16} />
                                <span>1. Kitchen Hygiene Audit</span>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">
                                Guided photo verification for allergen separation, temperature logs, and stainless-steel surfaces.
                            </p>
                        </div>
                        <div className="p-4 rounded-[4px] bg-black/60 border border-border space-y-2">
                            <div className="flex items-center gap-2 text-primary font-semibold">
                                <CheckCircle2 size={16} />
                                <span>2. Packaging & Thermal Seal</span>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">
                                Sustainable biodegradable packaging standards ensuring food safe transit within 45-minute pickup windows.
                            </p>
                        </div>
                        <div className="p-4 rounded-[4px] bg-black/60 border border-border space-y-2">
                            <div className="flex items-center gap-2 text-primary font-semibold">
                                <CheckCircle2 size={16} />
                                <span>3. Dynamic Batch Window</span>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">
                                Automatically locks order intake 3 hours prior to dinner pickup to avoid kitchen stress and food waste.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // ==========================================
    // 3. AXAL POWER FAST-CHARGING & CPMS
    // ==========================================
    if (study.id === "axal-power") {
        const maxKw = axalChargerType === "dcplug" ? 480 : 22;
        const currentKw = Math.min(axalPowerKw, maxKw);
        const estimatedKmPer10Min = Math.round((currentKw / 18) * 10 * 6.5);

        return (
            <div className="bg-card/40 border border-border rounded-[4px] p-6 md:p-8 space-y-8">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
                    <div>
                        <div className="flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider">
                            <Zap size={14} />
                            <span>CleanTech Hardware & Cloud CPMS Ecosystem</span>
                        </div>
                        <h4 className="text-xl font-medium text-foreground mt-1">
                            AXAL Power 480kW Ultra-Fast Fast Charging & Telemetry
                        </h4>
                    </div>
                    <div className="flex items-center gap-2">
                        <a
                            href="https://axalpower.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[4px] bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-all shadow-sm"
                        >
                            <span>Visit axalpower.com</span>
                            <ExternalLink size={13} />
                        </a>
                    </div>
                </div>

                {/* AXAL Power Real High-Resolution Gallery */}
                <CaseStudyGallery 
                    images={galleryImages} 
                    title={study.title} 
                    annotation="AXAL DCplug® 480kW Fast-Charger & Cloud CPMS Live Telemetry"
                />

                {/* Hardware Telemetry Simulation */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-2">
                    
                    {/* Telemetry Display */}
                    <div className="lg:col-span-7 p-6 rounded-[4px] bg-black border border-border space-y-5 shadow-2xl">
                        <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-white/10 pb-3">
                            <span className="flex items-center gap-2 text-white font-medium">
                                <Gauge size={15} className="text-cyan-400" />
                                <span>CPMS DISPATCH TELEMETRY: ENSCHEDE FLEET HUB</span>
                            </span>
                            <span className="text-emerald-400 font-bold">GRID SYNC 50Hz OK</span>
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="p-3 rounded-[4px] bg-foreground/5 border border-white/10">
                                <span className="text-xs text-muted-foreground block">Power Flow</span>
                                <span className="text-2xl font-bold text-cyan-400">{currentKw} kW</span>
                            </div>
                            <div className="p-3 rounded-[4px] bg-foreground/5 border border-white/10">
                                <span className="text-xs text-muted-foreground block">10-Min Range</span>
                                <span className="text-2xl font-bold text-emerald-400">+{estimatedKmPer10Min} km</span>
                            </div>
                            <div className="p-3 rounded-[4px] bg-foreground/5 border border-white/10">
                                <span className="text-xs text-muted-foreground block">Hardware Rating</span>
                                <span className="text-2xl font-bold text-foreground">{maxKw} kW</span>
                            </div>
                        </div>

                        {/* Power Load Bar */}
                        <div className="space-y-1.5">
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Dynamic Load Balancing (DLB):</span>
                                <span>{Math.round((currentKw / maxKw) * 100)}% Grid Capacity</span>
                            </div>
                            <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
                                <div 
                                    className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-full transition-all duration-300 rounded-full"
                                    style={{ width: `${(currentKw / maxKw) * 100}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Hardware Controls */}
                    <div className="lg:col-span-5 space-y-4">
                        <div>
                            <label className="text-xs font-semibold text-foreground block mb-2">
                                Select EV Charging Station Unit:
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => {
                                        setAxalChargerType("dcplug");
                                        setAxalPowerKw(380);
                                    }}
                                    className={`p-3 rounded-[4px] text-xs font-medium border text-center transition-all cursor-pointer ${
                                        axalChargerType === "dcplug"
                                            ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                            : "bg-card border-border text-muted-foreground hover:text-foreground"
                                    }`}
                                >
                                    <Zap size={14} className="mx-auto mb-1 text-cyan-400" />
                                    <span>DCplug® (480kW)</span>
                                </button>
                                <button
                                    onClick={() => {
                                        setAxalChargerType("towerplug");
                                        setAxalPowerKw(22);
                                    }}
                                    className={`p-3 rounded-[4px] text-xs font-medium border text-center transition-all cursor-pointer ${
                                        axalChargerType === "towerplug"
                                            ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                            : "bg-card border-border text-muted-foreground hover:text-foreground"
                                    }`}
                                >
                                    <Cpu size={14} className="mx-auto mb-1 text-emerald-400" />
                                    <span>Towerplug® AC (22kW)</span>
                                </button>
                            </div>
                        </div>

                        {axalChargerType === "dcplug" && (
                            <div>
                                <div className="flex justify-between text-xs mb-1.5">
                                    <span className="font-semibold text-foreground">Dynamic Throttle (kW):</span>
                                    <span className="text-cyan-400 font-bold">{currentKw} kW</span>
                                </div>
                                <input
                                    type="range"
                                    min="60"
                                    max="480"
                                    step="10"
                                    value={currentKw}
                                    onChange={(e) => setAxalPowerKw(parseInt(e.target.value))}
                                    className="w-full accent-primary cursor-pointer"
                                />
                            </div>
                        )}

                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Designed the operator dashboard for cloud load balancing, OCPP telemetry, and real-time charging point error diagnosis for European clean fleet operators.
                        </p>
                    </div>

                </div>
            </div>
        );
    }

    // ==========================================
    // 4. HOMEMADE MOBILE APPLICATION
    // ==========================================
    if (study.id === "homemade-app") {
        return (
            <div className="bg-card/40 border border-border rounded-[4px] p-6 md:p-8 space-y-8">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
                    <div>
                        <div className="flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider">
                            <Smartphone size={14} />
                            <span>Mobile Production Application</span>
                        </div>
                        <h4 className="text-xl font-medium text-foreground mt-1">
                            Homemade Consumer App & Behavioral Architecture
                        </h4>
                    </div>
                    <div className="flex items-center gap-2">
                        <a
                            href="https://github.com/nrajayogi/homemade"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[4px] bg-card border border-border hover:bg-foreground/5 text-foreground text-xs font-medium transition-all shadow-sm"
                        >
                            <Github size={13} />
                            <span>React Native Codebase</span>
                        </a>
                    </div>
                </div>

                {/* High-Resolution App Screens Gallery */}
                <CaseStudyGallery 
                    images={galleryImages} 
                    title={study.title} 
                    annotation="React Native Mobile Screens, Gamified Rewards, Squads & System Architecture"
                />

                {/* Behavioral Mechanism Deep-Dive */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
                    <div className="p-4 rounded-[4px] bg-black/60 border border-border space-y-2">
                        <div className="flex items-center gap-2 text-amber-400 font-semibold">
                            <Flame size={16} />
                            <span>Pickup Reward Architecture</span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                            Fixed 1 RP = €0.01 formula rewarding walking (+30 RP) and biking (+12 RP), achieving 88.1% pickup rate (Fisher&apos;s p = 0.000208).
                        </p>
                    </div>

                    <div className="p-4 rounded-[4px] bg-black/60 border border-border space-y-2">
                        <div className="flex items-center gap-2 text-primary font-semibold">
                            <Sparkles size={16} />
                            <span>Gemini AI Smart Assistant</span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                            Integrated in-app conversational assistant (&quot;Sanne&quot;) resolving meal dietary queries and cook preparation status.
                        </p>
                    </div>

                    <div className="p-4 rounded-[4px] bg-black/60 border border-border space-y-2">
                        <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                            <CheckCircle2 size={16} />
                            <span>Offline-First State Sync</span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                            Full Expo & React Native mobile client with local persistence ensuring zero lost pickup confirmations in low-connectivity areas.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // ==========================================
    // 5. NADI PULSE: AYURVEDIC TELEMEDICINE & SENSOR UX
    // ==========================================
    if (study.id === "nadi-pulse") {
        const vataPercent = nadiActiveDosha === "vata" ? 52 : 24;
        const pittaPercent = nadiActiveDosha === "pitta" ? 48 : 28;
        const kaphaPercent = 100 - vataPercent - pittaPercent;

        const pulseGati = 
            nadiActiveDosha === "vata" 
                ? "Serpentine Wave (Sarpa Gati)" 
                : nadiActiveDosha === "pitta" 
                ? "Bounding Pulse (Manduka Gati)" 
                : "Steady Wave (Hamsa Gati)";

        const prescription = 
            nadiActiveDosha === "vata" 
                ? "Ashwagandha (500mg) · Grounding Dinacharya · Warm Sesame Oil" 
                : nadiActiveDosha === "pitta" 
                ? "Brahmi Vati (250mg) · Cooling Amla · Low Acidity Diet" 
                : "Triphala Churna (1g) · Stimulating Ginger Tea · Morning Surya Namaskar";

        return (
            <div className="bg-card/40 border border-border rounded-[4px] p-6 md:p-8 space-y-8">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
                    <div className="flex items-center gap-3.5">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden border border-border bg-white/5 shrink-0 shadow-md">
                            <Image
                                src="/images/nadi-pulse/nadi-pulse-logo.png"
                                alt="Nadi Pulse Official Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 text-emerald-500 text-xs font-semibold uppercase tracking-wider">
                                <Heart size={14} />
                                <span>Pure UI/UX Research & Systems Design</span>
                            </div>
                            <h4 className="text-xl font-medium text-foreground mt-0.5">
                                Nadi Pulse: Dual-Sided Patient & Clinical Systems Ecosystem
                            </h4>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {study.figmaUrl && (
                            <a
                                href={study.figmaUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[4px] bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-all shadow-sm"
                            >
                                <Figma size={13} />
                                <span>Inspect in Figma ↗</span>
                            </a>
                        )}
                    </div>
                </div>

                {/* High-Resolution Master Gallery */}
                <CaseStudyGallery 
                    images={galleryImages} 
                    title={study.title} 
                    annotation="Patient Mobile App (NPulse) & Physician Clinical Diagnostic Portal"
                />

                {/* Interactive Diagnostic Telemetry Simulation */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-2">
                    
                    {/* Live Telemetry Display */}
                    <div className="lg:col-span-7 p-6 rounded-[4px] bg-black border border-border space-y-5 shadow-2xl">
                        <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-white/10 pb-3">
                            <span className="flex items-center gap-2 text-white font-medium">
                                <Activity size={15} className="text-emerald-400" />
                                <span>RADIAL ARTERY SENSOR: PAIRED (BT 5.2)</span>
                            </span>
                            <span className="text-emerald-400 font-bold">SIGNAL STRENGTH 98%</span>
                        </div>

                        {/* Vikriti Orbital Dials (Directly from 2023 Figma Production Screen) */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-xs">
                                <span className="font-semibold text-foreground flex items-center gap-1.5">
                                    <span>Vikriti Body Balance Telemetry</span>
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                        Acute Imbalance State
                                    </span>
                                </span>
                                <span className="text-muted-foreground text-[11px]">Variance Index: <strong className="text-foreground">4.0 – 5.5</strong></span>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                {/* Pitta Dial */}
                                <div className={`p-3.5 rounded-[4px] border text-center transition-all ${
                                    nadiActiveDosha === "pitta" ? "bg-amber-500/10 border-amber-500/40 shadow-lg shadow-amber-500/5" : "bg-white/[0.02] border-white/10"
                                }`}>
                                    <span className="text-xl block mb-1">🔥</span>
                                    <span className="text-xs font-semibold text-amber-400 block">Pitta</span>
                                    <span className="text-2xl font-bold text-foreground mt-0.5 block">{pittaPercent}</span>
                                    <span className="text-[10px] text-muted-foreground block mt-1">Fire &amp; Agni</span>
                                </div>

                                {/* Vata Dial */}
                                <div className={`p-3.5 rounded-[4px] border text-center transition-all ${
                                    nadiActiveDosha === "vata" ? "bg-cyan-500/10 border-cyan-500/40 shadow-lg shadow-cyan-500/5" : "bg-white/[0.02] border-white/10"
                                }`}>
                                    <span className="text-xl block mb-1">💨</span>
                                    <span className="text-xs font-semibold text-cyan-400 block">Vata</span>
                                    <span className="text-2xl font-bold text-foreground mt-0.5 block">{vataPercent}</span>
                                    <span className="text-[10px] text-muted-foreground block mt-1">Air &amp; Ether</span>
                                </div>

                                {/* Kapha Dial */}
                                <div className={`p-3.5 rounded-[4px] border text-center transition-all ${
                                    nadiActiveDosha === "kapha" ? "bg-purple-500/10 border-purple-500/40 shadow-lg shadow-purple-500/5" : "bg-white/[0.02] border-white/10"
                                }`}>
                                    <span className="text-xl block mb-1">💧</span>
                                    <span className="text-xs font-semibold text-purple-400 block">Kapha</span>
                                    <span className="text-2xl font-bold text-foreground mt-0.5 block">{kaphaPercent}</span>
                                    <span className="text-[10px] text-muted-foreground block mt-1">Water &amp; Earth</span>
                                </div>
                            </div>
                        </div>

                        {/* Tridosha Ratio Bar */}
                        <div className="space-y-1.5">
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Prakriti Constitutional Ratio:</span>
                                <span>Vata: {vataPercent}% · Pitta: {pittaPercent}% · Kapha: {kaphaPercent}%</span>
                            </div>
                            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden flex">
                                <div 
                                    className="bg-cyan-400 h-full transition-all duration-300"
                                    style={{ width: `${vataPercent}%` }}
                                    title="Vata"
                                />
                                <div 
                                    className="bg-amber-400 h-full transition-all duration-300"
                                    style={{ width: `${pittaPercent}%` }}
                                    title="Pitta"
                                />
                                <div 
                                    className="bg-purple-400 h-full transition-all duration-300"
                                    style={{ width: `${kaphaPercent}%` }}
                                    title="Kapha"
                                />
                            </div>
                        </div>

                        <div className="p-3.5 rounded-[4px] bg-white/5 border border-white/10 text-xs space-y-1">
                            <span className="text-muted-foreground block text-[10px] uppercase tracking-wider font-semibold">
                                Ayurvedic Chikitsa (Treatment Protocol):
                            </span>
                            <span className="text-emerald-300 font-medium block">
                                {prescription}
                            </span>
                        </div>
                    </div>

                    {/* Interactive Telemetry Controls */}
                    <div className="lg:col-span-5 space-y-4">
                        <div>
                            <label className="text-xs font-semibold text-foreground block mb-2">
                                1. Select Ayurvedic Constitutional State:
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                <button
                                    onClick={() => setNadiActiveDosha("vata")}
                                    className={`p-3 rounded-[4px] text-xs font-medium border text-center transition-all cursor-pointer ${
                                        nadiActiveDosha === "vata"
                                            ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                            : "bg-card border-border text-muted-foreground hover:text-foreground"
                                    }`}
                                >
                                    <span className="font-semibold block">Vata</span>
                                    <span className="text-[10px] opacity-80">Air &amp; Space</span>
                                </button>
                                <button
                                    onClick={() => setNadiActiveDosha("pitta")}
                                    className={`p-3 rounded-[4px] text-xs font-medium border text-center transition-all cursor-pointer ${
                                        nadiActiveDosha === "pitta"
                                            ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                            : "bg-card border-border text-muted-foreground hover:text-foreground"
                                    }`}
                                >
                                    <span className="font-semibold block">Pitta</span>
                                    <span className="text-[10px] opacity-80">Fire &amp; Water</span>
                                </button>
                                <button
                                    onClick={() => setNadiActiveDosha("kapha")}
                                    className={`p-3 rounded-[4px] text-xs font-medium border text-center transition-all cursor-pointer ${
                                        nadiActiveDosha === "kapha"
                                            ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                            : "bg-card border-border text-muted-foreground hover:text-foreground"
                                    }`}
                                >
                                    <span className="font-semibold block">Kapha</span>
                                    <span className="text-[10px] opacity-80">Water &amp; Earth</span>
                                </button>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-xs mb-1.5">
                                <span className="font-semibold text-foreground">2. Pulse Frequency (BPM):</span>
                                <span className="text-emerald-400 font-bold">{nadiPulseRate} BPM</span>
                            </div>
                            <input
                                type="range"
                                min="55"
                                max="105"
                                step="1"
                                value={nadiPulseRate}
                                onChange={(e) => setNadiPulseRate(parseInt(e.target.value))}
                                className="w-full accent-emerald-500 cursor-pointer"
                            />
                        </div>

                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Researched and mapped over 40 responsive screens in Figma across patient self-monitoring, Bluetooth radial sensor pairing, and physician clinical notes.
                        </p>
                    </div>

                </div>

                {/* Core Ayurvedic Treatment Frameworks (Chikitsa) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
                    <div className="p-4 rounded-[4px] bg-black/60 border border-border space-y-2">
                        <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                            <CheckCircle2 size={16} />
                            <span>Prakriti vs. Vikriti Diagnostic Architecture</span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                            Distinguishes lifelong constitutional baseline (Prakriti) from acute physiological imbalance (Vikriti). Visualized via three orbital dials to prevent erroneous patient self-treatment.
                        </p>
                    </div>

                    <div className="p-4 rounded-[4px] bg-black/60 border border-border space-y-2">
                        <div className="flex items-center gap-2 text-cyan-400 font-semibold">
                            <Activity size={16} />
                            <span>Tridosha Dynamics &amp; Nadi Pariksha</span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                            Maps radial artery pulse wave velocities to Vata (Air/Nervous System), Pitta (Fire/Metabolic Agni), and Kapha (Water/Structure), corresponding to 3-finger clinical palpation.
                        </p>
                    </div>

                    <div className="p-4 rounded-[4px] bg-black/60 border border-border space-y-2">
                        <div className="flex items-center gap-2 text-amber-400 font-semibold">
                            <Sparkles size={16} />
                            <span>Holistic Chikitsa (Ahara, Vihara &amp; Aushadhi)</span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                            Translates doshic scores into actionable daily nutrition (Ahara), circadian routines (Dinacharya/Vihara), and electronic herbal formulations (Aushadhi: Ashwagandha, Brahmi, Triphala).
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}
