"use client";

import { Button } from "@/components/ui/button";

import { Mail, MapPin, Phone, ArrowUpRight } from "lucide-react";

import { useContent } from "@/lib/content-context";
import { EditableText } from "@/components/admin/editable-text";

import { useRef } from "react";
import { useResponsive } from "@/hooks/use-responsive";

export function Contact() {
    const containerRef = useRef<HTMLElement>(null);
    const device = useResponsive(containerRef);
    const { content } = useContent();
    const { contact } = content;

    if (!contact || !contact.info || !contact.locations || !contact.form) return null;

    return (
        <section id="contact" ref={containerRef} className="bg-background border-t border-border relative overflow-hidden">
            <div className="container px-4 mx-auto border-x border-border p-0">
                <div className={`grid ${device === 'mobile' ? 'grid-cols-1' : 'grid-cols-2'} divide-y lg:divide-y-0 lg:divide-x divide-border border-b border-border`}>

                    {/* Left Panel: Contact Info */}
                    <div className="p-10 md:p-20 flex flex-col justify-between min-h-[600px] relative group">
                        <div className="relative z-10">
                            <span className="text-primary text-sm font-semibold tracking-wider uppercase mb-3 block">
                                <EditableText path="contact.info.subtitle" value={contact.info.subtitle || ""} />
                            </span>
                            <h2 className={`${device === 'mobile' ? 'text-4xl' : 'text-5xl'} font-medium text-foreground mb-6 leading-tight`}>
                                <EditableText path="contact.info.title" value={contact.info.title || ""} />
                            </h2>
                            <p className="text-muted-foreground text-lg max-w-md">
                                <EditableText path="contact.info.description" value={contact.info.description || ""} multiline />
                            </p>
                        </div>

                        <div className="relative z-10 space-y-8 mt-12">
                            {(contact.locations || []).map((loc, i) => (
                                <div key={i} className="flex items-start gap-4 group/item">
                                    <div className="p-3 bg-foreground/5 border border-border rounded-[4px] text-primary transition-colors group-hover/item:bg-foreground/10">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-foreground text-lg font-medium mb-1">
                                            <EditableText path={`contact.locations.${i}.title`} value={loc.title || ""} />
                                        </h3>
                                        <p className="text-muted-foreground text-sm whitespace-pre-line leading-relaxed">
                                            <EditableText path={`contact.locations.${i}.address`} value={loc.address || ""} multiline />
                                        </p>
                                        <div className="flex gap-4 mt-2">
                                            <a href={`tel:${loc.phone}`} className="text-xs text-primary hover:underline">{loc.phone}</a>
                                            <a href={`mailto:${loc.email}`} className="text-xs text-primary hover:underline">{loc.email}</a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Subtle Map Background */}
                        <div className="absolute inset-0 opacity-10 grayscale pointer-events-none mix-blend-overlay"
                            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')", backgroundSize: "cover", backgroundPosition: "center" }}
                        />
                    </div>

                    {/* Right Panel: Grid Form */}
                    <div className="bg-background relative">
                        <form className="h-full flex flex-col" onSubmit={async (e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            const data = {
                                firstName: formData.get('firstName'),
                                lastName: formData.get('lastName'),
                                email: formData.get('email'),
                                message: formData.get('message')
                            };

                            try {
                                await fetch('/api/submissions', {
                                    method: 'POST',
                                    body: JSON.stringify(data)
                                });
                                alert('Message sent!');
                                (e.target as HTMLFormElement).reset();
                            } catch {
                                alert('Failed to send message.');
                            }
                        }}>
                            {/* Form Grid */}
                            <div className={`grid ${device === 'mobile' ? 'grid-cols-1' : 'grid-cols-2'} divide-y md:divide-y-0 md:divide-x divide-border border-b border-border`}>
                                <div className="p-0">
                                    <input name="firstName" required type="text" className="w-full bg-transparent p-8 md:p-10 text-foreground placeholder-muted-foreground focus:bg-foreground/5 outline-none transition-colors border-none" placeholder={contact.form.namePlaceholder.split(' ')[0] || "First Name"} />
                                </div>
                                <div className="p-0">
                                    <input name="lastName" required type="text" className="w-full bg-transparent p-8 md:p-10 text-foreground placeholder-muted-foreground focus:bg-foreground/5 outline-none transition-colors border-none" placeholder={contact.form.namePlaceholder.split(' ')[1] || "Last Name"} />
                                </div>
                            </div>

                            <div className="border-b border-border">
                                <input name="email" required type="email" className="w-full bg-transparent p-8 md:p-10 text-foreground placeholder-muted-foreground focus:bg-foreground/5 outline-none transition-colors border-none" placeholder={contact.form.emailPlaceholder} />
                            </div>

                            <div className="flex-grow border-b border-border">
                                <textarea name="message" required className="w-full h-full min-h-[200px] bg-transparent p-8 md:p-10 text-foreground placeholder-muted-foreground focus:bg-foreground/5 outline-none transition-colors border-none resize-none" placeholder={contact.form.messagePlaceholder} />
                            </div>

                            <div className="p-0">
                                <Button type="submit" size="lg" className="w-full h-20 md:h-24 text-lg bg-primary hover:bg-primary/90 text-primary-foreground rounded-none border-none flex items-center justify-center gap-2 group">
                                    <EditableText path="contact.form.submitButton" value={contact.form.submitButton} /> <ArrowUpRight className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </Button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </section>
    );
}
