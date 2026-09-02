"use client";

import { Footer } from "@/components/layout/footer";
import { ServicesHero } from "@/components/sections/services-hero";
import { AllServicesGrid } from "@/components/sections/all-services-grid";
import { ServicePitchValue } from "@/components/sections/service-pitch-value";
import { ServiceDeliveryModel } from "@/components/sections/service-delivery-model";
import { ServiceFAQ } from "@/components/sections/service-faq";
import { Contact } from "@/components/sections/contact";

export default function ServicesPage() {
    return (
        <main className="min-h-screen bg-background text-foreground">
            {/* 1. Hero: Immersive Video Hook */}
            <ServicesHero />

            {/* 2. Value Prop: The "Why" (ROI & Speed) */}
            <ServicePitchValue />

            {/* 3. The Services: The "What" */}
            <AllServicesGrid />

            {/* 4. Delivery Model: The "How" */}
            <ServiceDeliveryModel />

            {/* 5. FAQ: Removing Objections */}
            <ServiceFAQ />

            {/* 6. Contact: CTA */}
            <Contact />

            <Footer />
        </main>
    );
}
