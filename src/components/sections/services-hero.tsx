"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { useResponsive } from "@/hooks/use-responsive";

export function ServicesHero() {
    const containerRef = useRef<HTMLElement>(null);
    useResponsive(containerRef);

    return (
        <section ref={containerRef} className="relative w-full flex flex-col md:block h-[80vh] md:h-screen overflow-hidden bg-[#111] p-0 m-0">
            {/* Visuals Container */}
            <div className="relative w-full h-full md:absolute md:inset-0 md:h-full overflow-hidden">
                {/* 1. Video Layer - Reusing the hero video or a similar one */}
                <div className="absolute inset-0 w-full h-full z-0">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover opacity-[0.4]" // Matches Home Page opacity logic roughly
                    >
                        <source src="/uploads/1765597137894-herocopy.mp4" type="video/mp4" />
                    </video>
                </div>

                {/* 2. Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90 z-10" />
            </div>

            {/* Content Container */}
            <div className="relative z-20 h-full flex flex-col justify-center items-center text-center px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <span className="text-primary text-sm md:text-base font-semibold tracking-[0.2em] uppercase mb-4 block">
                        Comprehensive Ecosystem
                    </span>
                    <h1 className="text-5xl md:text-[100px] leading-[0.9] font-bold text-white tracking-tighter mb-6">
                        Our Services
                    </h1>
                    <p className="text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto leading-relaxed">
                        Bridging the gap between traditional engineering wisdom <br className="hidden md:block" /> and modern digital innovation.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
