import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

const industries = [
    "Automotive",
    "Aerospace & Defense",
    "Industrial Machinery",
    "High Tech & Electronics",
    "Medical Devices",
    "Consumer Products",
];

export function IndustriesGrid() {
    return (
        <Section>
            <Container>
                <div className="flex flex-col md:flex-row gap-12 items-center">
                    <div className="w-full md:w-1/3">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6 text-foreground">
                            Industries We Serve
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                            Our digital engineering solutions are tailored to the unique regulatory and operational challenges of complex manufacturing sectors.
                        </p>
                        {/* Proof / Logos Placeholder */}
                        <div className="pt-8 border-t">
                            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Trusted By Leaders In</p>
                            <div className="flex flex-wrap gap-4 opacity-50 grayscale transition-all hover:grayscale-0 hover:opacity-100">
                                {/* Placeholders for logos */}
                                <div className="h-8 w-24 bg-foreground/10 rounded"></div>
                                <div className="h-8 w-24 bg-foreground/10 rounded"></div>
                                <div className="h-8 w-24 bg-foreground/10 rounded"></div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full md:w-2/3 grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {industries.map((industry, index) => (
                            <div key={index} className="aspect-[4/3] flex items-center justify-center p-4 bg-muted/30 rounded-lg border hover:border-primary/50 hover:bg-muted transition-all cursor-default group">
                                <span className="font-semibold text-center text-foreground/80 group-hover:text-primary transition-colors">{industry}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
        </Section>
    );
}
