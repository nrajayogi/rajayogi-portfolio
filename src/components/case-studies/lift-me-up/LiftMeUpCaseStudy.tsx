"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  AudioLines,
  BrainCircuit,
  Check,
  ChevronRight,
  CircleStop,
  Eye,
  Factory,
  Hand,
  Headphones,
  Move3D,
  PersonStanding,
  ScanLine,
  Sparkles,
  Timer,
  Workflow,
  ArrowDown,
  Layers,
  FileText,
  Sliders,
  ShieldCheck,
  Zap,
} from "lucide-react";
import {
  limitations,
  modes,
  nav,
  process,
  projectMeta,
  recommendations,
  tasks,
  type ModeKey,
} from "@/data/liftMeUpData";
import { Footer } from "@/components/layout/footer";

const easeMax = 7;

function ModeIcon({ mode }: { mode: ModeKey }) {
  if (mode === "voice") return <AudioLines className="h-6 w-6" />;
  if (mode === "nudge") return <Sparkles className="h-6 w-6" />;
  return <BrainCircuit className="h-6 w-6" />;
}

// 80% Percentage Angle Radial Gauge
function PercentageAngleGauge({
  percentage = 80,
  label = "Perceived Operator Agency",
}: {
  percentage?: number;
  label?: string;
}) {
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex items-center gap-3 p-3 rounded-[4px] border border-border bg-card">
      <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
        <svg className="w-14 h-14 -rotate-90" viewBox="0 0 64 64">
          <circle
            cx="32"
            cy="32"
            r={radius}
            className="stroke-foreground/10"
            strokeWidth="5"
            fill="transparent"
          />
          <motion.circle
            cx="32"
            cy="32"
            r={radius}
            className="stroke-primary"
            strokeWidth="5"
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            whileInView={{ strokeDashoffset }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            strokeLinecap="square"
          />
        </svg>
        <span className="absolute text-xs font-mono font-bold text-foreground">{percentage}%</span>
      </div>
      <div>
        <span className="text-xs font-bold text-foreground block">{percentage}% Angle Gauge</span>
        <span className="text-[10px] text-muted-foreground font-mono">{label}</span>
      </div>
    </div>
  );
}

function ResultBar({
  label,
  value,
  max = 14,
}: {
  label: string;
  value: number;
  max?: number;
}) {
  const percent = Math.round((value / max) * 100);

  return (
    <div className="grid grid-cols-[85px_1fr_65px] items-center gap-3">
      <span className="text-xs text-muted-foreground font-medium">{label}</span>
      <div className="h-2 overflow-hidden rounded-[4px] bg-foreground/10">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${(value / max) * 100}%` }}
          viewport={{ once: true, amount: 0.7 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="h-full rounded-[4px] bg-primary"
        />
      </div>
      <div className="text-right font-mono text-xs flex items-center justify-end gap-1">
        <span className="font-semibold text-foreground">{value}</span>
        <span className="text-[10px] text-muted-foreground">({percent}%)</span>
      </div>
    </div>
  );
}

function ChapterRail() {
  return (
    <aside className="fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 xl:block">
      <nav aria-label="Case study navigation" className="rounded-[4px] border border-border bg-card/90 p-2 backdrop-blur-xl shadow-lg">
        {nav.map(([number, name, id]) => (
          <a
            key={id}
            href={`#${id}`}
            className="group flex items-center gap-2 rounded-[4px] px-3 py-1.5 text-[11px] text-muted-foreground transition hover:bg-foreground/5 hover:text-foreground"
          >
            <span className="font-mono text-primary font-semibold">{number}</span>
            <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-300 group-hover:max-w-28 group-hover:opacity-100">
              {name}
            </span>
          </a>
        ))}
      </nav>
    </aside>
  );
}

function ProjectImage({
  src,
  alt,
  label,
  tall = false,
}: {
  src: string;
  alt: string;
  label: string;
  tall?: boolean;
}) {
  const [hasError, setHasError] = useState(false);

  return (
    <figure
      className={`group relative overflow-hidden rounded-[4px] border border-border bg-card/40 ${
        tall ? "aspect-[4/5]" : "aspect-[16/10]"
      }`}
    >
      {!hasError ? (
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.02]"
          onError={() => setHasError(true)}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-card">
          <span className="text-sm font-medium text-foreground">{alt}</span>
          <span className="mt-2 font-mono text-xs text-primary">{src}</span>
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
      <figcaption className="absolute inset-x-4 bottom-4 z-10 rounded-[4px] border border-white/10 bg-black/70 px-4 py-2 text-xs text-white/80 backdrop-blur-md">
        {label}
      </figcaption>
    </figure>
  );
}

export function LiftMeUpCaseStudy() {
  const [activeMode, setActiveMode] = useState<ModeKey>("voice");

  const mode = useMemo(
    () => modes.find((item) => item.key === activeMode) ?? modes[0],
    [activeMode]
  );

  const architectureSteps = [
    { num: "01", title: "Tracking Input", desc: "6DoF HMD pose, eye gaze vectors & dual 6DoF hand tracking", tag: "SENSE" },
    { num: "02", title: "Worker Calibration", desc: "Arm span, standing baseline elbow height & eye offsets", tag: "CALIBRATE" },
    { num: "03", title: "Golden Zone Logic", desc: "Real-time comfort reach sphere (±15° neck, 90° elbow envelope)", tag: "REASON" },
    { num: "04", title: "Initiative Layer", desc: "Voice ('I decide') · Nudge ('We decide') · Semi-Auto ('It decides')", tag: "AGENCY" },
    { num: "05", title: "Hoist Movement Model", desc: "Velocity damping, smooth elevation & collision bounds", tag: "ACT" },
    { num: "06", title: "Worker Feedback", desc: "Holographic trajectory preview ghost & audio confirm", tag: "TRANSPARENCY" },
    { num: "07", title: "Study Logging", desc: "Task duration, dwell metrics, override timestamps & psychometrics", tag: "EVALUATION" },
  ];

  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary selection:text-white font-sans">
      <ChapterRail />

      {/* TOP NAVIGATION BREADCRUMB */}
      <div className="border-b border-border bg-card/40 backdrop-blur-md sticky top-0 z-30">
        <div className="container mx-auto px-4 border-l border-r border-border p-0">
          <div className="px-6 md:px-12 h-14 flex items-center justify-between">
            <Link
              href="/#work"
              className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowDownRight className="w-4 h-4 rotate-[135deg]" />
              <span>Back to Portfolio</span>
            </Link>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="text-muted-foreground">M.SC. THESIS</span>
              <span className="text-border">/</span>
              <span className="text-primary font-bold">LIFT ME UP</span>
            </div>
          </div>
        </div>
      </div>

      {/* 1. HERO SECTION (Connected Frame matching Home Page Style) */}
      <section className="bg-background relative overflow-hidden">
        <div className="container mx-auto px-4 border-l border-r border-border p-0">
          
          {/* Main Hero Spotlight */}
          <div className="p-8 md:p-14 lg:p-16 border-b border-border bg-card/10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
              
              {/* Left Column (7 cols) */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[4px] border border-primary/30 bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
                    <ScanLine className="w-3.5 h-3.5" />
                    <span>{projectMeta.kicker}</span>
                  </div>

                  <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-foreground leading-[0.9] uppercase">
                    Lift Me Up
                  </h1>

                  <p className="text-lg sm:text-xl text-muted-foreground mt-5 leading-relaxed font-light max-w-2xl">
                    {projectMeta.subtitle}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-6">
                    {projectMeta.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-[4px] border border-border bg-foreground/5 text-xs text-muted-foreground font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <div className="px-4 py-2.5 rounded-[4px] border border-primary/30 bg-primary/10 flex items-center gap-2.5">
                    <span className="text-xl font-black text-primary">13 / 14</span>
                    <span className="text-xs font-medium text-foreground">ranked Voice first overall (93%)</span>
                  </div>

                  <div className="px-4 py-2.5 rounded-[4px] border border-border bg-card flex items-center gap-2">
                    <span className="text-sm font-mono font-bold text-primary">80%</span>
                    <span className="text-xs text-muted-foreground">perceived control majority</span>
                  </div>

                  <a
                    href="#context"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[4px] border border-border bg-card hover:bg-foreground/5 text-foreground text-xs font-semibold tracking-wider uppercase transition-all"
                  >
                    <span>Explore Thesis</span>
                    <ArrowDownRight className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Right Column (5 cols) */}
              <div className="lg:col-span-5">
                <div className="relative p-2 rounded-[4px] border border-border bg-card shadow-2xl">
                  <ProjectImage
                    src="/images/lift-me-up/hero-xr.webp"
                    alt="XR autonomous hoist prototype simulation"
                    label="XR Headset Simulation · Cargo bicycle frame suspended in golden zone testbed at University of Twente"
                    tall
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Connected 4-Column Bottom Stats Bar (4px radius corners) */}
          <div className="border-b border-border bg-card/20">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border">
              <div className="p-6 md:p-8 flex flex-col justify-between group hover:bg-foreground/[0.02] transition-colors">
                <span className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground mb-1">01 // COHORT</span>
                <div className="text-2xl sm:text-3xl font-bold text-foreground">15 Operators</div>
                <div className="text-xs text-muted-foreground mt-1">Within-subject Wizard of Oz</div>
                <div className="text-[11px] text-primary font-mono mt-2">UTwente XR Lab</div>
              </div>

              <div className="p-6 md:p-8 flex flex-col justify-between group hover:bg-foreground/[0.02] transition-colors">
                <span className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground mb-1">02 // CONDITIONS</span>
                <div className="text-2xl sm:text-3xl font-bold text-foreground">3 × 3 Matrix</div>
                <div className="text-xs text-muted-foreground mt-1">Voice, Nudge & Semi-Auto</div>
                <div className="text-[11px] text-primary font-mono mt-2">3 Assembly Tasks</div>
              </div>

              <div className="p-6 md:p-8 flex flex-col justify-between group hover:bg-foreground/[0.02] transition-colors">
                <span className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground mb-1">03 // PROTOCOL</span>
                <div className="text-2xl sm:text-3xl font-bold text-foreground">45 Minutes</div>
                <div className="text-xs text-muted-foreground mt-1">Simulated shift evaluation</div>
                <div className="text-[11px] text-primary font-mono mt-2">Van Raam Workflow</div>
              </div>

              <div className="p-6 md:p-8 flex flex-col justify-between group hover:bg-foreground/[0.02] transition-colors">
                <span className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground mb-1">04 // VOICE EASE</span>
                <div className="text-2xl sm:text-3xl font-bold text-primary">6.2 / 7.0</div>
                <div className="text-xs text-muted-foreground mt-1">Top rated ease score (88.6%)</div>
                <div className="text-[11px] text-primary font-mono mt-2">vs 4.4 Nudge & 4.0 Semi</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. CONTEXT (Section Header + 2-Column Connected Grid) */}
      <section id="context" className="bg-background relative overflow-hidden">
        <div className="container mx-auto px-4 border-l border-r border-border p-0">
          
          {/* Section Header */}
          <div className="p-8 md:p-14 border-b border-border flex flex-col md:flex-row md:items-end justify-between gap-6 bg-card/20">
            <div>
              <span className="text-primary text-xs font-semibold tracking-wider uppercase mb-3 block">
                01 // Operational Context & Problem
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium text-foreground tracking-tight max-w-3xl">
                The hoist lifted the frame. <span className="text-foreground/40">The worker still carried the decision burden.</span>
              </h2>
            </div>
            <div className="max-w-md">
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                At Van Raam, operators assemble large adapted bicycles using ceiling hoists. Lifting effort was eliminated, but postural decision burden remained high.
              </p>
              <div className="w-12 h-1 bg-primary mt-4 rounded-[4px]" />
            </div>
          </div>

          {/* 2-Column Problem vs Opportunity Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border border-b border-border">
            <div className="p-8 md:p-12 group hover:bg-foreground/[0.02] transition-colors">
              <div className="w-12 h-12 rounded-[4px] bg-destructive/10 text-destructive flex items-center justify-center mb-6">
                <PersonStanding size={24} />
              </div>
              <h3 className="text-2xl font-medium text-foreground mb-3">Human Need</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                A bicycle frame held too high, too low, or at the wrong orientation repeatedly forces the worker outside the ergonomic <strong className="text-foreground font-medium">&quot;golden zone&quot;</strong>. This postural strain accumulates across hundreds of micro-adjustments into chronic musculoskeletal fatigue.
              </p>
              <div className="p-4 rounded-[4px] bg-card border border-border text-xs text-muted-foreground italic">
                &quot;Operators frequently held heavy components with one hand while stretching awkwardly to manipulate pendant pushbuttons with the other.&quot;
              </div>
            </div>

            <div className="p-8 md:p-12 group hover:bg-foreground/[0.02] transition-colors">
              <div className="w-12 h-12 rounded-[4px] bg-primary/10 text-primary flex items-center justify-center mb-6">
                <Factory size={24} />
              </div>
              <h3 className="text-2xl font-medium text-foreground mb-3">System Opportunity</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Let the hoist sense worker posture, anticipate assembly targets, and collaborate proactively to keep components inside the comfort envelope—all while preserving absolute worker veto power.
              </p>
              <div className="p-4 rounded-[4px] bg-primary/5 border border-primary/20 text-xs text-foreground font-medium">
                The research goal was not creating another AR visual overlay, but engineering the interactive behaviour of an autonomous industrial machine.
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. RESEARCH QUESTION (Monumental Vision Statement Style) */}
      <section id="question" className="bg-background relative overflow-hidden border-b border-border">
        <div className="container mx-auto px-4 border-l border-r border-border p-0">
          
          <div className="py-20 md:py-32 px-8 md:px-14 flex flex-col items-center text-center relative">
            <span className="text-primary text-xs font-semibold tracking-widest uppercase mb-4 block">
              02 // Research Question & Scope
            </span>
            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight text-foreground max-w-5xl leading-tight">
              How can an autonomous hoist help workers work in the <span className="text-primary underline decoration-primary/40 decoration-2 underline-offset-8">golden zone</span>?
            </h2>

            <p className="mt-8 text-base md:text-xl text-muted-foreground max-w-3xl font-light leading-relaxed">
              Decomposed into three fundamental design dimensions: cue &amp; modality, timing of intervention, and authority preservation.
            </p>
          </div>

          {/* 3 Interaction Dimensions Bar */}
          <div className="border-t border-border bg-card/20">
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
              <div className="p-6 md:p-8">
                <span className="text-xs font-mono text-primary font-bold block mb-1">DIMENSION 01</span>
                <h4 className="text-lg font-medium text-foreground mb-2">Cue &amp; Modality</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  How the system communicates intent—hands-free speech vs visual holographic nudges vs physical stops.
                </p>
              </div>

              <div className="p-6 md:p-8">
                <span className="text-xs font-mono text-primary font-bold block mb-1">DIMENSION 02</span>
                <h4 className="text-lg font-medium text-foreground mb-2">Timing &amp; Cadence</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  When assistance triggers—pre-task calibration, in-situ during reaching strain, or on explicit demand.
                </p>
              </div>

              <div className="p-6 md:p-8">
                <span className="text-xs font-mono text-primary font-bold block mb-1">DIMENSION 03</span>
                <h4 className="text-lg font-medium text-foreground mb-2">Authority Preservation</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Ensuring operators maintain total control without cognitive friction or unexpected machine displacements.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. SYSTEM & ARCHITECTURE (Methodology Style) */}
      <section id="system" className="bg-background relative overflow-hidden">
        <div className="container mx-auto px-4 border-l border-r border-border p-0">
          
          {/* Section Header */}
          <div className="p-8 md:p-14 border-b border-border flex flex-col md:flex-row md:items-end justify-between gap-6 bg-card/20">
            <div>
              <span className="text-primary text-xs font-semibold tracking-wider uppercase mb-3 block">
                03 // System Engineering & Safe XR Sandbox
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium text-foreground tracking-tight">
                From posture theory <span className="text-foreground/40">to a system people could step inside.</span>
              </h2>
            </div>
            <div className="max-w-md">
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                Extended Reality (XR) was chosen because iterating on an autonomous physical suspended load in a real factory is dangerous and cost-prohibitive.
              </p>
              <div className="w-12 h-1 bg-primary mt-4 rounded-[4px]" />
            </div>
          </div>

          {/* 7-Step Architecture Flow */}
          <div className="p-8 md:p-14 border-b border-border bg-card/5">
            <div className="max-w-5xl mx-auto space-y-3">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono uppercase tracking-wider text-primary font-bold">
                  Redrawn Autonomous Hoist Pipeline
                </span>
                <span className="text-xs text-muted-foreground font-mono">
                  Unity 2022.3 LTS · C# · OpenXR Runtime
                </span>
              </div>

              <div className="grid gap-2.5">
                {architectureSteps.map((step, idx) => (
                  <div
                    key={step.num}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-[4px] border border-border bg-card hover:bg-foreground/[0.02] transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="w-8 h-8 rounded-[4px] bg-primary/10 text-primary font-mono text-xs font-bold flex items-center justify-center shrink-0">
                        {step.num}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="text-sm font-semibold text-foreground">{step.title}</h5>
                          <span className="px-2 py-0.5 rounded-[4px] bg-foreground/5 text-[10px] font-mono text-muted-foreground">
                            {step.tag}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{step.desc}</p>
                      </div>
                    </div>

                    {idx < architectureSteps.length - 1 && (
                      <div className="hidden sm:block text-muted-foreground/30">
                        <ArrowDown size={14} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3-Column Sense, Reason, Act */}
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border border-b border-border">
            <div className="p-8 md:p-10 group hover:bg-foreground/[0.02] transition-colors">
              <div className="w-10 h-10 rounded-[4px] bg-primary/10 text-primary flex items-center justify-center mb-4">
                <Eye size={20} />
              </div>
              <h4 className="text-lg font-medium text-foreground mb-2">Sense</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                6DoF headset and hand tracking, user arm span calibration, and reach envelopes make posture legible in real-time.
              </p>
            </div>

            <div className="p-8 md:p-10 group hover:bg-foreground/[0.02] transition-colors">
              <div className="w-10 h-10 rounded-[4px] bg-primary/10 text-primary flex items-center justify-center mb-4">
                <Move3D size={20} />
              </div>
              <h4 className="text-lg font-medium text-foreground mb-2">Reason</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Golden zone classification turns musculoskeletal comfort from a retrospective medical score into an active spatial control target.
              </p>
            </div>

            <div className="p-8 md:p-10 group hover:bg-foreground/[0.02] transition-colors">
              <div className="w-10 h-10 rounded-[4px] bg-primary/10 text-primary flex items-center justify-center mb-4">
                <Workflow size={20} />
              </div>
              <h4 className="text-lg font-medium text-foreground mb-2">Act</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Different initiative paths (Voice, Nudge, Semi-Auto) converge on the same hoist movement model with soft velocity damping.
              </p>
            </div>
          </div>

          {/* 2-Column Prototype Visuals */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border border-b border-border p-6 md:p-10 gap-6 md:gap-0">
            <div className="md:pr-6">
              <ProjectImage
                src="/images/lift-me-up/golden-zone.webp"
                alt="Golden zone biomechanical tracking"
                label="Biomechanical Mapping · Converting joint angles and arm reach into a 3D Golden Zone target envelope"
              />
            </div>
            <div className="md:pl-6 pt-6 md:pt-0">
              <ProjectImage
                src="/images/lift-me-up/prototype-evolution.webp"
                alt="Prototype evolution from virtual cell to mixed reality"
                label="Prototype Evolution · Progression from CAD digital twin to mixed reality testing setup"
              />
            </div>
          </div>

        </div>
      </section>

      {/* 5. THREE BEHAVIOURS (Interactive Initiative Spectrum) */}
      <section id="behaviours" className="bg-background relative overflow-hidden">
        <div className="container mx-auto px-4 border-l border-r border-border p-0">
          
          {/* Section Header */}
          <div className="p-8 md:p-14 border-b border-border flex flex-col md:flex-row md:items-end justify-between gap-6 bg-card/20">
            <div>
              <span className="text-primary text-xs font-semibold tracking-wider uppercase mb-3 block">
                04 // Initiative Spectrum Comparison
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium text-foreground tracking-tight">
                Three behaviours. <span className="text-foreground/40">One machine. Different ownership.</span>
              </h2>
            </div>
            <div className="max-w-md">
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                The bicycle frame, tool set, and hoist movement capabilities stayed identical across all trials. The experimental variable was initiative ownership.
              </p>
              <div className="w-12 h-1 bg-primary mt-4 rounded-[4px]" />
            </div>
          </div>

          {/* 3-Column Interactive Selector Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border border-b border-border">
            {modes.map((item) => {
              const isSelected = activeMode === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setActiveMode(item.key)}
                  className={`p-8 md:p-12 text-left transition-all cursor-pointer flex flex-col justify-between h-[360px] relative group ${
                    isSelected ? "bg-primary/10 border-b-4 border-b-primary" : "hover:bg-foreground/[0.02]"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className={`w-12 h-12 rounded-[4px] flex items-center justify-center transition-colors ${
                        isSelected ? "bg-primary text-primary-foreground" : "bg-foreground/5 text-primary"
                      }`}>
                        <ModeIcon mode={item.key} />
                      </div>
                      <span className={`text-[10px] font-mono font-bold tracking-widest uppercase px-2.5 py-1 rounded-[4px] ${
                        isSelected ? "bg-primary text-primary-foreground" : "bg-foreground/5 text-muted-foreground"
                      }`}>
                        {item.label}
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">{item.name}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                      {item.description}
                    </p>
                  </div>

                  <div>
                    <div className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">{item.micro}</div>
                    <div className="text-xs text-primary font-mono mt-1">Click to inspect empirical metrics</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Mode Detail Panel */}
          <div className="p-8 md:p-12 border-b border-border bg-card/10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-8 flex items-start gap-4">
                <div className="w-12 h-12 rounded-[4px] bg-primary text-primary-foreground flex items-center justify-center shrink-0 mt-1">
                  <ModeIcon mode={mode.key} />
                </div>
                <div>
                  <span className="text-xs font-mono uppercase text-primary font-bold tracking-wider block mb-1">
                    Empirical Finding for {mode.name} ({mode.label})
                  </span>
                  <p className="text-base sm:text-lg text-foreground font-light leading-relaxed">
                    {mode.insight}
                  </p>
                </div>
              </div>

              <div className="lg:col-span-4 flex items-center justify-end gap-3">
                <div className="px-5 py-4 rounded-[4px] border border-border bg-card text-center min-w-[120px]">
                  <span className="text-2xl font-black text-primary block">{mode.ease}</span>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Ease / 7.0 (88.6%)</span>
                </div>
                <div className="px-5 py-4 rounded-[4px] border border-border bg-card text-center min-w-[120px]">
                  <span className="text-2xl font-black text-primary block">{mode.ux}</span>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">UX Mean / 5.0</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 6. PROCESS (Methodology 6-Step Connected Grid) */}
      <section id="process" className="bg-background relative overflow-hidden">
        <div className="container mx-auto px-4 border-l border-r border-border p-0">
          
          {/* Section Header */}
          <div className="p-8 md:p-14 border-b border-border flex flex-col md:flex-row md:items-end justify-between gap-6 bg-card/20">
            <div>
              <span className="text-primary text-xs font-semibold tracking-wider uppercase mb-3 block">
                05 // Research Process & Milestones
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium text-foreground tracking-tight">
                A structured six-stage research arc.
              </h2>
            </div>
            <div className="max-w-md">
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                From factory floor observation to empirical psychometric analysis across 15 participants.
              </p>
              <div className="w-12 h-1 bg-primary mt-4 rounded-[4px]" />
            </div>
          </div>

          {/* 6-Cell Grid (3 cols x 2 rows) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 divide-border border-b border-border">
            {process.map((step, idx) => (
              <div
                key={step.number}
                className={`p-8 md:p-10 flex flex-col justify-between min-h-[280px] group hover:bg-foreground/[0.02] transition-colors border-border ${
                  idx % 3 !== 2 ? "lg:border-r" : ""
                } ${idx % 2 !== 1 ? "md:border-r lg:border-r-0" : ""} ${idx < 3 ? "border-b" : ""}`}
              >
                <div>
                  <span className="text-4xl font-light text-primary/40 group-hover:text-primary transition-colors font-mono block mb-4">
                    {step.number}
                  </span>
                  <h3 className="text-xl font-bold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.body}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. STUDY (Connected 2-Column Split) */}
      <section id="study" className="bg-background relative overflow-hidden">
        <div className="container mx-auto px-4 border-l border-r border-border p-0">
          
          {/* Section Header */}
          <div className="p-8 md:p-14 border-b border-border flex flex-col md:flex-row md:items-end justify-between gap-6 bg-card/20">
            <div>
              <span className="text-primary text-xs font-semibold tracking-wider uppercase mb-3 block">
                06 // Experimental Evaluation
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium text-foreground tracking-tight">
                A 45-minute XR shift, <span className="text-foreground/40">designed for direct comparison.</span>
              </h2>
            </div>
            <div className="max-w-md">
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                Every participant experienced all three behaviours in a counterbalanced order and performed the same standardized assembly task set under each condition.
              </p>
              <div className="w-12 h-1 bg-primary mt-4 rounded-[4px]" />
            </div>
          </div>

          {/* Study Body Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-border border-b border-border">
            
            {/* Left Column (6 cols): Visual */}
            <div className="lg:col-span-6 p-8 md:p-12">
              <ProjectImage
                src="/images/lift-me-up/study-setup.webp"
                alt="Lift Me Up participant study setup"
                label="Empirical Evaluation Setup · Within-subject Wizard of Oz testing with 15 complete participants at UTwente Interaction Technology Lab"
              />
            </div>

            {/* Right Column (6 cols): Metric Rows */}
            <div className="lg:col-span-6 divide-y divide-border">
              {[
                ["15", "Complete participants in the analysed dataset", "N=15 within-subject cohort"],
                ["3", "Behaviours experienced by every participant", "Counterbalanced condition order"],
                ["3", "Standardized assembly tasks in each condition", "Attach Battery, Screw Sequence, Cage Access"],
                ["Mixed", "Triangulated empirical psychometrics", "NASA-TLX, ease ratings (1–7), rankings (1–3), & qualitative interviews"],
              ].map(([val, title, sub]) => (
                <div key={title} className="p-6 md:p-8 flex items-center gap-6 group hover:bg-foreground/[0.02] transition-colors">
                  <span className="text-3xl md:text-4xl font-black text-primary font-mono shrink-0 w-20 text-center">
                    {val}
                  </span>
                  <div>
                    <h4 className="text-base font-semibold text-foreground">{title}</h4>
                    <span className="text-xs text-muted-foreground">{sub}</span>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* 8. RESULTS (Visual Climax with 80% Angle Gauge) */}
      <section id="results" className="bg-background relative overflow-hidden">
        <div className="container mx-auto px-4 border-l border-r border-border p-0">
          
          {/* Section Header */}
          <div className="p-8 md:p-14 border-b border-border flex flex-col md:flex-row md:items-end justify-between gap-6 bg-card/20">
            <div>
              <span className="text-primary text-xs font-semibold tracking-wider uppercase mb-3 block">
                07 // Empirical Validation & Findings
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium text-foreground tracking-tight">
                Voice won overall. <span className="text-foreground/40">The edge cases are where autonomy becomes interesting.</span>
              </h2>
            </div>
            <div className="max-w-md">
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                Voice was the overwhelming global preference, but task-specific distribution reveals why adopting a single static autonomy level is the wrong conclusion.
              </p>
              <div className="w-12 h-1 bg-primary mt-4 rounded-[4px]" />
            </div>
          </div>

          {/* Results Top 2-Column Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-border border-b border-border">
            
            {/* 13 of 14 Box (5 cols) */}
            <div className="lg:col-span-5 p-8 md:p-14 flex flex-col justify-between bg-primary/5">
              <div>
                <span className="text-xs font-mono uppercase text-primary font-bold tracking-wider block mb-2">
                  Overall Ranking Preference
                </span>
                <div className="text-7xl sm:text-8xl md:text-9xl font-black text-primary tracking-tight leading-none my-4">
                  13
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-foreground">of 14 participants (93%)</div>
                <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
                  Thirteen of fourteen participants who completed the final forced ranking placed <strong className="text-foreground font-medium">Voice</strong> first overall. One placed Semi-Automatic first. Zero placed Nudge first.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 border-t border-border pt-6 mt-8 text-center">
                {modes.map((item) => (
                  <div key={item.key} className="p-3 rounded-[4px] border border-border bg-card">
                    <span className="text-2xl font-black text-foreground block">{item.overallFirst}</span>
                    <span className="text-[10px] text-muted-foreground font-mono uppercase">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Ease of Use Bars (7 cols) */}
            <div className="lg:col-span-7 p-8 md:p-14 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <span className="text-xs font-mono uppercase text-muted-foreground font-bold tracking-wider block mb-1">
                      Ease of Use Comparison
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-bold text-foreground">
                      Same machine, very different experience
                    </h3>
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">Scale 1 to 7</span>
                </div>

                <div className="space-y-6">
                  {modes.map((item) => {
                    const percent = Math.round((item.ease / easeMax) * 100);
                    return (
                      <div key={item.key} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-semibold text-foreground">{item.name} ({item.label})</span>
                          <span className="font-mono text-primary font-bold">{item.ease} / 7.0 <span className="text-xs text-muted-foreground font-normal">({percent}%)</span></span>
                        </div>
                        <div className="h-2.5 overflow-hidden rounded-[4px] bg-foreground/10">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${(item.ease / easeMax) * 100}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.85, ease: "easeOut" }}
                            className="h-full rounded-[4px] bg-primary"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-4 rounded-[4px] bg-card border border-border text-xs text-muted-foreground leading-relaxed mt-8">
                The largest statistically meaningful effect was overall ease: Voice at <strong className="text-foreground">6.2 (88.6%)</strong>, Nudge at <strong className="text-foreground">4.4 (62.8%)</strong>, and Semi-Automatic at <strong className="text-foreground">4.0 (57.1%)</strong>. Composite UX means mirrored this pattern: Voice 4.37, Nudge 3.37, Semi-Auto 3.00.
              </div>
            </div>

          </div>

          {/* Task-Specific Preference Bars (3-Column Connected Grid) */}
          <div className="p-6 md:p-10 border-b border-border bg-card/10">
            <div className="max-w-4xl mb-6">
              <span className="text-xs font-mono uppercase text-primary font-bold tracking-wider block mb-1">
                Core Discovery: Situational Autonomy
              </span>
              <p className="text-base sm:text-lg font-medium text-foreground">
                Voice wins globally, but autonomy becomes significantly more desirable as the physical reach problem becomes harder.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {tasks.map((task) => (
                <div key={task.name} className="p-6 rounded-[4px] border border-border bg-card flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-primary uppercase block mb-1">
                      {task.short}
                    </span>
                    <h4 className="text-xl font-bold text-foreground mb-2">{task.name}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-6 min-h-[48px]">
                      {task.why}
                    </p>
                  </div>

                  <div className="space-y-2.5 border-t border-border pt-4">
                    <ResultBar label="Voice" value={task.voice} />
                    <ResultBar label="Nudge" value={task.nudge} />
                    <ResultBar label="Semi Auto" value={task.semi} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Perceived Control Grid with 80% Angle Gauge */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border border-b border-border">
            <div className="p-8 md:p-12 group hover:bg-foreground/[0.02] transition-colors">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-[4px] bg-primary/10 text-primary flex items-center justify-center">
                  <Hand size={24} />
                </div>
                <PercentageAngleGauge percentage={80} label="Voice Control Majority" />
              </div>
              <div className="text-5xl font-black text-primary tracking-tight mb-2">11 / 14 <span className="text-2xl font-mono text-muted-foreground font-normal">(~80%)</span></div>
              <h4 className="text-xl font-bold text-foreground mb-2">felt most in control with Voice</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Workers value unconditional predictability. Direct commands create a transparent cause-and-effect relationship without unexpected machine movements.
              </p>
            </div>

            <div className="p-8 md:p-12 group hover:bg-foreground/[0.02] transition-colors">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-[4px] bg-destructive/10 text-destructive flex items-center justify-center">
                  <CircleStop size={24} />
                </div>
                <div className="px-3.5 py-1.5 rounded-[4px] border border-destructive/30 bg-destructive/10">
                  <span className="font-mono text-xs font-bold text-destructive">71.4% LEAST CONTROL</span>
                </div>
              </div>
              <div className="text-5xl font-black text-destructive tracking-tight mb-2">10 / 14 <span className="text-2xl font-mono text-muted-foreground font-normal">(71.4%)</span></div>
              <h4 className="text-xl font-bold text-foreground mb-2">felt least in control with Semi-Automatic</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Proactive machine movements, even when objectively moving toward the golden zone, induced momentary anxiety when unannounced.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 9. DESIGN PRINCIPLES (Connected Full-Width Rows) */}
      <section id="principles" className="bg-background relative overflow-hidden">
        <div className="container mx-auto px-4 border-l border-r border-border p-0">
          
          {/* Section Header */}
          <div className="p-8 md:p-14 border-b border-border flex flex-col md:flex-row md:items-end justify-between gap-6 bg-card/20">
            <div>
              <span className="text-primary text-xs font-semibold tracking-wider uppercase mb-3 block">
                08 // Actionable Heuristics
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium text-foreground tracking-tight">
                Do not make the machine less capable. <span className="text-foreground/40">Make its capability negotiable.</span>
              </h2>
            </div>
            <div className="max-w-md">
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                Five operational design principles derived directly from worker cadence, observation, and telemetry.
              </p>
              <div className="w-12 h-1 bg-primary mt-4 rounded-[4px]" />
            </div>
          </div>

          {/* 5 Connected Rows */}
          <div className="divide-y divide-border border-b border-border">
            {recommendations.map((rec, idx) => (
              <div
                key={rec.title}
                className="p-8 md:p-12 flex flex-col sm:flex-row sm:items-center justify-between gap-6 group hover:bg-foreground/[0.02] transition-colors"
              >
                <div className="flex items-start sm:items-center gap-6">
                  <span className="text-2xl font-light text-primary font-mono shrink-0 w-10">
                    0{idx + 1}
                  </span>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-1.5">{rec.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-4xl">
                      {rec.body}
                    </p>
                  </div>
                </div>
                <div className="hidden sm:block text-muted-foreground/40 group-hover:text-primary transition-colors">
                  <ChevronRight size={20} />
                </div>
              </div>
            ))}
          </div>

          {/* Callout Line */}
          <div className="p-8 text-center border-b border-border bg-primary/5">
            <span className="text-lg sm:text-xl font-mono font-bold text-primary tracking-wider">
              &quot;Detection is not permission.&quot;
            </span>
          </div>

        </div>
      </section>

      {/* 10. REFLECTION & LIMITATIONS (Connected 3-Column Grid) */}
      <section id="reflection" className="bg-background relative overflow-hidden">
        <div className="container mx-auto px-4 border-l border-r border-border p-0">
          
          {/* Section Header */}
          <div className="p-8 md:p-14 border-b border-border flex flex-col md:flex-row md:items-end justify-between gap-6 bg-card/20">
            <div>
              <span className="text-primary text-xs font-semibold tracking-wider uppercase mb-3 block">
                09 // Reflection & Next Steps
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium text-foreground tracking-tight">
                What I would carry into the next prototype.
              </h2>
            </div>
            <div className="max-w-md">
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                Recognizing the boundaries of the experimental testbed and charting the path toward physical factory deployment.
              </p>
              <div className="w-12 h-1 bg-primary mt-4 rounded-[4px]" />
            </div>
          </div>

          {/* 3-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border border-b border-border">
            
            <div className="p-8 md:p-10 group hover:bg-foreground/[0.02] transition-colors">
              <div className="w-10 h-10 rounded-[4px] bg-primary/10 text-primary flex items-center justify-center mb-4">
                <Headphones size={20} />
              </div>
              <h4 className="text-lg font-bold text-foreground mb-2">Input Modalities Under Shop Noise</h4>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                The next iteration should keep the worker-initiated model constant and vary the input channel between voice commands, a tactile thumb controller, and bare hand spatial gestures under real factory acoustics (75–85 dB).
              </p>
            </div>

            <div className="p-8 md:p-10 group hover:bg-foreground/[0.02] transition-colors">
              <div className="w-10 h-10 rounded-[4px] bg-primary/10 text-primary flex items-center justify-center mb-4">
                <Timer size={20} />
              </div>
              <h4 className="text-lg font-bold text-foreground mb-2">Engineer Situational Autonomy</h4>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Semi-Automatic demonstrated its highest preference during the hardest reach task (Cage Access). This proves autonomy should dynamically ramp up when postural reach exceeds thresholds, and seamlessly return to manual veto during fine alignment.
              </p>
            </div>

            <div className="p-8 md:p-10 group hover:bg-foreground/[0.02] transition-colors">
              <div className="w-10 h-10 rounded-[4px] bg-primary/10 text-primary flex items-center justify-center mb-4">
                <ShieldCheck size={20} />
              </div>
              <h4 className="text-lg font-bold text-foreground mb-2">Boundaries of Evidence</h4>
              <div className="space-y-2 mt-3">
                {limitations.map((lim, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-[4px] bg-primary shrink-0 mt-1.5" />
                    <span>{lim}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 11. CLOSING STATEMENT BANNER */}
      <section className="bg-background relative overflow-hidden border-b border-border">
        <div className="container mx-auto px-4 border-l border-r border-border p-0">
          
          <div className="p-10 sm:p-16 md:p-20 text-center flex flex-col items-center justify-center bg-card/40">
            <span className="text-xs font-mono uppercase text-primary font-bold tracking-widest mb-4">
              Case Study Takeaway
            </span>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground max-w-4xl leading-tight mb-8">
              &quot;The best autonomous behaviour is not the one that acts most. It is the one that knows when to ask.&quot;
            </h2>

            <Link
              href="/#work"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-[4px] bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider hover:opacity-90 transition-all shadow-lg shadow-primary/20"
            >
              <span>Back to Portfolio</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>

        </div>
      </section>

      {/* GLOBAL FOOTER */}
      <Footer />
    </main>
  );
}

export default LiftMeUpCaseStudy;
