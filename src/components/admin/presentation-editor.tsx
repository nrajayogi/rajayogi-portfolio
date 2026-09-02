"use client";

import { useContent } from "@/lib/content-context";
import { type Page } from "@/lib/content-types";
import { FileUp, Monitor, Palette, Settings, Trash2, ChevronRight, ImageIcon } from "lucide-react";
import React, { useState, useEffect } from 'react';
import { CinematicView } from "@/components/sections/cinematic-view";
import { PropertiesPanel } from "./properties-panel";

// --- Sub-component: SlideEditor (Same as PagesManager, but local here) ---
function SlideEditor({ content, onChange }: { content: string, onChange: (newContent: string) => void }) {
    const [slides, setSlides] = useState<string[]>([]);
    const [activeSlideIndex, setActiveSlideIndex] = useState<number | null>(null);

    // Initialize slides
    useEffect(() => {
        if (!content) {
            setSlides([]);
            return;
        }
        const currentSlides = content.split(/<hr\s*\/?>/i).map(s => s.trim());
        if (currentSlides.join('<hr>') !== slides.join('<hr>')) {
            setSlides(currentSlides);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [content]);

    const updateParent = (newSlides: string[]) => {
        setSlides(newSlides);
        onChange(newSlides.join('<hr>'));
    };

    const addSlide = () => {
        const newSlide = ""; // Blank slide as requested
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
                <p className="text-xs text-slate-500">Manage slides & content</p>
                <div className="flex gap-2">
                    <label className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1 rounded flex items-center gap-1 transition-colors cursor-pointer border border-slate-700">
                        <ImageIcon size={12} /> Add Image
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;

                                const formData = new FormData();
                                formData.append("file", file);

                                try {
                                    // Show loading state if possible, or just wait
                                    const res = await fetch("/api/upload", { method: "POST", body: formData });
                                    const data = await res.json();

                                    if (data.success && activeSlideIndex !== null) {
                                        const newImageHtml = `<img src="${data.url}" alt="Slide Image" class="rounded-xl shadow-lg my-4" style="max-width: 100%; height: auto;" />`;
                                        const currentContent = slides[activeSlideIndex];
                                        updateSlideContent(activeSlideIndex, currentContent + newImageHtml);
                                    } else if (!data.success) {
                                        alert("Failed to upload image");
                                    }
                                } catch (error) {
                                    console.error("Upload error:", error);
                                    alert("Error uploading image");
                                }
                            }}
                        />
                    </label>
                    <label className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1 rounded flex items-center gap-1 transition-colors cursor-pointer border border-slate-700">
                        <FileUp size={12} /> Import
                        <input
                            type="file"
                            accept=".pptx, .pdf"
                            className="hidden"
                            onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;

                                const btn = e.target.parentElement;
                                if (btn) btn.style.opacity = "0.5";
                                const formData = new FormData();
                                formData.append("file", file);
                                const isPdf = file.name.toLowerCase().endsWith('.pdf');
                                const endpoint = isPdf ? "/api/import-pdf" : "/api/import-pptx";

                                try {
                                    const res = await fetch(endpoint, { method: "POST", body: formData });
                                    const data = await res.json();
                                    if (data.success && data.slides) {
                                        const combinedSlides = [...slides, ...data.slides];
                                        updateParent(combinedSlides);
                                        alert(`Imported ${data.slides.length} slides!`);
                                    } else {
                                        alert("Failed to import: " + (data.message || "Unknown error"));
                                    }
                                } catch (err) {
                                    console.error(err);
                                    // @ts-expect-error - Error type is unknown in catch block
                                    alert(`Error importing: ${err.message || "Unknown error"}`);
                                } finally {
                                    if (btn) btn.style.opacity = "1";
                                    e.target.value = "";
                                }
                            }}
                        />
                    </label>
                    <button onClick={addSlide} className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded transition-colors shadow-sm">
                        + Add Slide
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                {slides.map((slide, index) => (
                    <div key={index} className="w-full bg-slate-900 border border-slate-800 rounded-lg overflow-hidden flex flex-col hover:border-slate-700 transition-colors">
                        <div
                            className="p-3 border-b border-slate-800 flex justify-between items-center cursor-pointer hover:bg-slate-800 transition-colors bg-slate-900/50"
                            onClick={() => setActiveSlideIndex(activeSlideIndex === index ? null : index)}
                        >
                            <span className="text-xs font-mono font-bold text-slate-400">Slide {index + 1}</span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={(e) => { e.stopPropagation(); deleteSlide(index); }}
                                    className="p-1 hover:text-red-400 text-slate-500 transition-colors"
                                    aria-label="Delete slide"
                                    title="Delete slide"
                                >
                                    <Trash2 size={12} />
                                </button>
                                <ChevronRight size={14} className={`text-slate-500 transition-transform ${activeSlideIndex === index ? 'rotate-90' : ''}`} />
                            </div>
                        </div>

                        {activeSlideIndex === index && (
                            <div className="p-3 flex-1 flex flex-col">
                                <textarea
                                    className="w-full h-32 bg-slate-950 border border-slate-800 rounded p-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-blue-500"
                                    value={slide}
                                    onChange={(e) => updateSlideContent(index, e.target.value)}
                                    placeholder="<h2>Title</h2><p>Content...</p>"
                                />
                            </div>
                        )}
                    </div>
                ))}

                {slides.length === 0 && (
                    <div className="text-center py-8 border-2 border-dashed border-slate-800 rounded-xl text-slate-500 text-sm">
                        No slides yet. Click &quot;Add Slide&quot; or Import to begin.
                    </div>
                )}
            </div>
        </div>
    );
}

// --- Main Component ---
export function PresentationEditor() {
    const { content, updateLocalState } = useContent();
    const [isLoading, setIsLoading] = useState(true);

    // State mirroring the Page object
    const [pageId, setPageId] = useState<string | null>(null);
    const [title, setTitle] = useState("Presentation");
    const [pageContent, setPageContent] = useState(""); // This is the HTML string (slides joined by <hr>)

    // Settings
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
    const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null); // Track ID for re-binding
    const [previewScale, setPreviewScale] = useState(0.65);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

    // Initial Load Logic
    useEffect(() => {
        if (!content || !content.pages) return;

        // Case-insensitive lookup
        const existingPage = content.pages.find(p => p.slug.toLowerCase() === 'presentation');

        if (existingPage) {
            setPageId(existingPage.id);
            setTitle(existingPage.title);
            setPageContent(existingPage.content);
            if (existingPage.settings) {
                setSettings({
                    width: existingPage.settings.width || "1000px",
                    height: existingPage.settings.height || "80vh",
                    backgroundColor: existingPage.settings.backgroundColor || "rgba(15, 23, 42, 0.5)",
                    cornerRadius: existingPage.settings.cornerRadius || "24px",
                    spaceBetween: existingPage.settings.spaceBetween || "50",
                    shadow: existingPage.settings.shadow || "large",
                    paddingTop: existingPage.settings.paddingTop || "0px"
                });
            }
        } else {
            // Auto-create if missing! 
            // We don't save to global yet, wait for first edit? 
            // actually better to just init local state and let the sync effect handle creation.
            const newId = crypto.randomUUID();
            setPageId(newId);
            setPageContent("<h2>Welcome</h2><p>Start editing...</p>");
        }
        setIsLoading(false);
    }, [content]);

    // Re-bind selected element after content update (Fix for Stale Reference)
    useEffect(() => {
        if (selectedId) {
            const el = document.getElementById(selectedId);
            if (el && el !== selectedElement) {
                setSelectedElement(el);
            } else if (!el && selectedElement) {
                // Element might have been deleted
                // setSelectedElement(null); // Optional: clear if gone, but let's be safe
            }
        }
    }, [pageContent, selectedId, selectedElement]);

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if typing in an input or textarea
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || (e.target as HTMLElement).isContentEditable) {
                return;
            }

            switch (e.key.toLowerCase()) {
                case 't':
                    e.preventDefault();
                    handleAddComponent('paragraph');
                    break;
                case 'i':
                    e.preventDefault();
                    handleAddComponent('image');
                    break;
                case 'delete':
                case 'backspace':
                    if (selectedElement && !selectedElement.hasAttribute('data-slide-index')) {
                        // Delete element logic
                        if (confirm("Delete selected element?")) {
                            const slideContainer = selectedElement.closest('[data-slide-index]');
                            if (slideContainer) {
                                const index = parseInt(slideContainer.getAttribute('data-slide-index') || '-1');
                                selectedElement.remove(); // Remove from DOM
                                const newHtml = slideContainer.innerHTML; // Capture new state

                                // Update state via helper if possible, or direct
                                // We can't access updateSlideByIndex easily here as it uses state opacity
                                // But we have access to pageContent state
                                const currentSlides = pageContent.split(/<hr\s*\/?>/i);
                                currentSlides[index] = newHtml;
                                setPageContent(currentSlides.join('<hr>'));
                                setSelectedElement(null);
                                setSelectedId(null);
                            }
                        }
                    }
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [pageContent, currentSlideIndex, selectedElement]);

    // Sync Logic
    useEffect(() => {
        if (isLoading) return;

        const timer = setTimeout(() => {
            const pageList = content.pages || [];
            const updatedPages = [...pageList];

            const currentPageObj: Page = {
                id: pageId || crypto.randomUUID(),
                title: title,
                slug: 'presentation', // Enforce lowercase
                layout: 'cinematic',
                content: pageContent,
                settings: settings,
                updatedAt: new Date().toISOString(),
                published: true
            };

            const existingIndex = updatedPages.findIndex(p => p.slug.toLowerCase() === 'presentation');
            if (existingIndex >= 0) {
                updatedPages[existingIndex] = currentPageObj;
            } else {
                updatedPages.push(currentPageObj);
            }

            // Update Global State
            updateLocalState({ ...content, pages: updatedPages });

        }, 200); // Fast debounce

        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageContent, settings, title, pageId, isLoading]);

    // Intentionally omitting content/updateLocalState to prevent loops, checking stable deps

    const updateSlideByIndex = (index: number, newHtml: string) => {
        const currentSlides = pageContent.split(/<hr\s*\/?>/i);
        if (index >= 0 && index < currentSlides.length) {
            currentSlides[index] = newHtml;
            setPageContent(currentSlides.join('<hr>'));
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const currentIndex = currentSlideIndex;
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload", { method: "POST", body: formData });
            const data = await res.json();
            if (data.success) {
                // Absolute positioning for image
                const uid = "img-" + Math.random().toString(36).substr(2, 9);
                const newHtml = `<img id="${uid}" src="${data.url}" alt="Image" class="rounded-xl shadow-lg" style="position: absolute; left: 200px; top: 150px; max-width: 400px; height: auto;" />`;
                const currentSlides = pageContent.split(/<hr\s*\/?>/i);
                updateSlideByIndex(currentIndex, currentSlides[currentIndex] + newHtml);
            } else {
                alert("Upload failed");
            }
        } catch (err) {
            console.error(err);
            alert("Error uploading");
        }
        e.target.value = ""; // Reset
    };

    const handleAddComponent = (type: 'heading' | 'paragraph' | 'image' | 'video') => {
        const currentIndex = currentSlideIndex;
        const currentSlides = pageContent.split(/<hr\s*\/?>/i);
        const currentContent = currentSlides[currentIndex];
        let newContent = "";
        const defaultStyle = "position: absolute; left: 100px; top: 100px;";
        const uid = type + "-" + Math.random().toString(36).substr(2, 9);

        switch (type) {
            case 'heading':
                newContent = `<h2 id="${uid}" class="text-4xl font-bold" style="${defaultStyle} color: white; margin: 0;">New Heading</h2>`;
                break;
            case 'paragraph':
                newContent = `<p id="${uid}" class="text-lg" style="${defaultStyle} top: 160px; color: #cbd5e1; margin: 0;">New paragraph text goes here.</p>`;
                break;
            case 'image':
                document.getElementById('toolbox-image-upload')?.click();
                return;
            case 'video':
                const url = prompt("Enter Video URL (YouTube or MP4 link):");
                if (url) {
                    if (url.includes('youtube.com') || url.includes('youtu.be')) {
                        let videoId = "";
                        if (url.includes('v=')) videoId = url.split('v=')[1]?.split('&')[0];
                        else if (url.includes('youtu.be/')) videoId = url.split('youtu.be/')[1];
                        if (videoId) {
                            newContent = `<div id="${uid}" style="position: absolute; left: 150px; top: 150px; width: 480px; height: 270px; pointer-events: none;" class="rounded-xl overflow-hidden shadow-lg"><iframe width="100%" height="100%" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
                        } else {
                            alert("Invalid YouTube URL");
                        }
                    } else {
                        newContent = `<video id="${uid}" src="${url}" controls style="position: absolute; left: 150px; top: 150px; width: 400px;" class="rounded-xl shadow-lg"></video>`;
                    }
                }
                break;
        }

        if (newContent) {
            updateSlideByIndex(currentIndex, currentContent + newContent);
        }
    };


    if (isLoading) return <div className="p-8 text-slate-500">Loading Presentation...</div>;

    return (
        <div className="flex h-full">
            {/* Center Preview */}
            <div className="flex-1 bg-black/90 relative overflow-hidden flex flex-col items-center justify-center p-8">
                <div className="absolute top-4 left-4 z-10 bg-slate-800/80 backdrop-blur px-3 py-1.5 rounded-full text-xs font-mono text-slate-400 border border-slate-700">
                    Presentation Mode
                </div>

                {/* Scale Controls */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2 bg-slate-800/80 backdrop-blur p-1 rounded-full border border-slate-700">
                    <button onClick={() => setPreviewScale(s => Math.max(0.2, s - 0.1))} className="px-2 text-slate-400 hover:text-white">-</button>
                    <span className="text-xs font-mono w-12 text-center pt-0.5">{Math.round(previewScale * 100)}%</span>
                    <button onClick={() => setPreviewScale(s => Math.min(2, s + 0.1))} className="px-2 text-slate-400 hover:text-white">+</button>
                </div>

                <div
                    className="origin-center transition-all duration-300"
                    style={{ transform: `scale(${previewScale})` }}
                >
                    <div
                        style={{
                            width: "1400px", // Fixed canvas context for accurate preview
                            height: "900px",
                            border: "1px dashed rgba(255,255,255,0.1)"
                        }}
                        className="relative"
                    >
                        <CinematicView
                            slides={pageContent.split(/<hr\s*\/?>/i)}
                            settings={settings}
                            editable={true}
                            onIndexChange={setCurrentSlideIndex}
                            onElementSelect={(el) => {
                                if (el) {
                                    // Ensure ID exists
                                    if (!el.id) {
                                        el.id = "el-" + Math.random().toString(36).substr(2, 9);
                                        // NOTE: We rely on the next 'save' (via property change or drag) to persist this ID.
                                        // Triggering save here immediately would cause flash.
                                    }
                                    setSelectedId(el.id);
                                } else {
                                    setSelectedId(null);
                                }
                                setSelectedElement(el);
                                if (el) setActiveTab('design');
                            }}
                            onSlideChange={(index, val) => {
                                const currentSlides = pageContent.split(/<hr\s*\/?>/i);
                                currentSlides[index] = val;
                                setPageContent(currentSlides.join('<hr>'));
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Right Panel */}
            <div className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col shrink-0">
                {/* Tabs */}
                <div className="flex border-b border-slate-800">
                    <button
                        onClick={() => setActiveTab('content')}
                        className={`flex-1 py-3 text-xs font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'content' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
                    >
                        <Monitor size={14} /> Content
                    </button>
                    <button
                        onClick={() => setActiveTab('design')}
                        className={`flex-1 py-3 text-xs font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'design' ? 'border-purple-500 text-purple-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
                    >
                        <Palette size={14} /> Design
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`flex-1 py-3 text-xs font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'settings' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
                    >
                        <Settings size={14} /> Settings
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    {activeTab === 'content' && (
                        <SlideEditor content={pageContent} onChange={setPageContent} />
                    )}

                    {activeTab === 'design' && (
                        <>
                            {/* Hidden input for Toolbox Image Upload */}
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                id="toolbox-image-upload"
                                onChange={handleImageUpload}
                            />
                            <PropertiesPanel
                                selectedElement={selectedElement}
                                onAddComponent={handleAddComponent}
                                onUpdate={() => {
                                    // 1. Find which slide is currently active or contains this element
                                    // This is tricky because selectedElement is a DOM node.
                                    // We can traverse up to find data-slide-index.
                                    if (!selectedElement) return;

                                    const slideContainer = selectedElement.closest('[data-slide-index]');
                                    if (slideContainer) {
                                        const index = parseInt(slideContainer.getAttribute('data-slide-index') || '-1');
                                        if (index >= 0) {
                                            // 2. Get the new innerHTML of that slide container
                                            const newHtml = slideContainer.innerHTML;

                                            // 3. Update state
                                            // We need to access setPageContent/slides from here. 
                                            // But this is outside SlideEditor.
                                            // We need to update the PARENT state 'pageContent'.

                                            // Parse current pageContent to update just one slide?
                                            // The 'pageContent' state is a string joined by <hr>.
                                            const currentSlides = pageContent.split(/<hr\s*\/?>/i);
                                            currentSlides[index] = newHtml;
                                            setPageContent(currentSlides.join('<hr>'));
                                        }
                                    }
                                }}
                            />
                        </>
                    )}

                    {activeTab === 'settings' && (
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Layout</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs text-slate-500">Card Width</label>
                                        <input
                                            type="text"
                                            value={settings.width}
                                            onChange={(e) => setSettings({ ...settings, width: e.target.value })}
                                            className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-300"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-slate-500">Card Height</label>
                                        <input
                                            type="text"
                                            value={settings.height}
                                            onChange={(e) => setSettings({ ...settings, height: e.target.value })}
                                            className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-300"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-slate-500">Gap (px)</label>
                                    <input
                                        type="text"
                                        value={settings.spaceBetween}
                                        onChange={(e) => setSettings({ ...settings, spaceBetween: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-300"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Style</h3>
                                <div className="space-y-1">
                                    <label className="text-xs text-slate-500">Corner Radius</label>
                                    <input
                                        type="text"
                                        value={settings.cornerRadius}
                                        onChange={(e) => setSettings({ ...settings, cornerRadius: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-300"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-slate-500">Background Color</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="color"
                                            value={settings.backgroundColor} // hex only usually? rgba needs text input
                                            onChange={() => { }} // no-op for color picker if rgba
                                            className="w-8 h-8 rounded cursor-pointer bg-transparent border-none p-0"
                                        />
                                        <input
                                            type="text"
                                            value={settings.backgroundColor}
                                            onChange={(e) => setSettings({ ...settings, backgroundColor: e.target.value })}
                                            className="flex-1 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-300 font-mono"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
