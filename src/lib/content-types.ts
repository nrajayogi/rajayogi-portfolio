export interface Page {
    id: string;
    slug: string; // e.g. "careers" or "legal/privacy"
    title: string;
    content: string; // HTML or Markdown content
    layout?: 'default' | 'cinematic'; // New layout field
    settings?: {
        width?: string; // CSS value, e.g. "800px" or "90vw"
        height?: string; // CSS value, e.g. "600px" or "80vh"
        backgroundColor?: string; // Hex or rgba
        cornerRadius?: string; // CSS value, e.g. "24px"
        spaceBetween?: string; // Gap between slides
        shadow?: string; // Shadow intensity: 'none', 'small', 'medium', 'large'
        paddingTop?: string; // Vertical positioning
    };
    published: boolean;
    updatedAt: string;
    presentationData?: unknown; // JSON data for canvas-based presentations
}

export interface Content {
    metadata?: {
        version: number;
        lastUpdated: string;
    };
    hero: {
        title: string;
        subtitle: string;
        description: string;
        primaryCta: string;
        secondaryCta: string;
        videoUrl?: string; // Editable video path
        videoBrightness?: number; // Video brightness percentage
        logoUrl?: string;  // Editable logo path
        logoUrlMobile?: string; // Editable mobile logo path
        overlayBlur?: number; // Blur intensity (px) - Global
        layout: {
            desktop: {
                overlayPosition: { x: number; y: number };
                overlayScale: number;
                edgeToEdge: boolean;
            };
            tablet: {
                overlayPosition: { x: number; y: number };
                overlayScale: number;
                edgeToEdge: boolean;
            };
            mobile: {
                overlayPosition: { x: number; y: number };
                overlayScale: number;
                edgeToEdge: boolean;
            };
        };
        bottomStats: Array<{
            label: string;
            value: string;
            sub: string;
        }>;
        styles: {
            titleSize: {
                mobile: string;
                desktop: string;
            };
            descriptionSize: string;
        };
    };
    services: {
        header: {
            subtitle: string;
            title: string;
            description: string;
        };
        items: Array<{
            title: string;
            description: string;
        }>;
    };
    methodology: {
        header: {
            subtitle: string;
            titleLine1: string;
            titleLine2: string;
        };
        steps: Array<{
            id: string;
            title: string;
            desc: string;
        }>;
    };
    vision: {
        text: {
            line1: string;
            highlight: string;
            line2: string;
        };
    };
    partners: {
        header: {
            label: string;
            title: string;
        };
        logos: Array<{
            name: string;
            logo: string;
        }>;
    };
    about: {
        hero: {
            subtitle: string;
            title: string;
            description: string;
            videoUrl: string;
        };
        stats: Array<{
            label: string;
            value: string;
            sub: string;
            icon?: string;
        }>;
        mission: {
            label: string;
            quote: string;
            description: string;
        };
        values: Array<{
            title: string;
            description: string;
            icon: string;
        }>;
        timeline: Array<{
            year: string;
            title: string;
            description: string;
        }>;
        leadership: Array<{
            name: string;
            role: string;
            bio: string;
        }>;
    };
    contact: {
        hero: {
            subtitle: string;
            title: string;
            description: string;
            videoUrl: string;
        };
        info: {
            subtitle: string;
            title: string;
            description: string;
        };
        locations: Array<{
            title: string;
            address: string;
            phone: string;
            email: string;
            flag: string;
        }>;
        form: {
            title: string;
            namePlaceholder: string;
            emailPlaceholder: string;
            messagePlaceholder: string;
            submitButton: string;
        };
    };
    careers: {
        hero: {
            subtitle: string;
            title: string;
            description: string;
            videoUrl: string;
        };
        culture: {
            subtitle: string;
            title: string;
            description: string;
            imageUrl: string;
        };
        benefits: Array<{
            title: string;
            icon: string;
            description: string;
        }>;
        jobs: Array<{
            title: string;
            department: string;
            location: string;
            type: string;
        }>;
    };
    training: {
        hero: {
            subtitle: string;
            title: string;
            description: string;
            videoUrl: string;
        };
        courses: Array<{
            title: string;
            duration: string;
            level: string;
            description: string;
        }>;
    };
    imageCarousel: string[];
    sectionsOrder: string[];
    footer?: {
        logoUrl?: string;
        tagline: string;
        socials: Array<{
            name: string;
            url: string;
            icon: string;
        }>;
        locations: Array<{
            city: string;
            address: string;
            phone: string;
        }>;
        copyright: string;
    };
    navbar?: {
        links: Array<{ label: string; href: string; isExternal?: boolean }>;
    };
    pages?: Array<Page>;
    // Add other sections as we migrate them
    [key: string]: unknown;
}
