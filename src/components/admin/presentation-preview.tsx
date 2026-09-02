"use client";

import { useContent } from "@/lib/content-context";
import { CinematicView } from "@/components/sections/cinematic-view";
import { Page } from "@/lib/content-types";

// Currently hardcoded to target "presentation" or active edit, but flexible enough
export function PresentationPreview() {
    const { content } = useContent();

    // Find the page with slug "presentation"
    // In a real generic editor, we'd want to know WHICH page ID is being edited. 
    // For now, based on user request "presentation page", we target slug="presentation".
    const page = content.pages?.find((p: Page) => p.slug === "presentation");

    if (!page || page.layout !== 'cinematic') {
        return (
            <div className="flex items-center justify-center h-full text-slate-500">
                <p>No presentation content found.</p>
            </div>
        );
    }

    const slides = page.content.split(/<hr\s*\/?>/i);

    return (
        <div className="w-full h-full bg-[#050505] text-white overflow-hidden relative selection:bg-purple-500/30">
            {/* Ambient Background Effects - Reduced intensity for preview context if needed, but keeping consistent */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
            </div>

            <CinematicView slides={slides} />
        </div>
    );
}
