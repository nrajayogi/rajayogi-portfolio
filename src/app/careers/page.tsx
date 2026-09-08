"use client";

import { Container } from "@/components/ui/container";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Zap, Heart, Globe, Cpu, Coffee, Briefcase, GraduationCap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { useResponsive } from "@/hooks/use-responsive";
import { useContent } from "@/lib/content-context";

// Icon mapping
const iconMap: Record<string, any> = {
    Heart,
    Globe,
    Zap,
    GraduationCap,
    Cpu,
    Coffee,
    Briefcase
};

export default function CareersPage() {
    const containerRef = useRef<HTMLElement>(null);
    useResponsive(containerRef);
    const { content } = useContent();
    const careers = content.careers;

    // Parallax Effects
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 150]);

    if (!careers) return null;

    return (
        <>
            <main ref={containerRef} className="min-h-screen bg-black text-white overflow-hidden">

                {/* 1. CINEMATIC HERO */}
                <section className="relative w-full h-[85vh] md:h-screen overflow-hidden bg-[#111]">
                    <motion.div style={{ y: y1 }} className="absolute inset-0 z-0 h-[120%]">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 via-black/70 to-purple-900/60 z-10" />
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay z-10" />
                        <video
                            autoPlay
                            muted
                            loop
                            playsInline
                            key={careers.hero.videoUrl}
                            className="w-full h-full object-cover opacity-60 scale-105"
                        >
                            <source src={careers.hero.videoUrl} type="video/mp4" />
                        </video>
                    </motion.div>

                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-4 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="max-w-5xl"
                        >
                            <span className="text-primary text-sm md:text-base font-semibold tracking-[0.2em] uppercase mb-4 block">
                                {careers.hero.subtitle}
                            </span>
                            <h1 className="text-5xl md:text-[100px] leading-[0.9] font-bold text-white tracking-tighter mb-8">
                                {careers.hero.title.split(' ').map((word, i) => (
                                    <span key={i}>
                                        {word}{' '}
                                        {i === 1 && <br />}
                                    </span>
                                ))}
                            </h1>
                            <p className="text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto leading-relaxed">
                                {careers.hero.description}
                            </p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="mt-10"
                            >
                                <Button size="lg" className="h-14 px-8 rounded-full bg-white text-black hover:bg-zinc-200" asChild>
                                    <Link href="#positions">
                                        View Open Roles <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                {/* 2. CULTURE & VALUES */}
                <section className="bg-zinc-950 border-t border-white/10">
                    <div className="container mx-auto px-4 border-x border-white/10">
                        <div className="grid grid-cols-1 lg:grid-cols-2">
                            {/* Culture Text */}
                            <div className="p-12 md:p-24 border-b lg:border-b-0 lg:border-r border-white/10 bg-white/[0.02]">
                                <span className="text-primary text-sm font-semibold tracking-wider uppercase mb-6 block">{careers.culture.subtitle}</span>
                                <h2 className="text-3xl md:text-4xl font-medium text-white mb-8 leading-tight">
                                    {careers.culture.title.split(',').map((part, i) => (
                                        <span key={i}>
                                            {part}{i < 2 ? ',' : ''}
                                            {i === 1 && <br />}
                                            {i === 2 && <span className="text-white/40">{part}</span>}
                                        </span>
                                    ))}
                                    {/* Manual fix for subtitle coloring if needed, but simple wrap for now */}
                                    {careers.culture.title.includes('Purpose') && (
                                        <span>{careers.culture.title.split('Purpose')[0]}<span className="text-white/40">Purpose.</span></span>
                                    ) ? careers.culture.title.split('and').map((p, i) => (
                                        <span key={i}>{p}{i === 0 ? 'and ' : ''}{i === 1 && <span className="text-white/40">{careers.culture.title.split('and')[1]}</span>}</span>
                                    )) : careers.culture.title}
                                </h2>
                                <p className="text-zinc-500 leading-relaxed text-lg mb-8">
                                    {careers.culture.description}
                                </p>
                                <div className="grid grid-cols-2 gap-8">
                                    <div>
                                        <h4 className="text-white font-semibold mb-2">Impact</h4>
                                        <p className="text-sm text-zinc-500">Work on systems that power the global economy.</p>
                                    </div>
                                    <div>
                                        <h4 className="text-white font-semibold mb-2">Growth</h4>
                                        <p className="text-sm text-zinc-500">Accelerated career paths and mentorship.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Image / Visual */}
                            <div className="p-0 relative h-[500px] lg:h-auto overflow-hidden group">
                                <div className="absolute inset-0 bg-blue-900/20 mix-blend-overlay z-10" />
                                <Image
                                    src={careers.culture.imageUrl}
                                    alt="Team Collaboration"
                                    fill
                                    className="object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-105"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. BENEFITS GRID */}
                <section className="py-24 bg-black border-t border-white/10">
                    <Container>
                        <div className="text-center mb-16 max-w-2xl mx-auto">
                            <h2 className="text-3xl font-medium text-white mb-4">Perks & Benefits</h2>
                            <p className="text-zinc-500">We take care of you, so you can focus on the work.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {careers.benefits.map((benefit, i) => {
                                const Icon = iconMap[benefit.icon] || Heart;
                                return (
                                    <div key={i} className="group p-8 rounded-[4px] bg-white/5 border border-white/5 hover:border-white/20 transition-all duration-300">
                                        <div className="h-12 w-12 rounded-[4px] bg-white/10 flex items-center justify-center text-white mb-6 group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                                            <Icon className="h-6 w-6" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-white mb-3">{benefit.title}</h3>
                                        <p className="text-sm text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors">
                                            {benefit.description}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </Container>
                </section>

                {/* 4. OPEN ROLES */}
                <section id="positions" className="py-24 bg-zinc-950 border-t border-white/10">
                    <Container>
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
                            <div>
                                <h2 className="text-3xl font-medium text-white mb-2">Open Positions</h2>
                                <p className="text-zinc-500">Come build with us.</p>
                            </div>
                            <Button variant="outline" className="border-white/10 text-white hover:bg-white/10">
                                View all {careers.jobs.length} roles
                            </Button>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-[4px] overflow-hidden divide-y divide-white/10">
                            {careers.jobs.map((job, i) => (
                                <div key={i} className="group flex flex-col md:flex-row md:items-center justify-between p-6 md:p-8 hover:bg-white/5 transition-colors cursor-pointer">
                                    <div className="mb-4 md:mb-0">
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="text-xl font-medium text-white group-hover:text-primary transition-colors">{job.title}</h3>
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-white/10 text-white/60">
                                                {job.department}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-zinc-500">
                                            <span className="flex items-center gap-1">
                                                <Globe className="h-3 w-3" /> {job.location}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Briefcase className="h-3 w-3" /> {job.type}
                                            </span>
                                        </div>
                                    </div>
                                    <Button variant="ghost" className="self-start md:self-center text-white group-hover:translate-x-1 transition-transform">
                                        Apply <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>

                        {/* Note */}
                        <div className="text-center mt-12">
                            <p className="text-zinc-500 text-sm">
                                Don&apos;t see your role? <Link href="/contact" className="text-primary hover:underline">Contact us</Link> and tell us how you can help.
                            </p>
                        </div>
                    </Container>
                </section>

            </main>
            <Footer />
        </>
    );
}
