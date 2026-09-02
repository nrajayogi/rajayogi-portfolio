"use client";

import { useContent } from "@/lib/content-context";
import { cn, updateNestedValue } from "@/lib/utils";
import { useEffect, useRef } from "react";

interface EditableTextProps {
    path: string; // Dot notation path, e.g. "hero.title" or "services.items.0.title"
    value: string;
    as?: React.ElementType; // Tag to render as (h1, p, span, etc.)
    className?: string;
    multiline?: boolean; // If true, allows line breaks
    placeholder?: string;
}

export function EditableText({
    path,
    value,
    as: Component = "span",
    className,
    multiline = false,
    placeholder
}: EditableTextProps) {
    const { isEditing, content, updateContent } = useContent();
    const elementRef = useRef<HTMLElement>(null);

    // Sync local value when external value changes (unless currently editing?)
    // Actually, usually we trust content is source of truth.
    useEffect(() => {
        if (elementRef.current && elementRef.current.innerText !== value) {
            elementRef.current.innerText = value;
        }
    }, [value]);

    const handleBlur = () => {
        if (!elementRef.current) return;

        const newValue = elementRef.current.innerText;
        if (newValue === value) return; // No change

        // Update Global Content
        const newContent = updateNestedValue(content, path, newValue);
        updateContent(newContent);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!multiline && e.key === 'Enter') {
            e.preventDefault();
            elementRef.current?.blur();
        }
    };

    if (!isEditing) {
        return <Component className={className}>{value}</Component>;
    }

    return (
        <Component
            ref={elementRef}
            contentEditable
            suppressContentEditableWarning
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className={cn(
                "outline-none ring-2 ring-transparent transition-all min-w-[10px]",
                isEditing && "hover:ring-blue-500/50 focus:ring-blue-500 rounded px-1 cursor-text bg-white/5",
                className
            )}
            data-placeholder={placeholder}
        >
            {value}
        </Component>
    );
}
