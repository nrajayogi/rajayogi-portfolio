"use client";

import { useEffect, useRef } from "react";
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

// Helper to extract and persist company attribution across all pages visited in session
export function getTrackedCompany(): string | null {
    if (typeof window === "undefined") return null;
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const companyParam = urlParams.get("c") || urlParams.get("company") || urlParams.get("ref");
        if (companyParam && companyParam.trim()) {
            const clean = companyParam.trim().slice(0, 80);
            sessionStorage.setItem("tracked_company", clean);
            return clean;
        }
        return sessionStorage.getItem("tracked_company");
    } catch (_) {
        return null;
    }
}

// Helper to retrieve or establish persistent browser session ID
export function getSessionId(): string {
    if (typeof window === "undefined") return "anon";
    try {
        let sid = sessionStorage.getItem("portfolio_session_id");
        if (!sid) {
            sid = "ses_" + Math.random().toString(36).substring(2, 9) + "_" + Date.now().toString(36);
            sessionStorage.setItem("portfolio_session_id", sid);
        }
        return sid;
    } catch (_) {
        return "anon";
    }
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
        const company = getTrackedCompany();
        const sessionId = getSessionId();

        const res = await fetch("/api/analytics/track", {
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
                company,
                sessionId,
                durationSeconds: 0,
                scrollDepth: 0
            }),
        });

        if (res.ok) {
            const data = await res.json();
            return data.id as string | undefined;
        }
    } catch (error) {
        console.debug("Telemetry error:", error);
    }
}

export function AnalyticsTracker() {
    const pathname = usePathname();
    const currentRecordIdRef = useRef<string | null>(null);

    useEffect(() => {
        // Skip tracking for admin portal
        if (pathname.startsWith("/admin")) return;

        // Attach global helper to window for custom button triggers
        if (typeof window !== "undefined") {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (window as any).trackPortfolioAction = trackPortfolioAction;
        }

        const company = getTrackedCompany();
        const sessionId = getSessionId();
        let activeSeconds = 0;
        let maxScrollDepth = 0;
        let isTabFocused = typeof document !== "undefined" ? !document.hidden : true;

        // Measure initial scroll depth
        const calculateScroll = () => {
            if (typeof window === "undefined") return;
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const winHeight = window.innerHeight;
            const docHeight = document.documentElement.scrollHeight;
            if (docHeight > 0) {
                const current = Math.min(100, Math.round(((scrollTop + winHeight) / docHeight) * 100));
                if (current > maxScrollDepth) {
                    maxScrollDepth = current;
                }
            }
        };

        calculateScroll();

        // 1. Initial Page View tracking
        trackPortfolioAction("PAGE_VIEW", {
            path: pathname,
            pageTitle: document.title
        }).then((id) => {
            if (id) currentRecordIdRef.current = id;
        });

        // 2. Active Tab Focus & Dwell Time counter (counts only when visible and focused)
        const timerInterval = setInterval(() => {
            if (isTabFocused && !document.hidden) {
                activeSeconds += 1;
            }
        }, 1000);

        // 3. Scroll depth listener (passive)
        const onScroll = () => {
            calculateScroll();
        };
        window.addEventListener("scroll", onScroll, { passive: true });

        // 4. Tab visibility change & focus listeners
        const sendEngagementBeacon = () => {
            if (activeSeconds <= 0 && maxScrollDepth <= 0) return;
            const payload = JSON.stringify({
                action: "HEARTBEAT",
                recordId: currentRecordIdRef.current,
                sessionId,
                path: pathname,
                company,
                durationSeconds: activeSeconds,
                scrollDepth: maxScrollDepth
            });

            if (navigator.sendBeacon) {
                const blob = new Blob([payload], { type: "application/json" });
                navigator.sendBeacon("/api/analytics/track", blob);
            } else {
                fetch("/api/analytics/track", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: payload,
                    keepalive: true
                }).catch(() => {});
            }
        };

        const onVisibilityChange = () => {
            isTabFocused = !document.hidden;
            if (document.hidden) {
                sendEngagementBeacon();
            }
        };

        const onFocus = () => { isTabFocused = true; };
        const onBlur = () => { 
            isTabFocused = false; 
            sendEngagementBeacon();
        };

        document.addEventListener("visibilitychange", onVisibilityChange);
        window.addEventListener("focus", onFocus);
        window.addEventListener("blur", onBlur);

        // 5. Periodic heartbeat sync every 12 seconds
        const heartbeatInterval = setInterval(() => {
            if (activeSeconds > 0) {
                sendEngagementBeacon();
            }
        }, 12000);

        // 6. Global delegate listener for elements with data-track-action
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
            sendEngagementBeacon();
            clearInterval(timerInterval);
            clearInterval(heartbeatInterval);
            window.removeEventListener("scroll", onScroll);
            document.removeEventListener("visibilitychange", onVisibilityChange);
            window.removeEventListener("focus", onFocus);
            window.removeEventListener("blur", onBlur);
            document.removeEventListener("click", handleGlobalClick, { capture: true });
        };
    }, [pathname]);

    return null;
}
