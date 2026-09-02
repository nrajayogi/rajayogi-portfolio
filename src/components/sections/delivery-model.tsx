import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Search, PenTool, Rocket, Activity } from "lucide-react";

const steps = [
    {
        number: "01",
        title: "Discover",
        description: "We analyze your current landscape, identify bottlenecks, and define clear success metrics.",
        icon: Search,
    },
    {
        number: "02",
        title: "Design",
        description: "Our architects blueprint a scalable solution that integrates with your existing ecosystem.",
        icon: PenTool,
    },
    {
        number: "03",
        title: "Deliver",
        description: "Agile implementation with rigorous testing to ensure zero-disruption deployment.",
        icon: Rocket,
    },
    {
        number: "04",
        title: "Run",
        description: "Ongoing managed services, monitoring, and optimization to maximize ROI.",
        icon: Activity,
    },
];

export function DeliveryModel() {
    return (
        <Section className="bg-muted/30">
            <Container>
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4 text-foreground">
                        Our Delivery Approach
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        A proven framework that takes you from strategy to sustainable operations.
                    </p>
                </div>

                <div className="relative">
                    {/* Connector Line (Desktop) */}
                    <div className="hidden lg:block absolute top-12 left-0 w-full h-0.5 bg-border -z-10" />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {steps.map((step, index) => (
                            <div key={index} className="relative bg-background lg:bg-transparent p-6 lg:p-0 rounded-lg border lg:border-none shadow-sm lg:shadow-none">
                                <div className="w-24 h-24 mx-auto bg-background rounded-full border-2 border-primary/20 flex items-center justify-center mb-6 shadow-sm relative z-10">
                                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                                        <step.icon className="w-8 h-8" />
                                    </div>
                                    <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold w-8 h-8 rounded-full flex items-center justify-center border-2 border-background">
                                        {step.number}
                                    </div>
                                </div>

                                <div className="text-center">
                                    <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed text-sm">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
        </Section>
    );
}
