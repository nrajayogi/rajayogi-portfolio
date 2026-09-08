"use client";

import { useContent } from "@/lib/content-context";
import { type Page } from "@/lib/content-types";
import { Plus, Edit, Trash2, ArrowRight, FileUp, Monitor, Palette, Layout, Settings, ChevronRight, Save } from "lucide-react";
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { CinematicView } from "@/components/sections/cinematic-view";
import { PropertiesPanel } from "./properties-panel";



interface PagesManagerProps {
    targetSlug?: string;
}


function SlideEditor({ content, onChange }: { content: string, onChange: (newContent: string) => void }) {
    const [slides, setSlides] = useState<string[]>([]);
    const [activeSlideIndex, setActiveSlideIndex] = useState<number | null>(null);

    // Initialize slides from content string
    useEffect(() => {
        if (!content) {
            setSlides([]);
            return;
        }
        // Avoid infinite loop if content matches joined slides
        const currentSlides = content.split(/<hr\s*\/?>/i).map(s => s.trim());
        // Only update if length differs or content significantly differs to avoid cursor jumps
        if (currentSlides.join('<hr>') !== slides.join('<hr>')) {
            setSlides(currentSlides);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [content]); // 'slides' omitted to avoid circular loop with local edits vs parent sync

    // Update parent when slides change
    const updateParent = (newSlides: string[]) => {
        setSlides(newSlides);
        onChange(newSlides.join('<hr>'));
    };

    const addSlide = () => {
        const newSlide = "<h2>New Slide</h2><p>Content goes here...</p>";
        const newSlides = [...slides, newSlide];
        updateParent(newSlides);
        setActiveSlideIndex(newSlides.length - 1);
    };

    const deleteSlide = (index: number) => {
        if (confirm("Delete this slide?")) {
            const newSlides = slides.filter((_, i) => i !== index);
            updateParent(newSlides);
            if (activeSlideIndex === index) setActiveSlideIndex(null);
        }
    };

    const updateSlideContent = (index: number, val: string) => {
        const newSlides = [...slides];
        newSlides[index] = val;
        updateParent(newSlides);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <p className="text-xs text-slate-500">Manage your presentation slides.</p>
                <div className="flex gap-2">
                    <label className="text-xs bg-amber-600/20 hover:bg-amber-600/40 text-amber-500 px-3 py-1 rounded flex items-center gap-1 transition-colors cursor-pointer">
                        <FileUp size={12} /> Import PPTX/PDF
                        <input
                            type="file"
                            accept=".pptx, .pdf"
                            className="hidden"
                            onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;

                                // Show loading state via simple alert or toast for MVP
                                const btn = e.target.parentElement;
                                if (btn) btn.style.opacity = "0.5";

                                const formData = new FormData();
                                formData.append("file", file);

                                const isPdf = file.name.toLowerCase().endsWith('.pdf');
                                const endpoint = isPdf ? "/api/import-pdf" : "/api/import-pptx";

                                try {
                                    const res = await fetch(endpoint, {
                                        method: "POST",
                                        body: formData
                                    });
                                    const data = await res.json();
                                    if (data.success && data.slides) {
                                        const combinedSlides = [...slides, ...data.slides];
                                        updateParent(combinedSlides);
                                        alert(`Imported ${data.slides.length} slides!`);
                                    } else {
                                        alert("Failed to import: " + (data.message || "Unknown server error"));
                                    }
                                } catch (err) {
                                    console.error(err);
                                    // @ts-expect-error - Error type is unknown in catch block
                                    alert(`Error importing file: ${err.message || "Network error"}`);
                                } finally {
                                    if (btn) btn.style.opacity = "1";
                                    e.target.value = ""; // Reset
                                }
                            }}
                        />
                    </label>
                    <button
                        onClick={addSlide}
                        className="text-xs bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 px-3 py-1 rounded flex items-center gap-1 transition-colors"
                        aria-label="Add New Slide"
                    >
                        <Plus size={12} /> Add Slide
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-4 pb-4 pt-2 px-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                {slides.map((slide, index) => (
                    <div key={index} className="flex-shrink-0 w-full bg-slate-900 border border-slate-800 rounded-[4px] overflow-hidden group flex flex-col hover:border-slate-700 transition-colors">
                        <div
                            className="p-3 border-b border-slate-800 flex justify-between items-center cursor-pointer hover:bg-slate-800 transition-colors bg-slate-900/50"
                            onClick={() => setActiveSlideIndex(activeSlideIndex === index ? null : index)}
                        >
                            <span className="text-xs font-mono font-bold text-slate-400">Slide {index + 1}</span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={(e) => { e.stopPropagation(); deleteSlide(index); }}
                                    className="p-1 hover:text-red-400 text-slate-500 transition-colors"
                                    title="Delete Slide"
                                >
                                    <Trash2 size={12} />
                                </button>
                                <ChevronRight size={14} className={`text-slate-500 transition-transform ${activeSlideIndex === index ? 'rotate-90' : ''}`} />
                            </div>
                        </div>

                        {/* Mini Preview or Full Editor */}
                        {activeSlideIndex === index ? (
                            <div className="p-3 flex-1 flex flex-col">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-bold text-slate-500">Slide Content (HTML)</span>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const url = prompt("Enter Image URL:");
                                            if (url) updateSlideContent(index, slide + `\n<img src="${url}" class="w-2/3 mx-auto rounded-[4px] shadow-lg my-4" />`);
                                        }}
                                        className="text-[10px] bg-slate-800 text-slate-300 px-2 py-1 rounded hover:bg-slate-700 hover:text-white transition-colors flex items-center gap-1"
                                    >
                                        <FileUp size={10} /> Insert Image
                                    </button>
                                </div>
                                <textarea
                                    value={slide}
                                    onChange={(e) => updateSlideContent(index, e.target.value)}
                                    className="w-full h-48 bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm font-mono focus:border-blue-500 outline-none transition-colors text-white/90 leading-relaxed resize-none"
                                    placeholder="<h2>Title</h2>..."
                                />
                                <p className="text-[10px] text-slate-500 mt-2 text-right">HTML & Tailwind Classes Supported</p>
                            </div>
                        ) : (
                            /* Collapsed: Show visual preview instead of just text */
                            <div
                                className="h-40 w-full bg-slate-950 relative overflow-hidden cursor-pointer group-hover:opacity-90 transition-opacity"
                                onClick={() => setActiveSlideIndex(index)}
                            >
                                <div className="absolute inset-0 flex items-center justify-center p-4">
                                    <div className="w-[300%] h-[300%] scale-[0.33] origin-center pointer-events-none flex items-center justify-center"
                                        dangerouslySetInnerHTML={{ __html: slide }}
                                        style={{ color: 'white' }}
                                    />
                                </div>
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                            </div>
                        )}
                    </div>
                ))}

                {slides.length === 0 && (
                    <div className="flex-shrink-0 w-full h-40 flex items-center justify-center border border-dashed border-slate-800 rounded-[4px] text-slate-500 text-xs bg-slate-900/50">
                        No slides yet. Click &quot;Add Slide&quot; to begin.
                    </div>
                )}
            </div>
        </div>
    );
}

// --- Resize Overlay Component ---
const ResizeOverlay = ({
    selectedElement,
    zoom,
    onUpdate
}: {
    selectedElement: HTMLElement | null;
    zoom: number;
    onUpdate: () => void;
}) => {
    const [rect, setRect] = useState<DOMRect | null>(null);

    // Update overlay position to match selected element
    useEffect(() => {
        if (!selectedElement) return;
        const update = () => setRect(selectedElement.getBoundingClientRect());
        update();
        // Listen to resize/scroll/mutation to keep overlay in sync
        window.addEventListener('resize', update);
        const observer = new MutationObserver(update);
        observer.observe(selectedElement, { attributes: true, attributeFilter: ['style', 'class'] });
        return () => {
            window.removeEventListener('resize', update);
            observer.disconnect();
        };
    }, [selectedElement, zoom]); // Re-calc if zoom changes

    if (!selectedElement || !rect) return null;

    // We need to calculate 'local' rect relative to the container if possible,
    // but fixed overlay on top might be easier if we can map coordinates.
    // For now, let's append this directly *inside* the PagesManager preview container?
    // Actually, `selectedElement` is inside the scaled container.
    // If we render this overlay *inside* the same scaled container, we can just use `selectedElement.offsetLeft` etc?
    // No, `getBoundingClientRect` gives viewport coords.

    // Let's rely on the parent being relative.
    // Actually, simpler approach: The overlay is a sibling of the element? No, element is deep in slide.
    // The overlay should probably be appended to the slide itself or the preview wrapper.
    // Let's render it as a portal or just fixed on top using viewport coords?
    // Fixed on viewport is "easier" visually but tricky with scrolling.

    // BETTER APPROACH:
    // Render handles *inside* the `selectedElement`? No, that pollutes the DOM.
    // Render handles in a separate layer on top of the `CinematicView`.
    // We need the bounding rect of the `CinematicView` container to offset.

    // Let's try "Fixed Position Overlay" strategy for the MVP.
    // Get absolute coords.

    // We use a fixed overlay for simplicity, but we need to track scroll/resize.
    const style: React.CSSProperties = {
        position: 'fixed',
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        pointerEvents: 'none', // Pass through for text selection
        border: '1px dashed #3b82f6', // Make it visible so they know it's selected
        zIndex: 1000,
        boxSizing: 'border-box'
    };

    const handleStyle: React.CSSProperties = {
        width: 10, height: 10,
        background: '#fff',
        border: '1px solid #3b82f6',
        position: 'absolute',
        pointerEvents: 'auto',
        borderRadius: '50%',
        zIndex: 1001,
        boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
    };

    const moveHandleStyle: React.CSSProperties = {
        position: 'absolute',
        top: -24, left: 0,
        height: 24, padding: '0 8px',
        backgroundColor: '#3b82f6',
        color: 'white',
        fontSize: '12px',
        display: 'flex',
        alignItems: 'center',
        cursor: 'move',
        pointerEvents: 'auto',
        borderRadius: '4px 4px 0 0',
        zIndex: 1002
    };

    // Helper to get current translate values
    const getTranslate = (el: HTMLElement) => {
        const style = window.getComputedStyle(el);
        const matrix = new DOMMatrix(style.transform);
        return { x: matrix.e, y: matrix.f };
    };

    const handleMoveStart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const startX = e.clientX;
        const startY = e.clientY;
        const { x: initialTransX, y: initialTransY } = getTranslate(selectedElement);

        const onMouseMove = (ev: MouseEvent) => {
            ev.preventDefault();
            const deltaX = (ev.clientX - startX) / zoom;
            const deltaY = (ev.clientY - startY) / zoom;
            selectedElement.style.transform = `translate(${initialTransX + deltaX}px, ${initialTransY + deltaY}px)`;
        };

        const onMouseUp = () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
            onUpdate();
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    };

    const handleResizeStart = (e: React.MouseEvent, direction: string) => {
        e.preventDefault();
        e.stopPropagation();

        const startX = e.clientX;
        const startY = e.clientY;
        const cs = window.getComputedStyle(selectedElement);
        // We parse the actual rendered size, or fall back to visual size / zoom
        const cssW = parseInt(cs.width);
        const cssH = parseInt(cs.height);

        const onMouseMove = (ev: MouseEvent) => {
            ev.preventDefault();
            const deltaX = (ev.clientX - startX) / zoom;
            const deltaY = (ev.clientY - startY) / zoom;

            // Apply new size
            if (direction.includes('e')) {
                selectedElement.style.width = `${Math.max(20, cssW + deltaX)}px`;
                selectedElement.style.maxWidth = 'none'; // Ensure maxWidth doesn't constrain
            }
            if (direction.includes('s')) {
                selectedElement.style.height = `${Math.max(20, cssH + deltaY)}px`;
                selectedElement.style.maxHeight = 'none';
            }
        };

        const onMouseUp = () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
            onUpdate(); // Trigger save
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    };

    return (
        <React.Fragment> {/* Portal could be used here but fixed pos works */}
            {ReactDOM.createPortal(
                <div style={style}>
                    {/* Move Handle (Label) */}
                    <div style={moveHandleStyle} onMouseDown={handleMoveStart}>
                        {selectedElement.tagName.toLowerCase()}
                    </div>

                    {/* SE Handle */}
                    <div
                        style={{ ...handleStyle, right: -5, bottom: -5, cursor: 'nwse-resize' }}
                        onMouseDown={(e) => handleResizeStart(e, 'se')}
                    />
                    {/* E Handle */}
                    <div
                        style={{ ...handleStyle, right: -5, top: '50%', marginTop: -5, cursor: 'ew-resize' }}
                        onMouseDown={(e) => handleResizeStart(e, 'e')}
                    />
                    {/* S Handle */}
                    <div
                        style={{ ...handleStyle, bottom: -5, left: '50%', marginLeft: -5, cursor: 'ns-resize' }}
                        onMouseDown={(e) => handleResizeStart(e, 's')}
                    />
                </div>,
                document.body // Move outside any overflow:hidden containers
            )}
        </React.Fragment>
    );
};

export function PagesManager({ targetSlug }: PagesManagerProps) {
    const { content, updateContent, updateLocalState } = useContent();
    const [isCreating, setIsCreating] = useState(false);
    const [editingPageId, setEditingPageId] = useState<string | null>(null);

    // Form States
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [layout, setLayout] = useState<'default' | 'cinematic'>("default");
    const [pageContent, setPageContent] = useState("");

    const [settings, setSettings] = useState({
        width: "1000px",
        height: "80vh",
        backgroundColor: "rgba(15, 23, 42, 0.5)",
        cornerRadius: "24px",
        spaceBetween: "50",
        shadow: "large",
        paddingTop: "0px"
    });
    const [activeTab, setActiveTab] = useState<'content' | 'design' | 'settings'>('content');
    const [previewScale, setPreviewScale] = useState(0.65); // Default scaled down to fit split view
    const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);
    const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

    // Access the actual pages list from content
    const pages = content.pages || [];
    const editorActive = !!(targetSlug || isCreating || editingPageId);

    // --- SYNC LOCAL STATE TO GLOBAL CONTEXT ---
    // This ensures that when the user clicks the GLOBAL "Push Changes Live" button in the parent,
    // it saves the text they are currently editing, not the old version.
    useEffect(() => {
        if (!editingPageId && !targetSlug) return; // Don't sync if not editing

        // Debounce slightly to avoid thrashing context on every keystroke
        const timer = setTimeout(() => {
            let updatedPages: Page[] = [];

            // We need to find the ID carefully
            const pageList = content.pages || [];
            const currentId = editingPageId || (targetSlug ? pageList.find(p => p.slug === targetSlug)?.id : null);

            if (currentId) {
                updatedPages = pageList.map((p: Page) => p.id === currentId ? {
                    ...p,
                    title,
                    slug: slug.toLowerCase(),
                    layout,
                    content: pageContent,
                    settings
                } : p);
            }

            if (currentId) {
                updateLocalState({ ...content, pages: updatedPages });
            }
        }, 800);

        return () => clearTimeout(timer);
        // We exclude content/updateLocalState to prevent loops
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageContent, settings, title, slug, layout, editingPageId, targetSlug]);

    // Re-acquire selection after render if possible
    useEffect(() => {
        if (selectedElementId && !selectedElement) {
            // Look in the document? Need a ref to the preview container really.
            // But document.querySelector might work if ID is unique enough.
            const el = document.querySelector(`[data-editor-id="${selectedElementId}"]`) as HTMLElement;
            if (el) setSelectedElement(el);
        }
    }, [selectedElementId, selectedElement]);


    const resetForm = () => {
        setTitle("");
        setSlug("");

        setLayout("default");
        setPageContent("");
        setSettings({
            width: "1000px",
            height: "80vh",
            backgroundColor: "rgba(15, 23, 42, 0.5)",
            cornerRadius: "24px",
            spaceBetween: "50",
            shadow: "large",
            paddingTop: "0px"
        });
        setEditingPageId(null);
        setIsCreating(false);
    }

    const startEdit = (page: Page) => {
        setTitle(page.title);
        setSlug(page.slug);
        setLayout(page.layout || 'default');
        setPageContent(page.content);
        setSettings({
            width: page.settings?.width || "1000px",
            height: page.settings?.height || "80vh",
            backgroundColor: page.settings?.backgroundColor || "rgba(15, 23, 42, 0.5)",
            cornerRadius: page.settings?.cornerRadius || "24px",
            spaceBetween: page.settings?.spaceBetween || "50",
            shadow: page.settings?.shadow || "large",
            paddingTop: page.settings?.paddingTop || "0px"
        });
        setEditingPageId(page.id);
        setIsCreating(true);
    };

    // Auto-select page if targetSlug is provided
    useEffect(() => {
        if (targetSlug) {
            const target = pages.find(p => p.slug === targetSlug);
            if (target) {
                // Only start edit if we aren't already editing it
                if (editingPageId !== target.id) {
                    startEdit(target);
                }
            } else if (!isCreating && !editingPageId) {
                // Optional: Auto-create if not found? 
                // For now, let's just prep the form for creation with that slug
                setTitle("Presentation");
                setSlug(targetSlug);
                setLayout("cinematic");
                setIsCreating(true);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [targetSlug, pages.length]);

    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (!title || !slug) return;
        setIsSaving(true);

        let updatedPages: Page[];

        if (editingPageId) {
            // Update existing
            updatedPages = pages.map((p: Page) => p.id === editingPageId ? {
                ...p,
                title,
                slug,
                layout,
                content: pageContent, // Allow manual content edits
                updatedAt: new Date().toISOString(),
                settings // Save settings
            } : p);
        } else {
            // Create new
            const newPage: Page = {
                id: crypto.randomUUID(),
                title,
                slug: slug.toLowerCase().replace(/ /g, "-"),
                content: layout === 'cinematic'
                    ? (pageContent || "<h2>Slide 1</h2><p>Welcome</p><hr><h2>Slide 2</h2><p>Content</p>")
                    : (pageContent || "<h1>New Page</h1><p>Start editing...</p>"),
                layout,
                published: true,
                updatedAt: new Date().toISOString(),
                settings
            };
            updatedPages = [...pages, newPage];
        }

        try {
            await updateContent({ ...content, pages: updatedPages });
            resetForm();
        } catch (error) {
            alert("Failed to save changes. Please try again.");
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = (id: string) => {
        if (confirm("Are you sure?")) {
            const updatedPages = pages.filter((p: Page) => p.id !== id);
            updateContent({ ...content, pages: updatedPages });
        }
    }

    const saveSlideChanges = () => {
        // Delay slightly to ensure DOM update is rendered? Usually not needed for direct manipulation
        // We find the active slide based on the SELECTED element, or we might need a generic way
        const targetEl = selectedElement || document.activeElement;
        if (!targetEl) return;

        const slideContainer = targetEl.closest('[data-slide-index]');
        if (slideContainer) {
            const index = parseInt(slideContainer.getAttribute('data-slide-index') || '0');
            const newHtml = slideContainer.innerHTML;

            // We must be careful not to trigger re-renders that reset the DOM state while dragging
            // But updating pageContent string will re-render CinematicView. 
            // This is the classic specificitiy problem.
            // However, since we are using 'dangerouslySetInnerHTML', a re-render WILL reset the DOM 
            // to match the string. This means if we drag 1px, save, re-render, the element might "snap" 
            // if our precision is off, or just interrupt the drag.
            // SO: We should only save on MOUSE UP, not during drag.

            setPageContent(prev => {
                const slides = prev.split(/<hr\s*\/?>/i);
                slides[index] = newHtml;
                return slides.join('<hr>');
            });
        }
    }

    return (
        <div className="bg-slate-950 min-h-screen text-white overflow-hidden w-full flex relative">

            {/* 1. LEFT PANE: PREVIEW AREA */}
            <div className={`transition-all duration-300 ease-in-out bg-black relative flex flex-col items-center justify-center overflow-hidden h-screen ${editorActive ? 'w-[calc(100%-320px)]' : 'w-full'}`}>

                {/* Floating Toolbar (Left) */}
                <div className="absolute top-6 left-6 z-20 flex gap-4 items-center animate-in fade-in slide-in-from-top-4 duration-500">
                    <button
                        onClick={() => { resetForm(); setIsCreating(false); }}
                        className="bg-slate-900/80 backdrop-blur text-slate-400 p-2 rounded-full border border-slate-800 hover:text-white hover:bg-slate-800 transition-colors"
                        title="Back to Dashboard"
                    >
                        <ArrowRight className="rotate-180" size={16} />
                    </button>

                    {editorActive && (
                        <div className="flex items-center gap-3 bg-slate-900/80 backdrop-blur px-4 py-2 rounded-full border border-slate-800 shadow-xl">
                            <Monitor size={14} className="text-blue-400" />
                            <span className="text-xs font-mono text-slate-300 border-r border-slate-700 pr-3 mr-1">
                                {settings.width} x {settings.height}
                            </span>
                            <input
                                type="range"
                                min="0.1"
                                max="1.5"
                                step="0.05"
                                value={previewScale}
                                onChange={(e) => setPreviewScale(parseFloat(e.target.value))}
                                className="w-24 accent-blue-500 h-1 bg-slate-700 rounded-[4px] appearance-none cursor-pointer"
                            />
                        </div>
                    )}
                </div>

                {/* Centered Preview Container */}
                {editorActive && (
                    <div className="overflow-auto w-full h-full flex items-center justify-center p-8 bg-[#0a0a0a]">
                        <div
                            className="relative shadow-2xl bg-[#050505] overflow-hidden flex-shrink-0 border border-slate-800"
                            style={{
                                width: '1440px',
                                height: '900px',
                                transform: `scale(${previewScale})`,
                                transformOrigin: 'center center',
                            }}
                        >
                            <div className="absolute inset-0 z-0 pointer-events-none bg-[#050505]" />

                            <div
                                className="relative z-10 h-full w-full"
                                ref={(node) => {
                                    // Restoration logic: If we have an ID but lost selection node (e.g. after re-render), try to find it
                                    if (node && selectedElementId && !selectedElement) {
                                        const el = node.querySelector(`[data-editor-id="${selectedElementId}"]`) as HTMLElement;
                                        if (el) setSelectedElement(el);
                                    }
                                }}
                                onMouseDownCapture={(e) => {
                                    // Handle drag/select interaction
                                    const target = e.target as HTMLElement;
                                    const isSlideContent = target.closest('.swiper-slide');

                                    // Only handle interaction if we are inside a slide
                                    if (isSlideContent) {
                                        // If we are in Content mode, let text editing happen naturally
                                        if (activeTab === 'content') {
                                            // Just track clicking for selection if needed, but don't drag
                                            if (target !== isSlideContent) {
                                                // Optional: select it visually but don't interfere with edit
                                            }
                                            return;
                                        }

                                        // In DESIGN mode: Handle selection and dragging
                                        if (target !== isSlideContent && !target.classList.contains('swiper-slide')) {
                                            e.stopPropagation();

                                            // Prevent default to stop native drag/text selection in Design mode
                                            // e.preventDefault(); 
                                            // We need to be careful: preventing default might stop focus? 
                                            // Since contentEditable is false (via prop), we should be fine.

                                            if (activeTab !== 'design') setActiveTab('design');

                                            // 1. Assign unique ID if missing
                                            let eid = target.getAttribute('data-editor-id');
                                            if (!eid) {
                                                eid = crypto.randomUUID();
                                                target.setAttribute('data-editor-id', eid);
                                            }

                                            setSelectedElement(target);
                                            setSelectedElementId(eid);

                                            // 2. DRAG LOGIC
                                            const startX = e.clientX;
                                            const startY = e.clientY;
                                            const style = window.getComputedStyle(target);
                                            const matrix = new DOMMatrix(style.transform);
                                            const initialTranslateX = matrix.e;
                                            const initialTranslateY = matrix.f;

                                            // Flag to track if we actually moved (to distinguish click vs drag)
                                            let isDragging = false;

                                            const onMouseMove = (moveEvent: MouseEvent) => {
                                                moveEvent.preventDefault();
                                                isDragging = true;
                                                const deltaX = (moveEvent.clientX - startX) / previewScale;
                                                const deltaY = (moveEvent.clientY - startY) / previewScale;
                                                target.style.transform = `translate(${initialTranslateX + deltaX}px, ${initialTranslateY + deltaY}px)`;

                                                // Visual feedback cursor
                                                document.body.style.cursor = 'grabbing';
                                            };

                                            const onMouseUp = () => {
                                                window.removeEventListener('mousemove', onMouseMove);
                                                window.removeEventListener('mouseup', onMouseUp);
                                                document.body.style.cursor = '';

                                                if (isDragging) {
                                                    // Save changes
                                                    const slideContainer = target.closest('[data-slide-index]');
                                                    if (slideContainer) {
                                                        const index = parseInt(slideContainer.getAttribute('data-slide-index') || '0');
                                                        const newHtml = slideContainer.innerHTML;
                                                        setPageContent(prev => {
                                                            const slides = prev.split(/<hr\s*\/?>/i);
                                                            slides[index] = newHtml;
                                                            return slides.join('<hr>');
                                                        });
                                                    }
                                                }
                                            };

                                            window.addEventListener('mousemove', onMouseMove);
                                            window.addEventListener('mouseup', onMouseUp);
                                            return;
                                        }
                                    }

                                    // Deselect if clicking background
                                    if (e.target === e.currentTarget) {
                                        setSelectedElement(null);
                                        setSelectedElementId(null);
                                    }
                                }}
                            >
                                <CinematicView
                                    slides={pageContent.split(/<hr\s*\/?>/i)}

                                    onSlideChange={(index, newContent) => {
                                        setPageContent(prev => {
                                            const slides = prev.split(/<hr\s*\/?>/i);
                                            slides[index] = newContent;
                                            return slides.join('<hr>');
                                        });
                                    }}
                                    settings={settings}
                                    editable={activeTab === 'content'}
                                />
                                <ResizeOverlay
                                    selectedElement={selectedElement}
                                    zoom={previewScale}
                                    onUpdate={() => {
                                        // Force save
                                        if (selectedElement) {
                                            const slideContainer = selectedElement.closest('[data-slide-index]');
                                            if (slideContainer) {
                                                const index = parseInt(slideContainer.getAttribute('data-slide-index') || '0');
                                                const newHtml = slideContainer.innerHTML;
                                                setPageContent(prev => {
                                                    const slides = prev.split(/<hr\s*\/?>/i);
                                                    slides[index] = newHtml;
                                                    return slides.join('<hr>');
                                                });
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Non-Editor Mode: Dashboard List */}
                {!editorActive && (
                    <div className="p-8 w-full max-w-5xl mx-auto space-y-8 overflow-y-auto h-full">
                        <header className="flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-bold mb-2">My Pages</h1>
                                <p className="text-slate-400">Manage your dynamic landing pages</p>
                            </div>
                            <button
                                onClick={() => { resetForm(); setIsCreating(true); }}
                                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-[4px] flex items-center gap-2 transition-colors font-bold"
                            >
                                <Plus size={18} />
                                New Page
                            </button>
                        </header>
                        <div className="grid gap-4">
                            {pages.length > 0 ? pages.map((page: Page) => (
                                <div key={page.id} className="bg-slate-900 border border-slate-800 p-4 rounded-[4px] flex items-center justify-between group hover:border-slate-700 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-slate-800 rounded-[4px] flex items-center justify-center text-slate-500">
                                            {page.layout === 'cinematic' ? <Monitor size={18} /> : <FileUp size={18} />}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white">{page.title}</h3>
                                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                                <span className="bg-slate-800 px-1.5 py-0.5 rounded text-xs font-mono">/{page.slug}</span>
                                                {page.layout === 'cinematic' && <span className="bg-purple-900/50 text-purple-400 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">Cinematic</span>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => startEdit(page)} className="p-2 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors"><Edit size={16} /></button>
                                        <button onClick={() => handleDelete(page.id)} className="p-2 hover:bg-red-900/20 rounded text-slate-400 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                                    </div>
                                </div>
                            )) : <p className="text-slate-500">No pages found.</p>}
                        </div>
                    </div>
                )}
            </div>

            {/* 2. RIGHT SIDEBAR: TOOLS & PROPERTIES */}
            {editorActive && (
                <div className="w-[320px] bg-[#1E1E1E] border-l border-[#333] flex flex-col h-screen shrink-0 shadow-2xl z-40">

                    {/* Header Tabs */}
                    <div className="flex border-b border-[#333]">
                        <button
                            onClick={() => setActiveTab('design')}
                            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider flex justify-center items-center gap-2 transition-colors ${activeTab === 'design' ? 'bg-[#252525] text-white border-b-2 border-blue-500' : 'text-slate-500 hover:text-slate-300 hover:bg-[#252525]'}`}
                        >
                            <Palette size={14} /> Design
                        </button>
                        <button
                            onClick={() => setActiveTab('content')}
                            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider flex justify-center items-center gap-2 transition-colors ${activeTab === 'content' ? 'bg-[#252525] text-white border-b-2 border-blue-500' : 'text-slate-500 hover:text-slate-300 hover:bg-[#252525]'}`}
                        >
                            <Layout size={14} /> Content
                        </button>
                        <button
                            onClick={() => setActiveTab('settings')}
                            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider flex justify-center items-center gap-2 transition-colors ${activeTab === 'settings' ? 'bg-[#252525] text-white border-b-2 border-blue-500' : 'text-slate-500 hover:text-slate-300 hover:bg-[#252525]'}`}
                        >
                            <Settings size={14} /> Settings
                        </button>
                    </div>

                    {/* CONTENT AREA */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#1E1E1E]">

                        {/* DESIGN TAB (Properties Panel) */}
                        {activeTab === 'design' && (
                            <PropertiesPanel
                                selectedElement={selectedElement}
                                onUpdate={saveSlideChanges}
                                onAddComponent={(type) => {
                                    // Placeholder: In a real app, find active slide and append HTML
                                    console.log("Add component:", type);
                                    alert(`Adding ${type} is coming soon!`);
                                }}
                            />
                        )}

                        {/* CONTENT TAB (Slides Editor) */}
                        {activeTab === 'content' && (
                            <div className="p-4">
                                <SlideEditor content={pageContent} onChange={setPageContent} />
                            </div>
                        )}

                        {/* SETTINGS TAB */}
                        {activeTab === 'settings' && (
                            <div className="p-6 space-y-6">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase">Page Title</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full bg-[#252525] border border-[#333] rounded px-3 py-2 text-sm text-white focus:border-blue-500 outline-none transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase">Slug</label>
                                    <input
                                        type="text"
                                        value={slug}
                                        onChange={(e) => setSlug(e.target.value)}
                                        className="w-full bg-[#252525] border border-[#333] rounded px-3 py-2 text-sm text-white focus:border-blue-500 outline-none transition-colors"
                                    />
                                </div>

                                <div className="h-px bg-[#333] my-4" />

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase">Card Width</label>
                                        <input
                                            type="text"
                                            value={settings.width}
                                            onChange={(e) => setSettings({ ...settings, width: e.target.value })}
                                            className="w-full bg-[#252525] border border-[#333] rounded px-3 py-2 text-sm text-white focus:border-blue-500 outline-none transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase">Card Height</label>
                                        <input
                                            type="text"
                                            value={settings.height}
                                            onChange={(e) => setSettings({ ...settings, height: e.target.value })}
                                            className="w-full bg-[#252525] border border-[#333] rounded px-3 py-2 text-sm text-white focus:border-blue-500 outline-none transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase">Gap (px)</label>
                                        <input
                                            type="text"
                                            value={settings.spaceBetween}
                                            onChange={(e) => setSettings({ ...settings, spaceBetween: e.target.value })}
                                            className="w-full bg-[#252525] border border-[#333] rounded px-3 py-2 text-sm text-white focus:border-blue-500 outline-none transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase">Radius</label>
                                        <input
                                            type="text"
                                            value={settings.cornerRadius}
                                            onChange={(e) => setSettings({ ...settings, cornerRadius: e.target.value })}
                                            className="w-full bg-[#252525] border border-[#333] rounded px-3 py-2 text-sm text-white focus:border-blue-500 outline-none transition-colors"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase">Background Color</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="color"
                                            value={settings.backgroundColor}
                                            onChange={(e) => setSettings({ ...settings, backgroundColor: e.target.value })}
                                            className="h-10 w-10 bg-transparent border border-[#333] rounded cursor-pointer"
                                        />
                                        <input
                                            type="text"
                                            value={settings.backgroundColor}
                                            onChange={(e) => setSettings({ ...settings, backgroundColor: e.target.value })}
                                            className="flex-1 bg-[#252525] border border-[#333] rounded px-3 py-2 text-sm text-white focus:border-blue-500 outline-none transition-colors"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 mt-8"
                                >
                                    <Save size={14} />
                                    {isSaving ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        )}

                    </div>

                </div>
            )}

        </div>
    );
}
