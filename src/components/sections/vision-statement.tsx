"use client";

import { motion } from "framer-motion";
import { ArrowDownRight } from "lucide-react";

import { useContent } from "@/lib/content-context";
import { EditableText } from "@/components/admin/editable-text";

import { useRef } from "react";
import { useResponsive } from "@/hooks/use-responsive";

export function VisionStatement() {
    const containerRef = useRef<HTMLElement>(null);
    const device = useResponsive(containerRef);
    const { content } = useContent();
    const { vision } = content;

    return (
        <section ref={containerRef} className="relative w-full bg-background py-32 md:py-48 flex items-center justify-center overflow-hidden border-t border-border">
            <div className="container px-4 md:px-6 mx-auto relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col gap-6">
                        {/* Line 1 */}
                        <motion.h2
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className={`${device === 'mobile' ? 'text-4xl' : device === 'tablet' ? 'text-6xl' : 'text-8xl'} font-medium tracking-tight text-foreground leading-none`}
                        >
                            <EditableText path="vision.text.line1" value={vision.text.line1} /> <span className="text-foreground/40"><EditableText path="vision.text.highlight" value={vision.text.highlight} /></span>
                        </motion.h2>

                        {/* Line 2 - Forced new line visually */}
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                            className="flex items-center gap-4 md:gap-8"
                        >
                            <div className="hidden md:flex items-center justify-center w-16 h-16 rounded-full border border-border text-primary shrink-0">
                                <ArrowDownRight className="w-8 h-8" />
                            </div>
                            <h2 className={`${device === 'mobile' ? 'text-4xl' : device === 'tablet' ? 'text-6xl' : 'text-8xl'} font-medium tracking-tight text-foreground leading-none`}>
                                <EditableText path="vision.text.line2" value={vision.text.line2} />
                            </h2>
                        </motion.div>
                    </div>
                </div>
            </div>

            <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.03] opacity-[0.05]"

                style={{
                    backgroundImage: "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                    color: "var(--foreground)"
                }}
            />
        </section>
    );
}
