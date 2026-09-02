"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { AnalyticsTracker } from "@/components/analytics-tracker";

export function LayoutClientWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith("/admin");

    return (
        <>
            <AnalyticsTracker />
            {!isAdmin && <Navbar />}
            {children}
        </>
    );
}
