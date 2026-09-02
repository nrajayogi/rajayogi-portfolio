"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import initialContent from "@/data/content.json";
import { Content } from "./content-types";

interface ContentContextType {
    content: Content;
    updateContent: (newContent: Content) => Promise<void>;
    updateLocalState: (newContent: Content) => void;
    isLoading: boolean;
    isEditing: boolean;
    toggleEditing: () => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children }: { children: ReactNode }) {
    const [content, setContent] = useState<Content>(initialContent as Content);
    const [isLoading, setIsLoading] = useState(true); // Default to true
    const [isEditing, setIsEditing] = useState(false);

    // Fetch content from the Database API on mount
    useEffect(() => {
        // setIsLoading(true); // Removed to avoid setState during render cycle
        fetch('/api/content', { cache: 'no-store' })
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch content");
                return res.json();
            })
            .then(data => {
                setContent(data);
            })
            .catch(err => {
                console.error("Failed to load content from API, using fallback", err);
            })
            .finally(() => setIsLoading(false));
    }, []);

    const updateContent = async (newContent: Content) => {
        setContent(newContent);

        // Auto-save to database
        try {
            const res = await fetch('/api/save-content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newContent)
            });
            if (!res.ok) throw new Error("Failed to save");
        } catch (err) {
            console.error("Failed to save content:", err);
            // Optionally revert state or show toast here
            throw err; // Re-throw so caller knows it failed
        }
    };

    const updateLocalState = (newContent: Content) => {
        setContent(newContent);
    };

    const toggleEditing = () => setIsEditing(prev => !prev);

    return (
        <ContentContext.Provider value={{ content, updateContent, updateLocalState, isLoading, isEditing, toggleEditing }}>
            {children}
        </ContentContext.Provider>
    );
}

export function useContent() {
    const context = useContext(ContentContext);
    if (context === undefined) {
        throw new Error("useContent must be used within a ContentProvider");
    }
    return context;
}
