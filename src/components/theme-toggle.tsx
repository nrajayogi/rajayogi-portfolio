"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
    const { setTheme, theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-transparent hover:bg-white/10 transition-all">
                {/* Placeholder while mounting to prevent layout accumulation */}
            </button>
        )
    }

    return (
        <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="group flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-border/50 bg-background/50 backdrop-blur-xl hover:bg-muted/50 transition-all shadow-lg"
        >
            <div className="relative w-5 h-5 flex items-center justify-center">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-foreground" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-foreground" />
            </div>
            <span className="text-sm font-medium uppercase tracking-widest text-foreground hidden md:block">
                {theme === 'light' ? 'Light' : 'Dark'}
            </span>
        </button>
    );
}
