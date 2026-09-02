"use client";

import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import { useResponsive } from "@/hooks/use-responsive";
import { useContent } from "@/lib/content-context";

export default function ContactPage() {
    const containerRef = useRef<HTMLElement>(null);
    const device = useResponsive(containerRef);
    const { content } = useContent();
    const contact = content.contact;

    // Parallax Effects
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 150]);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        alert("Transmission sent. We will initiate contact shortly.");
    }

    if (!contact) return null;

    return (
        <>
            <main ref={containerRef} className="min-h-screen bg-black text-white overflow-hidden">

                {/* 1. CINEMATIC HERO */}
                <section className="relative w-full h-[85vh] md:h-screen overflow-hidden bg-[#111]">
                    <motion.div style={{ y: y1 }} className="absolute inset-0 z-0 h-[120%]">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/60 via-black/70 to-purple-950/60 z-10" />
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay z-10" />
                        <video
                            autoPlay
                            muted
                            loop
                            playsInline
                            key={contact.hero.videoUrl}
                            className="w-full h-full object-cover opacity-60 scale-105"
                        >
                            <source src={contact.hero.videoUrl} type="video/mp4" />
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
                                {contact.hero.subtitle}
                            </span>
                            <h1 className="text-5xl md:text-[100px] leading-[0.9] font-bold text-white tracking-tighter mb-8">
                                {contact.hero.title.split(' ').map((word, i) => (
                                    <span key={i} className={word.toLowerCase().includes('scale') ? "text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-purple-400" : ""}>
                                        {word}{' '}
                                        {i === 1 && <br />}
                                    </span>
                                ))}
                            </h1>
                            <p className="text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto leading-relaxed">
                                {contact.hero.description}
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* 2. CONTACT FORM SECTION */}
                <section className="bg-black border-t border-white/10 relative overflow-hidden">
                    <div className="container px-4 mx-auto border-x border-white/10 p-0">
                        <div className={`grid ${device === 'mobile' ? 'grid-cols-1' : 'grid-cols-2'} divide-y lg:divide-y-0 lg:divide-x divide-white/10 border-b border-white/10`}>

                            {/* Left Panel: Locations & Info */}
                            <div className="p-10 md:p-20 flex flex-col justify-between min-h-[600px] relative group">
                                <div className="relative z-10">
                                    <span className="text-primary text-sm font-semibold tracking-wider uppercase mb-3 block">
                                        {contact.info.subtitle}
                                    </span>
                                    <h2 className="text-4xl md:text-5xl font-medium text-white mb-6 leading-tight">
                                        {contact.info.title.split('.').map((part, i) => (
                                            <span key={i}>
                                                {part}{i < 1 ? '.' : ''}
                                                {i === 0 && <br />}
                                            </span>
                                        ))}
                                    </h2>
                                    <p className="text-zinc-500 text-lg max-w-md">
                                        {contact.info.description}
                                    </p>
                                </div>

                                <div className="relative z-10 space-y-8 mt-12">
                                    {contact.locations.map((loc, i) => (
                                        <div key={i} className="flex items-start gap-4 group/item">
                                            <div className="mt-1 flex-shrink-0 w-10 h-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-xl group-hover/item:bg-white/10 transition-colors select-none">
                                                {loc.flag}
                                            </div>
                                            <div>
                                                <h3 className="text-white text-lg font-medium mb-1">{loc.title}</h3>
                                                <p className="text-zinc-500 text-sm whitespace-pre-line leading-relaxed">{loc.address}</p>
                                                <div className="flex gap-4 mt-2">
                                                    <a href={`tel:${loc.phone}`} className="text-xs text-zinc-400 hover:text-white transition-colors">{loc.phone}</a>
                                                    <a href={`mailto:${loc.email}`} className="text-xs text-zinc-400 hover:text-white transition-colors">{loc.email}</a>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Subtle Map Background */}
                                <div className="absolute inset-0 opacity-20 grayscale pointer-events-none mix-blend-overlay"
                                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')", backgroundSize: "cover", backgroundPosition: "center" }}
                                />
                            </div>

                            {/* Right Panel: Form */}
                            <div className="bg-zinc-950 relative">
                                <form className="h-full flex flex-col" onSubmit={handleSubmit}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10 border-b border-white/10">
                                        <div className="p-0">
                                            <input
                                                name="firstName"
                                                required
                                                type="text"
                                                className="w-full bg-transparent p-8 md:p-10 text-white placeholder-zinc-600 focus:bg-white/5 outline-none transition-colors border-none"
                                                placeholder="First Name"
                                            />
                                        </div>
                                        <div className="p-0">
                                            <input
                                                name="lastName"
                                                required
                                                type="text"
                                                className="w-full bg-transparent p-8 md:p-10 text-white placeholder-zinc-600 focus:bg-white/5 outline-none transition-colors border-none"
                                                placeholder="Last Name"
                                            />
                                        </div>
                                    </div>

                                    <div className="border-b border-white/10">
                                        <input
                                            name="email"
                                            required
                                            type="email"
                                            className="w-full bg-transparent p-8 md:p-10 text-white placeholder-zinc-600 focus:bg-white/5 outline-none transition-colors border-none"
                                            placeholder="Work Email"
                                        />
                                    </div>

                                    <div className="flex-grow border-b border-white/10">
                                        <textarea
                                            name="message"
                                            required
                                            className="w-full h-full min-h-[200px] bg-transparent p-8 md:p-10 text-white placeholder-zinc-600 focus:bg-white/5 outline-none transition-colors border-none resize-none"
                                            placeholder="Tell us about your project..."
                                        />
                                    </div>

                                    <div className="p-0">
                                        <Button type="submit" size="lg" className="w-full h-20 md:h-24 text-lg bg-primary hover:bg-primary/90 text-primary-foreground rounded-none border-none flex items-center justify-center gap-2 group">
                                            Send Message <ArrowUpRight className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        </Button>
                                    </div>
                                </form>
                            </div>

                        </div>
                    </div>
                </section>

            </main>
            <Footer />
        </>
    );
}

