"use client";

import { useContent } from "@/lib/content-context";
import { Plus, Trash2, GripVertical, ExternalLink } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface MenuItem {
    label: string;
    href: string;
    isExternal?: boolean;
}

export function MenuEditor() {
    const { content, updateContent } = useContent();
    const menuItems = (content.navbar?.links as MenuItem[]) || [];

    const handleUpdate = (newLinks: MenuItem[]) => {
        updateContent({
            ...content,
            navbar: {
                ...content.navbar,
                links: newLinks
            }
        });
    };

    const addItem = () => {
        handleUpdate([...menuItems, { label: "New Link", href: "/" }]);
    };

    const removeItem = (index: number) => {
        const newLinks = [...menuItems];
        newLinks.splice(index, 1);
        handleUpdate(newLinks);
    };

    const updateItem = (index: number, field: keyof MenuItem, value: string | boolean) => {
        const newLinks = [...menuItems];
        newLinks[index] = { ...newLinks[index], [field]: value };
        handleUpdate(newLinks);
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-xl font-bold text-white">Navigation Menu</h2>
                    <p className="text-sm text-slate-500">Manage your header navigation links</p>
                </div>
                <button
                    onClick={addItem}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-[4px] text-sm font-medium transition-colors"
                >
                    <Plus size={16} />
                    Add Link
                </button>
            </div>

            <div className="space-y-3">
                {menuItems.map((item, index) => (
                    <div
                        key={index}
                        className="group flex items-center gap-4 bg-slate-900/50 border border-slate-800 p-4 rounded-[4px] hover:border-slate-700 transition-all"
                    >
                        <div className="cursor-grab text-slate-600 hover:text-slate-400">
                            <GripVertical size={20} />
                        </div>

                        <div className="flex-1 grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] uppercase text-slate-500 mb-1 font-bold">Label</label>
                                <input
                                    type="text"
                                    value={item.label}
                                    onChange={(e) => updateItem(index, 'label', e.target.value)}
                                    aria-label="Link Label"
                                    className="w-full bg-slate-800 border border-slate-700 rounded-[4px] px-3 py-2 text-sm text-white focus:border-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] uppercase text-slate-500 mb-1 font-bold">Href</label>
                                <input
                                    type="text"
                                    value={item.href}
                                    onChange={(e) => updateItem(index, 'href', e.target.value)}
                                    aria-label="Link Href"
                                    className="w-full bg-slate-800 border border-slate-700 rounded-[4px] px-3 py-2 text-sm text-white focus:border-blue-500 outline-none font-mono"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <button
                                onClick={() => updateItem(index, 'isExternal', !item.isExternal)}
                                className={cn(
                                    "p-2 rounded-[4px] transition-colors border",
                                    item.isExternal
                                        ? "bg-blue-500/10 border-blue-500/50 text-blue-400"
                                        : "bg-slate-800 border-slate-700 text-slate-500 hover:text-slate-300"
                                )}
                                title="External Link"
                            >
                                <ExternalLink size={18} />
                            </button>
                            <button
                                onClick={() => removeItem(index)}
                                className="p-2 rounded-[4px] bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                                title="Remove Link"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}

                {menuItems.length === 0 && (
                    <div className="text-center py-12 bg-slate-900/30 border border-dashed border-slate-800 rounded-[4px]">
                        <p className="text-slate-500">No navigation links added yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
