"use client";

import { motion } from "framer-motion";
import { Settings, Users, Globe, BarChart3, Database, ShieldCheck } from "lucide-react";



import { useContent } from "@/lib/content-context";
import { EditableText } from "@/components/admin/editable-text";

import { useRef } from "react";
import { useResponsive } from "@/hooks/use-responsive";

export function Services() {
    const { content } = useContent();
    const { services } = content;
    const containerRef = useRef<HTMLElement>(null);
    const device = useResponsive(containerRef);

    if (!services || !services.header || !services.items) {
        return null; // Handle missing data gracefully
    }

    return (
        <section id="research" ref={containerRef} className="bg-background border-t border-border relative overflow-hidden">
            {/* Connected Grid Layout */}
            <div className="container mx-auto px-4 border-l border-r border-border p-0">
                <div className={`grid ${device === 'mobile' ? 'grid-cols-1' : device === 'tablet' ? 'grid-cols-2' : 'grid-cols-3'} divide-y divide-border border-b border-border`}>

                    {/* Header Cell (Occupies first slot) */}
                    <div className="p-10 md:p-12 col-span-1 flex flex-col justify-center border-b border-border md:border-b-0 md:border-r border-border">
                        <span className="text-primary text-sm font-semibold tracking-wider uppercase mb-3 block">
                            <EditableText path="services.header.subtitle" value={services.header.subtitle} />
                        </span>
                        <h2 className="text-3xl md:text-5xl font-medium text-foreground mb-6">
                            <EditableText path="services.header.title" value={services.header.title} />
                        </h2>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            <EditableText path="services.header.description" value={services.header.description} multiline />
                        </p>
                        <div className="w-12 h-1 bg-primary mt-8 rounded-full" />
                    </div>

                    {/* Services Grid Cells */}
                    {/* Services Grid Cells */}
                    {services.items.map((service, index) => {
                        const Icon = [Settings, Users, Globe, BarChart3, Database, ShieldCheck][index % 6];
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                className={`p-10 md:p-12 relative group hover:bg-foreground/5 transition-all duration-300 md:border-r border-border last:border-r-0 ${index === 1 || index === 4 ? 'lg:border-r' : ''}`}
                            >
                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:text-primary group-hover:bg-primary/20 transition-all">
                                    <Icon size={24} strokeWidth={1.5} />
                                </div>
                                <h3 className="text-xl font-medium mb-3 text-foreground">
                                    <EditableText path={`services.items.${index}.title`} value={service.title} />
                                </h3>
                                <p className="text-muted-foreground leading-relaxed text-sm group-hover:text-foreground/80 transition-colors">
                                    <EditableText path={`services.items.${index}.description`} value={service.description} multiline />
                                </p>
                            </motion.div>
                        );
                    })}

                </div>
            </div>
        </section>
    )
}
