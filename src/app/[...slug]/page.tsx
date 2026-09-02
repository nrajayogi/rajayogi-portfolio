"use client";

import { useContent } from "@/lib/content-context";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useParams } from "next/navigation";
import { CinematicView } from "@/components/sections/cinematic-view";
import { PresentationRenderer } from "@/components/sections/presentation-renderer";
import { PresentationData } from "@/lib/presentation-types";
import Link from "next/link";

export default function DynamicPage() {
    const { content } = useContent();
    const params = useParams();

    // Get the slug from the URL params
    const slugPath = Array.isArray(params.slug) ? params.slug.join('/') : params.slug;

    // Derive page directly from content
    const page = content?.pages?.find(p => p.slug.toLowerCase() === (slugPath || "").toLowerCase());

    if (!content) {
        return <div className="min-h-screen flex items-center justify-center bg-black text-white">Loading...</div>;
    }

    if (!page) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white gap-4">
                <h1 className="text-4xl font-bold">404</h1>
                <p className="text-slate-400">Page not found</p>
                <Link href="/" className="px-4 py-2 bg-blue-600 rounded text-sm hover:bg-blue-500">Go Home</Link>
            </div>
        );
    }



    // --- CINEMATIC LAYOUT ---
    if (page.layout === 'cinematic') {
        // Check if we have presentationData (new canvas-based format)
        if (page.presentationData) {
            const presentationData = typeof page.presentationData === 'string'
                ? JSON.parse(page.presentationData)
                : page.presentationData as PresentationData;

            return (
                <main className="h-screen w-screen bg-[#050505] text-white overflow-hidden relative selection:bg-purple-500/30">
                    {/* Navbar Overlay */}
                    <div className="absolute top-0 left-0 right-0 z-50">
                        <Navbar />
                    </div>

                    {/* Ambient Background Effects */}
                    <div className="absolute inset-0 z-0 pointer-events-none">
                        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[120px]" />
                        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[120px]" />
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
                    </div>

                    <PresentationRenderer presentationData={presentationData} />
                </main>
            );
        }

        // Fall back to old HTML-based format
        // Split content by <hr> tags to create slides
        // We use a regex to handle various hr formats (<hr>, <hr/>, <hr />)
        const slides = page.content.split(/<hr\s*\/?>/i);

        return (
            <main className="h-screen w-screen bg-[#050505] text-white overflow-hidden relative selection:bg-purple-500/30">
                {/* Navbar Overlay */}
                <div className="absolute top-0 left-0 right-0 z-50">
                    <Navbar />
                </div>

                {/* Ambient Background Effects */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[120px]" />
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
                </div>

                <CinematicView slides={slides} settings={page.settings} />

                {/* Global Footer is EXCLUDED here as requested */}
            </main>
        );
    }

    // ... DEFAULT LAYOUT logic

    // --- DEFAULT LAYOUT ---
    return (
        <main className="min-h-screen bg-background text-foreground flex flex-col">
            <Navbar />

            <div className="flex-1 pt-24 pb-12 px-6">
                <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h1 className="text-4xl md:text-5xl font-bold mb-8">{page.title}</h1>
                    {/* Render HTML Content */}
                    <div
                        className="prose prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: page.content }}
                    />
                </div>
            </div>

            <Footer />
        </main>
    );
}
