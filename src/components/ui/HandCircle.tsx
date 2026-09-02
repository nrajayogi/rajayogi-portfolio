"use client";

import React from "react";

interface HandCircleProps {
  children?: React.ReactNode;
  color?: string;
  className?: string;
  active?: boolean;
  strokeWidth?: number;
}

export const HandCircle: React.FC<HandCircleProps> = ({
  children,
  color = "#D6DF84", // Soft lime chalk default
  className = "",
  active = true,
  strokeWidth = 2,
}) => {
  // Rough asymmetrical hand-drawn oval SVG path
  const circlePath = "M 10 28 C 8 14, 25 6, 50 6 C 85 6, 96 14, 94 28 C 92 42, 75 48, 48 48 C 18 48, 6 42, 10 28 Z M 12 26 C 22 8, 80 4, 92 26";

  return (
    <span className={`relative inline-flex items-center justify-center ${className}`}>
      {children}
      <svg
        className="absolute -inset-2 w-[calc(100%+1rem)] h-[calc(100%+1rem)] pointer-events-none overflow-visible"
        viewBox="0 0 100 54"
        preserveAspectRatio="none"
      >
        <path
          d={circlePath}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: 320,
            strokeDashoffset: active ? 0 : 320,
            opacity: active ? 0.95 : 0,
            transition: "stroke-dashoffset 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease",
          }}
        />
      </svg>
    </span>
  );
};
