"use client";

import React, { useState } from "react";

// Vector 01: Interactive Spatial XR & Gaze-Voice Diagram
export const SpatialXRVector: React.FC = () => {
  const [activeNode, setActiveNode] = useState<string | null>("gaze");

  return (
    <div className="relative w-full h-full min-h-[300px] sm:min-h-[360px] bg-neutral-950 text-white rounded-lg p-6 flex flex-col justify-between overflow-hidden select-none border border-neutral-800">
      {/* Top Header */}
      <div className="flex items-center justify-between text-xs font-sans text-neutral-400 z-10">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          SPATIAL XR INTERACTION MODEL
        </span>
        <span>HOIST CRANE SYSTEM · UTWENTE</span>
      </div>

      {/* Interactive SVG Canvas */}
      <svg
        viewBox="0 0 700 360"
        className="w-full h-full max-h-[260px] my-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Isometric Grid Floor Lines */}
        <g stroke="rgba(255,255,255,0.07)" strokeWidth="1">
          <line x1="100" y1="280" x2="600" y2="280" />
          <line x1="150" y1="240" x2="550" y2="240" />
          <line x1="200" y1="200" x2="500" y2="200" />
          <line x1="100" y1="280" x2="250" y2="160" />
          <line x1="350" y1="280" x2="350" y2="160" />
          <line x1="600" y1="280" x2="450" y2="160" />
        </g>

        {/* Industrial Hoist Crane Assembly Structure */}
        <path
          d="M 220 80 L 480 80 M 350 80 L 350 170"
          stroke="#404040"
          strokeWidth="3"
          strokeDasharray="4 4"
        />
        <rect x="335" y="165" width="30" height="20" rx="3" fill="#2563EB" stroke="#60A5FA" strokeWidth="1.5" />
        <circle cx="350" cy="175" r="4" fill="#FFFFFF" />

        {/* Hoist Load Wire & Component */}
        <line x1="350" y1="185" x2="350" y2="250" stroke="#60A5FA" strokeWidth="2" strokeDasharray="3 3" />
        <rect
          x="310"
          y="245"
          width="80"
          height="35"
          rx="4"
          fill="#1E293B"
          stroke={activeNode === "load" ? "#38BDF8" : "#475569"}
          strokeWidth="2"
          className="cursor-pointer transition-all"
          onMouseEnter={() => setActiveNode("load")}
        />
        <text x="350" y="267" textAnchor="middle" fill="#E2E8F0" fontSize="11" fontFamily="monospace">
          CARGO FRAME
        </text>

        {/* Worker Avatar Vector (Left Side) */}
        <g
          className="cursor-pointer"
          onMouseEnter={() => setActiveNode("gaze")}
        >
          {/* Head & Vision Headset */}
          <circle cx="170" cy="210" r="16" fill="#1E293B" stroke="#60A5FA" strokeWidth="2" />
          <rect x="172" y="204" width="12" height="8" rx="2" fill="#3B82F6" />
          {/* Body */}
          <path d="M 170 226 L 170 275 M 150 245 L 190 245" stroke="#475569" strokeWidth="3" strokeLinecap="round" />

          {/* Gaze Raycast Vector Cone */}
          <path
            d="M 184 208 L 310 248 M 184 212 L 310 270"
            stroke={activeNode === "gaze" ? "#60A5FA" : "rgba(96,165,250,0.3)"}
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <text x="235" y="222" fill="#93C5FD" fontSize="10" fontFamily="monospace">
            GAZE RAYCAST
          </text>
        </g>

        {/* Voice Command Waveform Vector */}
        <g
          className="cursor-pointer"
          onMouseEnter={() => setActiveNode("voice")}
        >
          <path
            d="M 185 190 Q 200 175, 215 190 T 245 190 T 275 190"
            stroke={activeNode === "voice" ? "#F43F5E" : "rgba(244,63,94,0.4)"}
            strokeWidth="2.5"
            fill="none"
          />
          <circle cx="215" cy="180" r="12" fill="#881337" stroke="#FB7185" strokeWidth="1" />
          <text x="215" y="184" textAnchor="middle" fill="#FFE4E6" fontSize="9" fontFamily="monospace">
            🎙️
          </text>
          <text x="245" y="175" fill="#FDA4AF" fontSize="10" fontFamily="monospace">
            "LOWER 5CM"
          </text>
        </g>

        {/* Safety Halo Envelope (Dashed Arc) */}
        <ellipse
          cx="350"
          cy="260"
          rx="110"
          ry="40"
          fill="none"
          stroke={activeNode === "safety" ? "#10B981" : "rgba(16,185,129,0.3)"}
          strokeWidth="1.5"
          strokeDasharray="6 6"
          className="cursor-pointer"
          onMouseEnter={() => setActiveNode("safety")}
        />
        <text x="440" y="295" fill="#6EE7B7" fontSize="10" fontFamily="monospace">
          SPATIAL SAFETY HALO (1.5m)
        </text>

        {/* NASA-TLX Usability Tag */}
        <g
          className="cursor-pointer"
          onMouseEnter={() => setActiveNode("nasatlx")}
        >
          <rect x="490" y="120" width="170" height="60" rx="6" fill="#18181B" stroke="#27272A" strokeWidth="1" />
          <text x="505" y="142" fill="#A1A1AA" fontSize="10" fontFamily="monospace">
            EVALUATION METRIC
          </text>
          <text x="505" y="162" fill="#22C55E" fontSize="13" fontWeight="bold" fontFamily="monospace">
            NASA-TLX WORKLOAD
          </text>
        </g>
      </svg>

      {/* Interactive Detail Bar */}
      <div className="pt-3 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-2 text-xs font-sans">
        <div className="flex items-center gap-2 text-neutral-300">
          <span className="text-blue-400 font-bold">INSPECTION NODE:</span>
          <span>
            {activeNode === "gaze" && "Head-mounted eye tracking calculates 3D intention target to replace manual pendant controller."}
            {activeNode === "voice" && "Low-latency voice recognition triggers discrete micro-elevation commands ('lower 5cm', 'hold', 'raise')."}
            {activeNode === "load" && "Simulated cargo bike frame assembly with semi-automated positioning guidance."}
            {activeNode === "safety" && "Dynamic collision bounding envelope provides real-time proximity safety."}
            {activeNode === "nasatlx" && "15-participant within-subject user study evaluated cognitive demand, physical effort, and operator agency."}
          </span>
        </div>
        <span className="text-neutral-500 hidden sm:inline">Hover over nodes to inspect</span>
      </div>
    </div>
  );
};

// Vector 02: Interactive Behavioral Product Loop Vector (Homemade B.V.)
export const BehavioralLoopVector: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);

  const steps = [
    { num: 1, title: "DISCOVERY", desc: "Consumers discover authentic local chefs and weekly meal batches" },
    { num: 2, title: "ORDER PACING", desc: "Kitchen tablet automatically aggregates prep batches for home chefs" },
    { num: 3, title: "KITCHEN TRIAGE", desc: "One-tap status updates maintain seamless pickup time synchronization" },
    { num: 4, title: "FEEDBACK LOOP", desc: "Customer dietary preferences inform chef weekly menu curation" },
  ];

  return (
    <div className="relative w-full h-full min-h-[300px] sm:min-h-[360px] bg-neutral-950 text-white rounded-lg p-6 flex flex-col justify-between overflow-hidden select-none border border-neutral-800">
      <div className="flex items-center justify-between text-xs font-sans text-neutral-400 z-10">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          PRODUCT ECOSYSTEM WORKFLOW
        </span>
        <span>HOMEMADE B.V. · ENSCHEDE</span>
      </div>

      {/* Circular Loop Graphic */}
      <div className="my-auto py-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {steps.map((step) => {
          const isActive = activeStep === step.num;
          return (
            <div
              key={step.num}
              onMouseEnter={() => setActiveStep(step.num)}
              className={`p-4 rounded-md border transition-all cursor-pointer space-y-2 ${
                isActive
                  ? "bg-neutral-900 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                  : "bg-neutral-950 border-neutral-800 hover:border-neutral-700"
              }`}
            >
              <div className="flex items-center justify-between text-xs font-sans">
                <span className={isActive ? "text-emerald-400 font-bold" : "text-neutral-500"}>
                  0{step.num}
                </span>
                <span className="text-[10px] text-neutral-500">STAGE</span>
              </div>
              <h4 className="text-sm font-semibold tracking-tight text-white font-sans">
                {step.title}
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {step.desc}
              </p>
            </div>
          );
        })}
      </div>

      <div className="pt-3 border-t border-neutral-800 flex items-center justify-between text-xs font-sans text-neutral-400">
        <span>TWO-SIDED PLATFORM ARCHITECTURE</span>
        <span className="text-emerald-400">FIGMA DESIGN SYSTEM & REACT / NEXT.JS</span>
      </div>
    </div>
  );
};

// Vector 03: Forensic Threat Graph Vector (C3iHub IIT Kanpur)
export const ThreatGraphVector: React.FC = () => {
  return (
    <div className="relative w-full h-full min-h-[300px] sm:min-h-[360px] bg-neutral-950 text-white rounded-lg p-6 flex flex-col justify-between overflow-hidden select-none border border-neutral-800">
      <div className="flex items-center justify-between text-xs font-sans text-neutral-400 z-10">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          RELATIONAL THREAT GRAPH TOPOLOGY
        </span>
        <span>C3IHUB / IIT KANPUR</span>
      </div>

      <svg viewBox="0 0 600 240" className="w-full h-full max-h-[200px] my-auto" fill="none">
        {/* Connection Lines */}
        <line x1="120" y1="120" x2="260" y2="70" stroke="#334155" strokeWidth="2" strokeDasharray="3 3" />
        <line x1="120" y1="120" x2="260" y2="170" stroke="#334155" strokeWidth="2" strokeDasharray="3 3" />
        <line x1="260" y1="70" x2="420" y2="120" stroke="#F43F5E" strokeWidth="2" />
        <line x1="260" y1="170" x2="420" y2="120" stroke="#334155" strokeWidth="2" />
        <line x1="420" y1="120" x2="520" y2="80" stroke="#F43F5E" strokeWidth="2" />
        <line x1="420" y1="120" x2="520" y2="160" stroke="#334155" strokeWidth="2" />

        {/* Nodes */}
        <circle cx="120" cy="120" r="18" fill="#1E293B" stroke="#64748B" strokeWidth="2" />
        <text x="120" y="124" textAnchor="middle" fill="#F8FAFC" fontSize="10" fontFamily="monospace">IP</text>

        <circle cx="260" cy="70" r="16" fill="#1E293B" stroke="#F43F5E" strokeWidth="2" />
        <text x="260" y="74" textAnchor="middle" fill="#F8FAFC" fontSize="9" fontFamily="monospace">HASH</text>

        <circle cx="260" cy="170" r="16" fill="#1E293B" stroke="#64748B" strokeWidth="2" />
        <text x="260" y="174" textAnchor="middle" fill="#F8FAFC" fontSize="9" fontFamily="monospace">DOMAIN</text>

        <circle cx="420" cy="120" r="22" fill="#881337" stroke="#F43F5E" strokeWidth="3" />
        <text x="420" y="124" textAnchor="middle" fill="#FFE4E6" fontSize="10" fontWeight="bold" fontFamily="monospace">CLUSTER</text>

        <circle cx="520" cy="80" r="14" fill="#1E293B" stroke="#F43F5E" strokeWidth="2" />
        <text x="520" y="84" textAnchor="middle" fill="#F8FAFC" fontSize="8" fontFamily="monospace">WHOIS</text>

        <circle cx="520" cy="160" r="14" fill="#1E293B" stroke="#64748B" strokeWidth="2" />
        <text x="520" y="164" textAnchor="middle" fill="#F8FAFC" fontSize="8" fontFamily="monospace">TELEMETRY</text>
      </svg>

      <div className="pt-3 border-t border-neutral-800 flex items-center justify-between text-xs font-sans text-neutral-400">
        <span>MULTI-SOURCE THREAT CORRELATION WORKBENCH</span>
        <span className="text-rose-400">INCIDENT TRIAGE INTERFACE</span>
      </div>
    </div>
  );
};
