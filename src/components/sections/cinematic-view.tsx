"use client";

import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, Keyboard, EffectCoverflow, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import React from "react";

interface CinematicViewProps {
    slides: string[];
    settings?: {
        width?: string;
        height?: string;
        backgroundColor?: string;
        cornerRadius?: string;
        spaceBetween?: string;
        shadow?: string;
        paddingTop?: string;
    };
    editable?: boolean;
    onSlideChange?: (index: number, newContent: string) => void;
    onElementSelect?: (element: HTMLElement | null) => void;
    onIndexChange?: (index: number) => void;
}

export function CinematicView({ slides, settings, editable, onSlideChange, onElementSelect, onIndexChange }: CinematicViewProps) {
    const getShadowClass = (shadow?: string) => {
        switch (shadow) {
            case 'none': return 'shadow-none';
            case 'small': return 'shadow-md';
            case 'medium': return 'shadow-xl';
            case 'large': return 'shadow-2xl shadow-black/50';
            default: return 'shadow-2xl shadow-black/50'; // Default
        }
    };

    const handleMouseDown = (e: React.MouseEvent, index: number) => {
        if (!editable) return;
        const target = e.target as HTMLElement;

        // Select the element
        onElementSelect?.(target);

        // Check if draggable
        if (target.style.position === 'absolute' || target.tagName === 'IMG' || target.tagName === 'VIDEO' || ['H1', 'H2', 'H3', 'P', 'DIV', 'SPAN'].includes(target.tagName)) {

            // Force absolute if needed
            if (target.style.position !== 'absolute') {
                target.style.position = 'absolute';
                target.style.left = target.offsetLeft + 'px';
                target.style.top = target.offsetTop + 'px';
            }

            // CRITICAL: Prevent default to stop browser native drag (ghosts) & text selection
            // We ONLY do this because we have a separate "Double Click" mode for editing.
            e.preventDefault();
            e.stopPropagation();

            target.style.userSelect = "none";
            target.style.webkitUserSelect = "none";

            const startX = e.clientX;
            const startY = e.clientY;
            const initialLeft = parseFloat(target.style.left || '0') || target.offsetLeft;
            const initialTop = parseFloat(target.style.top || '0') || target.offsetTop;

            // Visual feedback
            target.style.outline = "2px dashed #3b82f6";
            target.style.zIndex = "50"; // Bring to front while dragging

            const handleMouseMove = (ev: MouseEvent) => {
                const deltaX = ev.clientX - startX;
                const deltaY = ev.clientY - startY;
                target.style.left = `${initialLeft + deltaX}px`;
                target.style.top = `${initialTop + deltaY}px`;
            };

            const handleMouseUp = () => {
                // Cleanup
                target.style.outline = "";
                target.style.zIndex = "";

                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);

                // Save
                const slideContainer = target.closest('[data-slide-index]');
                if (slideContainer && onSlideChange) {
                    onSlideChange(index, slideContainer.innerHTML);
                }
            };

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }
    };

    // Fix: We can't pass 'index' to handleMouseUp if it's attached globally without closure.
    // So we need a mutable ref for the 'currentIndex' being edited.
    const currentIndexRef = React.useRef(0);

    return (
        <Swiper
            direction={'horizontal'}
            slidesPerView={'auto'} // Use auto to allow card sizing
            centeredSlides={true}
            spaceBetween={parseInt(settings?.spaceBetween || '50')} // Space between cards
            mousewheel={true}
            keyboard={true}
            effect={'coverflow'}
            onSlideChange={(swiper) => {
                onIndexChange?.(swiper.activeIndex);
                currentIndexRef.current = swiper.activeIndex;
            }}
            coverflowEffect={{
                rotate: 0,
                stretch: 0,
                depth: 200, // Deep perspective
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
            wrapperClass="!items-center" // Force vertical centering of slides
            style={{ paddingTop: settings?.paddingTop || '0px' }}
        >
            {slides.map((slideContent: string, index: number) => (
                <SwiperSlide
                    key={index}
                    className="flex items-center justify-center"
                    style={{
                        width: settings?.width || '100%',
                        maxWidth: '90vw',
                        height: settings?.height || '75vh' // Reduced slightly from 80vh to clear navbar/dots safely
                    }}
                >
                    {/* Card Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className={`w-full h-full backdrop-blur-xl border border-white/10 flex flex-col justify-center overflow-y-auto ${getShadowClass(settings?.shadow)}`}
                        style={{
                            backgroundColor: settings?.backgroundColor || 'rgba(15, 23, 42, 0.5)', // Default slate-900/50
                            borderRadius: settings?.cornerRadius || '24px' // Default rounded-3xl (1.5rem = 24px)
                        }}
                    >
                        <div
                            className={`prose prose-invert prose-lg md:prose-2xl max-w-none mx-auto text-center font-light leading-relaxed 
                            [&>h1]:text-4xl md:[&>h1]:text-6xl [&>h1]:font-bold [&>h1]:mb-6 md:[&>h1]:mb-10 
                            [&>h1]:bg-gradient-to-r [&>h1]:from-white [&>h1]:to-slate-400 [&>h1]:bg-clip-text [&>h1]:text-transparent
                            [&>ul]:text-left [&>ul]:inline-block [&>ul]:text-base md:[&>ul]:text-xl [&>ul]:space-y-2 md:[&>ul]:space-y-4
                            prose-img:rounded-2xl prose-img:mx-auto prose-img:max-h-[40vh] prose-img:object-contain
                            prose-p:text-slate-300 prose-p:max-w-prose prose-p:mx-auto
                            swiper-no-swiping relative z-20
                            ${editable ? 'cursor-default outline-none hover:bg-white/5 p-4 rounded-xl transition-colors' : ''}`}
                            contentEditable={false} // Disable global edit, enable per-element
                            suppressContentEditableWarning={true}
                            dangerouslySetInnerHTML={{ __html: slideContent }}
                            data-slide-index={index}
                            onDoubleClick={(e) => {
                                if (!editable) return;
                                const target = e.target as HTMLElement;

                                // Explicitly check if it's one of our content elements
                                if (['H1', 'H2', 'H3', 'P', 'LI', 'SPAN', 'DIV'].includes(target.tagName) && !target.hasAttribute('data-slide-index')) {
                                    e.stopPropagation();

                                    // Enable editing
                                    target.contentEditable = "true";
                                    target.style.cursor = "text";
                                    target.style.userSelect = "text"; // Enable selection
                                    target.style.webkitUserSelect = "text";
                                    target.focus();

                                    // Select all text for easy replacement (optional, but good UX)
                                    // const range = document.createRange();
                                    // range.selectNodeContents(target);
                                    // const sel = window.getSelection();
                                    // sel?.removeAllRanges();
                                    // sel?.addRange(range);

                                    const handleBlur = () => {
                                        // Save changes
                                        target.contentEditable = "false";
                                        target.style.cursor = ""; // Revert to stylesheet default (or add move cursor if needed)
                                        target.style.userSelect = "none"; // Revert to non-selectable for dragging
                                        target.style.webkitUserSelect = "none";

                                        // Sanitize or just save innerHTML
                                        // Use closest slide container to get full HTML
                                        const slideContainer = target.closest('[data-slide-index]');
                                        if (slideContainer && onSlideChange) {
                                            // We need to pass the updated HTML of the CONTAINER, not just the target
                                            // The target is *inside* the container, so its changes are reflected in container.innerHTML
                                            onSlideChange(index, slideContainer.innerHTML);
                                        }
                                        target.removeEventListener('blur', handleBlur);
                                        target.removeEventListener('keydown', handleEnter);
                                    };

                                    const handleEnter = (e: KeyboardEvent) => {
                                        // Optional: Blur on Shift+Enter or Escape? 
                                        if (e.key === 'Escape') {
                                            target.blur();
                                        }
                                    };

                                    target.addEventListener('blur', handleBlur);
                                    target.addEventListener('keydown', handleEnter);
                                }
                            }}
                            onMouseDown={(e) => {
                                // Don't drag if we are clicking inside an element that is currently editable
                                if ((e.target as HTMLElement).isContentEditable) {
                                    e.stopPropagation();
                                    return;
                                }
                                handleMouseDown(e, index);
                            }}
                            onClick={(e) => {
                                if (editable && onElementSelect) {
                                    e.stopPropagation();
                                    onElementSelect(e.target as HTMLElement);
                                }
                            }}
                            onKeyDown={(e) => {
                                // Stop bubble
                                e.stopPropagation();
                            }}
                        />
                    </motion.div>
                </SwiperSlide>
            ))}
        </Swiper>
    );
}


