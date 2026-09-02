// Presentation element types for canvas-based editing

export interface Position {
    x: number;
    y: number;
}

export interface Size {
    width: number;
    height: number;
}

export interface SlideElement {
    id: string;
    type: 'text' | 'image' | 'shape';
    position: Position;
    size: Size;
    rotation: number;
    zIndex: number;

    // Text-specific properties
    text?: string;
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: number | string;
    color?: string;
    textAlign?: 'left' | 'center' | 'right';
    lineHeight?: number;

    // Image-specific properties
    src?: string;
    opacity?: number;

    // Shape-specific properties
    shapeType?: 'rectangle' | 'circle' | 'triangle';
    fillColor?: string;
    borderColor?: string;
    borderWidth?: number;
}

export interface PresentationSlide {
    id: string;
    elements: SlideElement[];
    background?: string;
    backgroundImage?: string;
}

export interface PresentationData {
    slides: PresentationSlide[];
    settings?: {
        width?: string;
        height?: string;
        backgroundColor?: string;
        cornerRadius?: string;
        spaceBetween?: string;
        shadow?: string;
        paddingTop?: string;
    };
}

// Helper functions for element creation
export function createTextElement(position: Position = { x: 100, y: 100 }): SlideElement {
    return {
        id: crypto.randomUUID(),
        type: 'text',
        position,
        size: { width: 300, height: 60 },
        rotation: 0,
        zIndex: 1,
        text: 'Click to edit text',
        fontSize: 24,
        fontFamily: 'Inter, sans-serif',
        fontWeight: 400,
        color: '#ffffff',
        textAlign: 'left',
        lineHeight: 1.4,
    };
}

export function createImageElement(src: string, position: Position = { x: 100, y: 100 }): SlideElement {
    return {
        id: crypto.randomUUID(),
        type: 'image',
        position,
        size: { width: 400, height: 300 },
        rotation: 0,
        zIndex: 1,
        src,
        opacity: 1,
    };
}

export function createShapeElement(shapeType: 'rectangle' | 'circle' | 'triangle', position: Position = { x: 100, y: 100 }): SlideElement {
    return {
        id: crypto.randomUUID(),
        type: 'shape',
        position,
        size: { width: 200, height: 200 },
        rotation: 0,
        zIndex: 1,
        shapeType,
        fillColor: '#3b82f6',
        borderColor: '#1d4ed8',
        borderWidth: 2,
    };
}

export function createBlankSlide(): PresentationSlide {
    return {
        id: crypto.randomUUID(),
        elements: [],
        background: '#0f172a',
    };
}
