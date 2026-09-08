export type ModeKey = "voice" | "nudge" | "semi";

export interface ModeItem {
  key: ModeKey;
  name: string;
  label: string;
  description: string;
  micro: string;
  ease: number;
  ux: number;
  insight: string;
  overallFirst: number;
}

export interface TaskItem {
  name: string;
  short: string;
  why: string;
  voice: number;
  nudge: number;
  semi: number;
}

export interface ProcessStep {
  number: string;
  title: string;
  body: string;
}

export interface RecommendationItem {
  title: string;
  body: string;
}

export interface ProjectMeta {
  kicker: string;
  title: string;
  subtitle: string;
  role: string;
  institution: string;
  partner: string;
  timeline: string;
  tags: string[];
}

export const projectMeta: ProjectMeta = {
  kicker: "Master's Thesis · University of Twente × Van Raam",
  title: "Lift Me Up",
  subtitle:
    "Designing an autonomous hoist behaviour that helps assembly workers stay closer to the ergonomic golden zone, prototyped safely in extended reality.",
  role: "XR & Interaction Design Researcher",
  institution: "University of Twente (Enschede, NL)",
  partner: "Van Raam Adapted Bicycles (Varsseveld, NL)",
  timeline: "M.Sc. Interaction Technology Thesis (2025)",
  tags: ["XR", "Industrial UX", "Human autonomy", "Ergonomics", "Research"],
};

export const nav: [string, string, string][] = [
  ["01", "Context", "context"],
  ["02", "Question", "question"],
  ["03", "System", "system"],
  ["04", "Behaviours", "behaviours"],
  ["05", "Study", "study"],
  ["06", "Results", "results"],
  ["07", "Principles", "principles"],
  ["08", "Reflection", "reflection"],
];

export const modes: ModeItem[] = [
  {
    key: "voice",
    name: "Voice",
    label: "Worker initiated",
    description:
      "Worker initiated. The worker tells the hoist what to do. Direct command structure keeping total execution authority in the worker's hands.",
    micro: "I decide",
    ease: 6.2,
    ux: 4.37,
    insight:
      "Thirteen of fourteen participants chose Voice overall. Immediate authority, zero unexpected movement, and high predictability during fine positioning made Voice the undisputed baseline.",
    overallFirst: 13,
  },
  {
    key: "nudge",
    name: "Nudge",
    label: "Shared initiative",
    description:
      "Shared initiative. The system proposes an ergonomic move and the worker explicitly approves or ignores it before movement occurs.",
    micro: "We decide",
    ease: 4.4,
    ux: 3.37,
    insight:
      "Nobody placed Nudge first overall. While workers appreciated having zero unannounced movement, having to evaluate and confirm proposals repeatedly introduced cognitive friction and hesitation.",
    overallFirst: 0,
  },
  {
    key: "semi",
    name: "Semi Automatic",
    label: "System initiated",
    description:
      "System initiated. The system moves the hoist proactively into the golden zone while the worker retains an immediate, continuous override.",
    micro: "It decides",
    ease: 4.0,
    ux: 3.0,
    insight:
      "Ten of fourteen felt least in control with Semi Automatic. However, when reach demands became extreme (Task 3: Cage Access), participant acceptance and preference jumped significantly to 5 of 14.",
    overallFirst: 1,
  },
];

export const process: ProcessStep[] = [
  {
    number: "01",
    title: "Context immersion",
    body: "In-situ field observation at Van Raam's bicycle factory, analyzing posture breakdown and physical reach strain across 3 critical cargo bike assembly stages.",
  },
  {
    number: "02",
    title: "Golden zone mapping",
    body: "Translating ergonomic biomechanics and reaching envelopes into computational rules: converting posture from a retrospective score into a live spatial target.",
  },
  {
    number: "03",
    title: "Initiative spectrum",
    body: "Formulating three distinct machine agency models—Voice (I decide), Nudge (We decide), and Semi-Automatic (It decides)—to test where autonomy belongs.",
  },
  {
    number: "04",
    title: "XR simulation testbed",
    body: "Engineering a 1:1 scale digital twin in Unity XR, synchronizing real-time head/hand tracking, hoist motion models, and safety boundary constraints.",
  },
  {
    number: "05",
    title: "Wizard of Oz experiment",
    body: "Running 15 within-subject operator sessions (~45 minutes each), counterbalancing behavior order across standardized bicycle assembly tasks.",
  },
  {
    number: "06",
    title: "Mixed-method synthesis",
    body: "Triangulating post-task ease ratings (1–7), composite UX scores (1–5), forced ranking choices, and qualitative agency interviews.",
  },
];

export const tasks: TaskItem[] = [
  {
    name: "Attach Battery",
    short: "Task 01",
    why: "Low reach complexity, high precision positioning where unexpected movement is heavily penalized.",
    voice: 11,
    nudge: 1,
    semi: 2,
  },
  {
    name: "Screw Sequence",
    short: "Task 02",
    why: "Repetitive fastening across moderate height changes where timing of proposals was critical.",
    voice: 7,
    nudge: 6,
    semi: 1,
  },
  {
    name: "Cage Access",
    short: "Task 03",
    why: "Deep, awkward reach inside the frame where physical strain is highest and automated assistance is welcomed.",
    voice: 7,
    nudge: 2,
    semi: 5,
  },
];

export const recommendations: RecommendationItem[] = [
  {
    title: "Worker commanded help by default",
    body: "Direct agency remains the safest, highest-trust baseline. Automation should assist on explicit command rather than imposing unsolicited movement.",
  },
  {
    title: "Preview motion before movement",
    body: "Never displace a suspended industrial load unannounced. Visual intent indicators must communicate target trajectories before physical motors engage.",
  },
  {
    title: "Make autonomy situational",
    body: "Proactive assistance should expand during high-reach, awkward postures and contract during fine, dexterous alignment tasks.",
  },
  {
    title: "Keep a universal physical stop",
    body: "Operators must retain immediate, instinctive physical override authority across all autonomy tiers without cognitive delay.",
  },
  {
    title: "Negotiate autonomy (Detection is not permission)",
    body: "Ergonomic strain detection must be treated as an invitation to collaborate, not an automatic mandate to take over.",
  },
];

export const limitations: string[] = [
  "XR simulation did not reproduce physical mass, load inertia, acoustic shop noise, or full 8-hour musculoskeletal fatigue.",
  "Voice recognition was tested in a laboratory setting; factory ambient noise (75–85 dB) requires resilient hardware.",
  "The study evaluated 15 participants in 45-minute sessions rather than continuous multi-week deployment.",
  "Conclusions validate perceived agency, interaction timing, and initiative preference rather than measured clinical ergonomic outcomes.",
];
