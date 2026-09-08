"use client";

import { useState, useEffect, useCallback } from 'react';
import { useContent } from '@/lib/content-context';
import { Type, Image as ImageIcon, Square, Plus, Trash2, Eye, Save, ChevronLeft, ChevronRight, Settings as SettingsIcon, Layers, Upload, FileText } from 'lucide-react';
import { CanvasWorkspace } from './canvas-workspace';
import { ElementPropertiesPanel } from './element-properties-panel';
import { PresentationSettingsPanel } from './presentation-settings-panel';
import {
    PresentationSlide,
    SlideElement,
    createBlankSlide,
    createTextElement,
    createImageElement,
    createShapeElement,
    PresentationData,
} from '@/lib/presentation-types';

export function PresentationEditorNew() {
    const { content, updateContent } = useContent();

    // Presentation state
    const [slides, setSlides] = useState<PresentationSlide[]>([createBlankSlide()]);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [settings, setSettings] = useState({
        width: '1000px',
        height: '75vh',
        backgroundColor: 'rgba(15, 23, 42, 0.5)',
        cornerRadius: '24px',
        spaceBetween: '50',
        shadow: 'large',
        paddingTop: '0px'
    });
    const [rightPanelTab, setRightPanelTab] = useState<'element' | 'slide' | 'settings'>('element');
    const [clipboard, setClipboard] = useState<SlideElement | null>(null);

    const currentSlide = slides[currentSlideIndex];
    const selectedElement = currentSlide?.elements.find(el => el.id === selectedElementId) || null;

    // Helper to parse dimensions (e.g. "1000px" -> 1000, "75vh" -> fallback to 562 for logic)
    // Note: Height is tricky if it's vh, so we default to a standard 16:9 ratio height if vh
    const getNumericDimension = (dim: string, defaultVal: number) => {
        if (!dim) return defaultVal;
        const parsed = parseInt(dim);
        return isNaN(parsed) ? defaultVal : parsed;
    };

    const slideWidth = getNumericDimension(settings.width, 1000);
    // For height, if it's vh, it's dynamic, but for alignment buttons we need a number.
    // If it's vh, we use the default 16:9 based on 1000 width => 562
    const slideHeight = settings.height?.includes('vh') ? 562 : getNumericDimension(settings.height, 562);

    // Load presentation from content
    useEffect(() => {
        if (!content || !content.pages) return;

        const presentationPage = content.pages.find(p => p.slug.toLowerCase() === 'presentation');
        if (presentationPage && presentationPage.presentationData) {
            try {
                const data = typeof presentationPage.presentationData === 'string'
                    ? JSON.parse(presentationPage.presentationData)
                    : presentationPage.presentationData;

                if (data.slides && data.slides.length > 0) {
                    setSlides(data.slides);
                }
                if (data.settings) {
                    setSettings(data.settings);
                }
            } catch (err) {
                console.error('Failed to load presentation data:', err);
            }
        }
    }, [content]);

    // Save presentation
    const handleSave = useCallback(async () => {
        setIsSaving(true);
        try {
            const presentationData: PresentationData = {
                slides,
                settings,
            };

            const newContent = { ...content };
            const presentationPage = newContent.pages?.find(p => p.slug.toLowerCase() === 'presentation');

            if (presentationPage) {
                presentationPage.presentationData = presentationData;
            } else {
                if (!newContent.pages) newContent.pages = [];
                newContent.pages.push({
                    id: crypto.randomUUID(),
                    slug: 'presentation',
                    title: 'Vyantraa Presentation',
                    layout: 'cinematic',
                    published: true,
                    content: '',
                    presentationData,
                    updatedAt: new Date().toISOString(),
                });
            }

            await updateContent(newContent);
            alert('Presentation saved successfully!');
        } catch (err) {
            console.error('Failed to save presentation:', err);
            alert('Failed to save presentation');
        } finally {
            setIsSaving(false);
        }
    }, [slides, settings, content, updateContent]);

    // Update element
    const handleUpdateElement = useCallback((id: string, updates: Partial<SlideElement>) => {
        setSlides(prev => {
            const newSlides = [...prev];
            const slide = newSlides[currentSlideIndex];
            const elementIndex = slide.elements.findIndex(el => el.id === id);

            if (elementIndex !== -1) {
                slide.elements[elementIndex] = {
                    ...slide.elements[elementIndex],
                    ...updates,
                };
            }

            return newSlides;
        });
    }, [currentSlideIndex]);

    // Delete element
    const handleDeleteElement = useCallback((id: string) => {
        setSlides(prev => {
            const newSlides = [...prev];
            const slide = newSlides[currentSlideIndex];
            slide.elements = slide.elements.filter(el => el.id !== id);
            return newSlides;
        });
        setSelectedElementId(null);
    }, [currentSlideIndex]);

    // Update current slide
    const handleUpdateSlide = useCallback((updates: Partial<PresentationSlide>) => {
        setSlides(prev => {
            const newSlides = [...prev];
            newSlides[currentSlideIndex] = {
                ...newSlides[currentSlideIndex],
                ...updates,
            };
            return newSlides;
        });
    }, [currentSlideIndex]);
    const handleDuplicateElement = useCallback((id: string) => {
        setSlides(prev => {
            const newSlides = [...prev];
            const slide = newSlides[currentSlideIndex];
            const element = slide.elements.find(el => el.id === id);

            if (element) {
                const newElement = {
                    ...element,
                    id: crypto.randomUUID(),
                    position: {
                        x: element.position.x + 20,
                        y: element.position.y + 20,
                    },
                };
                slide.elements.push(newElement);
                setSelectedElementId(newElement.id);
            }

            return newSlides;
        });
    }, [currentSlideIndex]);

    // Add text
    const handleAddText = useCallback(() => {
        const newElement = createTextElement({
            x: 100 + Math.random() * 50,
            y: 100 + Math.random() * 50
        });
        newElement.text = 'Click to edit';

        setSlides(prev => {
            const newSlides = JSON.parse(JSON.stringify(prev)); // Deep clone
            newSlides[currentSlideIndex].elements.push(newElement);
            return newSlides;
        });
        setSelectedElementId(newElement.id);
    }, [currentSlideIndex]);

    // Add image
    const handleAddImage = useCallback(() => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/png,image/jpeg,image/jpg,image/svg+xml,image/webp';

        input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;

            const formData = new FormData();
            formData.append('file', file);

            try {
                const res = await fetch('/api/upload', { method: 'POST', body: formData });
                const data = await res.json();

                if (data.success) {
                    const newElement = createImageElement(data.url, {
                        x: 150 + Math.random() * 50,
                        y: 150 + Math.random() * 50
                    });

                    setSlides(prev => {
                        const newSlides = JSON.parse(JSON.stringify(prev)); // Deep clone
                        newSlides[currentSlideIndex].elements.push(newElement);
                        return newSlides;
                    });
                    setSelectedElementId(newElement.id);
                } else {
                    alert('Failed to upload image');
                }
            } catch (err) {
                console.error('Upload error:', err);
                alert('Error uploading image');
            }
        };

        input.click();
    }, [currentSlideIndex]);

    // Add shape
    const handleAddShape = useCallback(() => {
        const newElement = createShapeElement('rectangle', {
            x: 200 + Math.random() * 50,
            y: 200 + Math.random() * 50
        });

        setSlides(prev => {
            const newSlides = JSON.parse(JSON.stringify(prev)); // Deep clone
            newSlides[currentSlideIndex].elements.push(newElement);
            return newSlides;
        });
        setSelectedElementId(newElement.id);
    }, [currentSlideIndex]);

    // Add slide
    const handleAddSlide = useCallback(() => {
        setSlides(prev => [...prev, createBlankSlide()]);
        setCurrentSlideIndex(slides.length);
    }, [slides.length]);

    // Delete slide
    const handleDeleteSlide = useCallback((index: number) => {
        if (slides.length === 1) {
            alert('Cannot delete the last slide');
            return;
        }

        if (confirm('Delete this slide?')) {
            setSlides(prev => prev.filter((_, i) => i !== index));
            if (currentSlideIndex >= index && currentSlideIndex > 0) {
                setCurrentSlideIndex(currentSlideIndex - 1);
            }
        }
    }, [slides.length, currentSlideIndex]);

    // Handle file import (PDF/PPTX)
    const handleImport = useCallback(async () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.pdf,.pptx';

        input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;

            const formData = new FormData();
            formData.append('file', file);

            try {
                setIsSaving(true);
                const res = await fetch('/api/import-presentation', {
                    method: 'POST',
                    body: formData
                });
                const data = await res.json();

                if (data.success && data.slides) {
                    // Append imported slides to existing ones
                    setSlides(prev => [...prev, ...data.slides]);
                    alert(`Successfully imported ${data.slides.length} slides!`);
                } else {
                    alert(`Import failed: ${data.message || 'Unknown error'}`);
                }
            } catch (err) {
                console.error('Import error:', err);
                alert('Error importing file');
            } finally {
                setIsSaving(false);
            }
        };

        input.click();
    }, []);

    // Keyboard shortcuts for adding elements
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Don't trigger if user is typing in an input/textarea
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }

            if (e.key === 't' || e.key === 'T') {
                e.preventDefault();
                handleAddText();
            } else if (e.key === 'i' || e.key === 'I') {
                e.preventDefault();
                handleAddImage();
            } else if (e.key === 's' || e.key === 'S') {
                e.preventDefault();
                handleAddShape();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleAddText, handleAddImage, handleAddShape]);

    // Copy/Paste functionality
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Don't trigger if user is typing
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }

            // Copy (Ctrl/Cmd + C)
            if ((e.ctrlKey || e.metaKey) && e.key === 'c' && selectedElement) {
                e.preventDefault();
                setClipboard(selectedElement);
                console.log('Copied element to clipboard');
            }

            // Paste (Ctrl/Cmd + V)
            if ((e.ctrlKey || e.metaKey) && e.key === 'v' && clipboard) {
                e.preventDefault();
                const newElement = {
                    ...clipboard,
                    id: crypto.randomUUID(),
                    position: {
                        x: clipboard.position.x + 20,
                        y: clipboard.position.y + 20,
                    },
                };

                setSlides(prev => {
                    const newSlides = JSON.parse(JSON.stringify(prev));
                    newSlides[currentSlideIndex].elements.push(newElement);
                    return newSlides;
                });
                setSelectedElementId(newElement.id);
                console.log('Pasted element from clipboard');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedElement, clipboard, currentSlideIndex]);

    // Select/Deselect all
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Don't trigger if user is typing
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }

            // Deselect with Escape (when not editing)
            if (e.key === 'Escape' && selectedElementId) {
                e.preventDefault();
                setSelectedElementId(null);
            }

            // Select All - Ctrl/Cmd + A (select first element as we don't have multi-select yet)
            if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
                e.preventDefault();
                const firstElement = currentSlide?.elements[0];
                if (firstElement) {
                    setSelectedElementId(firstElement.id);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedElementId, currentSlide]);

    return (
        <div className="h-screen flex flex-col bg-slate-950">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-6 py-3 bg-slate-900 border-b border-slate-800">
                <div className="flex items-center gap-4">
                    <h1 className="text-lg font-bold text-white">Presentation Editor</h1>
                    <div className="h-6 w-px bg-slate-700" />
                    <div className="flex gap-2">
                        <button
                            onClick={handleAddText}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-sm transition-colors"
                            title="Add Text (T)"
                        >
                            <Type size={16} />
                            <span>Add Text</span>
                        </button>
                        <button
                            onClick={handleAddImage}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded text-sm transition-colors"
                            title="Add Image (I)"
                        >
                            <ImageIcon size={16} />
                            <span>Add Image</span>
                        </button>
                        <button
                            onClick={handleAddShape}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded text-sm transition-colors"
                            title="Add Shape (S)"
                        >
                            <Square size={16} />
                            <span>Add Shape</span>
                        </button>
                        <button
                            onClick={handleImport}
                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded text-sm transition-colors"
                            title="Import PDF/PPTX"
                        >
                            <Upload size={16} />
                            <span>Import</span>
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowPreview(!showPreview)}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded text-sm transition-colors"
                    >
                        <Eye size={16} />
                        {showPreview ? 'Edit' : 'Preview'}
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-sm transition-colors disabled:opacity-50"
                    >
                        <Save size={16} />
                        {isSaving ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>

            {/* Main content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Slides panel */}
                <div className="w-64 bg-slate-900 border-r border-slate-800 p-4 overflow-y-auto">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-slate-300">Slides</h3>
                        <button
                            onClick={handleAddSlide}
                            className="p-1 text-slate-400 hover:text-white transition-colors"
                            title="Add Slide"
                        >
                            <Plus size={16} />
                        </button>
                    </div>

                    <div className="space-y-3">
                        {slides.map((slide, index) => (
                            <div
                                key={slide.id}
                                className={`relative group cursor-pointer rounded-[4px] overflow-hidden border-2 transition-all ${index === currentSlideIndex
                                    ? 'border-blue-500 shadow-lg'
                                    : 'border-slate-700 hover:border-slate-600'
                                    }`}
                                onClick={() => setCurrentSlideIndex(index)}
                            >
                                <div
                                    className="aspect-video relative"
                                    style={{ background: slide.background || '#0f172a' }}
                                >
                                    {/* Show mini preview of elements */}
                                    {slide.elements.length > 0 ? (
                                        <div className="absolute inset-0 p-2 overflow-hidden">
                                            {slide.elements.slice(0, 3).map((element, idx) => (
                                                <div
                                                    key={element.id}
                                                    className="absolute bg-blue-500/20 border border-blue-500/40 rounded"
                                                    style={{
                                                        left: `${element.position.x / 20}px`,
                                                        top: `${element.position.y / 20}px`,
                                                        width: `${element.size.width / 20}px`,
                                                        height: `${element.size.height / 20}px`,
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-slate-600 text-xs">
                                            Empty slide
                                        </div>
                                    )}
                                    {slide.elements.length > 3 && (
                                        <div className="absolute bottom-1 right-1 bg-slate-800/80 text-slate-300 text-xs px-2 py-1 rounded">
                                            +{slide.elements.length - 3} more
                                        </div>
                                    )}
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 flex items-center justify-between">
                                    <span className="text-xs text-white font-medium">Slide {index + 1}</span>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteSlide(index);
                                        }}
                                        className="p-1 text-slate-400 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Slide navigation */}
                    <div className="flex gap-2 mt-4">
                        <button
                            onClick={() => setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))}
                            disabled={currentSlideIndex === 0}
                            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-sm transition-colors disabled:opacity-50"
                        >
                            <ChevronLeft size={14} />
                            Prev
                        </button>
                        <button
                            onClick={() => setCurrentSlideIndex(Math.min(slides.length - 1, currentSlideIndex + 1))}
                            disabled={currentSlideIndex === slides.length - 1}
                            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-sm transition-colors disabled:opacity-50"
                        >
                            Next
                            <ChevronRight size={14} />
                        </button>
                    </div>
                </div>

                {/* Canvas workspace */}
                <CanvasWorkspace
                    elements={currentSlide?.elements || []}
                    selectedElementId={selectedElementId}
                    onSelectElement={setSelectedElementId}
                    onUpdateElement={handleUpdateElement}
                    onDeleteElement={handleDeleteElement}
                    onDuplicateElement={handleDuplicateElement}
                    background={currentSlide?.background}
                    width={slideWidth}
                    height={slideHeight}
                    customHeight={settings.height}
                />

                {/* Properties/Settings panel with tabs */}
                <div className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col">
                    {/* Tabs */}
                    <div className="flex border-b border-slate-800">
                        <button
                            onClick={() => setRightPanelTab('element')}
                            className={`flex-1 py-3 text-xs font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${rightPanelTab === 'element'
                                ? 'border-blue-500 text-blue-400'
                                : 'border-transparent text-slate-400 hover:text-slate-200'
                                }`}
                        >
                            <Layers size={14} />
                            Element
                        </button>
                        <button
                            onClick={() => setRightPanelTab('slide')}
                            className={`flex-1 py-3 text-xs font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${rightPanelTab === 'slide'
                                ? 'border-emerald-500 text-emerald-400'
                                : 'border-transparent text-slate-400 hover:text-slate-200'
                                }`}
                        >
                            <FileText size={14} />
                            Slide
                        </button>
                        <button
                            onClick={() => setRightPanelTab('settings')}
                            className={`flex-1 py-3 text-xs font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${rightPanelTab === 'settings'
                                ? 'border-purple-500 text-purple-400'
                                : 'border-transparent text-slate-400 hover:text-slate-200'
                                }`}
                        >
                            <SettingsIcon size={14} />
                            Settings
                        </button>
                    </div>

                    {/* Panel content */}
                    {rightPanelTab === 'element' ? (
                        <ElementPropertiesPanel
                            element={selectedElement}
                            slideWidth={slideWidth}
                            slideHeight={slideHeight}
                            onUpdate={(updates) => {
                                if (selectedElementId) {
                                    handleUpdateElement(selectedElementId, updates);
                                }
                            }}
                        />
                    ) : rightPanelTab === 'slide' ? (
                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="space-y-6">
                                {/* Slide Background */}
                                <div>
                                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Slide Background</h4>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="color"
                                            value={currentSlide?.background || '#0f172a'}
                                            onChange={(e) => handleUpdateSlide({ background: e.target.value })}
                                            className="w-12 h-12 rounded cursor-pointer border-2 border-slate-700"
                                        />
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={currentSlide?.background || '#0f172a'}
                                                onChange={(e) => handleUpdateSlide({ background: e.target.value })}
                                                className="w-full px-3 py-2 bg-slate-800 text-slate-200 rounded text-sm"
                                                placeholder="#0f172a"
                                            />
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-2">Color for this slide only</p>
                                </div>

                                {/* Slide Info */}
                                <div>
                                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Slide Info</h4>
                                    <div className="space-y-2 text-sm text-slate-400">
                                        <div className="flex justify-between">
                                            <span>Slide Number:</span>
                                            <span className="text-slate-200">{currentSlideIndex + 1} of {slides.length}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Elements:</span>
                                            <span className="text-slate-200">{currentSlide?.elements.length || 0}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <PresentationSettingsPanel
                            settings={settings}
                            onUpdate={(updates) => setSettings({ ...settings, ...updates })}
                        />
                    )}
                </div>
            </div>

            {/* Keyboard shortcuts help */}
            <div className="px-6 py-2 bg-slate-900 border-t border-slate-800 text-xs text-slate-500 flex items-center gap-6">
                <span><kbd className="px-2 py-1 bg-slate-800 rounded">T</kbd> Add Text</span>
                <span><kbd className="px-2 py-1 bg-slate-800 rounded">I</kbd> Add Image</span>
                <span><kbd className="px-2 py-1 bg-slate-800 rounded">Delete</kbd> Remove</span>
                <span><kbd className="px-2 py-1 bg-slate-800 rounded">Cmd+D</kbd> Duplicate</span>
                <span><kbd className="px-2 py-1 bg-slate-800 rounded">Double-click</kbd> Edit text</span>
            </div>
        </div>
    );
}
