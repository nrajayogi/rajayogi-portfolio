"use client";

import React from "react";

// Paper Tape Strip Component
export const TapeStrip: React.FC<{
  className?: string;
  color?: "cream" | "lime" | "coral" | "blue";
  rotate?: number;
}> = ({ className = "", color = "cream", rotate = -2 }) => {
  const bgMap = {
    cream: "bg-[#F2EFE6]/25 border-dashed border-[#F2EFE6]/40",
    lime: "bg-[#D6DF84]/30 border-dashed border-[#D6DF84]/50",
    coral: "bg-[#F17C72]/30 border-dashed border-[#F17C72]/50",
    blue: "bg-[#72B8D4]/30 border-dashed border-[#72B8D4]/50",
  };

  return (
    <div
      style={{ transform: `rotate(${rotate}deg)` }}
      className={`h-4 w-16 md:w-20 border-y ${bgMap[color]} backdrop-blur-xs pointer-events-none select-none shadow-sm ${className}`}
    />
  );
};

// Push Pin Badge
export const PushPin: React.FC<{ color?: "coral" | "lime" | "blue" | "white"; className?: string }> = ({
  color = "coral",
  className = "",
}) => {
  const pinColors = {
    coral: "#F17C72",
    lime: "#D6DF84",
    blue: "#72B8D4",
    white: "#F2EFE6",
  };

  return (
    <div className={`w-4 h-4 rounded-full relative flex items-center justify-center shadow-md ${className}`}>
      <div
        className="w-3.5 h-3.5 rounded-full border border-black/30"
        style={{ backgroundColor: pinColors[color] }}
      />
      <div className="absolute top-0.5 left-0.5 w-1 h-1 rounded-full bg-white/70" />
    </div>
  );
};

// Hand-Drawn Chalk Star Doodle
export const ChalkStar: React.FC<{ color?: string; className?: string; size?: number }> = ({
  color = "#D6DF84",
  className = "",
  size = 28,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    className={`inline-block overflow-visible ${className}`}
  >
    <path
      d="M16 2 L19 12 L29 12 L21 18 L24 28 L16 22 L8 28 L11 18 L3 12 L13 12 Z"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="opacity-90"
    />
  </svg>
);

// Hand-Drawn Chalk Spiral Doodle
export const ChalkSpiral: React.FC<{ color?: string; className?: string; size?: number }> = ({
  color = "#F17C72",
  className = "",
  size = 32,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 40"
    className={`inline-block overflow-visible ${className}`}
  >
    <path
      d="M20 20 C 18 18, 18 22, 20 23 C 24 24, 25 17, 21 14 C 15 11, 11 21, 16 27 C 23 33, 33 26, 32 17 C 31 7, 18 3, 9 10"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      className="opacity-85"
    />
  </svg>
);

// Hand-Drawn Chalk Sparkle/Burst
export const ChalkSparkle: React.FC<{ color?: string; className?: string; size?: number }> = ({
  color = "#72B8D4",
  className = "",
  size = 24,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={`inline-block overflow-visible ${className}`}
  >
    <path
      d="M12 2 L12 22 M2 12 L22 12 M5 5 L19 19 M19 5 L5 19"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      className="opacity-80"
    />
  </svg>
);

// Hand-Drawn Wavy Chalk Bracket / Divider
export const ChalkWavyLine: React.FC<{ color?: string; className?: string }> = ({
  color = "rgba(242, 239, 230, 0.4)",
  className = "",
}) => (
  <svg
    viewBox="0 0 400 16"
    preserveAspectRatio="none"
    className={`w-full h-3 overflow-visible ${className}`}
  >
    <path
      d="M 0 8 Q 25 0, 50 8 T 100 8 T 150 8 T 200 8 T 250 8 T 300 8 T 350 8 T 400 8"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

// Hand-Drawn Voice Wave Icon (for XR Thesis)
export const ChalkVoiceWave: React.FC<{ color?: string; className?: string }> = ({
  color = "#D6DF84",
  className = "",
}) => (
  <svg
    width="48"
    height="28"
    viewBox="0 0 48 28"
    className={`inline-block ${className}`}
  >
    <path
      d="M4 14 L8 14 M12 8 L12 20 M16 4 L16 24 M20 2 L20 26 M24 6 L24 22 M28 2 L28 26 M32 4 L32 24 M36 8 L36 20 M40 12 L40 16 M44 14 L44 14"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

// Sticky Note Component with Tilted Angle
export const StickyNote: React.FC<{
  children: React.ReactNode;
  color?: "cream" | "lime" | "coral" | "blue";
  rotate?: number;
  className?: string;
  pinColor?: "coral" | "lime" | "blue" | "white";
}> = ({
  children,
  color = "cream",
  rotate = -2,
  className = "",
  pinColor = "coral",
}) => {
  const bgStyles = {
    cream: "bg-[#F2EFE6] text-[#123028] shadow-lg",
    lime: "bg-[#D6DF84] text-[#123028] shadow-lg",
    coral: "bg-[#F17C72] text-[#123028] shadow-lg",
    blue: "bg-[#72B8D4] text-[#123028] shadow-lg",
  };

  return (
    <div
      style={{ transform: `rotate(${rotate}deg)` }}
      className={`relative p-4 rounded-xs transition-transform duration-300 hover:scale-105 hover:rotate-0 hover:z-20 ${bgStyles[color]} ${className}`}
    >
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10">
        <PushPin color={pinColor} />
      </div>
      <div className="pt-2">{children}</div>
    </div>
  );
};
