import { notFound } from "next/navigation";
import { ServicePageTemplate } from "@/components/templates/service-page-template";
import fs from "fs";
import path from "path";

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

function getContent() {
    try {
        const filePath = path.join(process.cwd(), "src/data/content.json");
        const fileContent = fs.readFileSync(filePath, "utf8");
        return JSON.parse(fileContent);
    } catch (e) {
        console.error("Error reading content.json:", e);
        return {};
    }
}

export async function generateStaticParams() {
    const content = getContent();
    const services = (content.servicesData as any[]) || [];
    return services.map((service) => ({
        slug: service.slug,
    }));
}

export default async function ServicePage({ params }: PageProps) {
    const { slug } = await params;
    const content = getContent();
    const services = (content.servicesData as any[]) || [];
    const service = services.find((s) => s.slug === slug);

    if (!service) {
        notFound();
    }

    return <ServicePageTemplate service={service} />;
}
