"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, ExternalLink, Sparkles, Layers } from "lucide-react";

interface CaseStudyGalleryProps {
    images: string[];
    title: string;
    annotation?: string;
}

export function CaseStudyGallery({ images, title, annotation }: CaseStudyGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const activeImage = images[selectedIndex] || images[0];

    if (!images || images.length === 0) return null;

    return (
        <div className="space-y-4">
            {/* Primary High-Resolution Viewport */}
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-border bg-black shadow-2xl group">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeImage}
                        initial={{ opacity: 0, scale: 1.02 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                        className="relative w-full h-full"
                    >
                        <Image
                            src={activeImage}
                            alt={`${title} - View ${selectedIndex + 1}`}
                            fill
                            className="object-contain sm:object-cover"
                            priority
                        />
                    </motion.div>
                </AnimatePresence>

                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent pointer-events-none" />

                {/* Viewport Caption Bar */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                    <div className="bg-background/85 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-border text-xs text-foreground font-medium shadow-lg">
                        <span>{annotation || title}</span>
                        {images.length > 1 && (
                            <span className="text-muted-foreground ml-2 text-[11px]">
                                ({selectedIndex + 1} of {images.length})
                            </span>
                        )}
                    </div>
                    <div className="bg-background/85 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-border text-xs text-primary font-medium flex items-center gap-1.5 shadow-lg">
                        <Sparkles size={12} />
                        <span>High-Res Master</span>
                    </div>
                </div>
            </div>

            {/* Thumbnail Navigation Strip (If more than 1 image) */}
            {images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1">
                    {images.map((img, idx) => {
                        const isSelected = idx === selectedIndex;
                        return (
                            <button
                                key={idx}
                                onClick={() => setSelectedIndex(idx)}
                                className={`relative w-28 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 bg-card ${
                                    isSelected 
                                        ? "border-primary shadow-md scale-105" 
                                        : "border-border/60 opacity-60 hover:opacity-100 hover:border-foreground/30"
                                }`}
                            >
                                <Image
                                    src={img}
                                    alt={`Thumbnail ${idx + 1}`}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute bottom-1 right-1 bg-black/70 text-[9px] text-white px-1.5 py-0.5 rounded font-mono">
                                    0{idx + 1}
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
