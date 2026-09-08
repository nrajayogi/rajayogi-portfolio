"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { services } from "@/data/services";
import { Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function Header() {
    const [isOpen, setIsOpen] = React.useState(false);
    const [isServicesOpen, setIsServicesOpen] = React.useState(false);
    const pathname = usePathname();

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <Container>
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center space-x-2">
                            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                                Vyantraa
                            </span>
                        </Link>

                        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                            <Link
                                href="/"
                                className={cn("transition-colors hover:text-foreground/80", pathname === "/" ? "text-primary" : "text-foreground/60")}
                            >
                                Home
                            </Link>
                            <Link
                                href="/about"
                                className={cn("transition-colors hover:text-foreground/80", pathname === "/about" ? "text-primary" : "text-foreground/60")}
                            >
                                About
                            </Link>

                            {/* Desktop Services Dropdown */}
                            <div className="relative group">
                                <button
                                    className={cn(
                                        "flex items-center gap-1 transition-colors hover:text-foreground/80 outline-none",
                                        pathname.startsWith("/services") ? "text-primary" : "text-foreground/60"
                                    )}
                                >
                                    Services
                                    <ChevronDown className="h-4 w-4" />
                                </button>
                                <div className="absolute top-full left-0 pt-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0">
                                    <div className="rounded-[4px] border bg-popover p-2 shadow-md">
                                        <Link
                                            href="/services"
                                            className="block select-none space-y-1 rounded-[4px] p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                        >
                                            <div className="text-sm font-medium leading-none">Services Overview</div>
                                            <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                                                Explore all our digital transformation capabilities.
                                            </p>
                                        </Link>
                                        <div className="h-px bg-muted my-1" />
                                        {services.map((service) => (
                                            <Link
                                                key={service.id}
                                                href={`/services/${service.slug}`}
                                                className="block rounded-[4px] px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                                            >
                                                {service.title}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Desktop Products Dropdown (NEW) */}
                            <div className="relative group">
                                <button
                                    className={cn(
                                        "flex items-center gap-1 transition-colors hover:text-foreground/80 outline-none",
                                        pathname.startsWith("/products") ? "text-primary" : "text-foreground/60"
                                    )}
                                >
                                    Products
                                    <ChevronDown className="h-4 w-4" />
                                </button>
                                <div className="absolute top-full left-0 pt-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0">
                                    <div className="rounded-[4px] border bg-popover p-2 shadow-md">
                                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                                            Learning & Development
                                        </div>
                                        <Link
                                            href="/products/training"
                                            className="block rounded-[4px] px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                                        >
                                            Training Academy
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            <Link
                                href="/industries"
                                className={cn("transition-colors hover:text-foreground/80", pathname === "/industries" ? "text-primary" : "text-foreground/60")}
                            >
                                Industries
                            </Link>
                            <Link
                                href="/contact"
                                className={cn("transition-colors hover:text-foreground/80", pathname === "/contact" ? "text-primary" : "text-foreground/60")}
                            >
                                Contact
                            </Link>
                        </nav>
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        <Button asChild>
                            <Link href="/contact">Talk to an Expert</Link>
                        </Button>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="flex items-center space-x-2 md:hidden"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </Container>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden border-t bg-background">
                    <Container className="py-4 space-y-4">
                        <Link
                            href="/"
                            onClick={() => setIsOpen(false)}
                            className="block text-sm font-medium hover:text-primary"
                        >
                            Home
                        </Link>
                        <Link
                            href="/about"
                            onClick={() => setIsOpen(false)}
                            className="block text-sm font-medium hover:text-primary"
                        >
                            About
                        </Link>
                        <div>
                            <button
                                onClick={() => setIsServicesOpen(!isServicesOpen)}
                                className="flex items-center justify-between w-full text-sm font-medium hover:text-primary"
                            >
                                Services
                                <ChevronDown className={cn("h-4 w-4 transition-transform", isServicesOpen && "rotate-180")} />
                            </button>
                            {isServicesOpen && (
                                <div className="pl-4 mt-2 space-y-2 border-l-2 border-muted ml-1">
                                    <Link
                                        href="/services"
                                        onClick={() => setIsOpen(false)}
                                        className="block text-sm text-muted-foreground hover:text-primary"
                                    >
                                        All Services
                                    </Link>
                                    {services.map((service) => (
                                        <Link
                                            key={service.id}
                                            href={`/services/${service.slug}`}
                                            onClick={() => setIsOpen(false)}
                                            className="block text-sm text-muted-foreground hover:text-primary"
                                        >
                                            {service.title}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Mobile Products Link (Simplified as link for now, or dropdown if needed. Let's do dropdown for consistency) */}
                        <div>
                            <Link
                                href="/products/training"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center justify-between w-full text-sm font-medium hover:text-primary"
                            >
                                Products
                            </Link>
                            <div className="pl-4 mt-2 space-y-2 border-l-2 border-muted ml-1">
                                <Link
                                    href="/products/training"
                                    onClick={() => setIsOpen(false)}
                                    className="block text-sm text-muted-foreground hover:text-primary"
                                >
                                    Training Academy
                                </Link>
                            </div>
                        </div>

                        <Link
                            href="/industries"
                            onClick={() => setIsOpen(false)}
                            className="block text-sm font-medium hover:text-primary"
                        >
                            Industries
                        </Link>
                        <Link
                            href="/contact"
                            onClick={() => setIsOpen(false)}
                            className="block text-sm font-medium hover:text-primary"
                        >
                            Contact
                        </Link>
                        <div className="pt-4">
                            <Button asChild className="w-full">
                                <Link href="/contact" onClick={() => setIsOpen(false)}>Talk to an Expert</Link>
                            </Button>
                        </div>
                    </Container>
                </div>
            )}
        </header>
    );
}
