"use client";

import React from "react";
import { HandArrow } from "./HandArrow";

interface ChalkAnnotationProps {
  text: string;
  color?: "coral" | "lime" | "blue" | "white";
  direction?: "down" | "right" | "left" | "up-right" | "down-right";
  className?: string;
  rotate?: number;
}

export const ChalkAnnotation: React.FC<ChalkAnnotationProps> = ({
  text,
  color = "coral",
  direction = "right",
  className = "",
  rotate = -3,
}) => {
  const colorMap = {
    coral: "var(--chalk-coral)",
    lime: "var(--chalk-lime)",
    blue: "var(--chalk-blue)",
    white: "var(--text-primary)",
  };

  const actualColor = colorMap[color];

  return (
    <span
      style={{ transform: `rotate(${rotate}deg)` }}
      className={`inline-flex items-center gap-1.5 font-chalk text-xl select-none transition-transform duration-300 ${className}`}
    >
      <span style={{ color: actualColor }}>{text}</span>
      <HandArrow direction={direction} color={actualColor} width={40} height={18} />
    </span>
  );
};
