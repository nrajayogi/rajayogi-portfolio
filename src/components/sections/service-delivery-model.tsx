"use client";

import { motion } from "framer-motion";
import { ArrowRight, Search, PencilRuler, Code2, Rocket } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";

export function ServiceDeliveryModel() {
    const steps = [
        {
            id: "01",
            title: "Discovery & Audit",
            desc: "We dive deep into your existing architecture, identifying bottlenecks and opportunities for digital thread integration.",
            icon: Search
        },
        {
            id: "02",
            title: "Solution Design",
            desc: "Architecting a scalable ecosystem that bridges legacy systems with modern cloud-native capabilities.",
            icon: PencilRuler
        },
        {
            id: "03",
            title: "Agile Development",
            desc: "Iterative sprints focusing on high-impact modules first, ensuring quicker time-to-value for your organization.",
            icon: Code2
        },
        {
            id: "04",
            title: "Deployment & Scale",
            desc: "Rigorous testing followed by a phased rollout and knowledge transfer to your internal teams.",
            icon: Rocket
        }
    ];

    return (
        <Section className="bg-background border-t border-border py-32 md:py-40">
            <Container>
                <div className="mb-20">
                    <span className="text-primary text-sm font-semibold tracking-wider uppercase mb-4 block">
                        How We Engage
                    </span>
                    <h2 className="text-4xl md:text-5xl font-medium text-foreground tracking-tight">
                        The Delivery Model.
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden lg:block absolute top-[2.5rem] left-0 right-0 h-px bg-border z-0" />

                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="relative z-10 bg-background pt-4 md:pt-0"
                        >
                            <div className="w-20 h-20 bg-background border border-border rounded-2xl flex items-center justify-center mb-8 relative group hover:border-primary transition-colors">
                                <step.icon className="w-8 h-8 text-foreground group-hover:text-primary transition-colors" />
                                <div className="absolute -top-3 -right-3 w-8 h-8 bg-zinc-900 rounded-full flex items-center justify-center border border-border text-xs font-sans text-muted-foreground">
                                    {step.id}
                                </div>
                            </div>

                            <h3 className="text-xl font-semibold text-foreground mb-4">
                                {step.title}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed text-sm">
                                {step.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </Container>
        </Section>
    );
}
