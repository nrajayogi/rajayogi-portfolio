"use client";

import { SlideElement } from '@/lib/presentation-types';
import { useState } from 'react';
import { Type, Image as ImageIcon, Circle, AlignLeft, AlignCenter, AlignRight, Bold, Palette } from 'lucide-react';

interface ElementPropertiesPanelProps {
    element: SlideElement | null;
    onUpdate: (updates: Partial<SlideElement>) => void;
    slideWidth?: number;
    slideHeight?: number;
}

const FONT_FAMILIES = [
    { label: 'Inter', value: 'Inter, sans-serif' },
    { label: 'Arial', value: 'Arial, sans-serif' },
    { label: 'Helvetica', value: 'Helvetica, sans-serif' },
    { label: 'Times New Roman', value: '"Times New Roman", serif' },
    { label: 'Georgia', value: 'Georgia, serif' },
    { label: 'Courier New', value: '"Courier New", monospace' },
    { label: 'Verdana', value: 'Verdana, sans-serif' },
    { label: 'Montserrat', value: 'Montserrat, sans-serif' },
    { label: 'Roboto', value: 'Roboto, sans-serif' },
    { label: 'Open Sans', value: '"Open Sans", sans-serif' },
];

const PRESET_COLORS = [
    '#ffffff', '#000000', '#ef4444', '#f97316', '#f59e0b', '#eab308',
    '#84cc16', '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
    '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899',
];

export function ElementPropertiesPanel({
    element,
    onUpdate,
    slideWidth = 1000,
    slideHeight = 562,
}: ElementPropertiesPanelProps) {
    const [showColorPicker, setShowColorPicker] = useState(false);

    if (!element) {
        return (
            <div className="w-80 bg-slate-900 border-l border-slate-800 p-6 flex flex-col items-center justify-center text-slate-500">
                <Type size={48} className="mb-4 opacity-20" />
                <p className="text-sm text-center">Select an element to edit its properties</p>
            </div>
        );
    }

    return (
        <div className="w-80 bg-slate-900 border-l border-slate-800 p-4 overflow-y-auto">
            <h3 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
                {element.type === 'text' && <Type size={16} />}
                {element.type === 'image' && <ImageIcon size={16} />}
                {element.type === 'shape' && <Circle size={16} />}
                {element.type === 'text' ? 'Text Properties' : element.type === 'image' ? 'Image Properties' : 'Shape Properties'}
            </h3>

            {/* Common Properties */}
            <PropertySection title="Position & Size">
                <div className="grid grid-cols-2 gap-2">
                    <PropertyInput
                        label="X"
                        value={Math.round(element.position.x)}
                        onChange={(val) => onUpdate({ position: { ...element.position, x: val } })}
                    />
                    <PropertyInput
                        label="Y"
                        value={Math.round(element.position.y)}
                        onChange={(val) => onUpdate({ position: { ...element.position, y: val } })}
                    />
                    <PropertyInput
                        label="Width"
                        value={Math.round(element.size.width)}
                        onChange={(val) => onUpdate({ size: { ...element.size, width: val } })}
                    />
                    <PropertyInput
                        label="Height"
                        value={Math.round(element.size.height)}
                        onChange={(val) => onUpdate({ size: { ...element.size, height: val } })}
                    />
                </div>

                {/* Quick Align Buttons */}
                <div className="mt-3">
                    <label className="block text-xs font-medium text-slate-400 mb-2">Quick Align</label>
                    <div className="grid grid-cols-3 gap-2">
                        <button
                            onClick={() => onUpdate({ position: { ...element.position, x: 0 } })}
                            className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs transition-colors"
                            title="Align Left"
                        >
                            Left
                        </button>
                        <button
                            onClick={() => onUpdate({ position: { ...element.position, x: (slideWidth / 2) - element.size.width / 2 } })}
                            className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs transition-colors"
                            title="Center Horizontally"
                        >
                            Center
                        </button>
                        <button
                            onClick={() => onUpdate({ position: { ...element.position, x: slideWidth - element.size.width } })}
                            className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs transition-colors"
                            title="Align Right"
                        >
                            Right
                        </button>
                        <button
                            onClick={() => onUpdate({ position: { ...element.position, y: 0 } })}
                            className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs transition-colors"
                            title="Align Top"
                        >
                            Top
                        </button>
                        <button
                            onClick={() => onUpdate({ position: { ...element.position, y: (slideHeight / 2) - element.size.height / 2 } })}
                            className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs transition-colors"
                            title="Center Vertically"
                        >
                            Middle
                        </button>
                        <button
                            onClick={() => onUpdate({ position: { ...element.position, y: slideHeight - element.size.height } })}
                            className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs transition-colors"
                            title="Align Bottom"
                        >
                            Bottom
                        </button>
                    </div>
                </div>

                <PropertySlider
                    label="Rotation"
                    value={element.rotation}
                    onChange={(val) => onUpdate({ rotation: val })}
                    min={0}
                    max={360}
                    step={1}
                />
            </PropertySection>

            {/* Text-specific properties */}
            {element.type === 'text' && (
                <>
                    <PropertySection title="Font">
                        <label className="block text-xs text-slate-400 mb-1">Font Family</label>
                        <select
                            value={element.fontFamily}
                            onChange={(e) => onUpdate({ fontFamily: e.target.value })}
                            className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                        >
                            {FONT_FAMILIES.map(font => (
                                <option key={font.value} value={font.value}>{font.label}</option>
                            ))}
                        </select>

                        <PropertySlider
                            label="Font Size"
                            value={element.fontSize || 24}
                            onChange={(val) => onUpdate({ fontSize: val })}
                            min={8}
                            max={200}
                            step={1}
                        />

                        <label className="block text-xs text-slate-400 mb-2 mt-3">Font Weight</label>
                        <div className="flex gap-2">
                            <button
                                onClick={() => onUpdate({ fontWeight: 400 })}
                                className={`flex-1 px-3 py-2 rounded text-sm transition-colors ${element.fontWeight === 400 || element.fontWeight === 'normal'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                    }`}
                            >
                                Normal
                            </button>
                            <button
                                onClick={() => onUpdate({ fontWeight: 700 })}
                                className={`flex-1 px-3 py-2 rounded text-sm font-bold transition-colors ${element.fontWeight === 700 || element.fontWeight === 'bold'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                    }`}
                            >
                                Bold
                            </button>
                        </div>

                        <label className="block text-xs text-slate-400 mb-2 mt-3">Text Alignment</label>
                        <div className="flex gap-2">
                            <button
                                onClick={() => onUpdate({ textAlign: 'left' })}
                                className={`flex-1 px-3 py-2 rounded transition-colors flex items-center justify-center ${element.textAlign === 'left'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                    }`}
                            >
                                <AlignLeft size={16} />
                            </button>
                            <button
                                onClick={() => onUpdate({ textAlign: 'center' })}
                                className={`flex-1 px-3 py-2 rounded transition-colors flex items-center justify-center ${element.textAlign === 'center'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                    }`}
                            >
                                <AlignCenter size={16} />
                            </button>
                            <button
                                onClick={() => onUpdate({ textAlign: 'right' })}
                                className={`flex-1 px-3 py-2 rounded transition-colors flex items-center justify-center ${element.textAlign === 'right'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                    }`}
                            >
                                <AlignRight size={16} />
                            </button>
                        </div>
                    </PropertySection>

                    <PropertySection title="Color">
                        <label className="block text-xs text-slate-400 mb-2">Text Color</label>
                        <div className="flex items-center gap-2 mb-3">
                            <div
                                className="w-12 h-12 rounded border-2 border-slate-700 cursor-pointer hover:border-slate-500 transition-colors"
                                style={{ backgroundColor: element.color }}
                                onClick={() => setShowColorPicker(!showColorPicker)}
                            />
                            <input
                                type="text"
                                value={element.color}
                                onChange={(e) => onUpdate({ color: e.target.value })}
                                className="flex-1 bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-blue-500"
                                placeholder="#ffffff"
                            />
                        </div>

                        {showColorPicker && (
                            <div className="grid grid-cols-6 gap-2 mb-3">
                                {PRESET_COLORS.map(color => (
                                    <div
                                        key={color}
                                        className="w-full aspect-square rounded cursor-pointer border-2 border-transparent hover:border-slate-500 transition-colors"
                                        style={{ backgroundColor: color }}
                                        onClick={() => {
                                            onUpdate({ color });
                                            setShowColorPicker(false);
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                    </PropertySection>
                </>
            )}

            {/* Image-specific properties */}
            {element.type === 'image' && (
                <PropertySection title="Image">
                    <PropertySlider
                        label="Opacity"
                        value={element.opacity || 1}
                        onChange={(val) => onUpdate({ opacity: val })}
                        min={0}
                        max={1}
                        step={0.1}
                    />
                </PropertySection>
            )}

            {/* Shape-specific properties */}
            {element.type === 'shape' && (
                <>
                    <PropertySection title="Shape">
                        <label className="block text-xs text-slate-400 mb-2">Fill Color</label>
                        <input
                            type="color"
                            value={element.fillColor}
                            onChange={(e) => onUpdate({ fillColor: e.target.value })}
                            className="w-full h-10 bg-slate-800 border border-slate-700 rounded cursor-pointer"
                        />

                        <label className="block text-xs text-slate-400 mb-2 mt-3">Border Color</label>
                        <input
                            type="color"
                            value={element.borderColor}
                            onChange={(e) => onUpdate({ borderColor: e.target.value })}
                            className="w-full h-10 bg-slate-800 border border-slate-700 rounded cursor-pointer"
                        />

                        <PropertySlider
                            label="Border Width"
                            value={element.borderWidth || 0}
                            onChange={(val) => onUpdate({ borderWidth: val })}
                            min={0}
                            max={20}
                            step={1}
                        />
                    </PropertySection>
                </>
            )}

            {/* Layer control */}
            <PropertySection title="Layer">
                <div className="flex gap-2">
                    <button
                        onClick={() => onUpdate({ zIndex: element.zIndex + 1 })}
                        className="flex-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-sm transition-colors"
                    >
                        Bring Forward
                    </button>
                    <button
                        onClick={() => onUpdate({ zIndex: Math.max(0, element.zIndex - 1) })}
                        className="flex-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-sm transition-colors"
                    >
                        Send Backward
                    </button>
                </div>
            </PropertySection>
        </div>
    );
}

// Helper components
function PropertySection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="mb-6 pb-6 border-b border-slate-800 last:border-0">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">{title}</h4>
            {children}
        </div>
    );
}

function PropertyInput({
    label,
    value,
    onChange,
}: {
    label: string;
    value: number;
    onChange: (val: number) => void;
}) {
    return (
        <div>
            <label className="block text-xs text-slate-400 mb-1">{label}</label>
            <input
                type="number"
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
            />
        </div>
    );
}

function PropertySlider({
    label,
    value,
    onChange,
    min,
    max,
    step,
}: {
    label: string;
    value: number;
    onChange: (val: number) => void;
    min: number;
    max: number;
    step: number;
}) {
    return (
        <div className="mt-3">
            <div className="flex justify-between items-center mb-2">
                <label className="text-xs text-slate-400">{label}</label>
                <span className="text-xs text-slate-300 font-mono">{value}</span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-[4px] appearance-none cursor-pointer accent-blue-500"
            />
        </div>
    );
}
