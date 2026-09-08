"use client";

import { motion } from "framer-motion";
import { Clock, BarChart, GraduationCap } from "lucide-react";
import { useContent } from "@/lib/content-context";
import { EditableText } from "@/components/admin/editable-text";
import { useRef } from "react";
import { useResponsive } from "@/hooks/use-responsive";

export function Training() {
    const { content } = useContent();
    const { training } = content as any;
    const containerRef = useRef<HTMLElement>(null);
    const device = useResponsive(containerRef);

    if (!training || !training.hero) return null;

    return (
        <section ref={containerRef} className="bg-background border-t border-border relative overflow-hidden">
            {/* Hero Panel */}
            <div className="container px-4 mx-auto border-x border-border p-0">
                <div className={`grid ${device === 'mobile' ? 'grid-cols-1' : 'grid-cols-2'} divide-y lg:divide-y-0 lg:divide-x divide-border border-b border-border`}>
                    <div className="p-10 md:p-20 flex flex-col justify-center min-h-[500px]">
                        <span className="text-primary text-sm font-semibold tracking-wider uppercase mb-4 block">
                            <EditableText path="training.hero.subtitle" value={training.hero.subtitle} />
                        </span>
                        <h2 className="text-4xl md:text-6xl font-medium text-foreground mb-8 leading-tight">
                            <EditableText path="training.hero.title" value={training.hero.title} />
                        </h2>
                        <p className="text-muted-foreground text-lg mb-10 leading-relaxed max-w-xl">
                            <EditableText path="training.hero.description" value={training.hero.description} multiline />
                        </p>
                    </div>

                    <div className="relative h-full min-h-[400px] bg-slate-900 overflow-hidden">
                        {training.hero.videoUrl ? (
                            <video
                                key={training.hero.videoUrl}
                                autoPlay
                                muted
                                loop
                                playsInline
                                className="absolute inset-0 w-full h-full object-cover opacity-60"
                            >
                                <source src={training.hero.videoUrl} type="video/mp4" />
                            </video>
                        ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-r from-background to-transparent hidden lg:block" />
                    </div>
                </div>

                {/* Courses Grid */}
                <div className={`grid ${device === 'mobile' ? 'grid-cols-1' : device === 'tablet' ? 'grid-cols-2' : 'grid-cols-3'} divide-y md:divide-y-0 md:divide-x divide-border border-b border-border`}>
                    {(training.courses || []).map((course: any, index: number) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="p-10 md:p-12 group hover:bg-foreground/5 transition-all"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 rounded-[4px] bg-primary/10 text-primary">
                                    <GraduationCap size={24} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Course {index + 1}</span>
                                    <span className="text-xs font-medium text-foreground/60">{course.level}</span>
                                </div>
                            </div>

                            <h3 className="text-2xl font-medium mb-4 text-foreground">
                                <EditableText path={`training.courses.${index}.title`} value={course.title} />
                            </h3>
                            <p className="text-muted-foreground text-sm leading-relaxed mb-8">
                                <EditableText path={`training.courses.${index}.description`} value={course.description} multiline />
                            </p>

                            <div className="flex items-center gap-6 mt-auto py-4 border-t border-border/50">
                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                    <Clock size={14} />
                                    <span>{course.duration}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                    <BarChart size={14} />
                                    <span>{course.level}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
