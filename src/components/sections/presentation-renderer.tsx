"use client";

import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, Keyboard, EffectCoverflow, Pagination } from "swiper/modules";
import { PresentationData, SlideElement } from "@/lib/presentation-types";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

interface PresentationRendererProps {
    presentationData: PresentationData;
}

export function PresentationRenderer({ presentationData }: PresentationRendererProps) {
    const { slides, settings } = presentationData;

    const getShadowClass = (shadow?: string) => {
        switch (shadow) {
            case 'none': return 'shadow-none';
            case 'small': return 'shadow-md';
            case 'medium': return 'shadow-xl';
            case 'large': return 'shadow-2xl shadow-black/50';
            default: return 'shadow-2xl shadow-black/50';
        }
    };

    return (
        <Swiper
            direction={'horizontal'}
            slidesPerView={'auto'}
            centeredSlides={true}
            spaceBetween={parseInt(settings?.spaceBetween || '50')}
            mousewheel={true}
            keyboard={true}
            effect={'coverflow'}
            coverflowEffect={{
                rotate: 0,
                stretch: 0,
                depth: 200,
                modifier: 1,
                slideShadows: false,
            }}
            pagination={{
                clickable: true,
                dynamicBullets: true
            }}
            modules={[Mousewheel, Keyboard, EffectCoverflow, Pagination]}
            observer={true}
            observeParents={true}
            className="w-full h-full"
            wrapperClass="!items-center"
            style={{ paddingTop: settings?.paddingTop || '0px' }}
        >
            {slides.map((slide) => (
                <SwiperSlide
                    key={slide.id}
                    className="flex items-center justify-center"
                    style={{
                        width: settings?.width || '1000px',
                        maxWidth: '90vw',
                        height: settings?.height || '75vh'
                    }}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className={`w-full h-full backdrop-blur-xl border border-white/10 relative ${getShadowClass(settings?.shadow)}`}
                        style={{
                            backgroundColor: slide.background || settings?.backgroundColor || 'rgba(15, 23, 42, 0.5)',
                            borderRadius: settings?.cornerRadius || '24px',
                            backgroundImage: slide.backgroundImage ? `url(${slide.backgroundImage})` : undefined,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                        {slide.elements
                            .sort((a, b) => a.zIndex - b.zIndex)
                            .map((element) => (
                                <SlideElementRenderer key={element.id} element={element} />
                            ))}
                    </motion.div>
                </SwiperSlide>
            ))}
        </Swiper>
    );
}

interface SlideElementRendererProps {
    element: SlideElement;
}

function SlideElementRenderer({ element }: SlideElementRendererProps) {
    return (
        <div
            className="absolute"
            style={{
                left: `${element.position.x}px`,
                top: `${element.position.y}px`,
                width: `${element.size.width}px`,
                height: `${element.size.height}px`,
                transform: `rotate(${element.rotation}deg)`,
                zIndex: element.zIndex,
            }}
        >
            {element.type === 'text' && (
                <div
                    className="w-full h-full overflow-hidden whitespace-pre-wrap break-words"
                    style={{
                        fontSize: `${element.fontSize}px`,
                        fontFamily: element.fontFamily,
                        fontWeight: element.fontWeight,
                        color: element.color,
                        textAlign: element.textAlign,
                        lineHeight: element.lineHeight,
                    }}
                >
                    {element.text}
                </div>
            )}

            {element.type === 'image' && element.src && (
                <img
                    src={element.src}
                    alt="Slide element"
                    className="w-full h-full object-contain"
                    style={{ opacity: element.opacity }}
                />
            )}

            {element.type === 'shape' && (
                <div
                    className="w-full h-full"
                    style={{
                        backgroundColor: element.fillColor,
                        border: `${element.borderWidth}px solid ${element.borderColor}`,
                        borderRadius: element.shapeType === 'circle' ? '50%' : '0',
                    }}
                />
            )}
        </div>
    );
}
