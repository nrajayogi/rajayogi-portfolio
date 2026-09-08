"use client";

import { motion } from "framer-motion";
import { Search, PenTool, Zap, RefreshCw } from "lucide-react";



import { useContent } from "@/lib/content-context";
import { EditableText } from "@/components/admin/editable-text";

import { useRef } from "react";
import { useResponsive } from "@/hooks/use-responsive";

export function Methodology() {
    const { content } = useContent();
    const { methodology } = content;
    const containerRef = useRef<HTMLDivElement>(null);
    const device = useResponsive(containerRef);

    if (!methodology) return null;

    return (
        <section id="methodology" className="bg-background border-t border-border relative overflow-hidden">
            {/* Section Header */}
            <div className="container px-4 mx-auto py-24 border-x border-border">
                <div className="max-w-2xl">
                    <span className="text-primary text-sm font-semibold tracking-wider uppercase mb-4 block">
                        <EditableText path="methodology.header.subtitle" value={methodology.header.subtitle} />
                    </span>
                    <h2 className="text-3xl md:text-5xl font-medium text-foreground leading-tight">
                        <EditableText path="methodology.header.titleLine1" value={methodology.header.titleLine1} /> <span className="text-foreground/40"><EditableText path="methodology.header.titleLine2" value={methodology.header.titleLine2} /></span>
                    </h2>
                </div>
            </div>

            {/* Connected Grid */}
            <div ref={containerRef} className="border-t border-border">
                <div className="container mx-auto px-4 border-l border-r border-border p-0">
                    <div className={`grid ${device === 'mobile' ? 'grid-cols-1' : device === 'tablet' ? 'grid-cols-2' : 'grid-cols-4'} divide-y md:divide-y-0 md:divide-x divide-border`}>
                        {methodology.steps.map((step, i) => {
                            const Icon = [Search, PenTool, Zap, RefreshCw][i % 4];
                            const color = ["text-blue-400", "text-purple-400", "text-amber-400", "text-emerald-400"][i % 4];

                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="relative p-10 md:p-12 group hover:bg-foreground/5 transition-all duration-500 flex flex-col h-[400px] justify-between"
                                >
                                    {/* Top Content */}
                                    <div className="relative z-10 flex justify-between items-start">
                                        <span className={`text-6xl font-light opacity-20 group-hover:opacity-40 transition-opacity ${color} font-sans`}>
                                            {step.id}
                                        </span>
                                        <div className={`p-3 rounded-[4px] bg-foreground/5 border border-border text-foreground opacity-50 group-hover:opacity-100 transition-opacity`}>
                                            <Icon size={24} />
                                        </div>
                                    </div>

                                    {/* Bottom Content */}
                                    <div className="relative z-10">
                                        <h3 className="text-2xl font-medium text-foreground mb-4">
                                            <EditableText path={`methodology.steps.${i}.title`} value={step.title} />
                                        </h3>
                                        <p className="text-muted-foreground text-sm leading-relaxed group-hover:text-foreground/80 transition-colors">
                                            <EditableText path={`methodology.steps.${i}.desc`} value={step.desc} multiline />
                                        </p>
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
