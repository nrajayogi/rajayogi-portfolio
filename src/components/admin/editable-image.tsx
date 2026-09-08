"use client";

import { useContent } from "@/lib/content-context";
import { cn, updateNestedValue } from "@/lib/utils";
import Image, { ImageProps } from "next/image";
import { useRef, useState } from "react";
import { Upload, ImageIcon } from "lucide-react";

interface EditableImageProps extends Omit<ImageProps, 'src' | 'alt'> {
    path: string; // "hero.logoUrl"
    src: string;
    alt: string;
    width?: number;
    height?: number;
    fill?: boolean;
    className?: string;
    priority?: boolean;
}

export function EditableImage({
    path,
    src,
    alt,
    className,
    ...props
}: EditableImageProps) {
    const { isEditing, content, updateContent } = useContent();
    const [uploading, setUploading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

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
                // Update Content
                const newContent = JSON.parse(JSON.stringify(content));
                const keys = path.split('.');
                 
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                let current: any = newContent;
                for (let i = 0; i < keys.length - 1; i++) {
                    current = current[keys[i]];
                }
                current[keys[keys.length - 1]] = data.url;
                updateContent(newContent);
            } else {
                alert("Upload failed: " + data.message);
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("Upload error");
        } finally {
            setUploading(false);
        }
    };

    const handleClick = (e: React.MouseEvent) => {
        if (!isEditing) return;
        e.preventDefault();
        e.stopPropagation();
        inputRef.current?.click();
    };

    return (
        <div
            className={cn("relative group transition-all", isEditing && "cursor-pointer hover:ring-4 ring-blue-500/50 rounded-[4px] overflow-hidden")}
            onClick={handleClick}
             
            style={{ width: props.fill ? '100%' : props.width, height: props.fill ? '100%' : props.height }}
        >
            <Image
                src={src}
                alt={alt}
                className={className}
                {...props}
            />

            {/* Hidden Input */}
            <input
                ref={inputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleUpload}
                onClick={(e) => e.stopPropagation()}
                aria-label="Upload Image"
            />

            {/* Editing Overlay */}
            {isEditing && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white z-50 pointer-events-none">
                    {uploading ? (
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
                    ) : (
                        <>
                            <Upload size={24} className="mb-2" />
                            <span className="text-xs font-bold uppercase tracking-wider">Change Image</span>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

// Helper for standard <img> tags if needed, or just use simpler wrapper
export function EditableImg({
    path,
    src,
    alt,
    className,
    ...props
}: React.ImgHTMLAttributes<HTMLImageElement> & { path: string }) {
    const { isEditing, content, updateContent } = useContent();
    const [uploading, setUploading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

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
                // Update Content
                const newContent = updateNestedValue(content, path, data.url);
                updateContent(newContent);
            } else {
                alert("Upload failed: " + data.message);
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("Upload error");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div
            className={cn("relative group inline-block", isEditing && "cursor-pointer ring-2 ring-transparent hover:ring-blue-500 rounded")}
            onClick={() => isEditing && inputRef.current?.click()}
        >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={alt} className={className} {...props} />
            <input
                ref={inputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleUpload}
            />
            {isEditing && (
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white pointer-events-none transition-opacity">
                    {uploading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    ) : (
                        <ImageIcon size={16} />
                    )}
                </div>
            )}
        </div>
    )
}
