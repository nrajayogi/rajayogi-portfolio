"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { CaseStudy } from "@/data/portfolioData";
import { ProjectInteractiveViewer } from "./project-interactive-viewer";
import { CaseStudyGallery } from "@/components/ui/case-study-gallery";
import { 
    X, 
    ExternalLink, 
    Github, 
    Globe, 
    Sparkles, 
    CheckCircle2, 
    Layers, 
    Compass, 
    BookOpen, 
    Cpu, 
    ArrowUpRight,
    Figma
} from "lucide-react";

interface CaseStudyOverlayProps {
    study: CaseStudy | null;
    isOpen: boolean;
    onClose: () => void;
}

export function CaseStudyOverlay({ study, isOpen, onClose }: CaseStudyOverlayProps) {
    const [activeTab, setActiveTab] = useState<"interactive" | "narrative" | "architecture">("interactive");

    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) {
            window.addEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "hidden";
        }
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    if (!isOpen || !study) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[120] flex items-center justify-center">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-background/90 backdrop-blur-2xl"
                />

                {/* Main Overlay Window */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.96, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: 20 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="relative w-full max-w-6xl h-[92vh] bg-background border border-border rounded-2xl shadow-[0_25px_80px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col z-10"
                >
                    {/* Header Bar */}
                    <div className="p-4 sm:p-6 border-b border-border flex flex-wrap items-center justify-between gap-4 bg-card/60 backdrop-blur-md sticky top-0 z-30">
                        <div className="flex items-center gap-3">
                            {study.logoImage ? (
                                <div className="relative w-9 h-9 rounded-full overflow-hidden border border-border bg-white/10 shrink-0 shadow-sm">
                                    <Image
                                        src={study.logoImage}
                                        alt={study.title}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            ) : (
                                <span className="text-xl sm:text-2xl font-light text-primary/70">
                                    {study.number}
                                </span>
                            )}
                            <span className="w-1.5 h-1.5 rounded-full bg-border" />
                            <div>
                                <h3 className="text-base sm:text-lg font-medium text-foreground tracking-tight flex items-center gap-2">
                                    <span>{study.title}</span>
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                    {study.category} · {study.domain} · {study.year}
                                </p>
                            </div>
                        </div>

                        {/* Top Controls & Navigation */}
                        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
                            {/* Tab Switcher */}
                            <div className="flex items-center p-1 rounded-xl bg-foreground/5 border border-border">
                                <button
                                    onClick={() => setActiveTab("interactive")}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                                        activeTab === "interactive"
                                            ? "bg-primary text-primary-foreground shadow-sm"
                                            : "text-muted-foreground hover:text-foreground"
                                    }`}
                                >
                                    <Sparkles size={13} />
                                    <span>Interactive Demo</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab("narrative")}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                                        activeTab === "narrative"
                                            ? "bg-primary text-primary-foreground shadow-sm"
                                            : "text-muted-foreground hover:text-foreground"
                                    }`}
                                >
                                    <BookOpen size={13} />
                                    <span>Case Study</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab("architecture")}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                                        activeTab === "architecture"
                                            ? "bg-primary text-primary-foreground shadow-sm"
                                            : "text-muted-foreground hover:text-foreground"
                                    }`}
                                >
                                    <Cpu size={13} />
                                    <span>System Specs</span>
                                </button>
                            </div>

                            {/* External Links */}
                            {study.liveUrl && (
                                <a
                                    href={study.liveUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-foreground/5 text-foreground text-xs font-medium transition-all shadow-sm"
                                >
                                    <Globe size={13} className="text-primary" />
                                    <span>Live Site</span>
                                    <ArrowUpRight size={12} className="text-muted-foreground" />
                                </a>
                            )}

                            {study.githubUrl && (
                                <a
                                    href={study.githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-foreground/5 text-foreground text-xs font-medium transition-all shadow-sm"
                                >
                                    <Github size={13} />
                                    <span>GitHub</span>
                                    <ArrowUpRight size={12} className="text-muted-foreground" />
                                </a>
                            )}

                            {study.figmaUrl && (
                                <a
                                    href={study.figmaUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-foreground/5 text-foreground text-xs font-medium transition-all shadow-sm"
                                >
                                    <Figma size={13} className="text-purple-400" />
                                    <span>Figma</span>
                                    <ArrowUpRight size={12} className="text-muted-foreground" />
                                </a>
                            )}

                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="p-2 rounded-xl bg-foreground/5 hover:bg-foreground/10 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                                aria-label="Close"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Scrollable Overlay Body */}
                    <div className="p-6 md:p-10 overflow-y-auto space-y-8 flex-1">
                        
                        {/* TAB 1: INTERACTIVE DEMO */}
                        {activeTab === "interactive" && (
                            <div className="space-y-6">
                                <ProjectInteractiveViewer study={study} />

                                {/* Highlights Quick Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                                    <div className="p-5 rounded-2xl bg-card border border-border space-y-1.5">
                                        <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                                            Role & Contribution
                                        </span>
                                        <div className="text-sm font-semibold text-foreground">{study.role}</div>
                                        <p className="text-xs text-muted-foreground">{study.domain}</p>
                                    </div>
                                    <div className="p-5 rounded-2xl bg-card border border-border space-y-1.5">
                                        <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                                            Primary Empirical Impact
                                        </span>
                                        <div className="text-sm font-semibold text-emerald-500">{study.results[0]}</div>
                                        <p className="text-xs text-muted-foreground">Rigorous validation across task metrics</p>
                                    </div>
                                    <div className="p-5 rounded-2xl bg-card border border-border space-y-1.5">
                                        <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                                            Direct Artifacts
                                        </span>
                                        <div className="flex flex-wrap gap-2 pt-1">
                                            {study.liveUrl && (
                                                <a
                                                    href={study.liveUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
                                                >
                                                    <span>Live Platform ↗</span>
                                                </a>
                                            )}
                                            {study.githubUrl && (
                                                <a
                                                    href={study.githubUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-medium"
                                                >
                                                    <span>GitHub Repo ↗</span>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 2: DEEP-DIVE CASE STUDY */}
                        {activeTab === "narrative" && (
                            <div className="space-y-10 max-w-4xl mx-auto">
                                
                                {/* Lead Intro */}
                                <div className="space-y-4 border-b border-border pb-8">
                                    <span className="text-xs uppercase tracking-wider text-primary font-semibold">
                                        Executive Summary
                                    </span>
                                    <h2 className="text-2xl sm:text-3xl font-medium text-foreground tracking-tight">
                                        {study.tagline}
                                    </h2>
                                    <p className="text-muted-foreground text-base leading-relaxed">
                                        {study.context}
                                    </p>
                                </div>

                                {/* Visual Master Gallery */}
                                <div className="space-y-3">
                                    <span className="text-xs uppercase tracking-wider text-primary font-semibold block">
                                        Interface & Architecture Artifacts
                                    </span>
                                    <CaseStudyGallery 
                                        images={study.galleryImages || [study.coverImage]} 
                                        title={study.title} 
                                        annotation={study.annotation}
                                    />
                                </div>

                                {/* Problem vs In-Situ Observation */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="p-6 rounded-2xl bg-card border border-border space-y-3">
                                        <div className="flex items-center gap-2 text-destructive font-semibold text-xs uppercase tracking-wider">
                                            <span>The Core Friction</span>
                                        </div>
                                        <h4 className="text-lg font-medium text-foreground">The Operational Problem</h4>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {study.problem}
                                        </p>
                                    </div>

                                    <div className="p-6 rounded-2xl bg-card border border-border space-y-3">
                                        <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider">
                                            <span>In-Situ Field Finding</span>
                                        </div>
                                        <h4 className="text-lg font-medium text-foreground">Worker Observation</h4>
                                        <p className="text-sm italic text-muted-foreground leading-relaxed border-l-2 border-primary pl-3">
                                            &quot;{study.observation}&quot;
                                        </p>
                                    </div>
                                </div>

                                {/* Design Explorations & System Architecture */}
                                <div className="p-8 rounded-2xl bg-foreground/[0.02] border border-border space-y-4">
                                    <span className="text-xs uppercase tracking-wider text-primary font-semibold">
                                        Interaction Exploration & Prototypes
                                    </span>
                                    <h4 className="text-xl font-medium text-foreground">
                                        System Architecture & Prototype Iterations
                                    </h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {study.prototypeDescription}
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                        {study.exploration.map((exp, i) => (
                                            <div key={i} className="p-3.5 rounded-xl bg-card border border-border text-xs text-muted-foreground flex items-start gap-2">
                                                <span className="text-primary font-bold">0{i + 1}.</span>
                                                <span>{exp}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Testing & Empirical Results */}
                                <div className="space-y-4">
                                    <span className="text-xs uppercase tracking-wider text-emerald-500 font-semibold">
                                        Validation & Metrics
                                    </span>
                                    <h4 className="text-xl font-medium text-foreground">
                                        Empirical Results & What Actually Worked
                                    </h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {study.testing}
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {study.results.map((res, i) => (
                                            <div key={i} className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-foreground flex items-start gap-2.5">
                                                <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                                                <span>{res}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* What Failed & Core Learning */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border">
                                    <div className="space-y-2">
                                        <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold">
                                            What Failed Early On
                                        </span>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {study.whatFailed}
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <span className="text-xs uppercase tracking-wider text-primary font-semibold">
                                            Core Interaction Guideline
                                        </span>
                                        <p className="text-sm text-foreground font-medium leading-relaxed">
                                            {study.learnings}
                                        </p>
                                    </div>
                                </div>

                            </div>
                        )}

                        {/* TAB 3: SYSTEM SPECS & TECH ARCHITECTURE */}
                        {activeTab === "architecture" && (
                            <div className="space-y-8 max-w-4xl mx-auto">
                                <div className="border-b border-border pb-6 space-y-3">
                                    <span className="text-xs uppercase tracking-wider text-primary font-semibold block">
                                        Technical Stack & System Specifications
                                    </span>
                                    <h3 className="text-2xl font-medium text-foreground">
                                        Production & Research Architecture
                                    </h3>
                                    {study.architectureOverview && (
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {study.architectureOverview}
                                        </p>
                                    )}
                                </div>

                                {/* Dynamic Spec Metrics Grid */}
                                {study.specMetrics && study.specMetrics.length > 0 && (
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                                        {study.specMetrics.map((metric, idx) => (
                                            <div key={idx} className="p-4 rounded-xl bg-card border border-border space-y-1">
                                                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold block">
                                                    {metric.label}
                                                </span>
                                                <span className="text-2xl font-bold text-foreground block">
                                                    {metric.value}
                                                </span>
                                                <span className="text-[11px] text-muted-foreground block leading-tight">
                                                    {metric.detail}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {study.techStack?.map((cat, idx) => (
                                        <div key={idx} className="p-6 rounded-2xl bg-card border border-border space-y-3">
                                            <h4 className="text-sm font-semibold text-foreground">{cat.title}</h4>
                                            <div className="space-y-2 text-xs text-muted-foreground">
                                                {cat.items.map((item, itemIdx) => (
                                                    <div key={itemIdx} className="p-2.5 rounded-lg bg-foreground/5 border border-border/50 flex items-center gap-2">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                        <span className="text-foreground/90">{item}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {(study.liveUrl || study.githubUrl || study.figmaUrl) && (
                                    <div className="p-6 rounded-2xl bg-primary/10 border border-primary/20 flex flex-wrap items-center justify-between gap-4">
                                        <div>
                                            <h4 className="text-sm font-semibold text-foreground">Inspect Live Artifacts &amp; Research</h4>
                                            <p className="text-xs text-muted-foreground mt-0.5">Explore the interactive deployment, inspect the Figma canvas, or browse code.</p>
                                        </div>
                                        <div className="flex flex-wrap gap-3">
                                            {study.figmaUrl && (
                                                <a
                                                    href={study.figmaUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-colors"
                                                >
                                                    <Figma size={13} />
                                                    <span>Open in Figma</span>
                                                </a>
                                            )}
                                            {study.liveUrl && (
                                                <a
                                                    href={study.liveUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold shadow-sm flex items-center gap-1.5"
                                                >
                                                    <span>Open Live Platform</span>
                                                    <ExternalLink size={13} />
                                                </a>
                                            )}
                                            {study.githubUrl && (
                                                <a
                                                    href={study.githubUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-4 py-2 rounded-xl bg-card border border-border text-foreground text-xs font-medium flex items-center gap-1.5"
                                                >
                                                    <Github size={13} />
                                                    <span>Browse Codebase</span>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
