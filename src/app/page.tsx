"use client";

import { useContent } from "@/lib/content-context";
import { Hero } from "@/components/sections/hero";
import { VisionStatement } from "@/components/sections/vision-statement";
import { SelectedWorks } from "@/components/sections/selected-works";
import { Services } from "@/components/sections/services";
import { Methodology } from "@/components/sections/methodology";
import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/layout/footer";
import { Partners } from "@/components/sections/partners";
import { ImageCarousel } from "@/components/sections/image-carousel";
import { Training } from "@/components/sections/training";
import { HomemadeValueCarousel } from "@/components/sections/homemade-value-carousel";

export default function Home() {
  const { content } = useContent();
  const sectionsOrder = content.sectionsOrder || ["hero", "vision", "works", "homemadeValues", "services", "methodology", "about", "contact"];

  const SectionMap: Record<string, React.ComponentType> = {
    hero: Hero,
    vision: VisionStatement,
    works: SelectedWorks,
    homemadeValues: HomemadeValueCarousel,
    services: Services,
    methodology: Methodology,
    about: About,
    contact: Contact,
    partners: Partners,
    imageCarousel: ImageCarousel,
    training: Training
  };

  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary selection:text-white">
      {sectionsOrder.map((sectionKey) => {
        const Component = SectionMap[sectionKey];
        if (!Component) return null;
        return <Component key={sectionKey} />;
      })}
      <Footer />
    </main>
  );
}
