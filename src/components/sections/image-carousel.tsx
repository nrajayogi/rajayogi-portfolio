"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCoverflow } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

import { useContent } from "@/lib/content-context";
import { EditableImage } from "@/components/admin/editable-image";

export function ImageCarousel() {
    const { content } = useContent();
    const images = content.imageCarousel || [];

    // Duplicate logic for smooth loop if needed, effectively tripling the array for buffer
    // Or just use the dynamic array directly if it's long enough. 
    // For safety matching previous behavior:
    const carouselImages = [...images, ...images, ...images];

    const isEmpty = images.length === 0;

    if (isEmpty) {
        return (
            <section className="relative w-full min-h-[50vh] flex flex-col items-center justify-center bg-slate-900 border-t border-border">
                <div className="text-center p-10">
                    <h3 className="text-xl font-bold text-white mb-2">Carousel Section</h3>
                    <p className="text-slate-400">No images added yet. Add images in the editor to see preview.</p>
                </div>
            </section>
        );
    }

    return (
        <section className="relative w-full min-h-screen flex flex-col items-center justify-center bg-background overflow-hidden border-t border-border">
            <div className="w-full">
                <Swiper
                    effect={"coverflow"}
                    grabCursor={true}
                    centeredSlides={true}
                    slidesPerView={"auto"}
                    spaceBetween={50}
                    loop={true}
                    speed={800} // Smooth transition speed
                    autoplay={{
                        delay: 2500,
                        disableOnInteraction: false,
                    }}
                    coverflowEffect={{
                        rotate: -10, // Adjusted rotation
                        stretch: -12, // Optimized separation
                        depth: 150, // Deep perspective to shrink sides
                        modifier: 1, // Standard modifier
                        slideShadows: false, // Cleaner look without defaults
                    }}
                    modules={[EffectCoverflow, Autoplay]}
                    className="w-full"
                >
                    {carouselImages.map((src, index) => (
                        <SwiperSlide
                            key={index}
                            className="!w-[300px] md:!w-[400px] !h-[400px] md:!h-[500px] relative transition-all duration-500"
                        >
                            {/* 
                The Swiper 'coverflow' effect handles the positioning/scale 3D transform.
                We just need to ensure the image fills the card beautifully.
              */}
                            <div className="w-full h-full rounded-[4px] overflow-hidden relative bg-black">
                                <EditableImage
                                    path={`imageCarousel.${index % images.length}`}
                                    src={src}
                                    alt={`Slide ${index}`}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 300px, 400px"
                                    priority={true} // Priority ALL images to ensure clones render immediately (fixes 'missing image' bug)
                                />
                                {/* Optional Overlay for non-active slides? 
                     Swiper doesn't offer 'opacity' on non-active easily without custom css, 
                     but coverflow depth makes them look 'back'. 
                 */}
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* CSS adjustments to force the 'Active' slide to be fully opaque and others dimmed if needed */}
            <style jsx global>{`
        .swiper-slide {
           transition: all 0.5s ease;
           filter: brightness(0.7); /* make side cards darker/dimmed */
        }
        .swiper-slide-active {
           filter: brightness(1); /* Active card pops */
           z-index: 10;
        }
      `}</style>
        </section>
    );
}
