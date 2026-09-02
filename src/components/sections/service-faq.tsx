"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";

export function ServiceFAQ() {
    const faqs = [
        {
            q: "How does your pricing model work?",
            a: "We offer both fixed-bid project based pricing for defined scopes and time & material engagement models for ongoing consulting and support needs."
        },
        {
            q: "Can you integrate with our existing legacy systems?",
            a: "Absolutely. Our expertise lies in 'Brownfield' modernization. We build secure bridges between your legacy mainframes/databases and modern cloud architectures."
        },
        {
            q: "What industries do you specialize in?",
            a: "Our core focus is discrete manufacturing (Automotive, Aerospace, Industrial Machinery) and Process industries (Medical Devices, High Tech)."
        },
        {
            q: "Do you provide post-deployment support?",
            a: "Yes. We offer managed services packages to ensure your systems remain performant, secure, and up-to-date with the latest features."
        }
    ];

    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <Section className="bg-background border-t border-border py-32">
            <Container>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    <div className="lg:col-span-1">
                        <h2 className="text-3xl md:text-4xl font-medium text-foreground tracking-tight mb-6">
                            Common Questions.
                        </h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Clarifications on how we partner with enterprises to drive digital transformation.
                        </p>
                    </div>

                    <div className="lg:col-span-2 space-y-4">
                        {faqs.map((faq, index) => (
                            <div key={index} className="border-b border-border pb-4 last:border-0">
                                <button
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                    className="w-full flex justify-between items-center py-4 text-left group"
                                >
                                    <span className={`text-lg transition-colors ${openIndex === index ? 'text-primary' : 'text-foreground group-hover:text-primary'}`}>
                                        {faq.q}
                                    </span>
                                    <span className="p-2 rounded-full border border-border group-hover:border-primary/50 transition-colors">
                                        {openIndex === index ? (
                                            <Minus className="w-4 h-4 text-primary" />
                                        ) : (
                                            <Plus className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                                        )}
                                    </span>
                                </button>
                                <AnimatePresence>
                                    {openIndex === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-hidden"
                                        >
                                            <p className="pb-6 text-muted-foreground leading-relaxed pr-8">
                                                {faq.a}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
        </Section>
    );
}
