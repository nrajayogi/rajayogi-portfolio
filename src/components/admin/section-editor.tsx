"use client";

import { useContent } from "@/lib/content-context";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Content } from "@/lib/content-types";

// --- Custom Admin UI Components ---

interface AdminInputProps {
    label: string;
    value: string | number;
    onChange: (value: string | number | boolean) => void;
    multiline?: boolean;
}

const AdminInput = ({ label, value, onChange, multiline = false }: AdminInputProps) => (
    <div className="mb-4">
        <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2 font-medium">{label}</label>
        {multiline ? (
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white text-sm focus:border-blue-500 outline-none min-h-[100px]"
                aria-label={label}
            />
        ) : (
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white text-sm focus:border-blue-500 outline-none"
                aria-label={label}
            />
        )}
    </div>
);

interface FieldGroupProps {
    label: string;
    children: React.ReactNode;
    level?: number;
}

const FieldGroup = ({ label, children, level = 0 }: FieldGroupProps) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div className={cn("mb-4 border border-slate-800 rounded overflow-hidden", level > 0 && "ml-4")}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-2 bg-slate-800/50 hover:bg-slate-800 transition-colors text-left"
            >
                <span className="text-xs font-bold text-slate-400 uppercase">{label}</span>
                {isOpen ? <ChevronDown size={14} className="text-slate-500" /> : <ChevronRight size={14} className="text-slate-500" />}
            </button>
            {isOpen && <div className="p-3">{children}</div>}
        </div>
    );
};

// --- New Editor Components ---

const FileUploader = ({ label, value, onChange }: AdminInputProps) => {
    const [uploading, setUploading] = useState(false);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (data.success) {
                onChange(data.url);
            } else {
                alert("Upload failed");
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("Upload error");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="mb-4">
            <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2 font-medium">{label}</label>
            <div className="flex gap-2 items-center">
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="flex-1 bg-slate-800 border border-slate-700 rounded p-2 text-white text-sm focus:border-blue-500 outline-none"
                    placeholder="/path/to/image.jpg"
                />
                <label className="cursor-pointer bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded text-xs transition-colors">
                    {uploading ? "..." : "Upload"}
                    <input type="file" className="hidden" onChange={handleUpload} accept="image/*,video/*" />
                </label>
            </div>
            {String(value).match(/\.(jpg|jpeg|png|gif|webp)$/i) && (
                <div className="mt-2 w-full h-24 relative bg-slate-800/50 rounded overflow-hidden border border-slate-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={String(value)} alt="Preview" className="w-full h-full object-contain" />
                </div>
            )}
        </div>
    );
};

interface SliderProps extends AdminInputProps {
    min?: number;
    max?: number;
}

const BlurSlider = ({ label, value, onChange, min = 0, max = 20 }: SliderProps) => {
    const handleIncrement = () => {
        if (Number(value) < max) onChange(Number(value) + 1);
    };

    const handleDecrement = () => {
        if (Number(value) > min) onChange(Number(value) - 1);
    };

    return (
        <div className="mb-4">
            <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2 font-medium flex justify-between items-center">
                <span>{label}</span>
                <div className="flex items-center gap-1">
                    <button onClick={handleDecrement} className="w-6 h-6 flex items-center justify-center bg-slate-700 hover:bg-slate-600 rounded text-slate-300 text-sm" aria-label="Decrease" title="Decrease">-</button>
                    <input
                        type="number"
                        min={min}
                        max={max}
                        value={value}
                        onChange={(e) => onChange(Number(e.target.value))}
                        className="w-12 bg-slate-800 text-center text-xs text-white border border-slate-700 rounded py-1 focus:border-blue-500 outline-none appearance-none"
                    />
                    <button onClick={handleIncrement} className="w-6 h-6 flex items-center justify-center bg-slate-700 hover:bg-slate-600 rounded text-slate-300 text-sm" aria-label="Increase" title="Increase">+</button>
                </div>
            </label>
            <input
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
        </div>
    );
};

// --- Recursive Renderer ---


export function SectionEditor({ sectionKey, orientation = 'vertical' }: { sectionKey: string; orientation?: 'vertical' | 'horizontal' }) {
    const { content, updateContent } = useContent();

    // Resolve the actual section data, supporting nested keys like "about.hero" or "servicesData:plm-services"
    const resolveData = (obj: any, key: string) => {
        if (key.includes(':')) {
            const [collection, slug] = key.split(':');
            const array = obj[collection];
            if (Array.isArray(array)) {
                return array.find((item: any) => item.slug === slug);
            }
        }
        const parts = key.split('.');
        let current = obj;
        for (const part of parts) {
            if (current[part] === undefined) return null;
            current = current[part];
        }
        return current;
    };

    const sectionData = resolveData(content, sectionKey);

    if (!sectionData) {
        return <div className="text-slate-500 italic p-4">No data found for section: {sectionKey}</div>;
    }

    const handleChange = (path: string[], value: string | number | boolean) => {
        // Deep clone content to avoid mutation
        const newContent = JSON.parse(JSON.stringify(content));

        let current: any = newContent;

        if (sectionKey.includes(':')) {
            const [collection, slug] = sectionKey.split(':');
            const array = newContent[collection];
            if (Array.isArray(array)) {
                const item = array.find((i: any) => i.slug === slug);
                if (item) current = item;
            }
        } else {
            // Walk down the sectionKey parts
            const sectionParts = sectionKey.split('.');
            for (let i = 0; i < sectionParts.length; i++) {
                current = current[sectionParts[i]];
            }
        }

        // Walk down the additional path parts
        for (let i = 0; i < path.length - 1; i++) {
            current = current[path[i]];
        }
        current[path[path.length - 1]] = value;

        updateContent(newContent);
    };

    const handleAddItem = (path: string[], template: unknown) => {
        const newContent = JSON.parse(JSON.stringify(content));

        let current: any = newContent;
        if (sectionKey.includes(':')) {
            const [collection, slug] = sectionKey.split(':');
            const array = newContent[collection];
            if (Array.isArray(array)) {
                const item = array.find((i: any) => i.slug === slug);
                if (item) current = item;
            }
        } else {
            const sectionParts = sectionKey.split('.');
            for (let i = 0; i < sectionParts.length; i++) {
                current = current[sectionParts[i]];
            }
        }

        for (let i = 0; i < path.length; i++) {
            current = current[path[i]];
        }
        if (Array.isArray(current)) {
            current.push(template);
            updateContent(newContent);
        }
    };

    const handleRemoveItem = (path: string[], index: number) => {
        const newContent = JSON.parse(JSON.stringify(content));

        let current: any = newContent;
        if (sectionKey.includes(':')) {
            const [collection, slug] = sectionKey.split(':');
            const array = newContent[collection];
            if (Array.isArray(array)) {
                const item = array.find((i: any) => i.slug === slug);
                if (item) current = item;
            }
        } else {
            const sectionParts = sectionKey.split('.');
            for (let i = 0; i < sectionParts.length; i++) {
                current = current[sectionParts[i]];
            }
        }

        for (let i = 0; i < path.length; i++) {
            current = current[path[i]];
        }
        if (Array.isArray(current)) {
            current.splice(index, 1);
            updateContent(newContent);
        }
    };

    const renderFields = (data: unknown, path: string[] = [], level = 0): React.ReactNode => {
        if (typeof data === 'string' || typeof data === 'number') {
            const key = path[path.length - 1];
            const label = key.replace(/([A-Z])/g, ' $1').trim(); // CamelCase to Title Case

            // Detect specialized fields by key name OR context
            const parentKey = path.length > 1 ? path[path.length - 2] : sectionKey;
            const isImageContext = parentKey.toLowerCase().includes('image') || parentKey.toLowerCase().includes('carousel') || parentKey.toLowerCase().includes('logo');

            if (key.toLowerCase().includes('url') || key === 'logo' || key === 'image' || (isImageContext && !key.includes('overlay')) || key === 'logoUrlMobile') {
                return (
                    <FileUploader
                        key={path.join('.')}
                        label={label}
                        value={data}
                        onChange={(val) => handleChange(path, val)}
                    />
                );
            }

            if (key.toLowerCase().includes('blur') || key.toLowerCase().includes('scale') || key.toLowerCase().includes('brightness')) {
                // Brightness up to 600% for maximum control, Scale up to 200%, Blur up to 20px
                const max = key.includes('brightness') ? 600 : (key.includes('scale') ? 200 : 20);
                const min = key.includes('scale') ? 10 : 0;
                return (
                    <BlurSlider
                        key={path.join('.')}
                        label={label}
                        value={data}
                        onChange={(val) => handleChange(path, val)}
                        min={min}
                        max={max}
                    />
                );
            }

            // Handle Position Object {x, y} locally if detected??
            // Actually, renderFields recurses, so {x: 50, y: 50} becomes two number fields.
            // We want to intercept the *object* 'overlayPosition' before it recurses?
            // Or just let it recurse and handle x/y as sliders if parent is overlayPosition?
            if (parentKey === 'overlayPosition' && (key === 'x' || key === 'y')) {
                return (
                    <BlurSlider
                        key={path.join('.')}
                        label={`${label} (%)`}
                        value={data}
                        onChange={(val) => handleChange(path, val)}
                        min={-50}
                        max={150} // Allow dragging slightly offscreen
                    />
                );
            }

            const isLong = typeof data === 'string' && data.length > 50;
            return (
                <AdminInput
                    key={path.join('.')}
                    label={label}
                    value={data}
                    multiline={isLong}
                    onChange={(val) => handleChange(path, val)}
                />
            );
        }

        if (Array.isArray(data)) {
            return (
                <FieldGroup key={path.join('.')} label={`${path[path.length - 1]} (List)`} level={level}>
                    {data.map((item, index) => (
                        <div key={index} className="border-b border-slate-800/50 pb-4 mb-4 last:border-0 last:mb-0 last:pb-0 relative group">
                            <div className="flex justify-between items-center mb-2">
                                <div className="text-[10px] text-slate-600">Item {index + 1}</div>
                                <button
                                    onClick={() => handleRemoveItem(path, index)}
                                    className="text-slate-600 hover:text-red-500 text-xs px-2 py-1 rounded bg-slate-800/50 opacity-0 group-hover:opacity-100 transition-all font-medium"
                                    title="Remove Item"
                                >
                                    Remove
                                </button>
                            </div>
                            {renderFields(item, [...path, index.toString()], level + 1)}
                        </div>
                    ))}
                    <button
                        onClick={() => {
                            // Clone the first item structure or use a simple default if empty
                            const template = data.length > 0 ? JSON.parse(JSON.stringify(data[0])) : {};
                            // Reset string/number values to empty/0

                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const resetValues = (obj: any) => {
                                for (const k in obj) {
                                    if (typeof obj[k] === 'string') obj[k] = "";
                                    else if (typeof obj[k] === 'number') obj[k] = 0;
                                    else if (typeof obj[k] === 'object') resetValues(obj[k]);
                                }
                                return obj;
                            };
                            handleAddItem(path, resetValues(template));
                        }}
                        className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-medium rounded transition-colors border border-dashed border-slate-700 mt-2 flex items-center justify-center gap-1"
                    >
                        + Add Item
                    </button>
                </FieldGroup>
            );
        }

        if (typeof data === 'boolean') {
            return (
                <div key={path.join('.')} className="mb-4 flex items-center justify-between border border-slate-800 rounded p-3 bg-slate-800/20">
                    <label className="text-xs uppercase tracking-wider text-slate-400 font-medium">
                        {path[path.length - 1].replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <button
                        onClick={() => handleChange(path, !data)}
                        className={`w-12 h-6 rounded-full transition-colors relative ${data ? 'bg-blue-600' : 'bg-slate-700'}`}
                    >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${data ? 'left-7' : 'left-1'}`} />
                    </button>
                </div>
            );
        }

        if (typeof data === 'object' && data !== null) {
            const objectData = data as Record<string, unknown>;
            // For the root object, don't wrap in a fieldset to save space
            if (level === 0 && path.length === 0) {
                const keys = Object.keys(objectData);
                const priorityOrder = ['title', 'subtitle', 'description', 'logoUrlMobile', 'logoUrl', 'videoUrl', 'primaryCta', 'secondaryCta'];

                keys.sort((a, b) => {
                    const idxA = priorityOrder.indexOf(a);
                    const idxB = priorityOrder.indexOf(b);
                    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
                    if (idxA !== -1) return -1;
                    if (idxB !== -1) return 1;
                    return 0; // Keep original order for non-priority items
                });

                // --- HORIZONTAL MODE LOGIC ---
                // If orientation is horizontal, we want these top-level columns to be side-by-side.
                if (orientation === 'horizontal') {
                    return (
                        <div className="flex gap-4">
                            {keys.map(key => (
                                <div key={key} className="w-[300px] shrink-0">
                                    {/* Optional: Add a subtle header for the column if needed, though FieldGroup handles it mostly within renderFields recursion */}
                                    {/* If the value is a primitive, wrap it in a pseudo-group so it aligns nicely? */}
                                    {/* No, just renderFields. Primitive fields will just be floating inputs. */}
                                    {renderFields(objectData[key], [...path, key], level)}
                                </div>
                            ))}
                        </div>
                    );
                }

                return keys.map(key => renderFields(objectData[key], [...path, key], level));
            }

            const isMobileLayout = path.length === 2 && path[0] === 'layout' && path[1] === 'mobile'; // Detect if we are inside hero.layout.mobile

            return (
                <FieldGroup key={path.join('.')} label={path[path.length - 1]} level={level}>
                    {/* Inject Mobile Image Uploader specifically for the Mobile Layout section */}
                    {isMobileLayout && (

                        <FileUploader
                            label="Mobile Hero Image"
                            value={(content[sectionKey as keyof Content] as { logoUrlMobile?: string }).logoUrlMobile || ""}
                            onChange={(val) => handleChange(['logoUrlMobile'], val)}
                        />
                    )}
                    {Object.keys(objectData).map(key => renderFields(objectData[key], [...path, key], level + 1))}
                </FieldGroup>
            );
        }

        return null;
    };

    return (
        <div className={orientation === 'horizontal' ? "min-h-full" : "space-y-2"}>
            {/* Handle top-level array specifically to provide a label */}
            {Array.isArray(sectionData) ? (
                <FieldGroup label={`${sectionKey} (List)`} level={0}>
                    {sectionData.map((item, index) => (
                        <div key={index} className="border-b border-slate-800/50 pb-4 mb-4 last:border-0 last:mb-0 last:pb-0 relative group">
                            <div className="flex justify-between items-center mb-2">
                                <div className="text-[10px] text-slate-600">Item {index + 1}</div>
                                <button
                                    onClick={() => handleRemoveItem([], index)}
                                    className="text-slate-600 hover:text-red-500 text-xs px-2 py-1 rounded bg-slate-800/50 opacity-0 group-hover:opacity-100 transition-all font-medium"
                                    title="Remove Item"
                                >
                                    Remove
                                </button>
                            </div>
                            {renderFields(item, [index.toString()], 1)}
                        </div>
                    ))}
                    <button
                        onClick={() => {
                            const template = sectionData.length > 0 ? JSON.parse(JSON.stringify(sectionData[0])) : "";

                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const resetValues = (obj: any) => {
                                if (typeof obj === 'string') return "";
                                if (typeof obj === 'number') return 0;
                                for (const k in obj) {
                                    if (typeof obj[k] === 'string') obj[k] = "";
                                    else if (typeof obj[k] === 'number') obj[k] = 0;
                                    else if (typeof obj[k] === 'object') resetValues(obj[k]);
                                }
                                return obj;
                            };
                            handleAddItem([], typeof template === 'string' ? "" : resetValues(template));
                        }}
                        className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-medium rounded transition-colors border border-dashed border-slate-700 mt-2 flex items-center justify-center gap-1"
                    >
                        + Add Item
                    </button>
                </FieldGroup>
            ) : (
                renderFields(sectionData)
            )}
        </div>
    );
}
