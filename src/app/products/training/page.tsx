"use client";

import { motion } from "framer-motion";
import {
    Layers, Globe, BookOpen, Video, CheckCircle2,
    Quote, Play, Award, ArrowRight
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/layout/footer";
import { useResponsive } from "@/hooks/use-responsive";

// --- Hero Component Replicated for Training ---
function TrainingHero() {
    return (
        <section className="relative w-full flex flex-col md:block h-auto md:h-screen overflow-hidden bg-[#111] p-0 m-0">
            {/* Visuals */}
            <div className="relative w-full h-[80vh] md:absolute md:inset-0 md:h-full overflow-hidden">
                <div className="absolute inset-0 w-full h-full z-0">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover opacity-100 brightness-110"
                    >
                        <source src="https://cdn.pixabay.com/video/2020/05/25/40103-424074211_large.mp4" type="video/mp4" />
                    </video>
                </div>
                <div className="absolute inset-0 z-10 pointer-events-none bg-black/40" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 z-10 pointer-events-none mix-blend-overlay" />

                {/* Content Overlay */}
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            <span className="text-xs font-bold tracking-widest uppercase text-white/90">Vyantraa Academy</span>
                        </div>
                        <h1 className="text-5xl md:text-8xl font-bold tracking-tighter text-white mb-6 drop-shadow-2xl">
                            Future-Ready <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Workforce.</span>
                        </h1>
                        <p className="text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto leading-relaxed mb-10 drop-shadow-md">
                            Bridging the gap between legacy manufacturing and Industry 4.0 through immersive, hands-on masterclasses.
                        </p>
                        <Button size="lg" className="h-14 px-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-base" asChild>
                            <Link href="#curriculum">Explore Curriculum</Link>
                        </Button>
                    </motion.div>
                </div>
            </div>

            {/* Bottom Stats - Matches Home Page Style */}
            <div className="relative w-full z-30 md:absolute md:bottom-0 md:left-0 md:right-0 bg-[#020617] md:bg-transparent border-t md:border-none border-white/10">
                <div className="w-full pointer-events-auto md:bg-[#020617]/80 md:backdrop-blur-xl md:border-t md:border-white/10">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10 border-x border-white/10">
                            {[
                                { text: "25+ Courses", sub: "Industry Aligned", icon: Layers, color: "text-blue-400" },
                                { text: "Hybrid Learning", sub: "Online & On-Site", icon: Globe, color: "text-purple-400" },
                                { text: "Virtual Labs", sub: "Cloud Access", icon: Video, color: "text-amber-400" },
                                { text: "Certification", sub: "Blockchain Verified", icon: Award, color: "text-emerald-400" },
                            ].map((item, i) => (
                                <div key={i} className="group flex flex-col items-center justify-center py-8 hover:bg-white/5 transition-colors cursor-pointer">
                                    <item.icon className={`w-6 h-6 mb-3 ${item.color}`} />
                                    <h3 className="text-white font-semibold text-sm tracking-wide">{item.text}</h3>
                                    <p className="text-zinc-500 text-[10px] uppercase tracking-widest">{item.sub}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default function TrainingPage() {
    const containerRef = useRef<HTMLElement>(null);
    useResponsive(containerRef);

    return (
        <main ref={containerRef} className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary selection:text-white">

            <TrainingHero />

            {/* SECTION 1: THE PROBLEM (Standard Grid Layout) */}
            <section className="bg-background border-t border-border">
                <div className="container mx-auto px-4 border-l border-r border-border p-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border border-b border-border">
                        {/* Text Side */}
                        <div className="p-10 md:p-20 flex flex-col justify-center">
                            <span className="text-primary text-sm font-semibold tracking-wider uppercase mb-3 block">
                                The Context
                            </span>
                            <h2 className="text-3xl md:text-5xl font-medium text-foreground mb-6 leading-tight">
                                The Skills Gap is <br />
                                <span className="opacity-50">Widening.</span>
                            </h2>
                            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                                Traditional engineering education hasn&apos;t kept pace with the explosion of IIoT, Cloud, and AI in manufacturing.
                                Your workforce needs more than theory—they need operational competence.
                            </p>
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <div className="text-4xl font-bold text-foreground mb-1">82%</div>
                                    <div className="text-xs text-muted-foreground uppercase tracking-widest">Talent Shortage</div>
                                </div>
                                <div>
                                    <div className="text-4xl font-bold text-foreground mb-1">4.0</div>
                                    <div className="text-xs text-muted-foreground uppercase tracking-widest">Industry Phase</div>
                                </div>
                            </div>
                        </div>
                        {/* Image Side */}
                        <div className="relative h-[500px] md:h-auto bg-foreground/5 overflow-hidden group">
                            <Image
                                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=2000"
                                alt="Industrial Engineer"
                                fill
                                className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-700 mix-blend-multiply"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 2: CURRICULUM (Using Services Grid System) */}
            <section id="curriculum" className="bg-background border-t border-border">
                <div className="container mx-auto px-4 border-l border-r border-border p-0">
                    <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border border-b border-border">

                        {/* Header Cell */}
                        <div className="p-10 md:p-12 col-span-1 md:col-span-3 lg:col-span-1 flex flex-col justify-center border-b border-border lg:border-b-0 lg:border-r">
                            <span className="text-primary text-sm font-semibold tracking-wider uppercase mb-3 block">
                                Curriculum
                            </span>
                            <h2 className="text-3xl md:text-5xl font-medium text-foreground mb-6">
                                Masterclass Tracks
                            </h2>
                            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                                Select your specialization path. From sensor networks to strategic data governance.
                            </p>
                            <Button variant="outline" className="w-fit">Download Full Catalog</Button>
                        </div>

                        {/* Course Cards */}
                        {[
                            { title: "IIoT Architect", desc: "Design secure sensor networks and MQTT brokers.", level: "Intermediate" },
                            { title: "AI for Mfg", desc: "Computer vision for quality control.", level: "Advanced" },
                            { title: "MES Systems", desc: "Implementation strategies for ISA-95 standard.", level: "Expert" },
                            { title: "Cloud Factory", desc: "AWS/Azure for manufacturing workloads.", level: "Beginner" },
                            { title: "OT Security", desc: "Securing the shop floor from cyber threats.", level: "Advanced" },
                        ].map((course, i) => (
                            <div key={i} className="p-10 md:p-12 group hover:bg-foreground/5 transition-all duration-300">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-all">
                                        <BookOpen size={24} />
                                    </div>
                                    <span className="text-[10px] uppercase font-bold tracking-wider py-1 px-2 rounded bg-foreground/5 text-muted-foreground">{course.level}</span>
                                </div>
                                <h3 className="text-xl font-medium mb-3 text-foreground group-hover:text-primary transition-colors">
                                    {course.title}
                                </h3>
                                <p className="text-muted-foreground leading-relaxed text-sm group-hover:text-foreground/80 transition-colors mb-6">
                                    {course.desc}
                                </p>
                                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors cursor-pointer">
                                    View Syllabus <ArrowRight className="w-3 h-3" />
                                </div>
                            </div>
                        ))}

                    </div>
                </div>
            </section>

            {/* SECTION 3: VIRTUAL LABS (Feature Highlight) */}
            <section className="bg-background border-t border-border relative overflow-hidden">
                <div className="container px-4 mx-auto py-24 border-x border-border">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="order-2 lg:order-1 relative rounded-2xl overflow-hidden border border-border shadow-2xl">
                            <Image src="/dashboard-preview.png" alt="Lab Interface" fill className="bg-muted object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
                                    <Play className="fill-white text-white w-6 h-6 ml-1" />
                                </div>
                            </div>
                        </div>
                        <div className="order-1 lg:order-2">
                            <span className="text-primary text-sm font-semibold tracking-wider uppercase mb-4 block">
                                Hands-On Experience
                            </span>
                            <h2 className="text-3xl md:text-5xl font-medium text-foreground mb-6">
                                Don&apos;t just watch. <span className="text-primary">Build.</span>
                            </h2>
                            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                                Every course includes access to our cloud-based <strong>Virtual Factory Lab</strong>. Provision real resources and break things in a safe sandbox.
                            </p>
                            <ul className="space-y-4">
                                {["Pre-configured IDEs", "Real Industry Datasets", "24/7 Sandbox Access"].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-foreground">
                                        <CheckCircle2 className="h-5 w-5 text-primary" /> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 4: TESTIMONIALS (Grid) */}
            <section className="bg-background border-t border-border">
                <div className="container mx-auto px-4 border-l border-r border-border p-0">
                    <div className="p-12 border-b border-border text-center">
                        <h2 className="text-3xl font-medium text-foreground">Trusted by Leaders</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border border-b border-border">
                        {[
                            { name: "David Chen", role: "Chief Engineer", company: "Tesla", quote: "Implemented the edge architecture the very next week." },
                            { name: "Sarah Miller", role: "VP Digital", company: "Siemens", quote: "Instructors are true industry veterans." },
                            { name: "James Wilson", role: "Plant Manager", company: "GE", quote: "No fluff. Just hard engineering principles." },
                        ].map((t, i) => (
                            <div key={i} className="p-10 flex flex-col justify-between hover:bg-foreground/5 transition-colors">
                                <Quote className="w-8 h-8 text-primary/20 mb-6" />
                                <p className="text-foreground/80 text-lg italic mb-8 leading-relaxed">&quot;{t.quote}&quot;</p>
                                <div>
                                    <h4 className="font-semibold text-foreground">{t.name}</h4>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wide">{t.role}, {t.company}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 5: FAQ & CTA */}
            <section className="bg-background border-t border-border py-24">
                <div className="container mx-auto px-4 border-l border-r border-border border-y bg-foreground/5 rounded-3xl p-12 md:p-24 text-center">
                    <h2 className="text-4xl font-bold text-foreground mb-6">Ready to upgrade your team?</h2>
                    <p className="text-muted-foreground text-lg mb-10 max-w-2xl mx-auto">
                        Join 500+ engineers building the future of manufacturing.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" className="h-14 px-10 rounded-full text-base">
                            View Schedule
                        </Button>
                        <Button size="lg" variant="outline" className="h-14 px-10 rounded-full text-base bg-transparent">
                            Contact Sales
                        </Button>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
