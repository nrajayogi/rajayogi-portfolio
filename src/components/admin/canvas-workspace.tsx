"use client";

import { useState, useRef, useCallback, useEffect } from 'react';
import { SlideElement, Position, Size } from '@/lib/presentation-types';
import { Trash2, Copy, Lock, Unlock } from 'lucide-react';

interface CanvasWorkspaceProps {
    elements: SlideElement[];
    selectedElementId: string | null;
    onSelectElement: (id: string | null) => void;
    onUpdateElement: (id: string, updates: Partial<SlideElement>) => void;
    onDeleteElement: (id: string) => void;
    onDuplicateElement: (id: string) => void;
    width?: number;
    height?: number;
    customHeight?: string;
    background?: string;
}

export function CanvasWorkspace({
    elements,
    selectedElementId,
    onSelectElement,
    onUpdateElement,
    onDeleteElement,
    onDuplicateElement,
    width = 1920,
    height = 1080,
    customHeight,
    background = '#0f172a',
}: CanvasWorkspaceProps) {
    const canvasRef = useRef<HTMLDivElement>(null);
    const [dragging, setDragging] = useState<{ id: string; startX: number; startY: number; startPos: Position } | null>(null);
    const [resizing, setResizing] = useState<{ id: string; handle: string; startX: number; startY: number; startSize: Size; startPos: Position } | null>(null);
    const [editing, setEditing] = useState<string | null>(null);
    const [snapGuides, setSnapGuides] = useState<{ showVertical: boolean; showHorizontal: boolean }>({ showVertical: false, showHorizontal: false });

    const selectedElement = elements.find(el => el.id === selectedElementId);

    // Handle element click
    const handleElementClick = useCallback((e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        onSelectElement(id);
    }, [onSelectElement]);

    // Handle canvas click (deselect)
    const handleCanvasClick = useCallback(() => {
        onSelectElement(null);
        setEditing(null);
    }, [onSelectElement]);

    // Handle element double-click for text editing
    const handleElementDoubleClick = useCallback((e: React.MouseEvent, element: SlideElement) => {
        e.stopPropagation();
        if (element.type === 'text') {
            setEditing(element.id);
            onSelectElement(element.id);
        }
    }, [onSelectElement]);

    // Handle drag start
    const handleDragStart = useCallback((e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        const element = elements.find(el => el.id === id);
        if (!element || editing === id) return;

        setDragging({
            id,
            startX: e.clientX,
            startY: e.clientY,
            startPos: { ...element.position },
        });
    }, [elements, editing]);

    // Handle resize start
    const handleResizeStart = useCallback((e: React.MouseEvent, id: string, handle: string) => {
        e.stopPropagation();
        const element = elements.find(el => el.id === id);
        if (!element) return;

        setResizing({
            id,
            handle,
            startX: e.clientX,
            startY: e.clientY,
            startSize: { ...element.size },
            startPos: { ...element.position },
        });
    }, [elements]);

    // Handle mouse move
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (dragging) {
                const dx = e.clientX - dragging.startX;
                const dy = e.clientY - dragging.startY;

                let newX = dragging.startPos.x + dx;
                let newY = dragging.startPos.y + dy;

                // Snap to center - magnetic effect with 20px threshold
                // Use actual slide dimensions passed via props, ensuring dynamic alignment
                const centerX = width / 2;
                const centerY = height / 2;
                const snapThreshold = 20;

                // Get element for size info
                const element = elements.find(el => el.id === dragging.id);
                let showVertical = false;
                let showHorizontal = false;

                if (element) {
                    const elementCenterX = newX + element.size.width / 2;
                    const elementCenterY = newY + element.size.height / 2;

                    // Snap to horizontal center
                    if (Math.abs(elementCenterX - centerX) < snapThreshold) {
                        newX = centerX - element.size.width / 2;
                        showVertical = true;
                    }

                    // Snap to vertical center
                    if (Math.abs(elementCenterY - centerY) < snapThreshold) {
                        newY = centerY - element.size.height / 2;
                        showHorizontal = true;
                    }
                }

                // Update snap guides visibility
                setSnapGuides({ showVertical, showHorizontal });

                onUpdateElement(dragging.id, {
                    position: {
                        x: newX,
                        y: newY,
                    },
                });
            }

            if (resizing) {
                const dx = e.clientX - resizing.startX;
                const dy = e.clientY - resizing.startY;

                const newSize = { ...resizing.startSize };
                const newPos = { ...resizing.startPos };

                switch (resizing.handle) {
                    case 'se': // Bottom-right
                        newSize.width = Math.max(50, resizing.startSize.width + dx);
                        newSize.height = Math.max(30, resizing.startSize.height + dy);
                        break;
                    case 'sw': // Bottom-left
                        newSize.width = Math.max(50, resizing.startSize.width - dx);
                        newSize.height = Math.max(30, resizing.startSize.height + dy);
                        newPos.x = resizing.startPos.x + dx;
                        break;
                    case 'ne': // Top-right
                        newSize.width = Math.max(50, resizing.startSize.width + dx);
                        newSize.height = Math.max(30, resizing.startSize.height - dy);
                        newPos.y = resizing.startPos.y + dy;
                        break;
                    case 'nw': // Top-left
                        newSize.width = Math.max(50, resizing.startSize.width - dx);
                        newSize.height = Math.max(30, resizing.startSize.height - dy);
                        newPos.x = resizing.startPos.x + dx;
                        newPos.y = resizing.startPos.y + dy;
                        break;
                }

                onUpdateElement(resizing.id, { size: newSize, position: newPos });
            }
        };

        const handleMouseUp = () => {
            setDragging(null);
            setResizing(null);
            setSnapGuides({ showVertical: false, showHorizontal: false }); // Hide guides on release
        };

        if (dragging || resizing) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [dragging, resizing, onUpdateElement]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!selectedElementId || editing) return;

            // Delete
            if (e.key === 'Delete' || e.key === 'Backspace') {
                e.preventDefault();
                onDeleteElement(selectedElementId);
            }

            // Duplicate
            if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
                e.preventDefault();
                onDuplicateElement(selectedElementId);
            }

            // Arrow key nudging (Figma-style)
            const selectedElement = elements.find(el => el.id === selectedElementId);
            if (selectedElement && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
                const moveAmount = e.shiftKey ? 10 : 1; // 10px with Shift, 1px without

                const newPosition = { ...selectedElement.position };

                if (e.key === 'ArrowUp') newPosition.y -= moveAmount;
                if (e.key === 'ArrowDown') newPosition.y += moveAmount;
                if (e.key === 'ArrowLeft') newPosition.x -= moveAmount;
                if (e.key === 'ArrowRight') newPosition.x += moveAmount;

                onUpdateElement(selectedElementId, { position: newPosition });
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedElementId, editing, elements, onDeleteElement, onDuplicateElement, onUpdateElement]);

    return (
        <div className="flex-1 flex flex-col bg-slate-900 overflow-hidden">
            {/* Canvas container - fixed height, no scroll */}
            <div className="flex-1 overflow-hidden p-4 bg-slate-800">
                <div className="flex items-center justify-center h-full">
                    <div
                        ref={canvasRef}
                        className="relative shadow-2xl border border-white/10 rounded-3xl backdrop-blur-xl"
                        style={{
                            width: `${width}px`,
                            height: customHeight || `${height}px`,
                            maxWidth: '90vw',
                            background,
                            borderRadius: '24px',
                        }}
                        onClick={handleCanvasClick}
                    >
                        {/* Smart Alignment Guides - appear when snapping */}
                        {(snapGuides.showVertical || snapGuides.showHorizontal) && (
                            <div className="absolute inset-0 pointer-events-none z-50">
                                {/* Vertical center guide */}
                                {snapGuides.showVertical && (
                                    <div
                                        className="absolute top-0 bottom-0 w-0.5 bg-blue-500"
                                        style={{ left: `${width / 2}px`, boxShadow: '0 0 8px rgba(59, 130, 246, 0.8)' }}
                                    />
                                )}
                                {/* Horizontal center guide */}
                                {snapGuides.showHorizontal && (
                                    <div
                                        className="absolute left-0 right-0 h-0.5 bg-blue-500"
                                        style={{ top: `${height / 2}px`, boxShadow: '0 0 8px rgba(59, 130, 246, 0.8)' }}
                                    />
                                )}
                            </div>
                        )}

                        {/* Empty state hint */}
                        {elements.length === 0 && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="text-center text-slate-500">
                                    <div className="text-2xl mb-2">✨</div>
                                    <div className="text-sm font-medium mb-1">Your canvas is empty</div>
                                    <div className="text-xs">Press <kbd className="px-2 py-1 bg-slate-700 rounded text-slate-300">T</kbd> to add text</div>
                                </div>
                            </div>
                        )}

                        {/* Render elements */}
                        {elements
                            .sort((a, b) => a.zIndex - b.zIndex)
                            .map((element) => (
                                <CanvasElement
                                    key={element.id}
                                    element={element}
                                    isSelected={element.id === selectedElementId}
                                    isEditing={element.id === editing}
                                    onClick={(e) => handleElementClick(e, element.id)}
                                    onDoubleClick={(e) => handleElementDoubleClick(e, element)}
                                    onDragStart={(e) => handleDragStart(e, element.id)}
                                    onResizeStart={(e, handle) => handleResizeStart(e, element.id, handle)}
                                    onTextChange={(text) => onUpdateElement(element.id, { text })}
                                    onEditEnd={() => setEditing(null)}
                                />
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Individual canvas element component
interface CanvasElementProps {
    element: SlideElement;
    isSelected: boolean;
    isEditing: boolean;
    onClick: (e: React.MouseEvent) => void;
    onDoubleClick: (e: React.MouseEvent) => void;
    onDragStart: (e: React.MouseEvent) => void;
    onResizeStart: (e: React.MouseEvent, handle: string) => void;
    onTextChange: (text: string) => void;
    onEditEnd: () => void;
}

function CanvasElement({
    element,
    isSelected,
    isEditing,
    onClick,
    onDoubleClick,
    onDragStart,
    onResizeStart,
    onTextChange,
    onEditEnd,
}: CanvasElementProps) {
    const inputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    return (
        <div
            className={`absolute transition-shadow ${isSelected
                ? 'ring-2 ring-blue-500 shadow-lg shadow-blue-500/20'
                : isEditing
                    ? ''
                    : 'hover:ring-2 hover:ring-blue-300/50'
                }`}
            style={{
                left: `${element.position.x}px`,
                top: `${element.position.y}px`,
                width: `${element.size.width}px`,
                height: `${element.size.height}px`,
                transform: `rotate(${element.rotation}deg)`,
                zIndex: element.zIndex,
                cursor: isEditing ? 'text' : 'move',
            }}
            onClick={onClick}
            onDoubleClick={onDoubleClick}
            onMouseDown={!isEditing ? onDragStart : undefined}
        >
            {/* Element content */}
            {element.type === 'text' && (
                <div className="w-full h-full relative">
                    {isEditing ? (
                        <textarea
                            ref={inputRef}
                            autoFocus
                            value={element.text || ''}
                            onChange={(e) => onTextChange(e.target.value)}
                            onBlur={onEditEnd}
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) => e.stopPropagation()}
                            onKeyDown={(e) => {
                                if (e.key === 'Escape') {
                                    onEditEnd();
                                }
                                // Prevent event propagation
                                e.stopPropagation();
                            }}
                            className="w-full h-full bg-transparent resize-none outline-none border-2 border-blue-500 rounded p-2"
                            style={{
                                fontSize: `${element.fontSize}px`,
                                fontFamily: element.fontFamily,
                                fontWeight: element.fontWeight,
                                color: element.color,
                                textAlign: element.textAlign,
                                lineHeight: element.lineHeight,
                            }}
                            placeholder="Type here..."
                        />
                    ) : (
                        <div
                            className="w-full h-full overflow-hidden whitespace-pre-wrap break-words p-2 cursor-text"
                            style={{
                                fontSize: `${element.fontSize}px`,
                                fontFamily: element.fontFamily,
                                fontWeight: element.fontWeight,
                                color: element.color,
                                textAlign: element.textAlign,
                                lineHeight: element.lineHeight,
                            }}
                        >
                            {element.text || 'Double click to edit'}
                        </div>
                    )}
                </div>
            )}

            {element.type === 'image' && element.src && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={element.src}
                    alt="Slide element"
                    className="w-full h-full object-cover pointer-events-none"
                    style={{ opacity: element.opacity }}
                    draggable={false}
                />
            )}

            {element.type === 'shape' && (
                <div
                    className="w-full h-full"
                    style={{
                        backgroundColor: element.fillColor,
                        border: `${element.borderWidth}px solid ${element.borderColor}`,
                        borderRadius: element.shapeType === 'circle' ? '50%' : '0',
                    }}
                />
            )}

            {/* Resize handles */}
            {isSelected && !isEditing && (
                <>
                    <div
                        className="absolute w-3 h-3 bg-blue-500 border-2 border-white rounded-full cursor-nwse-resize"
                        style={{ top: '-6px', left: '-6px' }}
                        onMouseDown={(e) => { e.stopPropagation(); onResizeStart(e, 'nw'); }}
                    />
                    <div
                        className="absolute w-3 h-3 bg-blue-500 border-2 border-white rounded-full cursor-nesw-resize"
                        style={{ top: '-6px', right: '-6px' }}
                        onMouseDown={(e) => { e.stopPropagation(); onResizeStart(e, 'ne'); }}
                    />
                    <div
                        className="absolute w-3 h-3 bg-blue-500 border-2 border-white rounded-full cursor-nesw-resize"
                        style={{ bottom: '-6px', left: '-6px' }}
                        onMouseDown={(e) => { e.stopPropagation(); onResizeStart(e, 'sw'); }}
                    />
                    <div
                        className="absolute w-3 h-3 bg-blue-500 border-2 border-white rounded-full cursor-nwse-resize"
                        style={{ bottom: '-6px', right: '-6px' }}
                        onMouseDown={(e) => { e.stopPropagation(); onResizeStart(e, 'se'); }}
                    />
                </>
            )}
        </div>
    );
}
