"use client";

import { ArrowUpRight, Shield, Database, Cloud, Cpu, Factory, Wifi, LayoutGrid, Settings } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

const services = [
    {
        title: "PLM Services",
        slug: "plm-services",
        desc: "End-to-end Product Lifecycle Management strategy and implementation.",
        icon: Settings
    },
    {
        title: "Data Migration",
        slug: "data-migration",
        desc: "Secure, high-fidelity migration of legacy data to modern platforms.",
        icon: Database
    },
    {
        title: "Cyber Security",
        slug: "cyber-security",
        desc: "Industrial defense for IT/OT convergence and connected assets.",
        icon: Shield
    },
    {
        title: "Enterprise Integration",
        slug: "enterprise-integration",
        desc: "Seamless connectivity across your digital thread and ERP systems.",
        icon: LayoutGrid
    },
    {
        title: "Cloud Transformation",
        slug: "cloud-transformation",
        desc: "Scalable cloud architecture and managed services for manufacturing.",
        icon: Cloud
    },
    {
        title: "Digital Engineering",
        slug: "digital-engineering",
        desc: "CAD automation & model-based systems engineering solutions.",
        icon: Cpu
    },
    {
        title: "Digital Manufacturing",
        slug: "digital-manufacturing",
        desc: "MOM/MES implementation and smart factory optimization.",
        icon: Factory
    },
    {
        title: "IoT Operations",
        slug: "iot-connected-operations",
        desc: "Real-time visibility and analytics for connected industrial assets.",
        icon: Wifi
    },
    {
        title: "Enterprise Systems",
        slug: "enterprise-systems",
        desc: "Optimization of ERP and critical business applications.",
        icon: LayoutGrid
    }
];

export function ServicesGrid() {
    return (
        <section className="py-24 bg-background">
            <Container>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service, index) => (
                        <Link
                            key={index}
                            href={`/services/${service.slug}`}
                            className="group relative block h-full"
                        >
                            <div className="h-full p-8 rounded-3xl bg-zinc-900/30 border border-white/5 hover:border-white/10 hover:bg-zinc-900/50 transition-all duration-300 backdrop-blur-sm">
                                <div className="flex flex-col h-full justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/70 group-hover:text-white group-hover:scale-110 transition-all duration-300">
                                                <service.icon className="w-6 h-6" />
                                            </div>
                                            <ArrowUpRight className="w-5 h-5 text-white/20 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                                        </div>

                                        <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-primary transition-colors">
                                            {service.title}
                                        </h3>
                                        <p className="text-zinc-400 leading-relaxed text-sm">
                                            {service.desc}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </Container>
        </section>
    );
}
