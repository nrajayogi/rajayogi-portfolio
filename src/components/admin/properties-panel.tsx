import React, { useEffect, useState, useRef } from 'react';
import {
    AlignLeft, AlignCenter, AlignRight, AlignJustify,
    ArrowRight, Plus, Type, ChevronsUpDown,
    ArrowUpToLine, ArrowDownToLine, MoveVertical, ArrowUpDown, MoveHorizontal,
    Grid, Layers, Circle, MousePointer2, ImageIcon, Upload, Video, Palette
} from 'lucide-react';

interface PropertiesPanelProps {
    selectedElement: HTMLElement | null;
    onUpdate: () => void; // Trigger to force re-render or save
    onAddComponent: (type: 'heading' | 'paragraph' | 'image' | 'video') => void;
}

// Helper: RGB to Hex
const rgbToHex = (rgb: string) => {
    if (!rgb || rgb === 'rgba(0, 0, 0, 0)') return '#000000';
    if (rgb.startsWith('#')) return rgb;
    const nums = rgb.match(/\d+/g);
    if (!nums) return '#000000';
    return '#' + nums.slice(0, 3).map(x => parseInt(x).toString(16).padStart(2, '0')).join('');
};

interface InputRowProps {
    label?: string;
    value: string | number;
    onChange: (value: string) => void;
    icon?: React.ElementType;
}

interface ElementStyle {
    x: number; y: number; w: number; h: number; angle: number;
    opacity: number; radius: number;
    fill: string; stroke: string; strokeWidth: number;
    fontFamily: string; fontWeight: string; fontSize: number; lineHeight: string; letterSpacing: string;
    textAlign: string; alignItems: string;
    shadowX: number; shadowY: number; shadowBlur: number; shadowSpread: number; shadowColor: string;
    bgColor: string | null;
    textContent: string;
}


export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ selectedElement, onUpdate, onAddComponent }) => {
    // Local state to track inputs (synced with selectedElement)
    const [values, setValues] = useState<ElementStyle>({
        x: 0, y: 0, w: 0, h: 0, angle: 0,
        opacity: 100, radius: 0,
        fill: '#000000', stroke: '#000000', strokeWidth: 0,
        fontFamily: 'Inter', fontWeight: '400', fontSize: 16, lineHeight: 'normal', letterSpacing: 'normal',
        textAlign: 'left', alignItems: 'flex-start',
        shadowX: 0, shadowY: 0, shadowBlur: 0, shadowSpread: 0, shadowColor: '#000000',
        bgColor: null,
        textContent: ''
    });

    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const readValues = () => {
        if (!selectedElement) return;
        const style = window.getComputedStyle(selectedElement);
        // const matrix = new DOMMatrix(style.transform); // Don't rely on matrix for X/Y if we use left/top

        const shadow = style.boxShadow;
        // Basic parser for "rgb(0, 0, 0) 0px 0px 0px 0px" or "none"
        let sX = 0, sY = 0, sBlur = 0, sSpread = 0, sColor = '#000000';

        if (shadow && shadow !== 'none') {
            const match = shadow.match(/rgba?\([^)]+\)|#[0-9a-f]+/i);
            if (match) {
                sColor = rgbToHex(match[0]);
                const rest = shadow.replace(match[0], '').trim();
                const parts = rest.split(' ').map(p => parseFloat(p));
                if (parts.length >= 2) {
                    sX = parts[0] || 0;
                    sY = parts[1] || 0;
                    sBlur = parts[2] || 0;
                    sSpread = parts[3] || 0;
                }
            }
        }

        // Parse left/top explicitly
        const x = parseInt(selectedElement.style.left) || 0;
        const y = parseInt(selectedElement.style.top) || 0;

        setValues({
            x: x,
            y: y,
            w: parseInt(style.width) || 0,
            h: parseInt(style.height) || 0,
            angle: 0,
            opacity: Math.round(parseFloat(style.opacity) * 100) || 100,
            radius: parseInt(style.borderRadius) || 0,
            fill: rgbToHex(style.color) || '#ffffff', // Default to white for text if undefined
            stroke: rgbToHex(style.borderColor) || '#000000',
            strokeWidth: parseInt(style.borderWidth) || 0,
            fontFamily: style.fontFamily,
            fontWeight: style.fontWeight,
            fontSize: parseInt(style.fontSize) || 16,
            lineHeight: style.lineHeight,
            letterSpacing: style.letterSpacing === 'normal' ? '0' : style.letterSpacing,
            textAlign: style.textAlign,
            alignItems: style.alignItems,
            shadowX: sX, shadowY: sY, shadowBlur: sBlur, shadowSpread: sSpread, shadowColor: sColor,
            bgColor: style.backgroundColor && style.backgroundColor !== 'rgba(0, 0, 0, 0)' && style.backgroundColor !== 'transparent' ? rgbToHex(style.backgroundColor) : null,
            textContent: selectedElement.innerText || ''
        });
    };

    useEffect(() => {
        readValues();
        // Setup MutationObserver to update panel if element changes externally (drag)
        if (!selectedElement) return;
        const observer = new MutationObserver(readValues);
        observer.observe(selectedElement, { attributes: true, attributeFilter: ['style', 'class'] });
        return () => observer.disconnect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedElement]);

    // Update handlers
    const updateStyle = (property: string, value: string | number) => {
        if (!selectedElement) return;

        const el = selectedElement; // Alias to avoid direct prop mutation warning if possible, though linter is smart.

        switch (property) {
            case 'x':
            case 'y':
                // We update left/top directly now
                const newX = property === 'x' ? value : values.x;
                const newY = property === 'y' ? value : values.y;
                // Update local state immediately for responsiveness
                el.style.left = `${newX}px`;
                el.style.top = `${newY}px`;
                break;
            case 'w': el.style.width = `${value}px`; break;
            case 'h': el.style.height = `${value}px`; break;
            case 'opacity': el.style.opacity = `${(value as number) / 100}`; break;
            case 'radius': el.style.borderRadius = `${value}px`; break;
            case 'fill':
                // Explicit TEXT Check for fill (color)
                el.style.color = value as string;
                break;
            case 'bgColor':
                el.style.backgroundColor = value as string;
                break;
            case 'textContent':
                el.innerText = value as string;
                break;
            case 'stroke': el.style.borderColor = value as string; break;
            case 'strokeWidth':
                el.style.borderWidth = `${value}px`;
                if (el.style.borderStyle === '' || el.style.borderStyle === 'none') {
                    el.style.borderStyle = 'solid';
                }
                break;
            case 'textAlign': el.style.textAlign = value as string; break;
            case 'fontFamily': el.style.fontFamily = value as string; break;
            case 'fontWeight': el.style.fontWeight = value as string; break;
            case 'fontSize': el.style.fontSize = `${value} px`; break;
            case 'lineHeight': el.style.lineHeight = value as string; break;
            case 'letterSpacing': el.style.letterSpacing = value as string; break;
            case 'alignItems':
                el.style.display = 'flex'; // Ensure flex to make align-items work
                el.style.flexDirection = 'column'; // Assume column for text usually? Or let user decide.
                // Actually if it's a text block, usually we want justifyContent if it's vertical flow? 
                // Wait, if it's a slide background (flex center center), then alignItems is vertical.
                // If it's a text box, usually vertical align is handled differently.
                // Let's safe-guard:
                el.style.display = 'flex';
                el.style.alignItems = value as string;
                el.style.justifyContent = values.textAlign === 'center' ? 'center' : values.textAlign === 'right' ? 'flex-end' : 'flex-start';
                break;
            case 'shadowX':
            case 'shadowY':
            case 'shadowBlur':
            case 'shadowSpread':
            case 'shadowColor':
                const s = values;
                const vX = property === 'shadowX' ? value : s.shadowX;
                const vY = property === 'shadowY' ? value : s.shadowY;
                const vB = property === 'shadowBlur' ? value : s.shadowBlur;
                const vS = property === 'shadowSpread' ? value : s.shadowSpread;
                const vC = property === 'shadowColor' ? value : s.shadowColor;
                el.style.boxShadow = `${vX}px ${vY}px ${vB}px ${vS}px ${vC} `;
                break;
        }

        readValues(); // Update local state

        // Debounce Save Trigger
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = setTimeout(() => {
            onUpdate();
        }, 200);
    };


    const isSlideContainer = selectedElement?.hasAttribute('data-slide-index');

    if (!selectedElement || isSlideContainer) {
        return (
            <div className="h-full flex flex-col p-4">
                <div className="text-slate-500 text-center mb-8 mt-12">
                    <p className="text-sm font-medium mb-1">{isSlideContainer ? 'Slide Selected' : 'No Element Selected'}</p>
                    <p className="text-xs opacity-50">Select an item to edit, or add new content below.</p>
                </div>

                <div className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-2">Toolbox</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => onAddComponent('heading')}
                            className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-900 border border-slate-800 rounded-[4px] hover:bg-slate-800 hover:border-slate-600 transition-all group"
                        >
                            <Type size={20} className="text-slate-500 group-hover:text-blue-400" />
                            <span className="text-xs text-slate-400 group-hover:text-white font-medium">Heading</span>
                        </button>
                        <button
                            onClick={() => onAddComponent('paragraph')}
                            className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-900 border border-slate-800 rounded-[4px] hover:bg-slate-800 hover:border-slate-600 transition-all group"
                        >
                            <AlignLeft size={20} className="text-slate-500 group-hover:text-green-400" />
                            <span className="text-xs text-slate-400 group-hover:text-white font-medium">Text</span>
                        </button>
                        <button
                            onClick={() => onAddComponent('image')}
                            className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-900 border border-slate-800 rounded-[4px] hover:bg-slate-800 hover:border-slate-600 transition-all group"
                        >
                            <ImageIcon size={20} className="text-slate-500 group-hover:text-purple-400" />
                            <span className="text-xs text-slate-400 group-hover:text-white font-medium">Image</span>
                        </button>
                        <button
                            onClick={() => onAddComponent('video')}
                            className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-900 border border-slate-800 rounded-[4px] hover:bg-slate-800 hover:border-slate-600 transition-all group"
                        >
                            <Video size={20} className="text-slate-500 group-hover:text-red-400" />
                            <span className="text-xs text-slate-400 group-hover:text-white font-medium">Video</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const InputRow = ({ label, value, onChange, icon: Icon }: InputRowProps) => (
        <div className="flex items-center gap-2 group">
            {Icon && <Icon size={12} className="text-slate-500 group-hover:text-slate-300" />}
            {label && <span className="text-[10px] uppercase font-bold text-slate-500 w-4">{label}</span>}
            <input
                type="number"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-slate-900 border border-transparent hover:border-slate-700 focus:border-blue-500 rounded px-2 py-1 text-xs text-white transition-all outline-none text-right"
            />
        </div>
    );

    return (
        <div className="w-full h-full bg-[#1E1E1E] border-l border-[#333] text-white overflow-y-auto custom-scrollbar flex flex-col font-sans select-none">

            {/* Header */}
            <div className="h-10 border-b border-[#333] flex items-center px-4 justify-between bg-[#252525]">
                <span className="text-xs font-bold tracking-wide flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    {selectedElement.tagName.toLowerCase()}
                </span>
                <div className="flex gap-2 text-slate-400">
                    <AlignLeft size={14} className="hover:text-white cursor-pointer" onClick={() => updateStyle('textAlign', 'left')} />
                    <AlignCenter size={14} className="hover:text-white cursor-pointer" onClick={() => updateStyle('textAlign', 'center')} />
                    <AlignRight size={14} className="hover:text-white cursor-pointer" onClick={() => updateStyle('textAlign', 'right')} />
                </div>
            </div>

            <div className="p-4 space-y-6">

                {/* 0. CONTENT EDITOR */}
                {(values.textContent || ['P', 'H1', 'H2', 'H3', 'LI', 'SPAN', 'DIV'].includes(selectedElement.tagName)) && !isSlideContainer && (
                    <div className="mb-6 space-y-2">
                        <div className="flex justify-between items-center text-[11px] font-bold text-slate-400">
                            <span>Content</span>
                            <Type size={12} />
                        </div>
                        <textarea
                            value={values.textContent}
                            onChange={(e) => updateStyle('textContent', e.target.value)}
                            className="w-full h-24 bg-slate-900 border border-slate-700 rounded-[4px] p-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500 font-sans resize-none"
                            placeholder="Edit text content..."
                        />
                        <div className="h-px bg-[#333] my-4" />
                    </div>
                )}
                <div className="flex justify-between items-center text-[11px] font-bold text-slate-400">
                    <span>Position</span>
                    <Grid size={12} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <InputRow label="X" value={values.x} onChange={(v: string) => updateStyle('x', Number(v))} />
                    <InputRow label="Y" value={values.y} onChange={(v: string) => updateStyle('y', Number(v))} />
                    <InputRow label="W" value={values.w} onChange={(v: string) => updateStyle('w', Number(v))} />
                    <InputRow label="H" value={values.h} onChange={(v: string) => updateStyle('h', Number(v))} />
                    <InputRow label="Angle" value={values.angle} onChange={(v: string) => updateStyle('angle', Number(v))} icon={ArrowRight} />
                    <InputRow label="R" value={values.radius} onChange={(v: string) => updateStyle('radius', Number(v))} icon={Circle} />
                </div>
            </div>

            <div className="h-px bg-[#333]" />

            {/* 1.5 TYPOGRAPHY */}
            <div className="space-y-3">
                <div className="flex justify-between items-center text-[11px] font-bold text-slate-400">
                    <span>Typography</span>
                    <Type size={12} />
                </div>

                {/* Font Family */}
                <div className="relative group">
                    <select
                        value={values.fontFamily.split(',')[0].replace(/['"]/g, '')}
                        onChange={(e) => updateStyle('fontFamily', e.target.value)}
                        className="w-full bg-slate-900 border border-transparent hover:border-slate-700 rounded px-2 py-1.5 text-xs text-white outline-none appearance-none cursor-pointer"
                    >
                        <option value="Inter">Inter</option>
                        <option value="Montserrat">Montserrat</option>
                        <option value="Roboto">Roboto</option>
                        <option value="Open Sans">Open Sans</option>
                        <option value="Lato">Lato</option>
                        <option value="Poppins">Poppins</option>
                        <option value="Playfair Display">Playfair Display</option>
                        <option value="Merriweather">Merriweather</option>
                        <option value="system-ui">System UI</option>
                    </select>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                        <ChevronsUpDown size={10} />
                    </div>
                </div>

                {/* Weight & Size */}
                <div className="grid grid-cols-2 gap-2">
                    {/* Weight */}
                    <div className="relative">
                        <select
                            value={values.fontWeight}
                            onChange={(e) => updateStyle('fontWeight', e.target.value)}
                            className="w-full bg-slate-900 border border-transparent hover:border-slate-700 rounded px-2 py-1.5 text-xs text-white outline-none appearance-none cursor-pointer"
                        >
                            <option value="100">Thin (100)</option>
                            <option value="200">ExtraLight (200)</option>
                            <option value="300">Light (300)</option>
                            <option value="400">Regular (400)</option>
                            <option value="500">Medium (500)</option>
                            <option value="600">SemiBold (600)</option>
                            <option value="700">Bold (700)</option>
                            <option value="800">ExtraBold (800)</option>
                            <option value="900">Black (900)</option>
                        </select>
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                            <ChevronsUpDown size={10} />
                        </div>
                    </div>

                    {/* Size */}
                    <div className="relative group">
                        <input
                            type="number"
                            value={values.fontSize}
                            onChange={(e) => updateStyle('fontSize', Number(e.target.value))}
                            className="w-full bg-slate-900 border border-transparent hover:border-slate-700 focus:border-blue-500 rounded px-2 py-1.5 text-xs text-white outline-none text-left pl-8"
                        />
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 font-bold">Px</span>
                    </div>
                </div>

                {/* Line Height & Spacing */}
                <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2 bg-slate-900 rounded px-2 py-1.5 border border-transparent hover:border-slate-700">
                        <ArrowUpDown size={10} className="text-slate-500" />
                        <input
                            type="text"
                            placeholder="Auto"
                            value={values.lineHeight === 'normal' ? '' : values.lineHeight}
                            onChange={(e) => updateStyle('lineHeight', e.target.value)}
                            className="w-full bg-transparent border-none text-xs text-white outline-none text-right"
                        />
                    </div>
                    <div className="flex items-center gap-2 bg-slate-900 rounded px-2 py-1.5 border border-transparent hover:border-slate-700">
                        <MoveHorizontal size={10} className="text-slate-500" />
                        <input
                            type="text"
                            placeholder="0"
                            value={values.letterSpacing === 'normal' ? '' : values.letterSpacing}
                            onChange={(e) => updateStyle('letterSpacing', e.target.value)}
                            className="w-full bg-transparent border-none text-xs text-white outline-none text-right"
                        />
                    </div>
                </div>

                {/* Alignment Controls */}
                <div className="grid grid-cols-2 gap-2">
                    {/* Text Align */}
                    <div className="bg-slate-900 rounded p-1 flex justify-between">
                        <button onClick={() => updateStyle('textAlign', 'left')} title="Align Left" className={`p - 1 rounded hover: bg - slate - 700 ${values.textAlign === 'left' ? 'bg-slate-700 text-white' : 'text-slate-500'} `}><AlignLeft size={12} /></button>
                        <button onClick={() => updateStyle('textAlign', 'center')} title="Align Center" className={`p - 1 rounded hover: bg - slate - 700 ${values.textAlign === 'center' ? 'bg-slate-700 text-white' : 'text-slate-500'} `}><AlignCenter size={12} /></button>
                        <button onClick={() => updateStyle('textAlign', 'right')} title="Align Right" className={`p - 1 rounded hover: bg - slate - 700 ${values.textAlign === 'right' ? 'bg-slate-700 text-white' : 'text-slate-500'} `}><AlignRight size={12} /></button>
                        <button onClick={() => updateStyle('textAlign', 'justify')} title="Justify" className={`p - 1 rounded hover: bg - slate - 700 ${values.textAlign === 'justify' ? 'bg-slate-700 text-white' : 'text-slate-500'} `}><AlignJustify size={12} /></button>
                    </div>

                    {/* Vertical Align (Flex) */}
                    <div className="bg-slate-900 rounded p-1 flex justify-between">
                        <button onClick={() => updateStyle('alignItems', 'flex-start')} title="Align Top" className={`p - 1 rounded hover: bg - slate - 700 ${values.alignItems === 'flex-start' ? 'bg-slate-700 text-white' : 'text-slate-500'} `}><ArrowUpToLine size={12} /></button>
                        <button onClick={() => updateStyle('alignItems', 'center')} title="Align Middle" className={`p - 1 rounded hover: bg - slate - 700 ${values.alignItems === 'center' ? 'bg-slate-700 text-white' : 'text-slate-500'} `}><MoveVertical size={12} /></button>
                        <button onClick={() => updateStyle('alignItems', 'flex-end')} title="Align Bottom" className={`p - 1 rounded hover: bg - slate - 700 ${values.alignItems === 'flex-end' ? 'bg-slate-700 text-white' : 'text-slate-500'} `}><ArrowDownToLine size={12} /></button>
                    </div>
                </div>
            </div>

            <div className="h-px bg-[#333]" />

            {/* 2. APPEARANCE (Layer) */}
            <div className="space-y-3">
                <div className="flex justify-between items-center text-[11px] font-bold text-slate-400">
                    <span>Appearance</span>
                    <Layers size={12} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2 bg-slate-900 rounded px-2 py-1">
                        <span className="text-[10px] text-slate-500">Opacity</span>
                        <input
                            type="number"
                            value={values.opacity}
                            onChange={(e) => updateStyle('opacity', Number(e.target.value))}
                            className="w-full bg-transparent border-none text-xs text-white text-right outline-none"
                        />
                        <span className="text-[10px] text-slate-500">%</span>
                    </div>
                </div>
            </div>

            <div className="h-px bg-[#333]" />

            {/* 3. COLORS (Text & Background) */}
            <div className="space-y-3">
                <div className="flex justify-between items-center text-[11px] font-bold text-slate-400">
                    <span>Colors</span>
                    <Palette size={12} />
                </div>

                {/* Text Color */}
                <div className="space-y-1">
                    <span className="text-[10px] text-slate-500">Text Color</span>
                    <div className="flex gap-2 items-center group cursor-pointer">
                        <div className="w-4 h-4 rounded border border-white/20 relative overflow-hidden">
                            <input
                                type="color"
                                value={values.fill}
                                onChange={(e) => updateStyle('fill', e.target.value)}
                                className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] cursor-pointer p-0 border-0"
                            />
                        </div>
                        <input
                            type="text"
                            value={values.fill.toUpperCase()}
                            onChange={(e) => updateStyle('fill', e.target.value)}
                            className="bg-transparent border-none text-xs font-mono text-slate-300 w-20 outline-none uppercase"
                        />
                    </div>
                </div>

                {/* Background Color */}
                <div className="space-y-1">
                    <span className="text-[10px] text-slate-500">Background</span>
                    <div className="flex gap-2 items-center group cursor-pointer">
                        <div className="w-4 h-4 rounded border border-white/20 relative overflow-hidden">
                            <input
                                type="color"
                                value={values.bgColor || '#000000'} // Fallback
                                onChange={(e) => updateStyle('bgColor', e.target.value)}
                                className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] cursor-pointer p-0 border-0"
                            />
                        </div>
                        <input
                            type="text"
                            value={values.bgColor?.toUpperCase() || 'TRANSPARENT'}
                            onChange={(e) => updateStyle('bgColor', e.target.value)}
                            className="bg-transparent border-none text-xs font-mono text-slate-300 w-20 outline-none uppercase"
                        />
                    </div>
                </div>
            </div>

            <div className="h-px bg-[#333]" />

            {/* 4. STROKE */}
            <div className="space-y-3">
                <div className="flex justify-between items-center text-[11px] font-bold text-slate-400">
                    <span>Stroke</span>
                    <Plus size={12} className="cursor-pointer hover:text-white" />
                </div>
                <div className="flex gap-2 items-center">
                    <div className="w-4 h-4 rounded border border-2 border-slate-500 relative overflow-hidden">
                        <input
                            type="color"
                            value={values.stroke}
                            onChange={(e) => updateStyle('stroke', e.target.value)}
                            className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] cursor-pointer p-0 border-0"
                        />
                    </div>
                    <input
                        type="text"
                        value={values.stroke.toUpperCase()}
                        className="bg-transparent border-none text-xs font-mono text-slate-300 w-20 outline-none uppercase"
                        onChange={(e) => updateStyle('stroke', e.target.value)}
                    />
                    <div className="flex items-center gap-1 bg-slate-900 rounded px-1 py-0.5 w-12 ml-auto">
                        <input
                            type="number"
                            value={values.strokeWidth}
                            onChange={(e) => updateStyle('strokeWidth', Number(e.target.value))}
                            className="w-full bg-transparent border-none text-xs text-white text-right outline-none"
                        />
                    </div>
                </div>
            </div>

            <div className="h-px bg-[#333]" />

            {/* IMAGE PROPERTIES */}
            {selectedElement?.tagName === 'IMG' && (
                <div className="space-y-3">
                    <div className="flex justify-between items-center text-[11px] font-bold text-slate-400">
                        <span>Image Source</span>
                        <ImageIcon strokeWidth={1.5} size={12} />
                    </div>
                    <div className="space-y-3">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={(selectedElement as HTMLImageElement).src}
                                onChange={(e) => {
                                    (selectedElement as HTMLImageElement).src = e.target.value;
                                    onUpdate();
                                }}
                                className="flex-1 bg-[#252525] border border-[#333] rounded px-2 py-1 text-xs text-white focus:border-blue-500 outline-none"
                                placeholder="https://..."
                            />
                        </div>
                        <label className="flex items-center justify-center gap-2 w-full bg-[#252525] hover:bg-[#333] border border-[#333] border-dashed rounded py-2 cursor-pointer transition-colors group">
                            <Upload size={14} className="text-slate-500 group-hover:text-blue-400" />
                            <span className="text-xs text-slate-400 group-hover:text-white font-medium">Upload Replacement</span>
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    const formData = new FormData();
                                    formData.append("file", file);
                                    try {
                                        // Rudimentary loading state via opacity
                                        selectedElement.style.opacity = "0.5";
                                        const res = await fetch("/api/upload", { method: "POST", body: formData });
                                        const data = await res.json();
                                        if (data.success) {
                                            (selectedElement as HTMLImageElement).src = data.url;
                                            onUpdate();
                                        } else {
                                            alert("Upload failed");
                                        }
                                    } catch (err) {
                                        console.error(err);
                                        alert("Upload error");
                                    } finally {
                                        selectedElement.style.opacity = values.opacity ? (values.opacity / 100).toString() : "1";
                                    }
                                }}
                            />
                        </label>
                    </div>
                </div>
            )}

            <div className="h-px bg-[#333]" />

            {/* 5. SHADOW */}
            <div className="space-y-3">
                <div className="flex justify-between items-center text-[11px] font-bold text-slate-400">
                    <span>Shadow</span>
                    <div className="flex gap-2">
                        {/* Optional: Add preset buttons later */}
                    </div>
                </div>

                {/* Color */}
                <div className="flex gap-2 items-center">
                    <div className="w-4 h-4 rounded border border-white/20 relative overflow-hidden">
                        <input
                            type="color"
                            value={values.shadowColor}
                            onChange={(e) => updateStyle('shadowColor', e.target.value)}
                            className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] cursor-pointer p-0 border-0"
                        />
                    </div>
                    <input
                        type="text"
                        value={values.shadowColor.toUpperCase()}
                        onChange={(e) => updateStyle('shadowColor', e.target.value)}
                        className="bg-transparent border-none text-xs font-mono text-slate-300 w-20 outline-none uppercase"
                    />
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2 bg-slate-900 rounded px-2 py-1.5">
                        <span className="text-[10px] text-slate-500 font-mono">X</span>
                        <input
                            type="number"
                            value={values.shadowX}
                            onChange={(e) => updateStyle('shadowX', Number(e.target.value))}
                            className="w-full bg-transparent border-none text-xs text-white text-right outline-none"
                        />
                    </div>
                    <div className="flex items-center gap-2 bg-slate-900 rounded px-2 py-1.5">
                        <span className="text-[10px] text-slate-500 font-mono">Y</span>
                        <input
                            type="number"
                            value={values.shadowY}
                            onChange={(e) => updateStyle('shadowY', Number(e.target.value))}
                            className="w-full bg-transparent border-none text-xs text-white text-right outline-none"
                        />
                    </div>
                    <div className="flex items-center gap-2 bg-slate-900 rounded px-2 py-1.5">
                        <span className="text-[10px] text-slate-500 font-mono">Blur</span>
                        <input
                            type="number"
                            value={values.shadowBlur}
                            onChange={(e) => updateStyle('shadowBlur', Number(e.target.value))}
                            className="w-full bg-transparent border-none text-xs text-white text-right outline-none"
                        />
                    </div>
                    <div className="flex items-center gap-2 bg-slate-900 rounded px-2 py-1.5">
                        <span className="text-[10px] text-slate-500 font-mono">Spread</span>
                        <input
                            type="number"
                            value={values.shadowSpread}
                            onChange={(e) => updateStyle('shadowSpread', Number(e.target.value))}
                            className="w-full bg-transparent border-none text-xs text-white text-right outline-none"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

