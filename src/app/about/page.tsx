"use client";

import { Container } from "@/components/ui/container";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { ArrowRight, Users, Target, History, Briefcase, Award, Zap } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { useResponsive } from "@/hooks/use-responsive";
import { useContent } from "@/lib/content-context";

// Icon mapping
const iconMap: Record<string, any> = {
    History,
    Users,
    Briefcase,
    Award,
    Target,
    Zap
};

// CountUp Component for Stats
function CountUp({ value, label, sub, icon: iconName }: { value: string, label: string, sub: string, icon?: string }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });
    const Icon = (iconName && iconMap[iconName]) || History;

    return (
        <div ref={ref} className="py-8 text-center group hover:bg-white/5 transition-colors cursor-default relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-transparent via-white/5 to-transparent group-hover:via-white/10 transition-colors" />
            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={isInView ? { scale: 1, opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-4 inline-flex p-3 rounded-[4px] bg-white/5 text-primary group-hover:scale-110 transition-transform duration-500"
            >
                <Icon className="w-6 h-6" />
            </motion.div>
            <motion.h3
                initial={{ y: 20, opacity: 0 }}
                animate={isInView ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight"
            >
                {value}
            </motion.h3>
            <p className="text-white/60 font-medium tracking-widest text-xs uppercase mb-1">{label}</p>
            <p className="text-blue-400 text-[10px] md:text-xs font-medium tracking-wide uppercase">{sub}</p>
        </div>
    );
}

export default function AboutPage() {
    const containerRef = useRef<HTMLElement>(null);
    const device = useResponsive(containerRef);
    const { content } = useContent();
    const about = content.about;

    // Parallax Effect for Hero
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -100]);

    if (!about) return null;

    return (
        <>
            <main ref={containerRef} className="min-h-screen bg-black text-white overflow-hidden">

                {/* 1. CINEMATIC HERO */}
                <section className="relative w-full h-[85vh] md:h-screen overflow-hidden bg-[#111]">
                    <motion.div style={{ y: y1 }} className="absolute inset-0 z-0 h-[120%]">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/50 via-black/60 to-purple-950/50 z-10" />
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay z-10" />
                        <video
                            autoPlay
                            muted
                            loop
                            playsInline
                            key={about.hero.videoUrl}
                            className="w-full h-full object-cover opacity-60 scale-105"
                        >
                            <source src={about.hero.videoUrl} type="video/mp4" />
                        </video>
                    </motion.div>

                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-4 text-center">
                        <motion.div
                            style={{ y: y2 }}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="max-w-5xl"
                        >
                            <span className="text-primary text-sm md:text-base font-semibold tracking-[0.2em] uppercase mb-4 block">
                                {about.hero.subtitle}
                            </span>
                            <h1 className="text-5xl md:text-[100px] leading-[0.9] font-bold text-white tracking-tighter mb-8 drop-shadow-2xl">
                                {about.hero.title.split(' ').map((word, i) => (
                                    <span key={i} className={word.toLowerCase().includes('future') ? "text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-purple-400" : ""}>
                                        {word}{' '}
                                        {i === 1 && <br />}
                                    </span>
                                ))}
                            </h1>
                            <p className="text-lg md:text-xl text-zinc-300 max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
                                {about.hero.description}
                            </p>
                        </motion.div>
                    </div>

                    {/* Bottom Stats Bar */}
                    <div className="absolute bottom-0 left-0 right-0 z-30 bg-[#020617]/80 backdrop-blur-xl border-t border-white/10">
                        <div className="container mx-auto px-4">
                            <div className={`grid ${device === 'mobile' ? 'grid-cols-2' : 'grid-cols-4'} divide-x divide-white/10`}>
                                {about.stats.map((stat, i) => (
                                    <CountUp key={i} {...stat} />
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. MISSION & VISION */}
                <section className="bg-zinc-950 border-t border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
                    <div className="container mx-auto px-4 border-x border-white/10 relative z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2">
                            {/* Mission */}
                            <div className="p-12 md:p-24 border-b lg:border-b-0 lg:border-r border-white/10 bg-white/[0.02]">
                                <span className="text-primary text-sm font-semibold tracking-wider uppercase mb-6 block flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                    {about.mission.label}
                                </span>
                                <h2 className="text-3xl md:text-5xl font-medium text-white mb-8 leading-tight">
                                    {about.mission.quote}
                                </h2>
                                <p className="text-zinc-500 leading-relaxed text-lg">
                                    {about.mission.description}
                                </p>
                            </div>

                            {/* Vision Values */}
                            <div className="p-12 md:p-24">
                                <span className="text-emerald-500 text-sm font-semibold tracking-wider uppercase mb-6 block">Core Values</span>
                                <div className="space-y-12">
                                    {about.values.map((val, i) => {
                                        const Icon = iconMap[val.icon] || Target;
                                        return (
                                            <motion.div
                                                key={i}
                                                whileHover={{ x: 10 }}
                                                className="group cursor-default"
                                            >
                                                <h3 className="text-2xl font-medium text-white mb-3 flex items-center gap-3">
                                                    <Icon className={`h-6 w-6 text-primary group-hover:scale-125 transition-transform duration-300`} />
                                                    {val.title}
                                                </h3>
                                                <p className="text-zinc-500 leading-relaxed group-hover:text-zinc-300 transition-colors pl-9 border-l border-white/10 ml-3">
                                                    {val.description}
                                                </p>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. THE TIMELINE */}
                <section className="bg-black border-t border-white/10 relative">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay pointer-events-none" />
                    <div className="container px-4 mx-auto py-24 border-x border-white/10 relative z-10">
                        <div className="max-w-2xl mb-16">
                            <span className="text-primary text-sm font-semibold tracking-wider uppercase mb-4 block">
                                Our History
                            </span>
                            <h2 className="text-3xl md:text-5xl font-medium text-white leading-tight">
                                A decade of <span className="text-white/40">innovation</span>
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/10 border-t border-b border-white/10">
                            {about.timeline.map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    viewport={{ once: true }}
                                    className="group relative p-10 h-[350px] flex flex-col justify-between hover:bg-white/5 transition-colors duration-500"
                                >
                                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
                                    <div className="flex justify-between items-start">
                                        <span className="text-5xl font-light text-white/10 group-hover:text-white/30 transition-colors font-mono">
                                            {item.year}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-medium text-white mb-3 group-hover:text-primary transition-colors">{item.title}</h3>
                                        <p className="text-zinc-500 text-sm leading-relaxed group-hover:text-zinc-300 transition-colors">
                                            {item.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 4. LEADERSHIP */}
                <section className="py-24 bg-zinc-950 border-t border-white/10">
                    <Container>
                        <div className="text-center mb-16 max-w-2xl mx-auto">
                            <h2 className="text-3xl font-medium text-white mb-4">Leadership</h2>
                            <p className="text-zinc-500">The minds behind the machines.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {about.leadership.map((leader, i) => (
                                <div key={i} className="group p-8 rounded-[4px] bg-white/5 border border-white/5 hover:border-white/20 transition-all duration-300 relative overflow-hidden backdrop-blur-sm">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-purple-500/0 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />

                                    <div className="h-20 w-20 rounded-[4px] bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 border border-white/10 shadow-xl">
                                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-white/50">{leader.name.charAt(0)}</span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-white mb-1 relative z-10">{leader.name}</h3>
                                    <p className="text-primary text-xs font-semibold tracking-wider uppercase mb-4 relative z-10">{leader.role}</p>
                                    <p className="text-sm text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors relative z-10">
                                        {leader.bio}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </Container>
                </section>

                {/* 5. CTA */}
                <section className="py-32 bg-black border-t border-white/10 relative overflow-hidden text-center">
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent pointer-events-none" />
                    <Container className="relative z-10">
                        <h2 className="text-4xl md:text-7xl font-bold text-white mb-8 tracking-tighter">
                            Build with the best.
                        </h2>
                        <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
                            Ready to transform your operations with Vyantraa?
                        </p>
                        <Button size="lg" className="h-14 px-10 rounded-full bg-white text-black hover:bg-zinc-200 text-lg transition-transform hover:scale-105 active:scale-95" asChild>
                            <Link href="/contact">
                                Start the Conversation <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </Container>
                </section>

            </main>
            <Footer />
        </>
    );
}

