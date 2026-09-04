"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function AnalyticsTracker() {
    const pathname = usePathname();
    const initialized = useRef(false);

    useEffect(() => {
        // Skip tracking if visiting admin dashboard
        if (!pathname || pathname.startsWith("/admin")) {
            return;
        }

        const trackPage = async () => {
            try {
                const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                const referrer = document.referrer ? new URL(document.referrer).hostname : "Direct";

                await fetch("/api/analytics/track", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        path: pathname,
                        userAgent: navigator.userAgent,
                        referrer,
                        timeZone,
                        language: navigator.language,
                        screen: `${window.innerWidth}x${window.innerHeight}`
                    }),
                });
            } catch (error) {
                console.error("Analytics tracking error", error);
            }
        };

        trackPage();
    }, [pathname]);

    return null;
}
