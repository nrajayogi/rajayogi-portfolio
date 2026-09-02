
import { Footer } from "@/components/layout/footer";
import { PageHeader } from "@/components/ui/page-header";
import { IndustriesGrid } from "@/components/sections/industries-grid";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Check } from "lucide-react";

export default function IndustriesPage() {
    const benefits = [
        "Regulatory Compliance Frameworks (FDA, ISO, ITAR)",
        "Supply Chain Visibility",
        "Smart Factory Logic & Automation",
        "Legacy System Integration"
    ];

    return (
        <>
            <main className="min-h-screen">
                <PageHeader
                    heading="Industries We Serve"
                    subheading="Specialized expertise for complex, high-compliance manufacturing sectors."
                />

                <IndustriesGrid />

                <Section className="bg-background">
                    <Container>
                        <div className="max-w-3xl mx-auto">
                            <h3 className="text-2xl font-bold mb-6">Cross-Industry Expertise</h3>
                            <p className="text-muted-foreground mb-8">
                                While we specialize in discrete manufacturing, our core competencies in digital thread,
                                data integration, and cloud transformation apply across a wide range of industrial verticals.
                            </p>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {benefits.map((b, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                            <Check className="h-4 w-4" />
                                        </div>
                                        <span className="font-medium">{b}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </Container>
                </Section>
            </main>
            <Footer />
        </>
    );
}
