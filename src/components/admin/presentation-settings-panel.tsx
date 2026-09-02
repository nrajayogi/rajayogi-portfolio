"use client";

import { Settings as SettingsIcon } from 'lucide-react';

interface PresentationSettingsPanelProps {
    settings: {
        width: string;
        height: string;
        backgroundColor: string;
        cornerRadius: string;
        spaceBetween: string;
        shadow: string;
        paddingTop: string;
    };
    onUpdate: (settings: Partial<PresentationSettingsPanelProps['settings']>) => void;
}

export function PresentationSettingsPanel({ settings, onUpdate }: PresentationSettingsPanelProps) {
    return (
        <div className="w-80 bg-slate-900 border-l border-slate-800 p-4 overflow-y-auto">
            <h3 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
                <SettingsIcon size={16} />
                Presentation Settings
            </h3>

            <div className="space-y-6">
                {/* Slide Dimensions */}
                <PropertySection title="Slide Dimensions">
                    <div className="space-y-3">
                        <TextInput
                            label="Slide Width"
                            value={settings.width}
                            onChange={(val) => onUpdate({ width: val })}
                            placeholder="e.g., 1000px, 80vw"
                        />
                        <TextInput
                            label="Slide Height"
                            value={settings.height}
                            onChange={(val) => onUpdate({ height: val })}
                            placeholder="e.g., 75vh, 600px"
                        />
                    </div>
                </PropertySection>

                {/* Spacing */}
                <PropertySection title="Spacing">
                    <TextInput
                        label="Space Between Slides (px)"
                        value={settings.spaceBetween}
                        onChange={(val) => onUpdate({ spaceBetween: val })}
                        placeholder="50"
                    />
                    <TextInput
                        label="Top Padding"
                        value={settings.paddingTop}
                        onChange={(val) => onUpdate({ paddingTop: val })}
                        placeholder="0px"
                    />
                </PropertySection>

                {/* Style */}
                <PropertySection title="Style">
                    <TextInput
                        label="Corner Radius"
                        value={settings.cornerRadius}
                        onChange={(val) => onUpdate({ cornerRadius: val })}
                        placeholder="24px"
                    />
                  
                   <div className="space-y-1">
                        <label className="block text-xs text-slate-400">Background Color</label>
                        <div className="flex gap-2">
                            <input
                                type="color"
                                value={settings.backgroundColor.startsWith('rgba') ? '#0f172a' : settings.backgroundColor}
                                onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
                                className="w-12 h-10 rounded cursor-pointer bg-transparent border border-slate-700"
                            />
                            <input
                                type="text"
                                value={settings.backgroundColor}
                                onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
                                className="flex-1 bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-blue-500"
                                placeholder="rgba(15, 23, 42, 0.5)"
                            />
                        </div>
                    </div>

                    <div className="space-y-1 mt-3">
                        <label className="block text-xs text-slate-400">Shadow</label>
                        <select
                            value={settings.shadow}
                            onChange={(e) => onUpdate({ shadow: e.target.value })}
                            className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                        >
                            <option value="none">None</option>
                            <option value="small">Small</option>
                            <option value="medium">Medium</option>
                            <option value="large">Large</option>
                        </select>
                    </div>
                </PropertySection>
            </div>
        </div>
    );
}

function PropertySection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="pb-4 border-b border-slate-800 last:border-0">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">{title}</h4>
            <div className="space-y-3">{children}</div>
        </div>
    );
}

function TextInput({
    label,
    value,
    onChange,
    placeholder
}: {
    label: string;
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
}) {
    return (
        <div>
            <label className="block text-xs text-slate-400 mb-1">{label}</label>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
            />
        </div>
    );
}
