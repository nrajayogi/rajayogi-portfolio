"use client";

import { Briefcase, MapPin, Clock, Zap, Heart, Globe, GraduationCap, Coffee, Cpu } from "lucide-react";
import { useContent } from "@/lib/content-context";
import { EditableText } from "@/components/admin/editable-text";
import { useRef } from "react";
import { useResponsive } from "@/hooks/use-responsive";

export function Careers() {
    const { content } = useContent();
    const { careers } = content as any;
    const containerRef = useRef<HTMLElement>(null);
    const device = useResponsive(containerRef);

    if (!careers) return null;

    const BenefitIconMap: Record<string, any> = {
        Heart, Globe, Zap, GraduationCap, Cpu, Coffee
    };

    return (
        <section ref={containerRef} className="bg-background border-t border-border relative overflow-hidden">
            {/* Hero Panel */}
            <div className="container px-4 mx-auto border-x border-border p-0">
                <div className={`grid ${device === 'mobile' ? 'grid-cols-1' : 'grid-cols-2'} divide-y lg:divide-y-0 lg:divide-x divide-border border-b border-border`}>
                    <div className="p-10 md:p-20 flex flex-col justify-center min-h-[500px]">
                        <span className="text-primary text-sm font-semibold tracking-wider uppercase mb-4 block">
                            <EditableText path="careers.hero.subtitle" value={careers.hero.subtitle || ""} />
                        </span>
                        <h2 className="text-4xl md:text-6xl font-medium text-foreground mb-8 leading-tight">
                            <EditableText path="careers.hero.title" value={careers.hero.title || ""} />
                        </h2>
                        <p className="text-muted-foreground text-lg mb-10 leading-relaxed max-w-xl">
                            <EditableText path="careers.hero.description" value={careers.hero.description || ""} multiline />
                        </p>
                    </div>

                    <div className="relative h-full min-h-[400px] bg-slate-900 overflow-hidden">
                        {careers.hero.videoUrl ? (
                            <video
                                key={careers.hero.videoUrl}
                                autoPlay
                                muted
                                loop
                                playsInline
                                className="absolute inset-0 w-full h-full object-cover opacity-60"
                            >
                                <source src={careers.hero.videoUrl} type="video/mp4" />
                            </video>
                        ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-r from-background to-transparent hidden lg:block" />
                    </div>
                </div>

                {/* Culture Section */}
                <div className={`grid ${device === 'mobile' ? 'grid-cols-1' : 'grid-cols-2'} divide-y lg:divide-y-0 lg:divide-x divide-border border-b border-border`}>
                    <div className="relative h-full min-h-[400px] bg-slate-950">
                        {careers.culture.imageUrl && (
                            <img
                                src={careers.culture.imageUrl}
                                alt="Culture"
                                className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-700"
                            />
                        )}
                    </div>
                    <div className="p-10 md:p-20 flex flex-col justify-center">
                        <span className="text-primary text-sm font-semibold tracking-wider uppercase mb-4 block">
                            <EditableText path="careers.culture.subtitle" value={careers.culture.subtitle || ""} />
                        </span>
                        <h3 className="text-3xl md:text-5xl font-medium text-foreground mb-8 leading-tight">
                            <EditableText path="careers.culture.title" value={careers.culture.title || ""} />
                        </h3>
                        <p className="text-muted-foreground text-lg leading-relaxed max-w-xl">
                            <EditableText path="careers.culture.description" value={careers.culture.description || ""} multiline />
                        </p>
                    </div>
                </div>

                {/* Benefits Grid */}
                <div className={`grid ${device === 'mobile' ? 'grid-cols-1' : device === 'tablet' ? 'grid-cols-2' : 'grid-cols-3'} divide-y md:divide-y-0 md:divide-x divide-border border-b border-border`}>
                    {(careers.benefits || []).map((benefit: any, index: number) => {
                        const Icon = BenefitIconMap[benefit.icon] || Zap;
                        return (
                            <div key={index} className="p-10 md:p-12 hover:bg-foreground/5 transition-colors group">
                                <div className="p-4 bg-primary/10 rounded-[4px] w-fit mb-8 text-primary group-hover:scale-110 transition-transform">
                                    <Icon size={32} />
                                </div>
                                <h4 className="text-xl font-medium mb-4 text-foreground">
                                    <EditableText path={`careers.benefits.${index}.title`} value={benefit.title || ""} />
                                </h4>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    <EditableText path={`careers.benefits.${index}.description`} value={benefit.description || ""} multiline />
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* Jobs Section */}
                <div className="p-10 md:p-20">
                    <h3 className="text-4xl font-medium mb-12 text-foreground">Open Positions</h3>
                    <div className="space-y-4">
                        {(careers.jobs || []).map((job: any, index: number) => (
                            <div key={index} className="flex flex-col md:flex-row md:items-center justify-between p-8 bg-slate-900/50 border border-border/50 rounded-[4px] hover:border-primary/50 transition-all group">
                                <div className="mb-6 md:mb-0">
                                    <h4 className="text-xl font-medium text-foreground mb-2">
                                        <EditableText path={`careers.jobs.${index}.title`} value={job.title || ""} />
                                    </h4>
                                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1.5">
                                            <Briefcase size={14} />
                                            <EditableText path={`careers.jobs.${index}.department`} value={job.department || ""} />
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <MapPin size={14} />
                                            <EditableText path={`careers.jobs.${index}.location`} value={job.location || ""} />
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Clock size={14} />
                                            <EditableText path={`careers.jobs.${index}.type`} value={job.type || ""} />
                                        </div>
                                    </div>
                                </div>
                                <button className="px-8 py-3 bg-foreground text-background rounded-full font-medium hover:bg-primary hover:text-white transition-colors">
                                    Apply Now
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
