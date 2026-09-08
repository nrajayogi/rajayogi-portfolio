export interface TechStackCategory {
  title: string;
  items: string[];
}

export interface SpecMetric {
  label: string;
  value: string;
  detail: string;
}

export interface CaseStudy {
  id: string;
  number: string;
  title: string;
  category: string;
  year: string;
  tagline: string;
  role: string;
  domain: string;
  duration: string;
  coverImage: string;
  annotation: string;
  liveUrl?: string;
  githubUrl?: string;
  figmaUrl?: string;
  logoImage?: string;
  galleryImages?: string[];
  techStack: TechStackCategory[];
  specMetrics?: SpecMetric[];
  architectureOverview?: string;
  context: string;
  problem: string;
  observation: string;
  designQuestion: string;
  exploration: string[];
  prototypeDescription: string;
  testing: string;
  results: string[];
  whatFailed: string;
  iterations: string;
  learnings: string;
}

export interface ExperienceItem {
  id: string;
  year: string;
  role: string;
  company: string;
  location: string;
  domain: string;
  contribution: string;
  highlights: string[];
}

export interface LabItem {
  id: string;
  number: string;
  title: string;
  category: string;
  tagline: string;
  coverImage: string;
  tags: string[];
}

export const DESIGN_PHILOSOPHY = {
  quote: "CALM INTERACTION IN HIGH-DENSITY SYSTEMS.",
  statement: "I explore how spatial computing, multimodal inputs (gaze + voice), and physical human-robot collaboration can simplify demanding physical workflows without stripping human workers of autonomy or creating divided visual attention.",
  principles: [
    {
      title: "Worker-Centered Agency",
      desc: "Never let automation displace human decision-making; interfaces must clearly communicate machine state and keep operators in transparent control."
    },
    {
      title: "Multimodal Economy",
      desc: "Use gaze for spatial intent and voice for confirmation to keep operators' hands free and posture relaxed during physical tasks."
    },
    {
      title: "Empirical Grounding",
      desc: "Validate every interaction through in-situ observation, NASA-TLX workload analysis, and real task completion measurements."
    }
  ]
};

export const CAPABILITIES = [
  {
    title: "Spatial Computing & XR",
    desc: "Designing and simulating 3D spatial interfaces in Unity and WebXR, optimizing gaze-dwell selection and spatial targeting."
  },
  {
    title: "Multimodal Interaction",
    desc: "Combining gaze tracking, voice recognition, and physical affordances into seamless two-factor command structures."
  },
  {
    title: "Industrial HRI",
    desc: "Collaborative robotic assistance for assembly lines and workshops that respects human cadence and safety envelopes."
  },
  {
    title: "Behavioral Platform UX",
    desc: "Engineering transparent incentive architectures, squad mechanics, and gamification that respect user autonomy."
  },
  {
    title: "Design Systems & Architecture",
    desc: "High-density enterprise dashboards, accessible design tokens, and modular components built for complex workflows."
  },
  {
    title: "Rapid Prototyping & Code",
    desc: "Next.js, React Native, TypeScript, Tailwind CSS, Python, and Unity—bridging high-fidelity design with robust engineering."
  }
];

export const WORK_CASE_STUDIES: CaseStudy[] = [
  {
    id: "lift-me-up",
    number: "01",
    title: "Lift Me Up: Autonomous Hoist & XR Ergonomics",
    category: "XR · Human Autonomy · Ergonomics",
    year: "2025",
    tagline: "Master's Thesis: Designing autonomous hoist behaviour that helps bicycle assembly workers stay closer to the ergonomic golden zone, prototyped safely in XR.",
    role: "XR & Interaction Design Researcher",
    domain: "University of Twente × Van Raam",
    duration: "M.Sc. Thesis Project (2025)",
    coverImage: "/images/lift-me-up/hero-xr.webp",
    annotation: "Unity XR simulation & Wizard of Oz study at UTwente Interaction Technology Lab",
    galleryImages: [
      "/images/lift-me-up/hero-xr.webp",
      "/images/lift-me-up/golden-zone.webp",
      "/images/lift-me-up/system-architecture.webp",
      "/images/lift-me-up/prototype-evolution.webp",
      "/images/lift-me-up/study-setup.webp"
    ],
    techStack: [
      {
        title: "Spatial Runtime & Graphics",
        items: ["Unity 2022.3 LTS (C#)", "OpenXR & MRTK v2/v3", "URP (Universal Render Pipeline)", "Spatial Mesh Anchoring"]
      },
      {
        title: "Human-Robot Interaction Rig",
        items: ["Head-Mounted Eye Tracking (Gaze Dwell)", "Low-Latency Speech Intent Engine", "Autonomous Kinematic Hoist Model", "Wizard of Oz Experiment Control"]
      },
      {
        title: "Empirical Psychometrics",
        items: ["NASA-TLX Workload Scales", "Within-Subject Operator Study (N=15)", "Ergonomic Golden Zone Reach Sphere", "Perceived Worker Agency Framework"]
      }
    ],
    architectureOverview: "Worker-centered spatial XR architecture for heavy industrial assembly. Decouples physical hand pendants via hands-free voice triggers, collaborative nudge suggestions, and proactive semi-automatic trajectories converging on the ergonomic golden zone.",
    specMetrics: [
      { label: "Voice Preference", value: "13 / 14", detail: "Ranked Voice first overall across study cohort" },
      { label: "Voice Ease", value: "6.2 / 7", detail: "Compared to 4.4 Nudge & 4.0 Semi-Automatic" },
      { label: "Operator Cohort", value: "N = 15", detail: "Within-subject Wizard of Oz evaluation at UTwente" },
      { label: "Golden Zone", value: "3 Modes", detail: "Voice ('I decide'), Nudge ('We decide'), Semi-Auto ('It decides')" }
    ],
    context: "At Van Raam, workers assemble larger, highly customised bicycle frames using a ceiling mounted hoist. The hoist reduces physical lifting effort, but workers still have to decide where the frame should be held while simultaneously carrying out precision mechanical assembly.",
    problem: "A bicycle frame held too high, too low, or at the wrong orientation repeatedly pulls the worker outside the ergonomic golden zone. Awkward reaching accumulates across hundreds of micro-adjustments into long-term musculoskeletal fatigue.",
    observation: "The hoist lifted the frame. The worker still carried the decision burden. Workers frequently held heavy sub-assemblies with one hand while stretching awkwardly to press pendant buttons with the other.",
    designQuestion: "How can an autonomous hoist help workers work in the golden zone without stripping them of authority or causing divided attention?",
    exploration: [
      "Worker-initiated Voice model ('I decide') providing hands-free direct elevation control",
      "Shared-initiative Nudge model ('We decide') where the system proposes adjustments for worker approval",
      "System-initiated Semi-Automatic model ('It decides') proactively moving while worker retains override"
    ],
    prototypeDescription: "Engineered an immersive 1:1 scale digital twin in Unity XR simulating an industrial cargo bike workstation, synchronizing 6DoF head/hand tracking, posture estimation, and simulated hoist mechanics.",
    testing: "Designed and conducted a within-subject empirical study with 15 participants (~45 minute Wizard of Oz sessions) performing standardized bicycle assembly tasks across all three initiative conditions.",
    results: [
      "13 of 14 participants placed Voice first overall (6.2/7 ease of use vs. 4.4 Nudge and 4.0 Semi-Auto)",
      "11 of 14 felt most in control with Voice; 10 of 14 felt least in control with Semi-Automatic",
      "Autonomy acceptability rebounded sharply in high-reach tasks (Cage Access preference rose to 5/14)",
      "Formulated 5 core design heuristics highlighting that 'Detection is not permission'"
    ],
    whatFailed: "Early voice recognition prototypes occasionally misidentified ambient speech during active collaboration.",
    iterations: "Implemented a two-factor interaction pattern requiring brief gaze dwell on the active target before voice triggers are processed, preventing accidental commands.",
    learnings: "The best autonomous behaviour is not the one that acts most. It is the one that knows when to ask. Keep worker agency as the default and make autonomy situational."
  },
  {
    id: "homemade-app",
    number: "02",
    title: "Homemade: Behavioral Incentive Architecture & Food App",
    category: "Mobile App & Behavioral Platform UX",
    year: "2024 — 2026",
    tagline: "Master's Internship: Engineering a transparent, research-backed incentive system to give 'time back to the chef' and encourage sustainable pickup.",
    role: "Lead Interaction Designer & Full-Stack Engineer",
    domain: "Homemade B.V. / Univ of Twente (Enschede, NL)",
    duration: "M.Sc. I-Tech Internship & Production System",
    coverImage: "/images/homemade/homemade-app-screens.png",
    annotation: "React Native & AI Backend Codebase",
    githubUrl: "https://github.com/nrajayogi/homemade",
    liveUrl: "https://www.homemadechefs.com/",
    galleryImages: [
      "/images/homemade/homemade-app-screens.png",
      "/images/homemade/homemade-rewards-dashboard.png",
      "/images/homemade/homemade-squad-screen.png",
      "/images/homemade/homemade-ui-map.png"
    ],
    techStack: [
      {
        title: "Mobile Framework & State",
        items: ["React Native & Expo SDK", "TypeScript Strict Architecture", "Redux Toolkit & Offline Persistence", "React Navigation & Native Haptics"]
      },
      {
        title: "AI & Machine Learning",
        items: ["Gemini AI Assistant ('Sanne')", "Random Forest Transport Classifier (92% acc)", "Linear Regression Prep Time Estimator", "TF-IDF Dietary Content Filtering"]
      },
      {
        title: "Backend & Data Infrastructure",
        items: ["Python FastAPI & Flask Services", "PostgreSQL & SQLite Architecture", "RESTful Telemetry Endpoints", "Autonomous Geofencing & Push Dispatch"]
      }
    ],
    architectureOverview: "End-to-end mobile and behavioral architecture engineered with React Native and Expo, backed by Python FastAPI, SQLite/PostgreSQL, and Gemini AI. Incorporates a Random Forest ML model for transport mode classification and a research-backed 1 RP = €0.01 incentive engine.",
    specMetrics: [
      { label: "Pickup Adherence", value: "88.1%", detail: "Incentivized scenario pickup vs 14.3% baseline" },
      { label: "Statistical Sig.", value: "p = 0.0002", detail: "Fisher's Exact Test (Odds Ratio = 44.4x)" },
      { label: "ML Classification", value: "92%", detail: "Random Forest transport mode accuracy (Walk/Bike/Car)" },
      { label: "Reward Model", value: "1 RP = €0.01", detail: "Transparent euro equivalent without currency drift" }
    ],
    context: "Homemade operates on a chef-centric model where local home chefs cook, package, and often deliver their own orders. Because food is prepared fresh in small batches, every delivery trip takes valuable time away from the kitchen, creating an operational capacity bottleneck for home chefs.",
    problem: "The core challenge was: How can we increase pickup orders (especially walking or biking) to give 'time back to the chef' without harming customer autonomy, creating dark patterns, or compromising trust?",
    observation: "Through group user testing sessions, users viewed delivery vs. pickup strictly through proximity and weather constraints. When rewards felt abstract or lacked immediate euro equivalents, users suspected manipulative pricing and trust dropped rapidly.",
    designQuestion: "How might we implement a behavioral reward architecture that makes walking/biking pickup genuinely attractive without coercive streak pressure or hidden currency friction?",
    exploration: [
      "Fixed euro-equivalent Reward Points (1 RP = €0.01) eliminating intermediate currency confusion",
      "Distance & transport mode formulas rewarding sustainable mobility (walking +30 RP, biking +12 RP) with a 15 RP/€ safety cap",
      "Layered React Native & Expo mobile architecture integrated with an AI Chatbot ('Sanne' powered by Gemini with strict privacy walls)"
    ],
    prototypeDescription: "Engineered full React Native & Expo application flows featuring transparent checkout previews, 10-level seasonal progress, and companion web portals.",
    testing: "Conducted moderated group usability studies with 8 participants across 42 scenario decisions evaluating baseline vs. incentivized conditions, alongside dot-voting barrier analysis.",
    results: [
      "Incentivized scenario pickup rate increased to 88.1% (37/42 decisions) vs. 14.3% baseline (Fisher's exact test p = 0.000208, Odds Ratio = 44.4x)",
      "Formulated 5 research-backed design principles mitigating FTC/OECD dark pattern risks",
      "Engineered end-to-end React Native codebase with Gemini AI assistant and offline-first state management (github.com/nrajayogi/homemade)"
    ],
    whatFailed: "Early daily streak mechanics triggered loss-aversion pressure and guilt for users with irregular weekly ordering habits.",
    iterations: "Replaced daily streaks with flexible weekly goals and transparent, opt-in reminders that avoid manipulative shame framing.",
    learnings: "An incentive system must behave as a transparent value exchange, not a discount gimmick. Clarity and trust at checkout outweigh complex gamification every time."
  },
  {
    id: "homemade-chefs",
    number: "03",
    title: "Homemade Chefs: Culinary Creator Marketplace",
    category: "Web Platform & Creator Marketplace",
    year: "2024 — 2026",
    tagline: "Live partner portal empowering home chefs with interactive earnings calculators, food safety compliance, and live kitchen dispatch.",
    role: "Lead Product & Web Experience Designer",
    domain: "Homemade B.V. (Enschede, NL)",
    duration: "Production Web Platform",
    coverImage: "/images/chefs/hero-chefs.png",
    annotation: "Live Production Platform @ homemadechefs.com",
    liveUrl: "https://www.homemadechefs.com/",
    githubUrl: "https://github.com/nrajayogi/Homemade_chefs_website",
    galleryImages: [
      "/images/chefs/hero-chefs.png",
      "/images/chefs/feature-dashboard.png",
      "/images/chefs/hero-3d.png",
      "/images/chefs/chef-delivery-bag-hero.png"
    ],
    techStack: [
      {
        title: "Web Platform & Architecture",
        items: ["Next.js 15 & React 19", "Tailwind CSS & Framer Motion", "TypeScript Strict Runtime", "Stripe Connect & Dutch iDeal"]
      },
      {
        title: "Creator Tools & Systems",
        items: ["Interactive Real-Time Earnings Forecaster", "Dutch NVWA Food Safety Guided Flow", "Commercial Kitchen Management Portal", "Dynamic Dinner Batch Window Dispatch"]
      },
      {
        title: "Platform Scalability & Deploy",
        items: ["20+ Active Dutch Chefs Pilot", "42% Reduction in Onboarding Abandonment", "Figma Design Token Hierarchy", "Production Live at homemadechefs.com"]
      }
    ],
    architectureOverview: "Creator marketplace web architecture engineered with Next.js 16 and React 19, backed by Supabase SSR, Tailwind CSS v4, Framer Motion, and Stripe/iDeal. Features dynamic earnings simulators and Dutch NVWA food safety compliance workflows.",
    specMetrics: [
      { label: "Onboarding Drop", value: "-42%", detail: "Reduction in cook churn via earnings calculator" },
      { label: "Pilot Cook Cohort", value: "20+ Chefs", detail: "Active home cooks across Twente & Netherlands" },
      { label: "Core Web Vitals", value: "99 / 100", detail: "Lighthouse performance on Next.js 16 SSR" },
      { label: "Revenue Split", value: "85% / 15%", detail: "Transparent creator payout model with iDeal / Stripe" }
    ],
    context: "Independent culinary creators face steep barriers to launching food businesses—from complex commercial permitting and food safety certifications to erratic order logistics and opaque margin calculations.",
    problem: "Prospective home chefs felt intimidated by commercial software suites and lacked transparent insight into their potential earnings and order workflows.",
    observation: "Home chefs prioritize clarity over corporate jargon: they wanted to see exactly how many portions they needed to cook per week to replace their target monthly income.",
    designQuestion: "How can we design an empowering, human-centered partner web portal that transforms passionate home cooks into confident, compliant culinary entrepreneurs?",
    exploration: [
      "Interactive Real-Time Earnings Calculator with dynamic portion, ingredient, and weekly schedule sliders",
      "Guided Food Safety & Hygiene onboarding milestone checklist ensuring Dutch municipality compliance",
      "Horizontal-scroll features carousel detailing commercial packaging, branded chef gear, and live kitchen dispatch"
    ],
    prototypeDescription: "Built high-performance Next.js web platform (homemadechefs.com) featuring bespoke typography, dynamic pricing tier selectors, interactive earnings modeling, and responsive chef dashboards.",
    testing: "Tested with 20+ active and onboarding home chefs across the Netherlands to refine signup conversion and trust metrics.",
    results: [
      "Launched live production platform at homemadechefs.com serving active culinary communities in Enschede and beyond",
      "Reduced chef onboarding drop-off by 42% through interactive earnings previews and streamlined food safety verification",
      "Established cohesive brand design system spanning packaging accessories, web dashboards, and mobile portals"
    ],
    whatFailed: "Initial multi-page onboarding questionnaires had a high abandonment rate before users could see potential earnings.",
    iterations: "Moved the interactive earnings calculator to the top of the landing experience, allowing chefs to instantly visualize their income potential before registering.",
    learnings: "Empowerment precedes compliance. By letting creators experience the tangible value of their craft first, compliance workflows become collaborative milestones rather than bureaucratic hurdles."
  },
  {
    id: "axal-power",
    number: "04",
    title: "AXAL Power: EV Fast-Charging Systems & CPMS",
    category: "CleanTech Hardware UI & Cloud Energy Management",
    year: "2023 — 2025",
    tagline: "High-capacity DC fast-charging stations (up to 480kW) and cloud-based Charging Point Management System (CPMS) for commercial infrastructure.",
    role: "Digital Product & Systems UI Designer",
    domain: "AXAL Power B.V. (Enschede, Netherlands)",
    duration: "Enterprise CleanTech Platform",
    coverImage: "/images/axal/axal-power-hero.png",
    annotation: "Live CleanTech Hardware & Software Ecosystem",
    liveUrl: "https://axalpower.com/",
    galleryImages: [
      "/images/axal/axal-power-hero.png",
      "/images/axal/axal-cpms-dashboard.png"
    ],
    techStack: [
      {
        title: "Hardware Touchscreen HMI",
        items: ["Outdoor Anti-Glare Touchscreen HMI", "Minimum 64px Touch Target Sizing", "Adaptive Daylight High-Contrast Mode", "Figma Industrial Design Tokens"]
      },
      {
        title: "Cloud CPMS & Protocol Architecture",
        items: ["Cloud Charging Point Management System (CPMS)", "OCPP 1.6J / 2.0.1 Protocol Integration", "Dynamic Load Balancing (DLB) Engine", "Real-Time Fleet Telemetry Telematics"]
      },
      {
        title: "CleanTech Deployment",
        items: ["DCplug® 480kW Ultra-Fast Chargers", "Towerplug® Dual 22kW AC Units", "European Highway Pilots (NL & Spain)", "Enterprise Portal at axalpower.com"]
      }
    ],
    architectureOverview: "High-power CleanTech hardware and cloud energy management platform. Integrates daylight-visible outdoor touchscreen HMIs for DCplug® fast-chargers (up to 480kW) with a cloud CPMS leveraging OCPP 1.6J/2.0.1, Dynamic Load Balancing (DLB), and real-time fleet telemetry.",
    specMetrics: [
      { label: "Peak Power", value: "480 kW", detail: "DCplug® ultra-fast high-capacity architecture" },
      { label: "10-Min Range", value: "+300 km", detail: "High-voltage 800V commercial EV fast charging" },
      { label: "Grid Efficiency", value: "96%", detail: "Dynamic Load Balancing (DLB) with peak shaving" },
      { label: "Protocol Engine", value: "OCPP 2.0.1", detail: "Open Charge Point Protocol compliant telemetry" }
    ],
    context: "AXAL Power B.V., founded in Enschede by University of Twente alumni, engineers electric vehicle fast-charging hardware and energy management software for enterprise fleets, highway corridors, and commercial real estate across Europe.",
    problem: "Commercial EV charging operators faced fragmented tooling: separate hardware telemetry systems, complex Dynamic Load Balancing (DLB) protocols, and disjointed tariff billing engines.",
    observation: "Site hosts and fleet managers required real-time visibility into grid power constraints, peak shaving, and charger status without deciphering low-level OCPP logs.",
    designQuestion: "How might we design a unified hardware-software ecosystem that makes high-power EV charging intuitive for drivers while offering enterprise telemetry for site operators?",
    exploration: [
      "Touchscreen UI architecture for DCplug® fast-chargers with integrated advertising screens",
      "Cloud-based CPMS (Charging Point Management System) with real-time station diagnostics and session tracking",
      "Dynamic Load Balancing (DLB) dashboards optimizing power distribution across multi-vehicle charging hubs"
    ],
    prototypeDescription: "Designed modular station UI layouts, driver interaction flows, and the cloud energy management dashboard for real-time kWh telemetry, automated billing, and remote diagnostics.",
    testing: "Validated with enterprise charging site hosts and fleet operators across deployment pilots in the Netherlands and Spain.",
    results: [
      "Supported scalable rollouts of DCplug® (up to 480kW) and towerplug® (dual 22kW) hardware across European hubs",
      "Unified charger status, payment tariffs, and energy load balancing into an enterprise-grade web CPMS",
      "Live company and system showcased at axalpower.com"
    ],
    whatFailed: "Early touchscreen interfaces suffered from readability issues under direct daylight glare.",
    iterations: "Engineered high-contrast brutalist UI modes with enlarged touch target zones (min 64px) and adaptive ambient light compensation.",
    learnings: "Industrial CleanTech demands zero-latency physical reliability. Digital interfaces on physical charging stations must bridge the physical and virtual seamlessly under all environmental conditions."
  },
  {
    id: "nadi-pulse",
    number: "05",
    title: "Nadi Pulse: Ayurvedic Telemedicine & Remote Diagnostics",
    category: "Pure UI/UX Research & Systems Design",
    year: "2023",
    tagline: "Pure UI/UX Research & Clinical Systems Design: Translating ancient Ayurvedic pulse science (Nadi Pariksha) and Tridosha balance (Prakriti vs. Vikriti) into intuitive mobile telemetry, hardware sensor calibration, and doctor EHR portals.",
    role: "Lead UI/UX Researcher & Systems Designer",
    domain: "Digital HealthTech & Ayurvedic Medicine",
    duration: "Comprehensive UI/UX Research & Design Architecture",
    coverImage: "/images/nadi-pulse/nadi-pulse-vikriti-screen.png",
    annotation: "Figma UI/UX Design System & Clinical Architecture",
    figmaUrl: "https://www.figma.com/design/ojbXGMlyGZzwofQsCp651d/Rajayogi-Nandina-Portfolio?node-id=3-2",
    logoImage: "/images/nadi-pulse/nadi-pulse-logo.png",
    galleryImages: [
      "/images/nadi-pulse/nadi-pulse-vikriti-screen.png",
      "/images/nadi-pulse/nadi-pulse-logo.png",
      "/images/nadi-pulse/nadi-pulse-patient-app.png",
      "/images/nadi-pulse/nadi-pulse-doctor-portal.png"
    ],
    techStack: [
      {
        title: "Ayurvedic Medical Frameworks & UI Architecture",
        items: [
          "Tridosha Differential Telemetry (Vata, Pitta, Kapha)",
          "Prakriti (Baseline) vs. Vikriti (Imbalance) Modeling",
          "Nadi Pariksha Radial Artery Waveform Mapping",
          "Chikitsa Treatment Protocols (Ahara, Vihara, Aushadhi)"
        ]
      },
      {
        title: "UI/UX Research & Interaction Design",
        items: [
          "Figma Component System & Auto-Layout 5.0",
          "Comprehensive Design Tokens & Color Palettes",
          "Dual-Sided Information Architecture (Patient & Doctor)",
          "Cognitive Walkthrough & Patient Empathy Mapping"
        ]
      },
      {
        title: "Sensor Telemetry & Clinical Governance",
        items: [
          "Bluetooth Radial Pulse Sensor Pairing UX (3 Steps)",
          "Electronic Ayurvedic Prescription & Dosha Formulator",
          "Patient Medical Records & Longitudinal Trends",
          "Multi-Disciplinary Allopathic Referral Workflows"
        ]
      }
    ],
    architectureOverview: "Pure UI/UX research and design project (2023) translating classical Ayurvedic diagnostic principles into modern digital telemetry. Features a dual-sided architecture in Figma: a patient-facing mobile application visualizing biological balance (Vikriti dials, Prakriti assessment, sensor pairing, and Dinacharya routines) and a physician clinical portal for radial waveform diagnosis and electronic herbal prescriptions.",
    specMetrics: [
      { label: "UX Research Canvas", value: "8,370 px", detail: "Comprehensive dual-sided patient & doctor canvas in Figma" },
      { label: "Screen Workflows", value: "40+ Flows", detail: "Vikriti dials, calibration, teleconsultation, and doctor notes" },
      { label: "Ayurvedic Metrics", value: "Tridosha", detail: "Vata (Air), Pitta (Fire), and Kapha (Water) dynamic balance" },
      { label: "Clinical Precision", value: "4.0 - 5.5", detail: "Biometric pulse variance and constitutional deviation index" }
    ],
    context: "Ayurvedic pulse diagnostics (Nadi Pariksha) have traditionally required in-person radial artery palpation by seasoned Vaidyas to assess an individual's constitutional baseline (Prakriti) versus their current pathological imbalance (Vikriti). As digital health accelerated, patients sought holistic Ayurvedic care remotely, but lacked intuitive visual tools to comprehend classical terminology or evaluate biological telemetry safely from home.",
    problem: "How can we design an accessible, trustworthy digital health experience that translates nuanced Ayurvedic pulse science and Tridosha pathology into actionable patient telemetry, while equipping Ayurvedic physicians with rigorous clinical EHR tools to diagnose, prescribe, and monitor patients remotely without diluting traditional clinical integrity?",
    observation: "During contextual user research, patients felt intimidated by classical Sanskrit concepts without visual grounding. Furthermore, patients frequently confused their permanent constitutional baseline (Prakriti) with acute temporary imbalances (Vikriti), leading to misguided self-treatment. On the clinical side, doctors were relying on insecure, unencrypted messaging apps to review pulse photos and lab reports, lacking standardized digital records.",
    designQuestion: "How might we architect a dual-sided telemedicine system that clarifies Ayurvedic treatment principles—anchored by real-time Vikriti orbital dials—while streamlining clinical documentation, longitudinal telemetry, and multidisciplinary collaboration for Ayurvedic physicians?",
    exploration: [
      "Designed the signature 'Vikriti' Body Balance Screen featuring three circular orbital dials: Pitta (Fire 🔥), Vata (Air/Movement 💨), and Kapha (Water/Structure 💧), paired with a 4.0 - 5.5 physiological variance index and upcoming doctor teleconsultations",
      "Mapped core Ayurvedic Chikitsa (treatment) workflows: translating doshic imbalance into personalized Ahara (dietary adjustments), Vihara (circadian Dinacharya routines), and Aushadhi (formulated herbal prescriptions like Ashwagandha, Brahmi, and Triphala)",
      "Engineered a friction-free 3-step Bluetooth radial pulse sensor calibration flow that pairs hardware directly to the user's wrist",
      "Developed an extensive Doctor Clinical EHR Portal allowing Vaidyas to inspect superficial vs. deep pulse wave velocities (Sarpa, Manduka, and Hamsa Gati) and issue verified electronic prescriptions"
    ],
    prototypeDescription: "Architected extensive 8,370px-wide Figma design canvas spanning 40+ high-fidelity responsive screens for both patient mobile app and physician clinical portal, complete with interactive micro-interactions, appointment scheduling, and dark-mode health dashboards.",
    testing: "Evaluated interactive Figma prototypes with both patients seeking holistic health regimens and licensed Ayurvedic practitioners across structured usability walkthroughs and heuristic evaluations.",
    results: [
      "Engineered the signature Vikriti body balance visualization, reducing patient comprehension errors of doshic imbalance by over 60% during usability walkthroughs",
      "Designed end-to-end Figma UI/UX architecture connecting hardware pulse sensing with remote doctor teleconsultation",
      "Standardized remote Ayurvedic consultation with automated lifestyle, dietary (Dinacharya), and classical herbal prescription engines"
    ],
    whatFailed: "Early prototypes displayed raw physiological waveforms (mV and ms) directly on the patient home screen. Usability testing revealed that this triggered severe health anxiety, as users assumed minor heartbeat fluctuations indicated cardiac disease.",
    iterations: "Abstracted raw waveform data into calming, intuitive Vikriti orbital balance rings with gentle color gradients (warm amber for Pitta, serene indigo for Vata, soothing purple for Kapha), while reserving raw diagnostic waveforms exclusively for the Doctor Clinical Portal.",
    learnings: "Ayurvedic digital health requires bridging profound ancient philosophy with modern scientific clarity. By treating the patient interface as an educational, restorative sanctuary (Vikriti balance & Dinacharya) and the doctor interface as an empirical diagnostic workbench, the system builds profound trust across both user archetypes."
  }
];

export const EXPERIENCE_ITEMS: ExperienceItem[] = [
  {
    id: "exp-1",
    year: "Sep 2024 — Feb 2026",
    role: "Project-based UI/UX Designer & Researcher",
    company: "Homemade B.V.",
    location: "Enschede, Netherlands",
    domain: "Food Tech & Behavioral Incentive Systems",
    contribution: "Spearheaded research and UX architecture for sustainable order pickup incentive system. Designed and shipped both the consumer mobile app and the partner platform (homemadechefs.com).",
    highlights: [
      "Conducted 8-participant moderated experimental studies (p=0.000208)",
      "Engineered React Native & Expo production codebase (github.com/nrajayogi/homemade)",
      "Shipped live creator portal at homemadechefs.com"
    ]
  },
  {
    id: "exp-2",
    year: "2023 — 2025",
    role: "Digital Product & UI Designer",
    company: "AXAL Power B.V.",
    location: "Enschede, Netherlands",
    domain: "CleanTech & EV Charging Infrastructure",
    contribution: "Designed UI systems for DC fast-charging stations and the cloud-based CPMS (Charging Point Management System) platform.",
    highlights: [
      "Engineered station touch UI for DCplug® series (up to 480kW)",
      "Created energy management telemetry and dynamic load balancing dashboards",
      "Shipped web platforms at axalpower.com"
    ]
  },
  {
    id: "exp-3",
    year: "2024 — 2025",
    role: "Master's XR Interaction Researcher",
    company: "University of Twente",
    location: "Enschede, Netherlands",
    domain: "Spatial Computing & Human-Robot Interaction",
    contribution: "Researched worker-centered multimodal XR assistance for heavy industrial assembly cells.",
    highlights: [
      "Built Unity 6DoF simulation environment with voice + gaze targeting",
      "Ran 15-participant within-subject NASA-TLX study (-38% strain)",
      "Published 6 industrial HRI design guidelines"
    ]
  }
];
