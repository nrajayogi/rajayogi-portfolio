"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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
  ShieldCheck,
  Activity,
  Sliders,
  Radio,
  ArrowDown,
  Layers,
  FileText,
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

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

const easeMax = 7;

const spring = {
  type: "spring" as const,
  stiffness: 160,
  damping: 24,
};

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#b8ff73]">
      <span className="h-[1px] w-7 bg-[#b8ff73]/70" />
      {children}
    </div>
  );
}

function SectionTitle({
  children,
  note,
}: {
  children: React.ReactNode;
  note?: string;
}) {
  return (
    <div className="max-w-4xl">
      <h2 className="text-balance text-[clamp(2.4rem,5.5vw,5.8rem)] font-black leading-[0.92] tracking-[-0.065em]">
        {children}
      </h2>
      {note && (
        <p className="mt-7 max-w-2xl text-lg leading-8 text-white/60">{note}</p>
      )}
    </div>
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
      className={cx(
        "group relative overflow-hidden rounded-[28px] border border-white/10 bg-[#0c120c]",
        tall ? "aspect-[4/5]" : "aspect-[16/10]"
      )}
    >
      {!hasError ? (
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]"
          onError={() => setHasError(true)}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
          <div className="max-w-xs rounded-2xl border border-white/10 bg-black/50 p-5 text-sm leading-6 text-white/55 backdrop-blur-xl">
            <span>{alt}</span>
            <div className="mt-2 font-mono text-[11px] text-[#b8ff73]/75">
              {src}
            </div>
          </div>
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(184,255,115,0.15),transparent_40%),linear-gradient(145deg,rgba(255,255,255,0.06),transparent_60%)]" />
      <figcaption className="absolute inset-x-4 bottom-4 z-10 rounded-2xl border border-white/10 bg-black/60 px-4 py-3 text-xs leading-relaxed text-white/75 backdrop-blur-xl">
        {label}
      </figcaption>
    </figure>
  );
}

function Metric({
  number,
  label,
  detail,
}: {
  number: string;
  label: string;
  detail?: string;
}) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/[0.035] p-5 transition hover:border-[#b8ff73]/30 hover:bg-white/[0.05]">
      <div className="text-4xl font-black tracking-[-0.055em] text-[#d9ffb2]">
        {number}
      </div>
      <div className="mt-2 text-sm font-semibold text-white/85">{label}</div>
      {detail && <div className="mt-1 text-xs leading-5 text-white/40">{detail}</div>}
    </div>
  );
}

function ModeIcon({ mode }: { mode: ModeKey }) {
  if (mode === "voice") return <AudioLines className="h-6 w-6" />;
  if (mode === "nudge") return <Sparkles className="h-6 w-6" />;
  return <BrainCircuit className="h-6 w-6" />;
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
  return (
    <div className="grid grid-cols-[92px_1fr_34px] items-center gap-3">
      <span className="text-xs text-white/50">{label}</span>
      <div className="h-2.5 overflow-hidden rounded-full bg-white/8">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${(value / max) * 100}%` }}
          viewport={{ once: true, amount: 0.7 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="h-full rounded-full bg-[#b8ff73]"
        />
      </div>
      <span className="text-right font-mono text-xs text-white/70">{value}</span>
    </div>
  );
}

function ChapterRail() {
  return (
    <aside className="fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 xl:block">
      <nav aria-label="Case study navigation" className="rounded-2xl border border-white/10 bg-black/40 p-2 backdrop-blur-xl">
        {nav.map(([number, name, id]) => (
          <a
            key={id}
            href={`#${id}`}
            className="group flex items-center gap-2 rounded-xl px-3 py-2 text-[11px] text-white/40 transition hover:bg-white/5 hover:text-white"
          >
            <span className="font-mono text-[#b8ff73]/80">{number}</span>
            <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-300 group-hover:max-w-28 group-hover:opacity-100">
              {name}
            </span>
          </a>
        ))}
      </nav>
    </aside>
  );
}

// Redrawn, interactive native System Architecture Flowchart
function RedrawnSystemArchitecture() {
  const steps = [
    {
      num: "01",
      title: "Tracking Input",
      desc: "Headset pose (6DoF), eye gaze dwell vectors & dual 6DoF hand tracking",
      tag: "SENSE",
    },
    {
      num: "02",
      title: "Worker Calibration",
      desc: "Individual arm span, standing baseline elbow height & eye level offsets",
      tag: "CALIBRATE",
    },
    {
      num: "03",
      title: "Golden Zone & Ergonomics",
      desc: "Live reach sphere computation (±15° cervical tilt, 90° neutral elbow envelope)",
      tag: "REASON",
    },
    {
      num: "04",
      title: "Initiative Behaviour Layer",
      desc: "Voice ('I decide') · Nudge ('We decide') · Semi-Auto ('It decides')",
      tag: "AGENCY",
    },
    {
      num: "05",
      title: "Hoist Movement Model",
      desc: "Velocity damping, smooth vertical translation & spatial collision bounds",
      tag: "ACT",
    },
    {
      num: "06",
      title: "Worker Feedback",
      desc: "Holographic trajectory preview ghost, audio confirm chime & visual bounds",
      tag: "TRANSPARENCY",
    },
    {
      num: "07",
      title: "Study Logging",
      desc: "Task completion time, dwell metrics, override timestamps & psychometrics",
      tag: "EVALUATION",
    },
  ];

  return (
    <div className="rounded-[30px] border border-white/10 bg-[#090d09] p-6 sm:p-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-5 mb-6">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-widest text-[#b8ff73] uppercase">
            Redrawn System Architecture
          </span>
          <h4 className="text-xl font-bold text-white tracking-tight mt-1">
            Autonomous Hoist Behaviour Pipeline
          </h4>
        </div>
        <span className="text-xs text-white/40 font-mono">
          Unity XR · C# · OpenXR Runtime
        </span>
      </div>

      <div className="grid gap-3">
        {steps.map((s, idx) => (
          <div
            key={s.num}
            className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-white/8 bg-white/[0.02] p-4 transition-all hover:border-[#b8ff73]/40 hover:bg-white/[0.04]"
          >
            <div className="flex items-center gap-3.5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#b8ff73]/10 font-mono text-xs font-bold text-[#b8ff73]">
                {s.num}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h5 className="text-sm font-bold text-white">{s.title}</h5>
                  <span className="rounded-md bg-white/5 px-2 py-0.5 text-[9px] font-mono tracking-wider text-white/50">
                    {s.tag}
                  </span>
                </div>
                <p className="text-xs text-white/55 mt-0.5">{s.desc}</p>
              </div>
            </div>

            {idx < steps.length - 1 && (
              <div className="hidden sm:block text-white/20 group-hover:text-[#b8ff73]/50 transition-colors">
                <ArrowDown size={14} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function LiftMeUpCaseStudy() {
  const [activeMode, setActiveMode] = useState<ModeKey>("voice");

  const mode = useMemo(
    () => modes.find((item) => item.key === activeMode) ?? modes[0],
    [activeMode]
  );

  return (
    <div className="relative min-h-screen bg-[#060806] text-white selection:bg-[#b8ff73] selection:text-black font-sans">
      <ChapterRail />

      {/* Ambient background glow & technical grid */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute left-[18%] top-[-8rem] h-[42rem] w-[42rem] rounded-full bg-[#86ff5a]/10 blur-[150px]" />
        <div className="absolute bottom-[-15rem] right-[-10rem] h-[38rem] w-[38rem] rounded-full bg-emerald-400/10 blur-[160px]" />
        <div className="absolute inset-0 opacity-[0.22] [background-image:linear-gradient(rgba(255,255,255,.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.045)_1px,transparent_1px)] [background-size:68px_68px] [mask-image:radial-gradient(circle_at_center,black,transparent_82%)]" />
      </div>

      {/* Top back breadcrumb link */}
      <header className="relative z-20 mx-auto max-w-[1500px] px-5 pt-8 sm:px-8 lg:px-14">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <Link
            href="/#work"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white/50 transition hover:text-[#b8ff73]"
          >
            <ArrowUpRight className="h-4 w-4 rotate-[-135deg]" />
            <span>Back to Portfolio</span>
          </Link>
          <div className="flex items-center gap-2 text-xs font-mono text-white/40">
            <span>M.SC. THESIS</span>
            <span className="text-white/20">/</span>
            <span className="text-[#b8ff73]">LIFT ME UP</span>
          </div>
        </div>
      </header>

      {/* 1. HERO SECTION */}
      <section className="relative z-10 mx-auto flex min-h-[90svh] max-w-[1500px] items-center px-5 py-16 sm:px-8 lg:px-14">
        <div className="grid w-full gap-12 lg:grid-cols-[1.06fr_.94fr] lg:items-end">
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#b8ff73]/20 bg-[#b8ff73]/8 px-4 py-2 text-xs font-medium text-[#d8ffb3]">
              <ScanLine className="h-4 w-4" />
              <span>{projectMeta.kicker}</span>
            </div>

            <h1 className="max-w-5xl text-[clamp(4.2rem,10vw,9.5rem)] font-black leading-[0.78] tracking-[-0.09em] text-white">
              Lift
              <br />
              Me Up
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-white/70 sm:text-2xl sm:leading-9 font-light">
              {projectMeta.subtitle}
            </p>

            <div className="mt-8 flex flex-wrap gap-2 text-xs text-white/50">
              {projectMeta.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 bg-white/[0.025] px-3.5 py-1.5 font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>

            <a
              href="#context"
              className="mt-10 inline-flex items-center gap-3 text-sm font-semibold text-[#d9ffb2] hover:text-[#b8ff73] transition-colors"
            >
              Explore the case study
              <ArrowDownRight className="h-4 w-4" />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="relative"
          >
            <div className="absolute -inset-10 rounded-[60px] bg-[#b8ff73]/8 blur-3xl" />
            <div className="relative rounded-[36px] border border-white/10 bg-white/[0.035] p-3 shadow-2xl shadow-black/80 backdrop-blur-xl">
              <ProjectImage
                src="/images/lift-me-up/hero-xr.webp"
                alt="XR autonomous hoist prototype simulation"
                label="XR Headset Simulation · Cargo bicycle frame suspended in golden zone testbed at University of Twente"
                tall
              />
            </div>

            <div className="absolute -bottom-5 -left-5 hidden rounded-2xl border border-white/10 bg-black/80 p-4 shadow-xl backdrop-blur-xl sm:block">
              <div className="text-3xl font-black tracking-[-0.06em] text-[#b8ff73]">
                13 / 14
              </div>
              <div className="mt-1 text-xs text-white/50 font-medium">
                ranked Voice first overall
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* METRICS ROW */}
      <section className="relative z-10 mx-auto max-w-[1500px] px-5 pb-16 sm:px-8 lg:px-14">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Metric number="15" label="analysed participants" detail="Within-subject experimental cohort" />
          <Metric number="3 × 3" label="behaviours × tasks" detail="Voice, Nudge & Semi-Auto conditions" />
          <Metric number="45 min" label="session length" detail="Full Wizard of Oz study protocol" />
          <Metric number="6.2 / 7" label="Voice overall ease" detail="Compared to 4.4 Nudge & 4.0 Semi-Auto" />
        </div>
      </section>

      {/* 2. CONTEXT */}
      <section
        id="context"
        className="relative z-10 mx-auto max-w-[1500px] scroll-mt-24 px-5 py-24 sm:px-8 lg:px-14 border-t border-white/10"
      >
        <Eyebrow>01 · Context</Eyebrow>
        <div className="grid gap-14 lg:grid-cols-[.9fr_1.1fr] lg:items-start">
          <SectionTitle>
            The hoist lifted the frame.
            <span className="text-white/28"> The worker still carried the decision burden.</span>
          </SectionTitle>

          <div className="space-y-7 text-lg leading-8 text-white/65 font-light">
            <p>
              At <strong className="text-white font-medium">Van Raam</strong>, operators assemble large, highly customised adapted bicycles using a ceiling mounted hoist. The hoist relieves lifting weight, but the operator still has to continuously decide where the frame should be positioned while performing high-dexterity assembly work.
            </p>
            <p>
              A frame held too high, too low, or at the wrong orientation repeatedly forces the worker outside the ergonomic <strong className="text-[#d9ffb2] font-medium">&quot;golden zone&quot;</strong>. This postural strain accumulates silently across hundreds of micro-adjustments rather than appearing as a single dramatic failure.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-6">
                <PersonStanding className="h-6 w-6 text-[#b8ff73]" />
                <h3 className="mt-4 text-xl font-bold tracking-[-0.04em] text-white">Human need</h3>
                <p className="mt-2 text-sm leading-6 text-white/55">
                  Keep reach posture inside the comfortable golden zone without dividing attention away from complex mechanical assembly.
                </p>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-6">
                <Factory className="h-6 w-6 text-[#b8ff73]" />
                <h3 className="mt-4 text-xl font-bold tracking-[-0.04em] text-white">System opportunity</h3>
                <p className="mt-2 text-sm leading-6 text-white/55">
                  Enable the hoist to sense posture, anticipate assembly targets, and collaborate proactively while strictly preserving worker authority.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. RESEARCH QUESTION */}
      <section
        id="question"
        className="relative z-10 mx-auto max-w-[1500px] scroll-mt-24 px-5 py-24 sm:px-8 lg:px-14"
      >
        <div className="rounded-[36px] border border-[#b8ff73]/20 bg-[#b8ff73]/[0.065] p-7 sm:p-12 lg:p-16">
          <Eyebrow>02 · Research question</Eyebrow>
          <div className="grid gap-10 lg:grid-cols-[1.1fr_.9fr] lg:items-end">
            <h2 className="text-balance text-[clamp(2.5rem,6vw,6.2rem)] font-black leading-[0.92] tracking-[-0.07em] text-white">
              How can an autonomous hoist help workers work in the golden zone?
            </h2>
            <div className="space-y-5 text-lg leading-8 text-white/70 font-light">
              <p>
                I broke the research problem into three fundamental interaction dimensions:
              </p>
              <ul className="space-y-2 text-sm text-white/80 font-mono">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#b8ff73]" />
                  <span>1. Cue &amp; Modality (How intent is communicated)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#b8ff73]" />
                  <span>2. Timing (When movement proposals occur)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#b8ff73]" />
                  <span>3. Authority &amp; Control Preservation (Who retains the veto)</span>
                </li>
              </ul>
              <p className="text-[#d9ffb2] font-medium text-base pt-2">
                The artifact being designed was not merely a 3D interface overlay. It was the behavioural contract between a human worker and a motorized machine.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SYSTEM & ARCHITECTURE */}
      <section
        id="system"
        className="relative z-10 mx-auto max-w-[1500px] scroll-mt-24 px-5 py-24 sm:px-8 lg:px-14 border-t border-white/10"
      >
        <Eyebrow>03 · System</Eyebrow>
        <SectionTitle note="Extended Reality (XR) was chosen as a safety sandbox. Iterating on a physical suspended payload in a live factory is dangerous and costly; XR let the interaction fail harmlessly in software first.">
          From posture theory
          <span className="text-white/28"> to a system people could step inside.</span>
        </SectionTitle>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
          <RedrawnSystemArchitecture />

          <div className="grid gap-5">
            {[
              {
                icon: Eye,
                title: "Sense",
                body: "6DoF headset tracking and spatial calibration make operator posture, eye-level reach, and torso inclination legible in real time.",
              },
              {
                icon: Move3D,
                title: "Reason",
                body: "Golden zone classification converts musculoskeletal comfort from a retrospective medical diagnosis into an active spatial control vector.",
              },
              {
                icon: Workflow,
                title: "Act",
                body: "Different initiative structures (Voice, Nudge, Semi-Auto) route through a unified kinematic hoist model with soft velocity damping.",
              },
            ].map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6 transition hover:border-[#b8ff73]/30"
              >
                <Icon className="h-6 w-6 text-[#b8ff73]" />
                <h3 className="mt-4 text-2xl font-black tracking-[-0.05em] text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/55 font-light">{body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <ProjectImage
            src="/images/lift-me-up/golden-zone.webp"
            alt="Golden zone biomechanical tracking"
            label="Biomechanical Mapping · Converting joint angles and arm reach into a 3D Golden Zone target envelope"
          />
          <ProjectImage
            src="/images/lift-me-up/prototype-evolution.webp"
            alt="Prototype evolution from virtual cell to mixed reality"
            label="Prototype Sandbox · Digital twin iterative progression from CAD assembly to immersive participant testing"
          />
        </div>
      </section>

      {/* 5. THREE BEHAVIOURS (INTERACTIVE) */}
      <section
        id="behaviours"
        className="relative z-10 mx-auto max-w-[1500px] scroll-mt-24 px-5 py-24 sm:px-8 lg:px-14 border-t border-white/10"
      >
        <Eyebrow>04 · Behaviours</Eyebrow>
        <SectionTitle note="The physical frame, tool set, and hoist movement capabilities remained identical across all trials. The sole experimental variable was the initiative structure.">
          Three behaviours.
          <span className="text-white/28"> One machine. Different ownership.</span>
        </SectionTitle>

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {modes.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setActiveMode(item.key)}
              className={cx(
                "group rounded-[30px] border p-7 text-left transition duration-300 cursor-pointer",
                activeMode === item.key
                  ? "border-[#b8ff73] bg-[#b8ff73] text-[#071007] shadow-xl shadow-[#b8ff73]/10"
                  : "border-white/10 bg-white/[0.03] hover:border-[#b8ff73]/40 hover:bg-white/[0.055]"
              )}
            >
              <div className="flex items-center justify-between">
                <div
                  className={cx(
                    "rounded-full p-3 transition-colors",
                    activeMode === item.key
                      ? "bg-[#071007] text-[#b8ff73]"
                      : "bg-[#b8ff73]/10 text-[#b8ff73]"
                  )}
                >
                  <ModeIcon mode={item.key} />
                </div>
                <ArrowUpRight className={cx("h-5 w-5 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5", activeMode === item.key ? "opacity-70" : "opacity-35")} />
              </div>

              <div
                className={cx(
                  "mt-7 text-[10px] font-semibold uppercase tracking-[0.24em]",
                  activeMode === item.key ? "text-black/60" : "text-white/40"
                )}
              >
                {item.label}
              </div>
              <h3 className="mt-2 text-3xl font-black tracking-[-0.055em]">{item.name}</h3>
              <p
                className={cx(
                  "mt-3 min-h-20 text-sm leading-6 font-light",
                  activeMode === item.key ? "text-black/75" : "text-white/55"
                )}
              >
                {item.description}
              </p>
              <div className="mt-6 text-4xl font-black tracking-[-0.07em]">{item.micro}</div>
            </button>
          ))}
        </div>

        <motion.div
          layout
          transition={spring}
          className="mt-5 grid gap-5 rounded-[30px] border border-white/10 bg-white/[0.035] p-6 sm:grid-cols-[auto_1fr_auto] sm:items-center"
        >
          <div className="grid h-14 w-14 place-items-center rounded-full bg-[#b8ff73] text-black shrink-0">
            <ModeIcon mode={mode.key} />
          </div>
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-white/40">
              Insight for {mode.name}
            </div>
            <p className="mt-1.5 max-w-3xl text-base sm:text-lg leading-7 text-white/80 font-light">
              {mode.insight}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 shrink-0">
            <div className="rounded-2xl bg-white/5 px-4 py-3 text-center">
              <div className="text-2xl font-black text-[#d9ffb2]">{mode.ease}</div>
              <div className="text-[9px] uppercase tracking-[0.18em] text-white/40">
                ease / 7
              </div>
            </div>
            <div className="rounded-2xl bg-white/5 px-4 py-3 text-center">
              <div className="text-2xl font-black text-[#d9ffb2]">{mode.ux}</div>
              <div className="text-[9px] uppercase tracking-[0.18em] text-white/40">
                UX mean / 5
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 6. PROCESS */}
      <section className="relative z-10 mx-auto max-w-[1500px] px-5 py-24 sm:px-8 lg:px-14 border-t border-white/10">
        <Eyebrow>Process</Eyebrow>
        <SectionTitle note="From factory floor observations to psychometric user evaluation: six structured research milestones.">
          A disciplined research arc.
        </SectionTitle>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {process.map((item) => (
            <motion.article
              key={item.number}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55 }}
              className="min-h-[240px] rounded-[28px] border border-white/10 bg-white/[0.028] p-6 transition hover:border-[#b8ff73]/30 hover:bg-white/[0.04]"
            >
              <div className="font-mono text-xs font-bold text-[#b8ff73]">{item.number}</div>
              <h3 className="mt-8 text-2xl font-black leading-7 tracking-[-0.05em] text-white">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-white/55 font-light">{item.body}</p>
            </motion.article>
          ))}
        </div>
      </section>

      {/* 7. STUDY */}
      <section
        id="study"
        className="relative z-10 mx-auto max-w-[1500px] scroll-mt-24 px-5 py-24 sm:px-8 lg:px-14 border-t border-white/10"
      >
        <Eyebrow>05 · Study</Eyebrow>
        <div className="grid gap-14 lg:grid-cols-[.85fr_1.15fr]">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <SectionTitle note="Every participant experienced all three behaviours in a counterbalanced order and performed the exact same standardized assembly task set under each condition.">
              A 45 minute XR shift,
              <span className="text-white/28"> designed for direct comparison.</span>
            </SectionTitle>
          </div>

          <div className="space-y-5">
            <ProjectImage
              src="/images/lift-me-up/study-setup.webp"
              alt="Lift Me Up participant study setup"
              label="Empirical Evaluation Setup · Within-subject Wizard of Oz testing with 15 complete participants at UTwente Interaction Technology Lab"
            />

            {[
              ["15", "complete participants in the analysed dataset"],
              ["3", "behaviours experienced counterbalanced by every participant"],
              ["3", "standardized bicycle assembly tasks repeated in every condition"],
              ["Mixed", "ratings (1–7), rankings (1–3), observations & qualitative feedback"],
            ].map(([value, label]) => (
              <div
                key={label}
                className="grid grid-cols-[80px_1fr] items-center rounded-[22px] border border-white/10 bg-white/[0.025] px-5 py-4"
              >
                <div className="text-2xl font-black tracking-[-0.05em] text-[#b8ff73]">
                  {value}
                </div>
                <div className="text-sm text-white/60">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. RESULTS (VISUAL CLIMAX) */}
      <section
        id="results"
        className="relative z-10 mx-auto max-w-[1500px] scroll-mt-24 px-5 py-24 sm:px-8 lg:px-14 border-t border-white/10"
      >
        <Eyebrow>06 · Results</Eyebrow>
        <SectionTitle note="Voice was the overwhelming global preference, but task-specific distribution reveals why adopting a single static autonomy level is the wrong design conclusion.">
          Voice won overall.
          <span className="text-white/28"> The edge cases are where autonomy becomes interesting.</span>
        </SectionTitle>

        <div className="mt-12 grid gap-5 lg:grid-cols-[.8fr_1.2fr]">
          {/* First Block: 13 of 14 */}
          <div className="rounded-[34px] border border-[#b8ff73]/20 bg-[#b8ff73]/[0.075] p-7 sm:p-10 flex flex-col justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[#d9ffb2]/75">
                Overall ranking preference
              </div>
              <div className="mt-6 text-[clamp(4.5rem,10vw,8.5rem)] font-black leading-none tracking-[-0.09em] text-[#d9ffb2]">
                13
              </div>
              <div className="mt-1 text-3xl font-black tracking-[-0.055em] text-white">of 14</div>
              <p className="mt-5 text-sm leading-6 text-white/60 font-light">
                Thirteen of fourteen participants who completed the final forced ranking placed <strong className="text-white">Voice</strong> first overall. One placed Semi Automatic first. Zero placed Nudge first.
              </p>
            </div>

            <div className="mt-8 border-t border-white/10 pt-6">
              <div className="grid grid-cols-3 gap-3 text-center">
                {modes.map((item) => (
                  <div key={item.key} className="rounded-2xl bg-black/30 p-3">
                    <div className="text-2xl font-black text-[#d9ffb2]">
                      {item.overallFirst}
                    </div>
                    <div className="mt-1 text-[10px] text-white/50">{item.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Second Block: Ease of Use Bars */}
          <div className="rounded-[34px] border border-white/10 bg-white/[0.03] p-7 sm:p-10 flex flex-col justify-between">
            <div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.22em] text-white/40">
                    Ease of use score
                  </div>
                  <h3 className="mt-2 text-2xl sm:text-3xl font-black tracking-[-0.055em] text-white">
                    Same machine, very different experience
                  </h3>
                </div>
                <div className="text-xs text-white/40 font-mono">Scale: 1 to 7</div>
              </div>

              <div className="mt-8 space-y-6">
                {modes.map((item) => (
                  <div key={item.key}>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium text-white/70">{item.name}</span>
                      <span className="font-mono text-sm font-bold text-[#d9ffb2]">{item.ease} / 7.0</span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(item.ease / easeMax) * 100}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.85, ease: "easeOut" }}
                        className="h-full rounded-full bg-[#b8ff73]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-white/8 bg-black/30 p-5 text-xs sm:text-sm leading-6 text-white/55">
              The largest statistically meaningful effect was overall ease: Voice at <strong className="text-white">6.2</strong>, Nudge at <strong className="text-white">4.4</strong>, and Semi Automatic at <strong className="text-white">4.0</strong>. Composite UX means mirrored this pattern: Voice 4.37, Nudge 3.37, Semi-Auto 3.00.
            </div>
          </div>
        </div>

        {/* Third Block: Task-Specific Preference Bars */}
        <div className="mt-6">
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 mb-4">
            <span className="text-xs font-mono uppercase text-[#b8ff73] font-semibold tracking-wider block mb-1">
              Core Study Takeaway
            </span>
            <p className="text-base sm:text-lg font-bold text-white tracking-tight">
              Voice wins globally, but autonomy becomes significantly more desirable as the physical reach problem becomes harder.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {tasks.map((task) => (
              <article
                key={task.name}
                className="rounded-[30px] border border-white/10 bg-white/[0.028] p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#b8ff73]/80">
                    {task.short}
                  </div>
                  <h3 className="mt-2 text-2xl font-black tracking-[-0.05em] text-white">{task.name}</h3>
                  <p className="mt-3 min-h-16 text-xs sm:text-sm leading-6 text-white/50 font-light">{task.why}</p>
                </div>
                <div className="mt-6 space-y-3 border-t border-white/10 pt-5">
                  <ResultBar label="Voice" value={task.voice} />
                  <ResultBar label="Nudge" value={task.nudge} />
                  <ResultBar label="Semi Auto" value={task.semi} />
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Fourth Block: Perceived Control */}
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div className="rounded-[30px] border border-white/10 bg-white/[0.028] p-7 transition hover:border-[#b8ff73]/30">
            <Hand className="h-6 w-6 text-[#b8ff73]" />
            <div className="mt-5 text-5xl font-black tracking-[-0.07em] text-[#d9ffb2]">11 / 14</div>
            <h3 className="mt-2 text-xl font-bold tracking-[-0.04em] text-white">
              felt most in control with Voice
            </h3>
            <p className="mt-2 text-xs text-white/50 leading-relaxed">
              Workers value unconditional predictability. Direct commands create a transparent cause-and-effect relationship.
            </p>
          </div>
          <div className="rounded-[30px] border border-white/10 bg-white/[0.028] p-7 transition hover:border-rose-400/30">
            <CircleStop className="h-6 w-6 text-rose-400" />
            <div className="mt-5 text-5xl font-black tracking-[-0.07em] text-rose-300">10 / 14</div>
            <h3 className="mt-2 text-xl font-bold tracking-[-0.04em] text-white">
              felt least in control with Semi Automatic
            </h3>
            <p className="mt-2 text-xs text-white/50 leading-relaxed">
              Proactive machine movements, even when objectively moving toward the golden zone, induced momentary anxiety when unannounced.
            </p>
          </div>
        </div>
      </section>

      {/* 9. DESIGN PRINCIPLES */}
      <section
        id="principles"
        className="relative z-10 mx-auto max-w-[1500px] scroll-mt-24 px-5 py-24 sm:px-8 lg:px-14 border-t border-white/10"
      >
        <Eyebrow>07 · Design principles</Eyebrow>
        <SectionTitle note="Five operational heuristics derived directly from operator observations and quantitative telemetry.">
          Do not make the machine less capable.
          <span className="text-white/28"> Make its capability negotiable.</span>
        </SectionTitle>

        <div className="mt-12 divide-y divide-white/10 rounded-[34px] border border-white/10 bg-white/[0.028]">
          {recommendations.map((item, index) => (
            <div
              key={item.title}
              className="grid gap-5 p-6 sm:grid-cols-[70px_1fr_auto] sm:items-center sm:p-8 hover:bg-white/[0.02] transition-colors"
            >
              <div className="font-mono text-sm font-bold text-[#b8ff73]">
                0{index + 1}
              </div>
              <div>
                <h3 className="text-2xl font-black tracking-[-0.05em] text-white">{item.title}</h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-white/55 font-light">{item.body}</p>
              </div>
              <ChevronRight className="hidden h-5 w-5 text-white/20 sm:block" />
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-[#b8ff73]/20 bg-[#b8ff73]/[0.05] p-5 text-center">
          <span className="text-base sm:text-lg font-mono font-bold text-[#b8ff73] tracking-wide">
            &quot;Detection is not permission.&quot;
          </span>
        </div>
      </section>

      {/* 10. REFLECTION & NEXT STEPS */}
      <section
        id="reflection"
        className="relative z-10 mx-auto max-w-[1500px] scroll-mt-24 px-5 py-24 sm:px-8 lg:px-14 border-t border-white/10"
      >
        <div className="grid gap-12 lg:grid-cols-[.9fr_1.1fr]">
          <div>
            <Eyebrow>08 · Reflection</Eyebrow>
            <SectionTitle note="Responsible scientific communication requires recognizing the boundaries of the experimental testbed.">
              What I would carry into the next prototype.
            </SectionTitle>
          </div>

          <div className="space-y-5">
            <div className="rounded-[30px] border border-[#b8ff73]/20 bg-[#b8ff73]/[0.055] p-7">
              <Headphones className="h-6 w-6 text-[#b8ff73]" />
              <h3 className="mt-4 text-2xl font-black tracking-[-0.05em] text-white">
                Test worker commanded input under real factory constraints
              </h3>
              <p className="mt-3 text-sm leading-6 text-white/60 font-light">
                The next iteration should keep the worker-initiated agency model constant and vary the input channel between voice commands, a physical ergonomic thumb pendant, and bare hand spatial gestures.
              </p>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-white/[0.028] p-7">
              <Timer className="h-6 w-6 text-[#b8ff73]" />
              <h3 className="mt-4 text-2xl font-black tracking-[-0.05em] text-white">
                Engineer situational autonomy on purpose
              </h3>
              <p className="mt-3 text-sm leading-6 text-white/60 font-light">
                Semi-Automatic demonstrated its highest preference during the hardest physical reaching task (Cage Access). This proves autonomy should dynamically ramp up when postural reach exceeds thresholds, and seamlessly return to manual veto during fine alignment.
              </p>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-white/[0.028] p-7">
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-white/40">
                Boundaries of the evidence
              </div>
              <div className="mt-4 space-y-3">
                {limitations.map((item) => (
                  <div key={item} className="flex gap-3 text-xs sm:text-sm leading-6 text-white/55">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-[#b8ff73]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. CLOSING STATEMENT BANNER */}
      <section className="relative z-10 mx-auto max-w-[1500px] px-5 pb-24 pt-8 sm:px-8 lg:px-14">
        <div className="rounded-[38px] bg-[#b8ff73] p-8 text-[#061006] sm:p-12 lg:p-16 shadow-2xl shadow-[#b8ff73]/20">
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-black/50">
                Case study takeaway
              </div>
              <h2 className="mt-4 max-w-5xl text-[clamp(2.4rem,6vw,5.5rem)] font-black leading-[0.92] tracking-[-0.075em] text-[#061006]">
                The best autonomous behaviour is not the one that acts most.
                It is the one that knows when to ask.
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                href="/#work"
                className="inline-flex items-center justify-center gap-3 rounded-full bg-[#061006] px-7 py-4 text-sm font-semibold text-[#d9ffb2] transition hover:scale-[1.03] cursor-pointer"
              >
                <span>Back to portfolio</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* GLOBAL FOOTER INTEGRATION */}
      <div className="relative z-10 border-t border-white/10">
        <Footer />
      </div>
    </div>
  );
}

export default LiftMeUpCaseStudy;
