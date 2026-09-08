"use client";

import Link from "next/link";
import { useRef } from "react";
import { useContent } from "@/lib/content-context";
import { useResponsive } from "@/hooks/use-responsive";
import { Linkedin, Instagram, ArrowUpRight, ArrowUp } from "lucide-react";

export function Footer() {
    const containerRef = useRef<HTMLElement>(null);
    const device = useResponsive(containerRef);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <footer ref={containerRef} className="bg-background text-foreground border-t border-border font-sans tracking-tight">
            <div className={`flex ${device === 'mobile' || device === 'tablet' ? 'flex-col' : 'flex-row'} min-h-[480px]`}>

                {/* Left Column: Brand & Bio */}
                <div className={`w-full ${device === 'desktop' ? 'lg:w-[40%]' : ''} border-r border-border p-8 md:p-12 flex flex-col justify-between relative group hover:bg-foreground/[0.02] transition-colors duration-500`}>
                    <div>
                        <Link href="/" className="block mb-6">
                            <span className="text-2xl font-bold tracking-tight uppercase text-foreground">Rajayogi Nandina</span>
                            <span className="block text-xs font-sans uppercase tracking-widest text-primary mt-1">Product Designer & XR Researcher</span>
                        </Link>
                        <p className="text-lg md:text-xl font-light leading-relaxed max-w-sm text-muted-foreground">
                            Completing M.Sc. Interaction Technology at University of Twente. Designing multimodal XR, ergonomic robotics, and high-density digital systems.
                        </p>
                    </div>

                    <div className="mt-12">
                        <div className="flex flex-col gap-2">
                            <span className="text-xs uppercase tracking-widest text-muted-foreground font-sans">Connect</span>
                            <div className="flex gap-4 mt-2">
                                <a
                                    href="https://linkedin.com/in/rajayogi-nandina"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-2.5 rounded-[4px] border border-border bg-foreground/5 hover:bg-primary hover:text-white transition-all"
                                    aria-label="LinkedIn"
                                >
                                    <Linkedin size={18} strokeWidth={1.5} />
                                </a>
                                <a
                                    href="https://instagram.com/rajayogi_nandina"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-2.5 rounded-[4px] border border-border bg-foreground/5 hover:bg-primary hover:text-white transition-all"
                                    aria-label="Instagram"
                                >
                                    <Instagram size={18} strokeWidth={1.5} />
                                </a>
                                <a
                                    href="https://www.figma.com/design/ojbXGMlyGZzwofQsCp651d/Portfolio?m=auto&t=nVbnyyDjAJzu5tzD-6"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-2.5 rounded-[4px] border border-border bg-foreground/5 hover:bg-primary hover:text-white transition-all flex items-center gap-1.5 text-xs font-sans"
                                    aria-label="Figma Portfolio"
                                >
                                    <span>Figma</span>
                                    <ArrowUpRight size={14} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Center Column: Quick Navigation */}
                <div className={`w-full ${device === 'desktop' ? 'lg:w-[30%]' : ''} border-r border-border p-8 md:p-12 flex flex-col justify-between hover:bg-foreground/[0.02] transition-colors duration-500`}>
                    <div className="space-y-4">
                        <span className="text-xs uppercase tracking-widest text-muted-foreground font-sans">Index</span>
                        <ul className="space-y-3">
                            {[
                                { name: "Selected Works", href: "#work" },
                                { name: "Vision Manifesto", href: "#vision" },
                                { name: "Research & Capabilities", href: "#research" },
                                { name: "Academic Journey", href: "#about" },
                                { name: "Get in Touch", href: "#contact" }
                            ].map((item) => (
                                <li key={item.name}>
                                    <a href={item.href} className="text-lg md:text-xl font-light text-foreground/80 hover:text-primary transition-colors flex items-center justify-between group">
                                        <span>{item.name}</span>
                                        <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="mt-8 pt-4 border-t border-border">
                        <p className="text-xs text-muted-foreground font-sans">
                            Timezone: Enschede, NL (CET · UTC+1)
                        </p>
                    </div>
                </div>

                {/* Right Column: Contact CTA Box */}
                <div className={`w-full ${device === 'desktop' ? 'lg:w-[30%]' : ''} flex flex-col justify-between p-8 md:p-12 bg-card relative overflow-hidden group`}>
                    <div>
                        <span className="text-xs uppercase tracking-widest text-primary font-sans">Opportunity</span>
                        <h3 className="text-2xl sm:text-3xl font-medium text-foreground mt-3 leading-snug">
                            Open to selective design & XR research roles.
                        </h3>
                        <p className="text-muted-foreground text-sm mt-3 leading-relaxed">
                            Interested in spatial computing, multimodal systems, or industrial collaboration?
                        </p>
                    </div>

                    <div className="mt-8">
                        <a
                            href="mailto:rajayogi2000@gmail.com"
                            className="inline-flex items-center justify-between w-full p-4 rounded-[4px] bg-primary text-primary-foreground font-semibold text-xs uppercase tracking-widest hover:opacity-90 transition-opacity"
                        >
                            <span>rajayogi2000@gmail.com</span>
                            <ArrowUpRight className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            </div>

            {/* Bottom Legal & Back to Top Bar */}
            <div className="border-t border-border px-8 md:px-12 py-6 flex flex-col md:flex-row justify-between items-center text-[11px] uppercase tracking-widest text-muted-foreground font-sans gap-3 md:gap-0">
                <p>© 2026 Rajayogi Nandina. Crafted with precision.</p>
                <div className="flex items-center gap-6">
                    <Link 
                        href="/admin" 
                        className="flex items-center gap-1 text-muted-foreground/60 hover:text-primary transition-colors"
                        title="Open Visitor Tracker & Admin Portal"
                    >
                        <span>Admin Tracker</span>
                        <ArrowUpRight className="w-3 h-3" />
                    </Link>
                    <button
                        onClick={scrollToTop}
                        className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer"
                    >
                        <span>Back to Top</span>
                        <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </footer>
    );
}
