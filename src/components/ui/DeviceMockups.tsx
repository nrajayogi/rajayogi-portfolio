"use client";

import React, { useState } from "react";
import { Eye, Mic, Shield, Sparkles, Activity, CheckCircle, Flame, Clock, Bot, Award, Layers } from "lucide-react";

// Mockup 01: Vision Pro Spatial XR Headset Frame
export const SpatialXRMockup: React.FC<{ imageSrc?: string }> = ({ imageSrc }) => {
  return (
    <div className="relative w-full aspect-[16/10] bg-[#0A0A0A] rounded-2xl md:rounded-3xl p-3 md:p-5 border border-white/15 shadow-2xl overflow-hidden flex flex-col justify-between select-none">
      {/* Vision Pro Top Sensor Array */}
      <div className="flex items-center justify-between z-20 text-[11px] font-sans text-white/60 pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-white font-medium">SPATIAL XR WORKSPACE // UTWENTE</span>
        </div>
        <div className="flex items-center gap-4 text-white/50">
          <span>GAZE: CALIBRATED (90Hz)</span>
          <span className="hidden sm:inline">VOICE: READY</span>
        </div>
      </div>

      {/* Center 3D Simulation Layer */}
      <div className="relative flex-1 my-2 rounded-xl overflow-hidden bg-neutral-900 border border-white/10 flex items-center justify-center">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt="Spatial XR Simulation"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-white/40 text-xs font-sans">UNITY SIMULATION ENVIRONMENT</div>
        )}

        {/* Floating Spatial HUD Overlay Glass */}
        <div className="absolute top-4 left-4 p-3.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/20 text-white space-y-1.5 shadow-xl max-w-[220px] hidden sm:block">
          <div className="flex items-center justify-between text-[10px] font-sans text-blue-400">
            <span>TARGET ALIGNMENT</span>
            <span>HOIST-01</span>
          </div>
          <div className="text-xs font-semibold">Cargo Bike Frame #42</div>
          <div className="text-[10px] text-white/70 font-sans">Elevation: 1.25m · Tolerance: ±2mm</div>
        </div>

        {/* Gaze Raycast Indicator Target */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-2 border-blue-400/80 animate-ping opacity-60" />
          <div className="w-6 h-6 rounded-full border-2 border-blue-400 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-white" />
          </div>
        </div>

        {/* Voice Active Pill */}
        <div className="absolute bottom-4 right-4 px-3.5 py-1.5 rounded-full bg-rose-950/80 backdrop-blur-md border border-rose-500/40 text-rose-200 text-xs font-sans flex items-center gap-2 shadow-lg">
          <Mic className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
          <span>Voice Trigger: "Lower 5cm"</span>
        </div>
      </div>

      {/* Bottom Telemetry Bar */}
      <div className="flex items-center justify-between text-[10px] font-sans text-white/50 pt-2 border-t border-white/10">
        <span>SAFETY PROXIMITY: 1.5M CLEAR</span>
        <span className="text-emerald-400">NASA-TLX WORKLOAD: OPTIMIZED</span>
      </div>
    </div>
  );
};

// Mockup 02: Homemade B.V. Mobile & App Showcase Frame (with Official Logo & Real Screens)
export const TabletKitchenMockup: React.FC<{ view?: "logo" | "rewards" | "ai" }> = ({ view = "logo" }) => {
  const [activeTab, setActiveTab] = useState<"logo" | "rewards" | "ai">(view);

  return (
    <div className="relative w-full aspect-[16/10] bg-[#121110] rounded-2xl md:rounded-3xl p-3 md:p-5 border border-neutral-700/80 shadow-2xl overflow-hidden flex flex-col justify-between select-none">
      {/* Top Header Navigation Tabs */}
      <div className="flex items-center justify-between z-20 text-[11px] font-sans text-neutral-400 pb-2 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#EA580C]" />
          <span className="text-white font-medium">HOMEMADE B.V. // UTWENTE INTERNSHIP</span>
        </div>

        {/* View Switcher Pills */}
        <div className="flex items-center gap-1 bg-neutral-900 p-0.5 rounded-full border border-neutral-800">
          <button
            onClick={() => setActiveTab("logo")}
            className={`px-2.5 py-0.5 rounded-full text-[10px] transition-colors ${
              activeTab === "logo" ? "bg-[#EA580C] text-white font-bold" : "text-neutral-400 hover:text-white"
            }`}
          >
            Brand Logo
          </button>
          <button
            onClick={() => setActiveTab("rewards")}
            className={`px-2.5 py-0.5 rounded-full text-[10px] transition-colors ${
              activeTab === "rewards" ? "bg-[#EA580C] text-white font-bold" : "text-neutral-400 hover:text-white"
            }`}
          >
            Rewards App
          </button>
          <button
            onClick={() => setActiveTab("ai")}
            className={`px-2.5 py-0.5 rounded-full text-[10px] transition-colors ${
              activeTab === "ai" ? "bg-[#EA580C] text-white font-bold" : "text-neutral-400 hover:text-white"
            }`}
          >
            AI Sanne
          </button>
        </div>
      </div>

      {/* Screen Frame Content */}
      <div className="relative flex-1 my-2 rounded-xl overflow-hidden bg-[#EA580C] flex items-center justify-center shadow-inner">
        {/* VIEW 1: Official Logo */}
        {activeTab === "logo" && (
          <div className="w-full h-full bg-[#EA580C] flex flex-col items-center justify-center p-6 animate-fadeIn">
            <img
              src="/images/homemade/homemade-logo.png"
              alt="Homemade Official Logo"
              className="max-h-[140px] md:max-h-[170px] object-contain drop-shadow-md"
            />
            <div className="mt-4 px-3 py-1 rounded-full bg-black/30 backdrop-blur-md text-white text-[10px] font-sans">
              University of Twente · MSc Interaction Technology Internship Report
            </div>
          </div>
        )}

        {/* VIEW 2: Real Rewards App Dashboard */}
        {activeTab === "rewards" && (
          <div className="w-full h-full bg-neutral-900 flex items-center justify-center p-2 animate-fadeIn">
            <img
              src="/images/homemade/homemade-rewards-dashboard.png"
              alt="Homemade Rewards Program"
              className="max-h-[190px] md:max-h-[220px] object-contain rounded-lg shadow-lg"
            />
          </div>
        )}

        {/* VIEW 3: Real Gemini AI Chatbot "Sanne" */}
        {activeTab === "ai" && (
          <div className="w-full h-full bg-neutral-900 flex items-center justify-center p-2 animate-fadeIn">
            <img
              src="/images/homemade/homemade-chatbot.png"
              alt="Homemade AI Chatbot Sanne"
              className="max-h-[190px] md:max-h-[220px] object-contain rounded-lg shadow-lg"
            />
          </div>
        )}
      </div>

      {/* Bottom Telemetry Bar */}
      <div className="flex items-center justify-between text-[10px] font-sans text-neutral-400 pt-2 border-t border-neutral-800">
        <span>REWARD POINTS: 1 RP = €0.01 (FIXED)</span>
        <span className="text-emerald-400">PICKUP SHIFT: +73.8% (p = 0.000208)</span>
      </div>
    </div>
  );
};

// Mockup 03: Multi-Pane Cyber Workbench Frame (C3iHub IIT Kanpur)
export const CyberWorkbenchMockup: React.FC = () => {
  return (
    <div className="relative w-full aspect-[16/10] bg-[#0E1117] rounded-2xl md:rounded-3xl p-3 md:p-5 border border-slate-800 shadow-2xl overflow-hidden flex flex-col justify-between select-none">
      {/* Workbench Browser Header */}
      <div className="flex items-center justify-between z-20 text-[11px] font-sans text-slate-400 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-slate-200 font-medium ml-2">C3IHUB // THREAT NAVIGATOR WORKBENCH</span>
        </div>
        <span className="text-slate-500">INCIDENT-ID: #CN-8942</span>
      </div>

      {/* Multi-Pane Workbench Content */}
      <div className="flex-1 my-2 rounded-xl bg-[#090D14] border border-slate-800 p-3 grid grid-cols-12 gap-3 overflow-hidden">
        {/* Left: Entity Inspector */}
        <div className="col-span-4 bg-slate-900/60 rounded-lg p-3 border border-slate-800/80 space-y-2 text-xs">
          <span className="text-[10px] font-sans text-rose-400 uppercase">THREAT ENTITY</span>
          <div className="text-xs font-semibold text-white">194.26.29.112</div>
          <div className="space-y-1 text-[10px] font-sans text-slate-400 pt-1 border-t border-slate-800">
            <div>Type: Phishing Gateway</div>
            <div>Linked CVEs: CVE-2023-38831</div>
            <div>Risk Score: 94/100 (Critical)</div>
          </div>
        </div>

        {/* Right: Threat Graph Canvas */}
        <div className="col-span-8 bg-slate-900/40 rounded-lg p-3 border border-slate-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[10px] font-sans text-slate-400">
            <span>RELATIONAL TOPOLOGY CANVAS</span>
            <span className="text-rose-400 font-bold">12 CONNECTED CLUSTERS</span>
          </div>

          {/* Mini Graph Nodes */}
          <div className="my-auto py-2 flex items-center justify-around">
            <div className="w-9 h-9 rounded-full bg-blue-950 border border-blue-500 flex items-center justify-center text-[9px] font-sans text-blue-200">
              IP
            </div>
            <div className="w-12 h-0.5 bg-slate-700" />
            <div className="w-11 h-11 rounded-full bg-rose-950 border-2 border-rose-500 flex items-center justify-center text-[10px] font-sans font-bold text-rose-100 shadow-md">
              BOTNET
            </div>
            <div className="w-12 h-0.5 bg-slate-700" />
            <div className="w-9 h-9 rounded-full bg-amber-950 border border-amber-500 flex items-center justify-center text-[9px] font-sans text-amber-200">
              DNS
            </div>
          </div>

          <div className="text-[10px] font-sans text-slate-500 flex justify-between">
            <span>Graph Triage Active</span>
            <span>Standardized Case Export Ready</span>
          </div>
        </div>
      </div>

      {/* Footer Status */}
      <div className="flex items-center justify-between text-[10px] font-sans text-slate-500 pt-2 border-t border-slate-800">
        <span>FORENSIC TELEMETRY ENGINE · IIT KANPUR</span>
        <span className="text-emerald-400">STATUS: ACTIVE INGESTION</span>
      </div>
    </div>
  );
};
