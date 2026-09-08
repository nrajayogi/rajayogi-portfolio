"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle2, Award, Briefcase, Users } from "lucide-react";


import { useContent } from "@/lib/content-context";
import { EditableText } from "@/components/admin/editable-text";

import { useRef } from "react";
import { useResponsive } from "@/hooks/use-responsive";

export function About() {
    const { content } = useContent();
    const { about } = content;
    const containerRef = useRef<HTMLElement>(null);
    const device = useResponsive(containerRef);

    if (!about || !about.hero) {
        return null; // Or a loading state/placeholder
    }

    return (
        <section id="about" ref={containerRef} className="bg-background border-t border-border relative overflow-hidden">
            <div className="container px-4 mx-auto border-x border-border p-0">
                <div className={`grid ${device === 'mobile' ? 'grid-cols-1' : 'grid-cols-2'} divide-y lg:divide-y-0 lg:divide-x divide-border border-b border-border`}>

                    {/* Left Panel: Content */}
                    <div className="p-10 md:p-20 flex flex-col justify-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[4px] bg-primary/10 text-primary text-sm font-medium mb-8 border border-primary/20 w-fit">
                            <Award size={16} />
                            <span className="uppercase tracking-wide text-xs">M.Sc. Interaction Tech · UTwente</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-medium mb-8 leading-tight text-foreground">
                            <EditableText path="about.hero.title" value={about.hero.title} />
                        </h2>
                        <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
                            <EditableText path="about.hero.description" value={about.hero.description} multiline />
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 mb-12">
                            {[
                                "Spatial Computing & Unity XR",
                                "Multimodal Voice & Gaze Systems",
                                "Empirical User Studies & NASA-TLX",
                                "Behavioral UX & Incentive Architecture",
                                "Design Systems & Component Scalability",
                                "Full-Stack Next.js & React 19"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <CheckCircle2 className="text-primary h-5 w-5 flex-shrink-0" />
                                    <span className="text-foreground font-medium text-sm">{item}</span>
                                </div>
                            ))}
                        </div>

                        <Button asChild size="lg" className="rounded-[4px] w-fit px-8 h-12 text-xs uppercase tracking-widest font-semibold">
                            <a href="#contact">Connect with Me</a>
                        </Button>
                    </div>

                    {/* Right Panel: Stats Grid - Mapping hardcoded stats to dynamic ones if possible */}
                    <div className="grid grid-rows-2 divide-y divide-border">
                        {/* Top Stats */}
                        <div className="grid grid-cols-2 divide-x divide-border">
                            <div className="p-10 md:p-16 flex flex-col justify-center items-center text-center group hover:bg-foreground/5 transition-colors">
                                <Briefcase className="text-primary mb-4 h-10 w-10 opacity-80 group-hover:opacity-100 transition-opacity" />
                                <h3 className="text-4xl md:text-5xl font-bold mb-2 text-foreground">
                                    <EditableText path="about.stats.1.value" value={about.stats[1]?.value || ""} />
                                </h3>
                                <p className="text-muted-foreground text-sm uppercase tracking-wider">
                                    <EditableText path="about.stats.1.label" value={about.stats[1]?.label || ""} />
                                </p>
                            </div>
                            <div className="p-10 md:p-16 flex flex-col justify-center items-center text-center group hover:bg-foreground/5 transition-colors">
                                <Award className="text-primary mb-4 h-10 w-10 opacity-80 group-hover:opacity-100 transition-opacity" />
                                <h3 className="text-4xl md:text-5xl font-bold mb-2 text-foreground">
                                    <EditableText path="about.stats.0.value" value={about.stats[0]?.value || ""} />
                                </h3>
                                <p className="text-muted-foreground text-sm uppercase tracking-wider">
                                    <EditableText path="about.stats.0.label" value={about.stats[0]?.label || ""} />
                                </p>
                            </div>
                        </div>

                        {/* Bottom Stats & Badge */}
                        <div className="grid grid-cols-2 divide-x divide-border">
                            <div className="p-10 md:p-16 flex flex-col justify-center items-center text-center group hover:bg-foreground/5 transition-colors">
                                <Users className="text-primary mb-4 h-10 w-10 opacity-80 group-hover:opacity-100 transition-opacity" />
                                <h3 className="text-4xl md:text-5xl font-bold mb-2 text-foreground">
                                    <EditableText path="about.stats.2.value" value={about.stats[2]?.value || ""} />
                                </h3>
                                <p className="text-muted-foreground text-sm uppercase tracking-wider">
                                    <EditableText path="about.stats.2.label" value={about.stats[2]?.label || ""} />
                                </p>
                            </div>
                            <div className="p-10 md:p-16 bg-primary flex flex-col justify-center items-center text-center relative overflow-hidden group">
                                <div className="relative z-10">
                                    <h3 className="text-3xl md:text-4xl font-bold mb-2 text-primary-foreground">Enschede</h3>
                                    <p className="text-primary-foreground/80 text-sm md:text-base uppercase tracking-wider">Netherlands (CET)</p>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}
