"use client";

import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Autoplay, EffectCoverflow, Navigation, Pagination } from "swiper/modules";
import { ArrowLeft, ArrowRight, UserCheck } from "lucide-react";
import StoryCard, { ProfileStandoutStory } from "@/components/ui/StoryCard";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import "swiper/css/pagination";

export const PROFILE_STANDOUT_STORIES: ProfileStandoutStory[] = [
    {
        id: "spatial-xr",
        number: "01",
        category: "Spatial XR",
        title: "Spatial Computing & XR",
        subtitle: "University of Twente Master's Thesis",
        shortMetric: "-38% Strain",
        description: "Master's thesis research at the University of Twente architecting hands-free multimodal guidance for cargo bike manufacturing in Unity XR & MRTK. Validated with a 38% ergonomic workload strain reduction through NASA-TLX evaluations.",
        bulletPoints: [
            "Unity XR & Microsoft MRTK spatial guidance interface",
            "NASA-TLX empirical evaluation with industrial assembly workers",
            "Hands-free gaze dwell (250ms) and spatial voice command integration"
        ],
        image: "/images/doodles/magic.svg",
        bgColor: "bg-[#e5d9ee]", // Soft Lilac
        accentColor: "#7e22ce"
    },
    {
        id: "behavioral-ux",
        number: "02",
        category: "Behavioral UX",
        title: "Behavioral Game Theory",
        subtitle: "Quant UX & Habit Loops at Homemade",
        shortMetric: "p = 0.000208",
        description: "Designed the behavioral incentive architecture and squad mechanics at Homemade to drive engagement and retention without relying on pure discount subsidies.",
        bulletPoints: [
            "Social squad pickup coordination and habit loop mechanics",
            "Statistically significant retention lift validated via Fisher's exact test (p = 0.000208)",
            "Randomized cohort A/B experiments on consumer food behavior"
        ],
        image: "/images/doodles/seed.svg",
        bgColor: "bg-[#d5ebd9]", // Soft Sage
        accentColor: "#166534"
    },
    {
        id: "systems-arch",
        number: "03",
        category: "Cloud CPMS",
        title: "Full-Stack Architecture",
        subtitle: "Production CleanTech EV Infrastructure",
        shortMetric: "480 kW Fast-Charge",
        description: "Engineered scalable cloud CPMS dispatch telemetry for AXAL Power's 480kW fast-charging stations, implementing OCPP 2.0.1 compliance, dynamic load balancing, and millisecond latencies.",
        bulletPoints: [
            "OCPP 2.0.1 compliant cloud charger management system (CPMS)",
            "Dynamic Load Balancing (DLB) protecting local 50Hz grid capacity",
            "Full-stack Next.js 16, TypeScript, Supabase SSR, and automated billing"
        ],
        image: "/images/doodles/chef-art.svg",
        bgColor: "bg-[#ede2d1]", // Warm Oatmeal
        accentColor: "#ea580c"
    },
    {
        id: "medical-telemetry",
        number: "04",
        category: "Biosensors",
        title: "Biosensors & Telemetry",
        subtitle: "Nadi Pulse Ayurvedic Healthcare · 2023",
        shortMetric: "Radial Wave",
        description: "Pioneered Nadi Pulse, translating radial artery pulse wave velocities and Tridosha pathology into intuitive patient telemetry and doctor portals. Differentiating baseline Prakriti from acute Vikriti deviations.",
        bulletPoints: [
            "Tridosha orbital dials mapping Vata, Pitta, and Kapha pulse dynamics",
            "Bluetooth radial sensor pairing flow establishing immediate hardware trust",
            "Integrated EHR portal for Vaidyas (Ahara, Vihara & Aushadhi prescribing)"
        ],
        image: "/images/doodles/profile.svg",
        bgColor: "bg-[#d8e7fc]", // Soft Sky Blue
        accentColor: "#2563eb"
    },
    {
        id: "human-robot-collab",
        number: "05",
        category: "Robotics HRC",
        title: "Human-Robot Collab",
        subtitle: "Industrial Ergonomics & Cognitive Load",
        shortMetric: "Semi-Auto Sync",
        description: "Investigated transparent crane/hoist synchronization and cognitive workload in high-consequence heavy manufacturing environments, creating predictable semi-autonomous assistance.",
        bulletPoints: [
            "Contextual cognitive task analysis on active manufacturing shop floors",
            "Semi-automated crane hoist coordination with safety envelope spatial boundaries",
            "Ergonomic posture modeling and physical strain reduction protocols"
        ],
        image: "/images/doodles/robot-collab.svg",
        bgColor: "bg-[#d1fae5]", // Soft Mint
        accentColor: "#059669"
    },
    {
        id: "creator-marketplace",
        number: "06",
        category: "Marketplaces",
        title: "Creator Marketplaces",
        subtitle: "Homemade Chefs Creator Economics",
        shortMetric: "85/15 Margin",
        description: "Architected the creator marketplace for homemadechefs.com, empowering local artisanal chefs with compliance verification, dynamic batch windows, and transparent revenue modeling.",
        bulletPoints: [
            "Dutch NVWA food safety verification and kitchen hygiene audit workflow",
            "Dynamic batch ordering windows reducing kitchen stress and food waste",
            "Transparent earnings forecasting tool reducing onboarding drop-off by 42%"
        ],
        image: "/images/doodles/marketplace.svg",
        bgColor: "bg-[#ffedd5]", // Soft Peach
        accentColor: "#f97316"
    },
    {
        id: "field-ethnography",
        number: "07",
        category: "Field Testing",
        title: "Field Ethnography",
        subtitle: "In-Situ Shop Floor Usability Studies",
        shortMetric: "20+ Studies",
        description: "Specialized in in-situ user research conducted on active industrial factory floors and real commercial kitchens rather than isolated, sterile usability laboratories.",
        bulletPoints: [
            "Shadow testing with assembly workers in Enschede cargo-bike plants",
            "Subjective and objective workload measurement protocols (NASA-TLX, SUS)",
            "Translating messy qualitative observations into quantifiable design heuristics"
        ],
        image: "/images/doodles/ethnography.svg",
        bgColor: "bg-[#ffe4e6]", // Soft Rose
        accentColor: "#f43f5e"
    },
    {
        id: "design-systems",
        number: "08",
        category: "Design Systems",
        title: "Design Systems",
        subtitle: "Figma to Production Code Architecture",
        shortMetric: "100% Tokenized",
        description: "Bridging the gap between Figma design systems and production code with unified design tokens, strict accessibility standards, and reusable cross-platform components.",
        bulletPoints: [
            "Multi-platform design token architecture (React Native & Next.js)",
            "WCAG AA accessible contrast, minimum 48px touch targets, and keyboard navigation",
            "Automated component documentation and developer handoff workflows"
        ],
        image: "/images/doodles/design-system.svg",
        bgColor: "bg-[#ede9fe]", // Soft Lavender
        accentColor: "#8b5cf6"
    },
    {
        id: "product-leadership",
        number: "09",
        category: "0-to-1 Lead",
        title: "0-to-1 Product Leadership",
        subtitle: "Netherlands · Chicago · India",
        shortMetric: "3 Global Hubs",
        description: "Proven track record operating across international engineering and design hubs (Netherlands, US, India). Leading multidisciplinary teams from in-situ factory floor observations to shipped commercial platforms.",
        bulletPoints: [
            "Cross-cultural alignment across engineering, product design, and executive leadership",
            "Shipped 1 Master's Thesis system and 3 commercial production platforms",
            "Fast 0-to-1 execution from rapid Figma prototypes to scalable cloud architectures"
        ],
        image: "/images/doodles/memories.svg",
        bgColor: "bg-[#fef3c7]", // Warm Gold
        accentColor: "#ca8a04"
    }
];

export function HomemadeValueCarousel() {
    const swiperRef = useRef<SwiperType | null>(null);
    const [activeStoryIdx, setActiveStoryIdx] = useState(0);

    // Duplicate 2 times for 18 total slides — creating a seamless, deep 3D cylindrical loop
    const carouselItems = [...PROFILE_STANDOUT_STORIES, ...PROFILE_STANDOUT_STORIES];

    return (
        <section id="standout-profile" className="w-full bg-background border-t border-b border-border relative overflow-hidden">
            
            {/* Full-Width Section Header */}
            <div className="w-full px-6 sm:px-12 md:px-16 lg:px-20 py-10 md:py-14 border-b border-border flex flex-col md:flex-row md:items-end justify-between gap-6 bg-card/10">
                <div className="max-w-3xl">
                    <span className="text-primary text-xs font-semibold tracking-wider uppercase mb-3 flex items-center gap-1.5 font-sans">
                        <UserCheck size={14} />
                        <span>Why I Stand Out · Signature Profile</span>
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-foreground tracking-tight font-sans">
                        What Sets <span className="text-primary font-semibold">Rajayogi</span> Apart
                    </h2>
                    <p className="text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed mt-3 max-w-2xl font-sans font-light">
                        Bridging empirical cognitive research, spatial computing, and scalable production systems to engineer experiences that amplify human potential.
                    </p>
                    <div className="w-14 h-1 bg-primary mt-5 rounded-[4px]" />
                </div>

                {/* Interactive Navigation Arrows */}
                <div className="flex items-center gap-3 self-start md:self-end">
                    <button
                        onClick={() => swiperRef.current?.slidePrev()}
                        aria-label="Previous Competency"
                        className="w-12 h-12 rounded-[4px] border border-border bg-card hover:bg-primary hover:text-white hover:border-primary text-foreground flex items-center justify-center transition-all cursor-pointer shadow-none"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <button
                        onClick={() => swiperRef.current?.slideNext()}
                        aria-label="Next Competency"
                        className="w-12 h-12 rounded-[4px] border border-border bg-card hover:bg-primary hover:text-white hover:border-primary text-foreground flex items-center justify-center transition-all cursor-pointer shadow-none"
                    >
                        <ArrowRight size={18} />
                    </button>
                </div>
            </div>

            {/* Full-Width Interactive Competency Category Pills Bar */}
            <div className="w-full border-b border-border bg-card/5 px-6 sm:px-12 md:px-16 lg:px-20 py-4 overflow-x-auto">
                <div className="flex items-center gap-2.5 min-w-max">
                    {PROFILE_STANDOUT_STORIES.map((story, idx) => {
                        const isSelected = activeStoryIdx === idx;
                        return (
                            <button
                                key={story.id}
                                onClick={() => {
                                    if (swiperRef.current) {
                                        swiperRef.current.slideToLoop(idx);
                                    }
                                }}
                                className={`px-4 py-2 rounded-[4px] text-xs font-sans font-medium transition-all flex items-center gap-2 cursor-pointer shadow-none ${
                                    isSelected
                                        ? "bg-primary text-white font-semibold"
                                        : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                                }`}
                            >
                                <span className="font-mono text-[10px] opacity-75">{story.number}</span>
                                <span 
                                    className="w-2 h-2 rounded-full" 
                                    style={{ backgroundColor: story.accentColor }} 
                                />
                                <span>{story.title}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* 3D Cylindrical Swiper Viewport - Expansive Across Screen */}
            <div className="w-full relative py-12 md:py-18 overflow-hidden">
                <Swiper
                    onSwiper={(swiper) => {
                        swiperRef.current = swiper;
                    }}
                    onSlideChange={(swiper) => {
                        setActiveStoryIdx(swiper.realIndex % PROFILE_STANDOUT_STORIES.length);
                    }}
                    effect={"coverflow"}
                    grabCursor={true}
                    centeredSlides={true}
                    slidesPerView={"auto"}
                    spaceBetween={50}
                    loop={true}
                    speed={800}
                    slideToClickedSlide={true}
                    autoplay={{
                        delay: 3800,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    }}
                    coverflowEffect={{
                        rotate: -10,
                        stretch: -12,
                        depth: 150,
                        modifier: 1,
                        slideShadows: false,
                    }}
                    pagination={{
                        clickable: true,
                        el: ".profile-swiper-pagination",
                    }}
                    modules={[EffectCoverflow, Autoplay, Navigation, Pagination]}
                    className="w-full py-6 !overflow-visible swiper-coverflow"
                >
                    {carouselItems.map((story, index) => (
                        <SwiperSlide
                            key={index}
                            className="!w-[300px] sm:!w-[340px] md:!w-[380px] !h-[490px] sm:!h-[510px] md:!h-[530px] relative transition-all duration-500 group"
                        >
                            <StoryCard story={story} />
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Pagination Bullets */}
                <div className="profile-swiper-pagination flex justify-center items-center gap-2 pt-8" />
            </div>
        </section>
    );
}
