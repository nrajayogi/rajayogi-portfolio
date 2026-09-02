"use client";

import React from "react";

interface HandArrowProps {
  direction?: "down" | "right" | "left" | "up-right" | "down-right";
  color?: string;
  className?: string;
  width?: number;
  height?: number;
}

export const HandArrow: React.FC<HandArrowProps> = ({
  direction = "right",
  color = "#F17C72", // Coral chalk default
  className = "",
  width = 60,
  height = 24,
}) => {
  // SVG hand-drawn line with arrowhead
  let pathD = "M 4 12 Q 30 6 52 12 M 42 5 L 53 12 L 44 19";

  if (direction === "down") {
    pathD = "M 12 4 Q 6 30 12 52 M 5 42 L 12 53 L 19 44";
  } else if (direction === "up-right") {
    pathD = "M 4 28 Q 24 20 44 4 M 32 4 L 45 4 L 44 16";
  } else if (direction === "down-right") {
    pathD = "M 4 4 Q 24 14 44 28 M 32 28 L 45 28 L 42 16";
  }

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={`inline-block overflow-visible ${className}`}
    >
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          strokeDasharray: 120,
          strokeDashoffset: 0,
          opacity: 0.9,
          transition: "stroke-dashoffset 0.6s ease-out",
        }}
      />
    </svg>
  );
};
