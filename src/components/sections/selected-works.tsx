"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { WORK_CASE_STUDIES, CaseStudy } from "@/data/portfolioData";
import { CaseStudyOverlay } from "./case-study-overlay";
import { useResponsive } from "@/hooks/use-responsive";
import { 
    Sparkles, 
    ExternalLink, 
    Github, 
    Globe, 
    ArrowUpRight, 
    Maximize2, 
    Layers, 
    Play,
    Compass
} from "lucide-react";

export function SelectedWorks() {
    const [selectedStudyId, setSelectedStudyId] = useState<string>("lift-me-up");
    const [overlayStudy, setOverlayStudy] = useState<CaseStudy | null>(null);
    const containerRef = useRef<HTMLElement>(null);
    const device = useResponsive(containerRef);

    const activeStudy = WORK_CASE_STUDIES.find(s => s.id === selectedStudyId) || WORK_CASE_STUDIES[0];

    const openOverlay = (study: CaseStudy) => {
        setOverlayStudy(study);
    };

    return (
        <section id="work" ref={containerRef} className="bg-background border-t border-border relative overflow-hidden">
            {/* Connected Grid Outer Container matching Vyantraa layout */}
            <div className="container mx-auto px-4 border-l border-r border-border p-0">
                
                {/* Section Header */}
                <div className="p-8 md:p-14 border-b border-border flex flex-col md:flex-row md:items-end justify-between gap-6 bg-card/20">
                    <div>
                        <span className="text-primary text-xs font-semibold tracking-wider uppercase mb-3 block">
                            Interactive Research & Production Platforms
                        </span>
                        <h2 className="text-3xl sm:text-4xl md:text-6xl font-medium text-foreground tracking-tight">
                            Selected Works
                        </h2>
                    </div>
                    <div className="max-w-md">
                        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                            Industrial XR prototypes, multimodal human-robot collaboration systems, and behavioral production platforms tested with real users.
                        </p>
                        <div className="w-12 h-1 bg-primary mt-4 rounded-full" />
                    </div>
                </div>

                {/* Project Selector Bar */}
                <div className="border-b border-border bg-card/10 overflow-x-auto">
                    <div className="flex divide-x divide-border min-w-max">
                        {WORK_CASE_STUDIES.map((study) => {
                            const isSelected = study.id === selectedStudyId;
                            return (
                                <button
                                    key={study.id}
                                    onClick={() => setSelectedStudyId(study.id)}
                                    className={`px-6 py-4 text-left transition-all cursor-pointer flex items-center gap-3 ${
                                        isSelected 
                                            ? "bg-foreground/5 text-primary border-b-2 border-b-primary font-semibold" 
                                            : "text-muted-foreground hover:text-foreground hover:bg-foreground/[0.02]"
                                    }`}
                                >
                                    <span className="text-xs font-light opacity-60">{study.number}</span>
                                    <span className="text-xs tracking-tight">{study.title}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* ACTIVE PROJECT SPOTLIGHT (12-Column Hero Display) */}
                <div className="p-8 md:p-14 border-b border-border bg-foreground/[0.01]">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
                        
                        {/* Left Content (7 Cols) */}
                        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                            <div>
                                <div className="flex items-center gap-3.5 mb-3">
                                    {activeStudy.logoImage ? (
                                        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-border bg-white/10 shrink-0 shadow-sm">
                                            <Image
                                                src={activeStudy.logoImage}
                                                alt={activeStudy.title}
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                    ) : (
                                        <span className="text-3xl font-light text-primary/70">{activeStudy.number}</span>
                                    )}
                                    <span className="w-1.5 h-1.5 rounded-full bg-border" />
                                    <span className="text-xs uppercase tracking-wider text-primary font-semibold">
                                        {activeStudy.category}
                                    </span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-border" />
                                    <span className="text-xs text-muted-foreground font-medium">
                                        {activeStudy.year}
                                    </span>
                                </div>

                                <h3 className="text-2xl sm:text-4xl md:text-5xl font-medium text-foreground tracking-tight leading-tight">
                                    {activeStudy.title}
                                </h3>

                                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mt-4 max-w-2xl font-light">
                                    {activeStudy.tagline}
                                </p>
                            </div>

                            {/* In-Situ Quote / Highlight */}
                            <div className="p-4 rounded-xl bg-card border border-border text-xs text-muted-foreground">
                                <span className="text-foreground font-semibold block mb-1">Field Observation:</span>
                                <span className="italic">&quot;{activeStudy.observation}&quot;</span>
                            </div>

                            {/* Meta Badges */}
                            <div className="flex flex-wrap items-center gap-3">
                                <div className="px-3 py-1.5 rounded-lg bg-foreground/5 border border-border text-xs text-muted-foreground">
                                    Role: <strong className="text-foreground font-medium">{activeStudy.role}</strong>
                                </div>
                                <div className="px-3 py-1.5 rounded-lg bg-foreground/5 border border-border text-xs text-muted-foreground">
                                    Context: <strong className="text-foreground font-medium">{activeStudy.domain}</strong>
                                </div>
                                <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-500 font-semibold">
                                    {activeStudy.results[0]}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap items-center gap-3 pt-2">
                                {/* Primary: Launch Interactive Overlay */}
                                <button
                                    onClick={() => openOverlay(activeStudy)}
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground text-xs font-semibold tracking-wider uppercase hover:opacity-90 transition-all cursor-pointer shadow-lg shadow-primary/20 group"
                                >
                                    <Sparkles size={14} className="group-hover:rotate-12 transition-transform" />
                                    <span>Launch Interactive Case Study</span>
                                </button>

                                {/* Secondary: Open Dedicated Page */}
                                <Link
                                    href={`/works/${activeStudy.id}`}
                                    className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl border border-border bg-card hover:bg-foreground/5 text-foreground text-xs font-medium transition-all"
                                >
                                    <span>Dedicated Page</span>
                                    <ArrowUpRight size={13} className="text-muted-foreground" />
                                </Link>

                                {/* Live Link */}
                                {activeStudy.liveUrl && (
                                    <a
                                        href={activeStudy.liveUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl border border-border bg-card hover:bg-foreground/5 text-foreground text-xs font-medium transition-all"
                                    >
                                        <Globe size={13} className="text-primary" />
                                        <span>Live Site</span>
                                        <ArrowUpRight size={13} className="text-muted-foreground" />
                                    </a>
                                )}

                                {/* Code Link */}
                                {activeStudy.githubUrl && (
                                    <a
                                        href={activeStudy.githubUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl border border-border bg-card hover:bg-foreground/5 text-foreground text-xs font-medium transition-all"
                                    >
                                        <Github size={13} />
                                        <span>Code</span>
                                        <ArrowUpRight size={13} className="text-muted-foreground" />
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Right Interactive Visual Viewport (5 Cols) */}
                        <div className="lg:col-span-5">
                            <div
                                onClick={() => openOverlay(activeStudy)}
                                className="relative aspect-[16/11] w-full rounded-2xl overflow-hidden border border-border bg-black group cursor-pointer shadow-2xl"
                            >
                                <Image
                                    src={activeStudy.coverImage}
                                    alt={activeStudy.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-90"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />

                                {/* Interactive Launch Overlay Prompt */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                                    <span className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-xs uppercase tracking-wider shadow-2xl flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                                        <Play size={12} fill="currentColor" />
                                        <span>Open Interactive Demo & Specs</span>
                                    </span>
                                </div>

                                {/* Annotation Bottom Pill */}
                                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                                    <span className="text-xs text-foreground font-medium bg-background/80 backdrop-blur-md px-3 py-1 rounded-md border border-border shadow-sm">
                                        {activeStudy.annotation}
                                    </span>
                                    <span className="text-xs text-primary font-medium bg-background/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-border flex items-center gap-1">
                                        <Maximize2 size={11} />
                                        <span>Expand</span>
                                    </span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* 5-PROJECT CONNECTED PREVIEW MATRIX */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-border">
                    {WORK_CASE_STUDIES.map((study) => {
                        const isSelected = study.id === selectedStudyId;
                        return (
                            <div
                                key={study.id}
                                onClick={() => setSelectedStudyId(study.id)}
                                className={`p-6 md:p-8 cursor-pointer transition-all duration-300 group flex flex-col justify-between h-56 ${
                                    isSelected 
                                        ? "bg-primary/5 border-t-2 border-t-primary" 
                                        : "hover:bg-foreground/[0.02]"
                                }`}
                            >
                                <div>
                                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                                        <span className="font-light text-primary/80">{study.number}</span>
                                        <span>{study.year}</span>
                                    </div>
                                    <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                                        {study.title}
                                    </h4>
                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                        {study.tagline}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between pt-3 border-t border-border/50 text-xs">
                                    <span className="text-muted-foreground group-hover:text-foreground transition-colors font-medium">
                                        {isSelected ? "Active Spotlight" : "Select"}
                                    </span>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openOverlay(study);
                                        }}
                                        className="text-primary hover:underline flex items-center gap-1 font-medium"
                                    >
                                        <span>Open Demo</span>
                                        <ArrowUpRight size={12} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>

            {/* FULL-SCREEN IMMERSIVE CASE STUDY OVERLAY */}
            <CaseStudyOverlay
                study={overlayStudy}
                isOpen={overlayStudy !== null}
                onClose={() => setOverlayStudy(null)}
            />
        </section>
    );
}
