"use client";

import { useContent } from "@/lib/content-context";
import { EditableText } from "@/components/admin/editable-text";
import { motion } from "framer-motion";
import {
    Cpu, Globe, Zap, Activity,
    Gem, Component, Triangle, Command
} from "lucide-react";

import { useRef } from "react";
import { useResponsive } from "@/hooks/use-responsive";

export function Partners() {
    const containerRef = useRef<HTMLDivElement>(null);
    const device = useResponsive(containerRef);


    const { content } = useContent();
    const { partners } = content;

    if (!partners) return null;

    return (
        <section ref={containerRef} className="w-full bg-background border-t border-border py-0 overflow-hidden">
            <div className="container mx-auto">
                <div className={`grid ${device === 'mobile' ? 'grid-cols-1' : device === 'tablet' ? 'grid-cols-2' : 'grid-cols-4'} divide-y md:divide-y-0 md:divide-x divide-border border-b border-border`}>

                    {/* Header Cell */}
                    <div className="p-8 md:p-12 md:col-span-1 flex flex-col justify-center border-b border-border md:border-b-0">
                        <span className="text-sm tracking-widest uppercase text-muted-foreground mb-2">
                            <EditableText path="partners.header.label" value={partners.header.label} />
                        </span>
                        <h3 className="text-2xl font-light text-foreground">
                            <EditableText path="partners.header.title" value={partners.header.title} />
                        </h3>
                    </div>

                    {/* Logos Grid */}
                    <div className={`${device === 'mobile' ? 'col-span-1' : device === 'tablet' ? 'col-span-1' : 'md:col-span-3'} grid ${device === 'mobile' ? 'grid-cols-2' : 'grid-cols-4'} divide-x divide-y md:divide-y-0 divide-border`}>
                        {partners.logos.map((client, index) => {
                            // Fallback to hardcoded icons for now because we can't serialize components in JSON
                            // In a real app we'd map string names to icons
                            const Icon = [Cpu, Activity, Zap, Command, Globe, Component, Triangle, Gem][index % 8];

                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="relative flex items-center justify-center h-40 p-6 group hover:bg-foreground/5 transition-colors cursor-pointer overflow-hidden"
                                >
                                    {/* Text Label (Fades out on hover) */}
                                    <span className="absolute text-lg text-muted-foreground font-medium group-hover:opacity-0 transition-opacity duration-300 transform group-hover:scale-95">
                                        <EditableText path={`partners.logos.${index}.name`} value={client.name} />
                                    </span>

                                    {/* Logo Icon (Reveals on hover) */}
                                    <div className="absolute opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-50 group-hover:scale-100 flex flex-col items-center gap-2">
                                        <Icon className="w-8 h-8 text-foreground" strokeWidth={1.5} />
                                        <span className="text-sm text-foreground/70 tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity delay-100 duration-300">
                                            <EditableText path={`partners.logos.${index}.name`} value={client.name} />
                                        </span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
