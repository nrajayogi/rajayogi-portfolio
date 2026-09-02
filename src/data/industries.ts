export type Industry = {
    id: string;
    title: string;
    description: string;
    iconName: string;
    features: string[];
};

export const industries: Industry[] = [
    {
        id: "automotive",
        title: "Automotive",
        description: "Accelerate autonomous and EV innovation with model-based systems engineering.",
        iconName: "Car",
        features: ["EV Battery Systems Design", "Autonomous Drive Simulation", "Regulatory Compliance (ASPICE)", "Supplier Collaboration"]
    },
    {
        id: "aerospace",
        title: "Aerospace & Defense",
        description: "Manage complex programs with rigorous compliance and digital thread traceability.",
        iconName: "Plane",
        features: ["Program Lifecycle Management", "ITAR/EAR Compliance", "MBSE for Avionics", "Sustainment & MRO"]
    },
    {
        id: "industrial",
        title: "Industrial Machinery",
        description: "Optimize equipment performance and enable predictive maintenance models.",
        iconName: "Cogs",
        features: ["Smart Factory Integration", "Equipment as a Service", "Digital Twin Operations", "Field Service Management"]
    },
    {
        id: "hitech",
        title: "High Tech & Electronics",
        description: "Shorten product lifecycles and manage complex global supply chains effectively.",
        iconName: "Cpu",
        features: ["Silicon-to-Systems Design", "Conflict Minerals Tracking", "Value Chain Collaboration", "Rapid Prototyping"]
    },
    {
        id: "medical",
        title: "Medical Devices",
        description: "Ensure patient safety and speed up FDA approvals with validatable systems.",
        iconName: "Stethoscope",
        features: ["Design Control (21 CFR Part 820)", "Unique Device Identification (UDI)", "Quality Management (QMS)", "Risk Management (ISO 14971)"]
    },
    {
        id: "consumer",
        title: "Consumer Products",
        description: "Deliver personalized products at scale with agile manufacturing and PLM.",
        iconName: "ShoppingBag",
        features: ["Formula & Recipe Management", "Packaging Sustainability", "Brand Consistency", "Direct-to-Consumer Logistics"]
    }
];
