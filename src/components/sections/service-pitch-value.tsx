"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";

export function ServicePitchValue() {
    return (
        <Section className="bg-background border-t border-border py-32 md:py-40 overflow-hidden relative">
            <Container>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
                    {/* Left: Headlines Analysis */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl md:text-6xl font-medium tracking-tight text-foreground leading-none mb-8">
                            ROI-Driven <br />
                            <span className="text-primary">Engineering.</span>
                        </h2>
                        <p className="text-xl text-muted-foreground leading-relaxed max-w-lg mb-12">
                            We don’t just implement software; we engineer business outcomes. Our deployments are measured by the operational efficiencies they create.
                        </p>

                        <div className="space-y-8">
                            {[
                                { val: "40%", label: "Faster Time-to-Market" },
                                { val: "30%", label: "Reduction in Engineering Spend" },
                                { val: "100%", label: "Regulatory Compliance" }
                            ].map((stat, i) => (
                                <div key={i} className="flex flex-col">
                                    <span className="text-5xl md:text-6xl font-bold text-foreground tracking-tighter">{stat.val}</span>
                                    <span className="text-sm text-primary font-semibold uppercase tracking-wider">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right: The "How/Why" Cards */}
                    <div className="space-y-6 md:pt-12">
                        {[
                            {
                                title: "Vendor Agnostic",
                                desc: "We are not tied to a single platform. Whether it’s Siemens, PTC, or Dassault, we architect the best solution for your needs."
                            },
                            {
                                title: "Vertical Expertise",
                                desc: "Our team consists of engineers, not just developers. We understand the physics of products as well as the logic of code."
                            },
                            {
                                title: "Rapid Deployment",
                                desc: "Our pre-configured accelerators significantly reduce implementation timelines, getting you to value faster."
                            }
                        ].map((card, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="p-8 border border-border bg-foreground/5 rounded-[4px] hover:bg-foreground/10 transition-colors"
                            >
                                <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-primary" />
                                    {card.title}
                                </h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {card.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </Container>
            {/* Background Mesh */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
        </Section>
    );
}
