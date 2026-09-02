import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { CheckCircle2, ShieldCheck, Zap, Layers, BarChart3, Users } from "lucide-react";

const differentiators = [
    {
        title: "Strategy-to-Execution",
        description: "We don't just advise; we build, deploy, and support mission-critical systems.",
        icon: Layers,
    },
    {
        title: "Migration Rigor",
        description: "Zero-loss data migration frameworks with automated validation and risk controls.",
        icon: ShieldCheck,
    },
    {
        title: "Integration-First Mindset",
        description: "Seamlessly connecting PLM, ERP, MES, and CRM for a unified digital thread.",
        icon: Zap,
    },
    {
        title: "Measurable Outcomes",
        description: "We focus on KPIs that matter: time-to-market, OEE, and operational cost reduction.",
        icon: BarChart3,
    },
    {
        title: "Scalable Engagement",
        description: "From rapid pilots to global enterprise rollouts, our models adapt to your needs.",
        icon: Users,
    },
    {
        title: "Governance Compliant",
        description: "Built-in security and compliance best practices for regulated industries.",
        icon: CheckCircle2,
    },
];

export function WhyVyantraa() {
    return (
        <Section className="bg-background">
            <Container>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6 text-foreground">
                            Why Partner with Vyantraa?
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                            In a crowded market of generalists, we are specialists. Our deep domain expertise in industrial digitalization ensures that your transformation initiatives deliver real-world value, not just slideware.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-8">
                            {differentiators.map((item, index) => (
                                <div key={index} className="flex gap-4">
                                    <div className="mt-1">
                                        <item.icon className="h-6 w-6 text-primary flex-shrink-0" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                                        <p className="text-sm text-muted-foreground leading-snug">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Visual / Image Placeholder */}
                    <div className="relative">
                        <div className="aspect-square rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 border border-border p-8 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-400 via-transparent to-transparent"></div>
                            <div className="text-center max-w-xs relative z-10">
                                <div className="text-5xl font-bold text-primary mb-2">100%</div>
                                <p className="text-lg font-medium text-foreground">Commitment to delivery excellence</p>
                            </div>
                            {/* Decorative circles */}
                            <div className="absolute -bottom-12 -left-12 h-48 w-48 bg-primary/10 rounded-full blur-3xl"></div>
                            <div className="absolute top-12 right-12 h-24 w-24 bg-blue-500/10 rounded-full blur-2xl"></div>
                        </div>
                    </div>
                </div>
            </Container>
        </Section>
    );
}
