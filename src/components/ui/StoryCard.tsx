"use client";

import React, { useState } from "react";
import Image from "next/image";
import { CheckCircle2, ChevronRight, X } from "lucide-react";

export interface ProfileStandoutStory {
    id: string;
    number: string;
    category: string;
    title: string;
    subtitle: string;
    shortMetric: string;
    description: string;
    bulletPoints: string[];
    image: string;
    bgColor: string;
    accentColor: string;
}

interface StoryCardProps {
    story: ProfileStandoutStory;
}

export default function StoryCard({ story }: StoryCardProps) {
    const [isToggled, setIsToggled] = useState(false);

    return (
        <div
            className={`
                group relative w-full h-full rounded-[28px] overflow-hidden 
                ${story.bgColor} 
                border border-black/10 dark:border-white/10 
                flex flex-col justify-between p-7 select-none transition-all duration-500 ease-out
            `}
        >
            {/* Subtle Texture Grain */}
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

            {/* Top Identity Header Bar (Clean, Perfectly Aligned) */}
            <div className="w-full flex items-center justify-between z-10 pointer-events-none">
                <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-neutral-900/80 px-2 py-0.5 rounded-[4px] bg-black/10">
                        {story.number}
                    </span>
                    <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-neutral-900/85">
                        {story.category}
                    </span>
                </div>
                <span className="text-[11px] font-mono font-bold text-neutral-900 px-2.5 py-0.5 rounded-full bg-black/10 border border-black/10">
                    {story.shortMetric}
                </span>
            </div>

            {/* Centered Large Vector Illustration (Ample Breathing Room) */}
            <div 
                onClick={() => setIsToggled(true)}
                className="flex-1 flex items-center justify-center my-3 cursor-pointer transition-transform duration-700 ease-out group-hover:scale-105"
            >
                <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center">
                    <Image
                        src={story.image}
                        alt={story.title}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 280px, 360px"
                    />
                </div>
            </div>

            {/* Resting Bottom State: Title + Subtitle + Explore Button */}
            <div className="w-full text-center flex flex-col items-center gap-2 z-10">
                <div>
                    <h3 className="font-sans font-bold text-2xl md:text-[26px] text-neutral-950 tracking-tight leading-tight">
                        {story.title}
                    </h3>
                    <p className="text-xs text-neutral-800/85 font-medium mt-1 font-sans">
                        {story.subtitle}
                    </p>
                </div>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsToggled(true);
                    }}
                    className="mt-1 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-neutral-950 text-white text-xs font-semibold hover:bg-neutral-800 transition-all cursor-pointer shadow-none"
                >
                    <span>Explore Methodology</span>
                    <ChevronRight size={13} />
                </button>
            </div>

            {/* Hover / Tapped Reveal: Full Methodology & Validation Drawer */}
            <div className={`
                absolute inset-0 z-30 p-7 flex flex-col justify-between
                bg-neutral-950/95 backdrop-blur-xl border border-white/20
                rounded-[28px] text-left transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]
                ${isToggled 
                    ? "translate-y-0 opacity-100 pointer-events-auto" 
                    : "translate-y-full opacity-0 pointer-events-none group-hover:translate-y-0 group-hover:opacity-100 group-hover:pointer-events-auto"
                }
            `}>
                {/* Drawer Top Bar */}
                <div className="flex items-center justify-between border-b border-white/15 pb-3">
                    <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-white/60">
                            {story.number}
                        </span>
                        <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-primary">
                            {story.category}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-emerald-400">
                            {story.shortMetric}
                        </span>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsToggled(false);
                            }}
                            className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer ml-1"
                            aria-label="Close details"
                        >
                            <X size={14} />
                        </button>
                    </div>
                </div>

                {/* Drawer Content Body */}
                <div className="space-y-3 my-auto py-2 overflow-y-auto max-h-[75%] pr-1">
                    <div>
                        <h4 className="font-sans font-bold text-xl md:text-2xl text-white tracking-tight">
                            {story.title}
                        </h4>
                        <p className="text-neutral-300 text-xs md:text-sm font-normal leading-relaxed font-sans mt-1.5">
                            {story.description}
                        </p>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-white/10">
                        <span className="text-[10px] font-semibold text-white/80 uppercase tracking-wider block font-sans">
                            Core Methodologies & Validation:
                        </span>
                        {story.bulletPoints.map((bp, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs text-neutral-200">
                                <CheckCircle2 size={13} className="text-emerald-400 mt-0.5 shrink-0" />
                                <span className="leading-snug">{bp}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Drawer Footer */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-neutral-400">
                    <span className="truncate max-w-[200px]">{story.subtitle}</span>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsToggled(false);
                        }}
                        className="text-xs font-semibold text-primary hover:underline cursor-pointer shrink-0"
                    >
                        Close ✕
                    </button>
                </div>
            </div>
        </div>
    );
}
