"use client";

import React, { useEffect, useState } from "react";

export const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [cursorText, setCursorText] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      const clickable = target?.closest("button, a, [data-cursor]");

      if (clickable) {
        setIsHovered(true);
        const text = clickable.getAttribute("data-cursor") || "";
        setCursorText(text);
      } else {
        setIsHovered(false);
        setCursorText("");
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed top-0 left-0 pointer-events-none z-50 transition-transform duration-75 ease-out hidden md:block"
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
      }}
    >
      <div
        className={`-translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-all duration-200 ${
          cursorText
            ? "px-3.5 py-1.5 rounded-full bg-neutral-950 text-white text-[11px] font-medium shadow-2xl scale-100"
            : isHovered
            ? "w-10 h-10 rounded-full bg-neutral-950/10 border border-neutral-950/40 backdrop-blur-xs scale-100"
            : "w-3 h-3 rounded-full bg-neutral-950/80 scale-100"
        }`}
      >
        {cursorText && <span>{cursorText}</span>}
      </div>
    </div>
  );
};
