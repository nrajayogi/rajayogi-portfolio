"use client";

import { Container } from "@/components/ui/container";
import { Footer } from "@/components/layout/footer";
// Removed Accordion imports as we are using custom implementation
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, ArrowUpRight, Plus, Minus } from "lucide-react";
import Link from "next/link";
import { Service, services } from "@/data/services";
import { useState, useRef, useEffect } from "react";
import { useResponsive } from "@/hooks/use-responsive";
import * as Icons from "lucide-react";

// Helper Component for FAQ Item to handle open/close state logic cleanly
function ServiceFAQItem({ faq, index }: { faq: { question: string; answer: string }, index: number }) {
    const [isOpen, setIsOpen] = useState(index === 0); // Default first open? Or closed. Let's default closed or match others. Pitch deck had first open.

    return (
        <div className="border-b border-white/10 pb-4 last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center py-4 text-left group"
            >
                <span className={`text-lg transition-colors ${isOpen ? 'text-primary' : 'text-white group-hover:text-primary'}`}>
                    {faq.question}
                </span>
                <span className="p-2 rounded-full border border-white/10 group-hover:border-primary/50 transition-colors">
                    {isOpen ? (
                        <Minus className="w-4 h-4 text-primary" />
                    ) : (
                        <Plus className="w-4 h-4 text-zinc-500 group-hover:text-primary" />
                    )}
                </span>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <p className="pb-6 text-zinc-400 leading-relaxed pr-8">
                            {faq.answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

interface ServicePageTemplateProps {
    service: Service;
}

export function ServicePageTemplate({ service }: ServicePageTemplateProps) {
    // Dynamic Icon
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const IconComponent = (Icons as any)[service.iconName] || Icons.HelpCircle;

    // Helper to get related services content
    // Added fallback || [] to prevent crash if relatedServices is undefined
    const relatedServicesHelper = (service.relatedServices?.map(slug =>
        services.find(s => s.slug === slug)
    ).filter(Boolean) as Service[]) || [];

    // Responsive Logic for Hero (copied from Hero.tsx context)
    const containerRef = useRef<HTMLElement>(null);
    const device = useResponsive(containerRef);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    // Bottom Stats (Generic placeholder logic to match Hero visual)
    const stats = [
        { label: "Impact", sub: "Global Scale" },
        { label: "Clients", sub: "Fortune 500" },
        { label: "Speed", sub: "Accelerated" },
        { label: "Result", sub: "Verified" }
    ];

    return (
        <>
            <main className="min-h-screen bg-black text-white">
                {/* 
                   1. EXACT HERO REPLICA 
                   Background Video + Blur + Noise + Bottom Stats Bar 
                */}
                <section ref={containerRef} className={`relative w-full ${mounted ? 'h-screen' : 'h-[85vh]'} md:h-screen overflow-hidden bg-[#111]`}>
                    {/* Video Layer */}
                    <div className="absolute inset-0 w-full h-full z-0">
                        {/* Placeholder or specific video if available. Using a generic abstract tech one for now or falling back to gradient if no video. */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-black to-purple-900/40" />
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
                    </div>

                    {/* Content Overlay */}
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-4 text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1.0 }}
                            className={`max-w-4xl ${mounted ? 'opacity-100' : 'opacity-0'}`}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md">
                                <IconComponent className="h-4 w-4 text-primary" />
                                <span className="text-xs font-medium tracking-widest uppercase text-white/70">Vyantraa Services</span>
                            </div>
                            <h1 className="text-5xl md:text-8xl font-bold text-white mb-6 tracking-tight leading-none">
                                {service.title}
                            </h1>
                            <p className="text-lg md:text-2xl text-white/60 font-light max-w-2xl mx-auto leading-relaxed">
                                {service.shortDescription}
                            </p>
                        </motion.div>
                    </div>

                    {/* Bottom Stats Bar (Exact Match) */}
                    <div className="absolute bottom-0 left-0 right-0 z-30 bg-[#020617]/80 backdrop-blur-xl border-t border-white/10">
                        <div className="container mx-auto px-4">
                            <div className={`grid ${device === 'mobile' ? 'grid-cols-2' : 'grid-cols-4'} divide-x divide-white/10`}>
                                {stats.map((stat, i) => (
                                    <div key={i} className="py-6 md:py-8 text-center group hover:bg-white/5 transition-colors cursor-default border-white/10">
                                        <h3 className="text-white font-semibold tracking-widest text-xs md:text-sm mb-1">{stat.label}</h3>
                                        <p className="text-blue-400 text-[10px] md:text-xs font-medium tracking-wide uppercase">{stat.sub}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* 
                   2. PROCESS (METHODOLOGY EXACT MATCH)
                   Grid layout with large numbers and hover effects
                */}
                {/* 
                   2. PROCESS (METHODOLOGY EXACT MATCH)
                   Visualize timelines/steps like ServiceDeliveryModel
                */}
                <section className="bg-background border-t border-white/10 py-32 md:py-40">
                    <div className="container px-4 mx-auto">
                        <div className="mb-20">
                            <span className="text-primary text-sm font-semibold tracking-wider uppercase mb-4 block">
                                Our Approach
                            </span>
                            <h2 className="text-4xl md:text-5xl font-medium text-white tracking-tight">
                                How we deliver <span className="text-white/40">{service.title}</span>.
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                            {/* Connecting Line (Desktop) */}
                            <div className="hidden lg:block absolute top-[2.5rem] left-0 right-0 h-px bg-white/10 z-0" />

                            {service.process?.map((step, i) => (
                                <div key={i} className="relative z-10 bg-background pt-4 md:pt-0">
                                    <div className="w-20 h-20 bg-background border border-white/10 rounded-2xl flex items-center justify-center mb-8 relative group hover:border-primary transition-colors">
                                        <span className="text-2xl font-light text-white/50 group-hover:text-primary transition-colors">
                                            0{i + 1}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-semibold text-white mb-4">
                                        {step.title}
                                    </h3>
                                    <p className="text-zinc-400 leading-relaxed text-sm">
                                        {step.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 
                   3. CHALLENGE VS SOLUTION (Split Layout)
                */}
                <section className="bg-[#050505] border-t border-white/10">
                    <div className="container mx-auto px-4 border-x border-white/10">
                        <div className="grid grid-cols-1 lg:grid-cols-2">
                            {/* Challenges */}
                            <div className="p-12 md:p-20 border-b lg:border-b-0 lg:border-r border-white/10">
                                <h3 className="text-2xl font-light text-white mb-12 flex items-center gap-3">
                                    <span className="w-2 h-2 rounded-full bg-red-500" />
                                    The Challenge
                                </h3>
                                <div className="space-y-8">
                                    {service.challenges?.map((challenge, i) => (
                                        <div key={i} className="flex gap-4">
                                            <div className="w-6 h-6 rounded-full border border-white/10 flex items-center justify-center text-white/30 text-xs mt-1 shrink-0">
                                                {i + 1}
                                            </div>
                                            <p className="text-zinc-400 leading-relaxed">{challenge}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Solutions */}
                            <div className="p-12 md:p-20 bg-white/[0.02]">
                                <h3 className="text-2xl font-light text-white mb-12 flex items-center gap-3">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                    The Solution
                                </h3>
                                <div className="space-y-6">
                                    {service.solutions?.map((solution, i) => (
                                        <div key={i} className="flex items-start gap-4 p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                                            <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                                            <p className="text-emerald-100/80 leading-relaxed">{solution}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 
                   4. VALUE PROPOSITION (ROI) SECTION (NEW)
                   Moved here to balance layout if needed or kept above. 
                   Actually, based on previous file, it was before Process. 
                   I will keep it consistent with the previous successful write or the one I intend.
                   The user said "fix this", not "rearrange".
                   In step 564 (write), Value Prop was #2. 
                   In step 573 (write), Value Prop was #2.
                   Wait, Step 573 write_to_file had:
                   1. Hero
                   2. Value Prop (ROI)
                   3. Process
                   4. Challenge vs Solution
                   ...
                   But the file content I saw in Step 573 (view_file) had:
                   1. Hero
                   2. Process
                   3. Challenge
                   4. Tech Stack
                   ...
                   It seems my Step 564 write might have failed or been overwritten?
                   Step 573 view_file showed lines 91-122 as Process.
                   Step 574 write_to_file had:
                   1. Hero
                   2. Value Props
                   3. Process
                   ...
                   
                   If the user says "still the same", and I see the runtime error in line 280, 
                   it means the file IS using the version with `relatedServicesHelper` (which was at the end).
                   
                   I will produce the file EXACTLY as Step 574 intended but with the fix.
                   
                */}
                {/* 
                   4. VALUE PROPOSITION (ROI) SECTION (Split Layout like Pitch Deck)
                */}
                {service.valueProps && service.valueProps.length > 0 && (
                    <section className="bg-background border-b border-white/10 relative overflow-hidden py-32 md:py-40">
                        {/* Background Mesh */}
                        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />

                        <div className="container mx-auto px-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
                                {/* Left: Headlines & Impact */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6 }}
                                >
                                    <h2 className="text-4xl md:text-6xl font-medium tracking-tight text-white leading-none mb-8">
                                        Measurable <br />
                                        <span className="text-primary">Impact.</span>
                                    </h2>
                                    <p className="text-xl text-zinc-400 leading-relaxed max-w-lg mb-12">
                                        We engineer business outcomes. Here is the value we drive with {service.title}.
                                    </p>

                                    <div className="space-y-8">
                                        {service.outcomes?.slice(0, 3).map((outcome, i) => (
                                            <div key={i} className="flex flex-col">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                    <span className="text-2xl md:text-3xl font-bold text-white tracking-tight">{outcome}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>

                                {/* Right: Value Cards */}
                                <div className="space-y-6 md:pt-12">
                                    {service.valueProps.map((prop, i) => {
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        const Icon = (Icons as any)[prop.iconName] || Icons.Star;
                                        return (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, y: 20 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                                className="p-8 border border-white/10 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors"
                                            >
                                                <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                                                        <Icon className="h-4 w-4" />
                                                    </div>
                                                    {prop.title}
                                                </h3>
                                                <p className="text-zinc-400 leading-relaxed">
                                                    {prop.description}
                                                </p>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* 
                   5. TECH STACK (Partners Grid Style)
                */}
                {service.techStack && service.techStack.length > 0 && (
                    <section className="border-t border-white/10 bg-black">
                        <div className="container mx-auto px-4 border-x border-white/10">
                            <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/10 border-b border-white/10">
                                <div className="p-10 flex items-center justify-center md:justify-start">
                                    <span className="text-sm tracking-widest uppercase text-white/40">Powered By</span>
                                </div>
                                <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
                                    {service.techStack.map((tech, i) => (
                                        <div key={i} className="h-32 flex items-center justify-center p-6 grayscale hover:grayscale-0 transition-all duration-500 cursor-default hover:bg-white/5">
                                            <span className="text-lg font-medium text-white/60">{tech}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* 
                   6. FAQ SECTION (Accordion)
                */}
                {/* 
                   6. FAQ SECTION (Standardized Pitch Deck Style)
                */}
                {service.faqs && service.faqs.length > 0 && (
                    <section className="py-32 bg-background border-t border-white/10">
                        <Container>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                                <div className="lg:col-span-1">
                                    <h2 className="text-3xl md:text-4xl font-medium text-white tracking-tight mb-6">
                                        Common Questions.
                                    </h2>
                                    <p className="text-zinc-500 leading-relaxed mb-8">
                                        Everything you need to know about our {service.title} services.
                                    </p>
                                    <Button asChild variant="outline" className="border-white/10 text-white hover:bg-white/10">
                                        <Link href="/contact">Ask something else</Link>
                                    </Button>
                                </div>

                                <div className="lg:col-span-2 space-y-4">
                                    {service.faqs.map((faq, i) => (
                                        <ServiceFAQItem key={i} faq={faq} index={i} />
                                    ))}
                                </div>
                            </div>
                        </Container>
                    </section>
                )}

                {/* 
                   7. RELATED SERVICES (NEW)
                */}
                {relatedServicesHelper.length > 0 && (
                    <section className="py-24 bg-black border-t border-white/10">
                        <Container>
                            <h2 className="text-2xl font-light text-white mb-12">Related Services</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {relatedServicesHelper.map((related, i) => {
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    const RelatedIcon = (Icons as any)[related.iconName] || Icons.HelpCircle;
                                    return (
                                        <Link key={i} href={`/services/${related.slug}`} className="group block p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-white/10 transition-all duration-300">
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center text-white group-hover:text-primary transition-colors">
                                                    <RelatedIcon className="h-5 w-5" />
                                                </div>
                                                <ArrowUpRight className="h-5 w-5 text-white/20 group-hover:text-white transition-colors" />
                                            </div>
                                            <h3 className="text-xl font-semibold text-white mb-2">{related.title}</h3>
                                            <p className="text-sm text-zinc-500 line-clamp-2">{related.shortDescription}</p>
                                        </Link>
                                    )
                                })}
                            </div>
                        </Container>
                    </section>
                )}


                {/* 
                   8. CTA
                */}
                <section className="py-32 bg-black border-t border-white/10 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/10 to-transparent pointer-events-none" />
                    <Container className="relative z-10 text-center">
                        <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight">
                            Ready to transform?
                        </h2>
                        <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
                            Join industry leaders who trust Vyantraa for their critical engineering systems.
                        </p>
                        <Button size="lg" className="h-14 px-8 rounded-full bg-white text-black hover:bg-zinc-200" asChild>
                            <Link href="/contact">
                                Get Started Now <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </Container>
                </section>
            </main>
            <Footer />
        </>
    );
}
