"use client";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { services } from "@/data/services";

export function ContactForm() {
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        // In a real app, this would use Server Actions or an API route
        alert("Thank you for your interest! We will be in touch shortly.");
    }

    return (
        <Section className="bg-slate-900 text-white">
            <Container>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
                            Ready to Transform?
                        </h2>
                        <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                            Let’s discuss your digital engineering challenges. Whether you need a strategic roadmap or hands-on implementation, our experts are ready to help.
                        </p>

                        <div className="space-y-6 text-slate-300">
                            <div>
                                <h4 className="font-semibold text-white mb-1">Email Us</h4>
                                <p>contact@vyantraa.com</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-white mb-1">Call Us</h4>
                                <p>+91 7995824646</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white text-slate-900 rounded-[4px] p-6 sm:p-8 shadow-xl">
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-medium">Name</label>
                                    <input id="name" required className="flex h-10 w-full rounded-[4px] border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="John Doe" />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="company" className="text-sm font-medium">Company</label>
                                    <input id="company" required className="flex h-10 w-full rounded-[4px] border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Acme Corp" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium">Work Email</label>
                                <input id="email" type="email" required className="flex h-10 w-full rounded-[4px] border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="john@acme.com" />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="topic" className="text-sm font-medium">I&apos;m interested in...</label>
                                <select id="topic" className="flex h-10 w-full rounded-[4px] border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                                    <option value="">Select a Service</option>
                                    {services.map(s => (
                                        <option key={s.id} value={s.id}>{s.title}</option>
                                    ))}
                                    <option value="other">General Inquiry</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="message" className="text-sm font-medium">Message</label>
                                <textarea id="message" rows={4} className="flex min-h-[80px] w-full rounded-[4px] border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="How can we help you?"></textarea>
                            </div>

                            <Button type="submit" size="lg" className="w-full">
                                Send Message
                            </Button>
                        </form>
                    </div>
                </div>
            </Container>
        </Section>
    );
}
