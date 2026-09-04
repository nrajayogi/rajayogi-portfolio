"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export interface GeoData {
    city?: string | null;
    region?: string | null;
    country?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    isp?: string | null;
}

// Client-side cache for high-accuracy visitor geolocation
async function getClientGeo(): Promise<GeoData | null> {
    if (typeof window === "undefined") return null;
    try {
        const cached = sessionStorage.getItem("visitor_geo_cache");
        if (cached) {
            return JSON.parse(cached);
        }

        // Fast non-blocking lookup for exact city/region/country
        const res = await fetch("https://freeipapi.com/api/json", {
            signal: AbortSignal.timeout(2000)
        });

        if (res.ok) {
            const data = await res.json();
            const geo: GeoData = {
                city: data.cityName && data.cityName !== "-" ? data.cityName : null,
                region: data.regionName && data.regionName !== "-" ? data.regionName : null,
                country: data.countryCode && data.countryCode !== "-" ? data.countryCode : null,
                latitude: data.latitude ? Number(data.latitude) : null,
                longitude: data.longitude ? Number(data.longitude) : null,
                isp: data.isp || null
            };
            sessionStorage.setItem("visitor_geo_cache", JSON.stringify(geo));
            return geo;
        }
    } catch (_) {
        // Fallback gracefully
    }
    return null;
}

export async function trackPortfolioAction(
    action = "PAGE_VIEW", 
    metadata?: { path?: string; pageTitle?: string; details?: string }
) {
    if (typeof window === "undefined") return;

    const pathname = metadata?.path || window.location.pathname;
    // Skip tracking for admin portal visits
    if (pathname.startsWith("/admin")) return;

    try {
        const clientGeo = await getClientGeo();
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const referrer = document.referrer ? new URL(document.referrer).hostname : "Direct";

        await fetch("/api/analytics/track", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                path: pathname,
                action,
                pageTitle: metadata?.pageTitle || document.title,
                clientGeo,
                userAgent: navigator.userAgent,
                referrer,
                timeZone,
                language: navigator.language,
                screen: `${window.innerWidth}x${window.innerHeight}`
            }),
        });
    } catch (error) {
        console.debug("Telemetry error:", error);
    }
}

export function AnalyticsTracker() {
    const pathname = usePathname();

    useEffect(() => {
        // Attach global helper to window for custom button triggers
        if (typeof window !== "undefined") {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (window as any).trackPortfolioAction = trackPortfolioAction;
        }

        // 1. Track route changes
        if (!pathname.startsWith("/admin")) {
            trackPortfolioAction("PAGE_VIEW", {
                path: pathname,
                pageTitle: document.title
            });
        }

        // 2. Global delegate listener for any element with data-track-action
        const handleGlobalClick = (e: MouseEvent) => {
            const target = (e.target as HTMLElement).closest("[data-track-action]");
            if (target) {
                const action = target.getAttribute("data-track-action") || "CLICK";
                const title = target.getAttribute("data-track-title") || "";
                trackPortfolioAction(action, { pageTitle: title });
            }
        };

        document.addEventListener("click", handleGlobalClick, { capture: true });
        return () => {
            document.removeEventListener("click", handleGlobalClick, { capture: true });
        };
    }, [pathname]);

    return null;
}
