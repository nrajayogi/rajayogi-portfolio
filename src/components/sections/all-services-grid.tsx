"use client";

import { motion } from "framer-motion";
import { Settings, Database, Cloud, Cpu, Factory, Wifi, LayoutGrid, Shield } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { useResponsive } from "@/hooks/use-responsive";

// Service Data (Consolidated for the grid)
const allServices = [
    {
        title: "PLM Services",
        href: "/services/plm-services",
        desc: "End-to-end Product Lifecycle Management strategy and implementation.",
        icon: Settings
    },
    {
        title: "Data Migration",
        href: "/services/data-migration",
        desc: "Secure, high-fidelity migration of legacy data to modern platforms.",
        icon: Database
    },
    {
        title: "Cyber Security",
        href: "/services/cyber-security",
        desc: "Industrial defense for IT/OT convergence and connected assets.",
        icon: Shield
    },
    {
        title: "Enterprise Integration",
        href: "/services/enterprise-integration",
        desc: "Seamless connectivity across your digital thread and ERP systems.",
        icon: LayoutGrid
    },
    {
        title: "Cloud Transformation",
        href: "/services/cloud-transformation",
        desc: "Scalable cloud architecture and managed services for manufacturing.",
        icon: Cloud
    },
    {
        title: "Digital Engineering",
        href: "/services/digital-engineering",
        desc: "CAD automation & model-based systems engineering solutions.",
        icon: Cpu
    },
    {
        title: "Digital Manufacturing",
        href: "/services/digital-manufacturing",
        desc: "MOM/MES implementation and smart factory optimization.",
        icon: Factory
    },
    {
        title: "IoT Operations",
        href: "/services/iot-connected-operations",
        desc: "Real-time visibility and analytics for connected industrial assets.",
        icon: Wifi
    },
    {
        title: "Enterprise Systems",
        href: "/services/enterprise-systems",
        desc: "Optimization of ERP and critical business applications.",
        icon: LayoutGrid
    }
];

export function AllServicesGrid() {
    const containerRef = useRef<HTMLElement>(null);
    const device = useResponsive(containerRef);

    return (
        <section ref={containerRef} className="bg-background border-t border-border relative overflow-hidden">
            {/* Connected Grid Layout */}
            <div className="container mx-auto px-4 border-l border-r border-border p-0">
                <div className={`grid ${device === 'mobile' ? 'grid-cols-1' : device === 'tablet' ? 'grid-cols-2' : 'grid-cols-3'} divide-y divide-border border-b border-border`}>

                    {/* Header Cell (Occupies first slot - Exactly like Home Page) */}
                    <div className="p-10 md:p-12 col-span-1 flex flex-col justify-center border-b border-border md:border-b-0 md:border-r border-border bg-background z-10">
                        <span className="text-primary text-sm font-semibold tracking-wider uppercase mb-3 block">
                            Our Capabilities
                        </span>
                        <h2 className="text-3xl md:text-4xl font-medium text-foreground mb-6">
                            Engineering Excellence
                        </h2>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            Comprehensive PLM and consulting services tailored to modern manufacturing.
                        </p>
                        <div className="w-12 h-1 bg-primary mt-8 rounded-full" />
                    </div>

                    {/* Services Grid Cells */}
                    {allServices.map((service, index) => {
                        const Icon = service.icon;
                        return (
                            <Link href={service.href} key={index} className="contents">
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`p-10 md:p-12 relative group hover:bg-foreground/5 transition-all duration-300 md:border-r border-border last:border-r-0 cursor-pointer`}
                                >
                                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:text-primary group-hover:bg-primary/20 transition-all">
                                        <Icon size={24} strokeWidth={1.5} />
                                    </div>
                                    <h3 className="text-xl font-medium mb-3 text-foreground flex items-center gap-2">
                                        {service.title}
                                    </h3>
                                    <p className="text-muted-foreground leading-relaxed text-sm group-hover:text-foreground/80 transition-colors">
                                        {service.desc}
                                    </p>
                                </motion.div>
                            </Link>
                        );
                    })}

                </div>
            </div>
        </section>
    );
}
