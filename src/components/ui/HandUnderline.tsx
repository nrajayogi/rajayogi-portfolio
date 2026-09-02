"use client";

import React from "react";

interface HandUnderlineProps {
  color?: string;
  className?: string;
  active?: boolean;
}

export const HandUnderline: React.FC<HandUnderlineProps> = ({
  color = "var(--chalk-lime)",
  className = "",
  active = true,
}) => {
  // SVG rough double stroke underline
  const pathD = "M 4 8 Q 40 2 80 7 Q 120 12 160 5 Q 200 2 240 8";

  return (
    <svg
      viewBox="0 0 244 14"
      preserveAspectRatio="none"
      className={`w-full h-3 overflow-visible ${className}`}
    >
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        style={{
          strokeDasharray: 260,
          strokeDashoffset: active ? 0 : 260,
          opacity: active ? 0.9 : 0,
          transition: "stroke-dashoffset 0.5s ease-out, opacity 0.3s ease",
        }}
      />
    </svg>
  );
};
