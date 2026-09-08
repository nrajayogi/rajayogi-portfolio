import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { WORK_CASE_STUDIES } from "@/data/portfolioData";
import { ProjectInteractiveViewer } from "@/components/sections/project-interactive-viewer";
import { CaseStudyGallery } from "@/components/ui/case-study-gallery";
import { LiftMeUpCaseStudy } from "@/components/case-studies/lift-me-up/LiftMeUpCaseStudy";
import { ArrowLeft, ExternalLink, Github, Globe, CheckCircle2, Layers, Compass, Sparkles, Figma } from "lucide-react";

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateStaticParams() {
    return WORK_CASE_STUDIES.map((study) => ({
        slug: study.id,
    }));
}

export default async function WorkPage({ params }: PageProps) {
    const { slug } = await params;

    // Use bespoke editorial experience for Lift Me Up
    if (slug === "lift-me-up" || slug === "industrial-xr-thesis") {
        return <LiftMeUpCaseStudy />;
    }

    const study = WORK_CASE_STUDIES.find((s) => s.id === slug);

    if (!study) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-background text-foreground pb-24">
            {/* Top Navigation Bar */}
            <div className="border-b border-border bg-card/40 backdrop-blur-md sticky top-0 z-40">
                <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <Link
                        href="/#work"
                        className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft size={16} />
                        <span>Back to Portfolio</span>
                    </Link>

                    <div className="flex items-center gap-3">
                        {study.liveUrl && (
                            <a
                                href={study.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-all"
                            >
                                <Globe size={13} />
                                <span>Live Website ↗</span>
                            </a>
                        )}
                        {study.figmaUrl && (
                            <a
                                href={study.figmaUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-sm transition-all"
                            >
                                <Figma size={13} />
                                <span>Inspect in Figma ↗</span>
                            </a>
                        )}
                        {study.githubUrl && (
                            <a
                                href={study.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] border border-border bg-card hover:bg-foreground/5 text-foreground text-xs font-medium transition-all"
                            >
                                <Github size={13} />
                                <span>Source Code ↗</span>
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* Project Hero Header */}
            <div className="container mx-auto px-4 sm:px-6 pt-12 md:pt-16 pb-12 border-b border-border">
                <div className="max-w-4xl">
                    <div className="flex items-center gap-3.5 mb-4">
                        {study.logoImage ? (
                            <div className="relative w-12 h-12 rounded-full overflow-hidden border border-border bg-white/10 shrink-0 shadow-sm">
                                <Image
                                    src={study.logoImage}
                                    alt={study.title}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        ) : (
                            <span className="text-3xl font-light text-primary/70">{study.number}</span>
                        )}
                        <span className="w-1.5 h-1.5 rounded-full bg-border" />
                        <span className="text-xs uppercase tracking-wider text-primary font-semibold">{study.category}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-border" />
                        <span className="text-xs text-muted-foreground">{study.year}</span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-medium tracking-tight text-foreground leading-[1.05]">
                        {study.title}
                    </h1>

                    <p className="text-lg sm:text-xl text-muted-foreground mt-4 leading-relaxed font-light">
                        {study.tagline}
                    </p>

                    <div className="flex flex-wrap gap-3 mt-6">
                        <div className="px-3.5 py-1.5 rounded-[4px] bg-foreground/5 border border-border text-xs text-muted-foreground">
                            Role: <strong className="text-foreground font-medium">{study.role}</strong>
                        </div>
                        <div className="px-3.5 py-1.5 rounded-[4px] bg-foreground/5 border border-border text-xs text-muted-foreground">
                            Institution: <strong className="text-foreground font-medium">{study.domain}</strong>
                        </div>
                        <div className="px-3.5 py-1.5 rounded-[4px] bg-foreground/5 border border-border text-xs text-muted-foreground">
                            Timeline: <strong className="text-foreground font-medium">{study.duration}</strong>
                        </div>
                    </div>

                    {/* Master Gallery Showcase */}
                    <div className="mt-10">
                        <CaseStudyGallery
                            images={study.galleryImages || [study.coverImage]}
                            title={study.title}
                            annotation={study.annotation}
                        />
                    </div>
                </div>
            </div>

            {/* Interactive Simulation / Live Project Viewer */}
            <div className="container mx-auto px-4 sm:px-6 py-12 border-b border-border">
                <div className="mb-4">
                    <span className="text-xs uppercase tracking-wider text-primary font-semibold block mb-1">
                        Interactive Laboratory
                    </span>
                    <h2 className="text-2xl font-medium text-foreground">
                        Live Project Demonstration & Metrics
                    </h2>
                </div>
                <ProjectInteractiveViewer study={study} />
            </div>

            {/* Narrative & Case Study Deep-Dive */}
            <div className="container mx-auto px-4 sm:px-6 py-16">
                <div className="max-w-4xl mx-auto space-y-12">
                    
                    {/* The Problem & In-situ Observation */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-6 rounded-[4px] bg-card border border-border space-y-3">
                            <span className="text-xs font-semibold uppercase tracking-wider text-destructive">
                                Operational Problem
                            </span>
                            <h3 className="text-lg font-medium text-foreground">The Real-World Friction</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {study.problem}
                            </p>
                        </div>

                        <div className="p-6 rounded-[4px] bg-card border border-border space-y-3">
                            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                                In-Situ Field Observation
                            </span>
                            <h3 className="text-lg font-medium text-foreground">Worker Cadence</h3>
                            <p className="text-sm italic text-muted-foreground leading-relaxed border-l-2 border-primary pl-3">
                                &quot;{study.observation}&quot;
                            </p>
                        </div>
                    </div>

                    {/* Prototype System */}
                    <div className="p-8 rounded-[4px] bg-foreground/[0.02] border border-border space-y-4">
                        <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                            System Architecture
                        </span>
                        <h3 className="text-xl font-medium text-foreground">
                            How the Interface Was Engineered
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {study.prototypeDescription}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                            {study.exploration.map((exp, i) => (
                                <div key={i} className="p-3.5 rounded-[4px] bg-card border border-border text-xs text-muted-foreground flex items-start gap-2">
                                    <span className="text-primary font-bold">0{i + 1}.</span>
                                    <span>{exp}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* System Specifications & Tech Stack */}
                    <div className="space-y-6">
                        <div className="border-b border-border pb-4 space-y-2">
                            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                                System Specifications & Tech Stack
                            </span>
                            <h3 className="text-xl font-medium text-foreground">
                                Technical Specifications & Infrastructure
                            </h3>
                            {study.architectureOverview && (
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {study.architectureOverview}
                                </p>
                            )}
                        </div>

                        {/* Spec Metrics Grid */}
                        {study.specMetrics && study.specMetrics.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                                {study.specMetrics.map((metric, idx) => (
                                    <div key={idx} className="p-4 rounded-[4px] bg-card border border-border space-y-1">
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

                        {/* Tech Stack Categories */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {study.techStack?.map((cat, idx) => (
                                <div key={idx} className="p-5 rounded-[4px] bg-card border border-border space-y-3">
                                    <h4 className="text-sm font-semibold text-foreground">{cat.title}</h4>
                                    <div className="space-y-2 text-xs text-muted-foreground">
                                        {cat.items.map((item, itemIdx) => (
                                            <div key={itemIdx} className="p-2 rounded-[4px] bg-foreground/5 border border-border/50 flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                                <span className="text-foreground/90">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Results & Guidelines */}
                    <div className="space-y-4">
                        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-500">
                            Empirical Validation
                        </span>
                        <h3 className="text-xl font-medium text-foreground">
                            Measured Outcomes & User Study
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {study.testing}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {study.results.map((res, i) => (
                                <div key={i} className="p-4 rounded-[4px] bg-emerald-500/10 border border-emerald-500/20 text-xs text-foreground flex items-start gap-2.5">
                                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                                    <span>{res}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom Back Button */}
                    <div className="pt-8 border-t border-border flex justify-between items-center">
                        <Link
                            href="/#work"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-[4px] bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider hover:opacity-90 transition-all shadow-sm"
                        >
                            <ArrowLeft size={14} />
                            <span>Return to Portfolio</span>
                        </Link>
                    </div>

                </div>
            </div>
        </main>
    );
}
