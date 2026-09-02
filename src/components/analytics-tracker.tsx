"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function AnalyticsTracker() {
    const pathname = usePathname();
    const initialized = useRef(false);

    useEffect(() => {
        // Prevent double tracking in React Strict Mode dev
        if (initialized.current) {
            // in dev mode strict mode mounts twice, but for route change we want to track
        }

        const trackPage = async () => {
            try {
                await fetch("/api/analytics/track", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        path: pathname,
                        userAgent: navigator.userAgent,
                        country: "Unknown" // Placeholder until IP geo is added
                    }),
                });
            } catch (error) {
                console.error("Analytics error", error);
            }
        };

        trackPage();
    }, [pathname]);

    return null;
}
