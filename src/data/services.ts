export type Service = {
    id: string;
    title: string;
    slug: string;
    shortDescription: string;
    iconName: string;
    description: string;
    features: string[];
    outcomes: string[];
    process: {
        title: string;
        description: string;
        iconName?: string;
    }[];
    valueProps: {
        title: string;
        description: string;
        iconName: string;
    }[];
    relatedServices: string[]; // slugs of related services
    challenges: string[];
    solutions: string[];
    techStack: string[];
    faqs: {
        question: string;
        answer: string;
    }[];
};

export const services: Service[] = [
    {
        id: "plm",
        title: "PLM Services",
        slug: "plm-services",
        shortDescription: "End-to-end Product Lifecycle Management strategy, implementation, and support.",
        iconName: "Settings",
        description: "Maximize your product innovation with our comprehensive PLM solutions. We help organizations streamline their product development processes, from concept to retirement. By integrating people, data, processes, and business systems, we provide a product information backbone for your company and its extended enterprise.",
        features: [
            "Strategic PLM Roadmap & Assessment",
            "Platform Implementation (Windchill, Teamcenter, etc.)",
            "Legacy Data Migration & Cleansing",
            "Customization & API Development",
            "Upgrade & Cloud Migration Services",
            "24/7 Application Support & Maintenance"
        ],
        outcomes: [
            "30% reduction in time-to-market",
            "Improved cross-functional collaboration",
            "Single source of truth for product data",
            "Reduced scrap and rework costs",
            "Streamlined regulatory compliance"
        ],
        process: [
            { title: "Assessment", description: "Deep dive into your current product development lifecycle and tool chain." },
            { title: "Strategy", description: "Defining a PLM roadmap aligned with your business goals." },
            { title: "Implementation", description: "Agile configuration and deployment of the PLM platform." },
            { title: "Adoption", description: "Training and change management to ensure organizational buy-in.", iconName: "Users" }
        ],
        valueProps: [
            { title: "Accelerated Time-to-Market", description: "Reduce product development cycles by up to 30% through streamlined workflows.", iconName: "Zap" },
            { title: "Cost Reduction", description: "Lower scrap and rework costs by ensuring data accuracy across the lifecycle.", iconName: "TrendingDown" },
            { title: "Regulatory Compliance", description: "Automated audit trails and history for every part and process.", iconName: "ShieldCheck" },
            { title: "Global Collaboration", description: "Enable real-time design collaboration across distributed teams.", iconName: "Globe" }
        ],
        relatedServices: ["digital-engineering", "data-migration", "integration"],
        challenges: [
            "Siloed engineering and manufacturing data.",
            "Slow change management processes.",
            "Lack of visibility into product costs.",
            "Compliance risks due to manual tracking."
        ],
        solutions: [
            "Unified digital thread across the enterprise.",
            "Automated workflows and change control.",
            "Real-time cost analytics and reporting.",
            "Full traceability/history for every part."
        ],
        techStack: ["Siemens Teamcenter", "PTC Windchill", "Dassault 3DExperience", "Aras Innovator"],
        faqs: [
            { question: "How long does a PLM implementation take?", answer: "Typically 6-12 months for a full enterprise rollout, but we deliver initial value in 3 months via our agile methodology." },
            { question: "Do you support cloud migration?", answer: "Yes, we specialize in migrating on-premise PLM to AWS, Azure, and SaaS platforms." }
        ]
    },
    {
        id: "data",
        title: "Data Migration & Modernization",
        slug: "data-migration",
        shortDescription: "Secure, high-fidelity migration of legacy data to modern platforms.",
        iconName: "Database",
        description: "Data is your most valuable asset. Our specialized migration frameworks ensure that your critical intellectual property is preserved, cleansed, and optimized during the transition to modern platforms. We handle complex extractions, transformations, and loading (ETL) with zero data loss fidelity.",
        features: [
            "Legacy System Decommissioning Strategy",
            "High-Volume ETL Pipelines",
            "Data Quality Assessment & Cleansing",
            "Validation & Verification Automation",
            "Multi-CAD Data Handling",
            "Post-Migration Integrity Checks"
        ],
        outcomes: [
            "100% Data Fidelity Guarantee",
            "Reduced legacy infrastructure costs",
            "Enhanced data accessibility and searchability",
            "Foundation for AI/ML initiatives",
            "Minimall business disruption during cutover"
        ],
        process: [
            { title: "Audit", description: "Cataloging legacy data sources and assessing quality." },
            { title: "Mapping", description: "Designing target schemas and transformation logic." },
            { title: "Dry Run", description: "Iterative testing of migration scripts on sample sets." },
            { title: "Cutover", description: "Final executing with validation and minimal downtime.", iconName: "Power" }
        ],
        valueProps: [
            { title: "Zero Data Loss", description: "100% fidelity guarantee with bit-level validation protocols.", iconName: "Database" },
            { title: "Minimal Downtime", description: "Weekend cutover strategies to ensure production continuity.", iconName: "Clock" },
            { title: "Legacy Retirement", description: "Eliminate maintenance costs of obsolete hardware and software.", iconName: "Trash2" },
            { title: "Future-Ready Data", description: "Data cleansed and structured for AI and modern analytics.", iconName: "Sparkles" }
        ],
        relatedServices: ["plm-services", "enterprise-systems", "cloud-transformation"],
        challenges: [
            "Legacy systems are approaching end-of-life.",
            "Data formats are incompatible with modern tools.",
            "Risk of data loss during transfer.",
            "Downtime impacting production."
        ],
        solutions: [
            "Automated ETL pipelines with validation.",
            "Format-agnostic intermediate storages.",
            "Zero-loss verification protocols.",
            "Weekend cutover strategies."
        ],
        techStack: ["Talend", "Informatica", "Python", "SQL Server", "Oracle"],
        faqs: [
            { question: "Can you migrate 2D drawings?", answer: "Yes, we migrate 2D, 3D, and metadata while maintaining associations." },
            { question: "Is downtime required?", answer: "We minimize downtime to a single weekend for the final cutover." }
        ]
    },
    {
        id: "integration",
        title: "Enterprise Integration",
        slug: "enterprise-integration",
        shortDescription: "Seamless connectivity across PLM, ERP, MES, and CRM systems.",
        iconName: "Network",
        description: "Break down silos and create a connected digital thread across your enterprise. We design and build robust integration architectures that enable real-time data flow between your engineering, manufacturing, and business systems, ensuring everyone works from the same data.",
        features: [
            "Middleware Architecture Design (MuleSoft, Boomi, etc.)",
            "Custom Connector Development",
            "Event-Driven Architecture Implementation",
            "API Management & Governance",
            "Real-time Data Synchronization",
            "Legacy Mainframe Integration"
        ],
        outcomes: [
            "Elimination of manual data entry errors",
            "Real-time visibility across the value chain",
            "Accelerated order-to-cash cycles",
            "Improved inventory accuracy",
            "Agile response to market changes"
        ],
        process: [
            { title: "Discovery", description: "Identifying data silos and integration touchpoints." },
            { title: "Design", description: "Architecting the middleware and API strategy." },
            { title: "Build", description: "Developing connectors and transformation flows." },
            { title: "Deploy", description: "Launch with real-time monitoring and error handling.", iconName: "Rocket" }
        ],
        valueProps: [
            { title: "Real-Time Visibility", description: "See operations across the entire value chain as they happen.", iconName: "Eye" },
            { title: "Operational Agility", description: "Pivot quickly in response to supply chain disruptions.", iconName: "RefreshCcw" },
            { title: "Data Consistency", description: "Eliminate manual data entry and associated errors.", iconName: "FileCheck" },
            { title: "Scalable Architecture", description: "Add new systems and partners without breaking existing flows.", iconName: "Maximize" }
        ],
        relatedServices: ["digital-manufacturing", "iot-connected-operations", "enterprise-systems"],
        challenges: [
            "Disconnected ERP, PLM, and MES systems.",
            "Manual data re-entry causing errors.",
            "Lack of real-time inventory visibility.",
            "Slow response to supply chain disruptions."
        ],
        solutions: [
            "Event-driven integration architecture.",
            "Automated data synchronization.",
            "Unified dashboarding.",
            "Proactive alerting and self-healing flows."
        ],
        techStack: ["MuleSoft", "Boomi", "Azure Logic Apps", "Apache Kafka"],
        faqs: [
            { question: "Do you build custom connectors?", answer: "Yes, we build custom API wrappers for legacy systems lacking modern endpoints." }
        ]
    },
    {
        id: "cloud",
        title: "Cloud Transformation",
        slug: "cloud-transformation",
        shortDescription: "Scalable cloud architecture, migration, and managed services.",
        iconName: "Cloud",
        description: "Accelerate your digital journey with our cloud transformation services. Whether moving on-premise workloads to the cloud or optimizing cloud-native applications, we ensure security, scalability, and cost-efficiency. We specialize in Azure, AWS, and Google Cloud environments.",
        features: [
            "Cloud Readiness Assessment",
            "Lift-and-Shift to Cloud Native conversion",
            "DevSecOps Pipeline Implementation",
            "Infrastructure as Code (IaC)",
            "Containerization & Microservices (Kubernetes)",
            "Cloud Cost Optimization (FinOps)"
        ],
        outcomes: [
            "Dynamic scalability to meet demand",
            "Enhanced security posture",
            "Reduced IT infrastructure overhead",
            "Faster deployment cycles",
            "Global accessibility for distributed teams"
        ],
        process: [
            { title: "Cloud Strategy", description: "Selecting the right provider and service models (IaaS/PaaS)." },
            { title: "Migration", description: "Moving workloads securely (Lift & Shift or Refactor)." },
            { title: "Optimization", description: "Rightsizing instances and implementing cost controls." },
            { title: "Management", description: "Ongoing monitoring, security patching, and support.", iconName: "Activity" }
        ],
        valueProps: [
            { title: "Cost Optimization", description: "Pay only for what you use with auto-scaling infrastructure.", iconName: "DollarSign" },
            { title: "Enhanced Security", description: "Enterprise-grade security and compliance out of the box.", iconName: "Lock" },
            { title: "Global Reach", description: "Deploy applications closer to users with CDN and edge locations.", iconName: "Map" },
            { title: "Innovation Speed", description: "Spin up new environments in minutes, not months.", iconName: "Zap" }
        ],
        relatedServices: ["iot-connected-operations", "data-migration", "integration"],
        challenges: [
            "High on-premise infrastructure costs.",
            "Difficulty scaling for global teams.",
            "Security vulnerabilities.",
            "Slow hardware procurement cycles."
        ],
        solutions: [
            "Elastic cloud infrastructure.",
            "Zero-trust security models.",
            "Global CDN and edge caching.",
            "Instant provisioning via IaC."
        ],
        techStack: ["AWS", "Microsoft Azure", "Google Cloud", "Terraform", "Docker", "Kubernetes"],
        faqs: [
            { question: "Is cloud PLM secure?", answer: "Yes, often more secure than on-premise due to dedicated security teams and modern encryption standards." }
        ]
    },
    {
        id: "digital-eng",
        title: "Digital Engineering",
        slug: "digital-engineering",
        shortDescription: "CAD automation, simulation, and model-based systems engineering.",
        iconName: "Cpu",
        description: "Reimagine how you design and validate products. Our Digital Engineering services leverage advanced simulation, model-based systems engineering (MBSE), and CAD automation to drive innovation and reduce reliance on physical prototyping.",
        features: [
            "Model-Based Systems Engineering (MBSE)",
            "CAD Automation & Scripting",
            "Simulation & Digital Twin Development",
            "AR/VR for Design Review",
            "Generative Design Implementation",
            "Engineering Process Optimization"
        ],
        outcomes: [
            "Significant reduction in physical prototypes",
            "Early detection of design flaws",
            "Optimized product performance",
            "Captured engineering knowledge",
            "Faster design iteration cycles"
        ],
        process: [
            { title: "Review", description: "Analyzing current design processes and bottlenecks." },
            { title: "Automation", description: "Scripting repetitive tasks and integrating simulation." },
            { title: "MBSE", description: "Implementing model-based approaches for complex systems." },
            { title: "Verification", description: "Validating designs virtually before prototyping.", iconName: "CheckCircle" }
        ],
        valueProps: [
            { title: "Reduced Prototyping", description: "Cut physical prototyping costs by up to 70%.", iconName: "Box" },
            { title: "Design Optimization", description: "Explore thousands of design variants automatically.", iconName: "Cpu" },
            { title: "Early Error Detection", description: "Find and fix issues before cutting metal.", iconName: "AlertTriangle" },
            { title: "Knowledge Capture", description: "Standardize engineering calculations and rules.", iconName: "BookOpen" }
        ],
        relatedServices: ["plm-services", "digital-manufacturing", "cloud-transformation"],
        challenges: [
            "Over-reliance on physical prototypes.",
            "Design flaws discovered late in production.",
            "Lack of design reuse.",
            "Manual, repetitive engineering calculations."
        ],
        solutions: [
            "Virtual validation and simulation.",
            "Automated design scripting.",
            "Model-Based Systems Engineering.",
            "Knowledge capture and reuse libraries."
        ],
        techStack: ["Ansys", "Matlab", "Simulink", "Python", "C#"],
        faqs: [
            { question: "What sizes of companies do you work with?", answer: "We work with startups to Fortune 500 OEMs in automotive, aerospace, and medical devices." }
        ]
    },
    {
        id: "digital-mfg",
        title: "Digital Manufacturing",
        slug: "digital-manufacturing",
        shortDescription: "MOM/MES implementation and smart factory solutions.",
        iconName: "Factory",
        description: "Bridge the gap between engineering and the shop floor. We implement Manufacturing Operations Management (MOM) and Manufacturing Execution Systems (MES) that provide real-time control and visibility over production processes, quality, and maintenance.",
        features: [
            "MES Strategy & Vendor Selection",
            "Paperless Manufacturing Implementation",
            "Production Scheduling & Planning",
            "Quality Management Systems (QMS)",
            "Machine Connectivity (OPC-UA, MQTT)",
            "Overall Equipment Effectiveness (OEE) Tracking"
        ],
        outcomes: [
            "Increased plant throughput",
            "Reduced scrap and waste",
            "Traceability for compliance",
            "Real-time production monitoring",
            "Predictive maintenance capabilities"
        ],
        process: [
            { title: "Plant Audit", description: "Mapping shop floor processes and equipment connectivity." },
            { title: "Solution Design", description: "Defining MES/MOM architecture and user interfaces." },
            { title: "Pilot", description: "Deploying on a single line to validate ROI." },
            { title: "Rollout", description: "Scaling to full production across all sites.", iconName: "Spreadsheet" }
        ],
        valueProps: [
            { title: "Increased Throughput", description: "Optimize machine utilization and reduce cycle times.", iconName: "BarChart" },
            { title: "Paperless Operations", description: "Eliminate paper travelers and work instructions.", iconName: "FileText" },
            { title: "Quality Control", description: "Catch defects in real-time with automated inspection.", iconName: "Search" },
            { title: "Traceability", description: "Complete genealogy for every product produced.", iconName: "GitCommit" }
        ],
        relatedServices: ["iot-connected-operations", "plm-services", "integration"],
        challenges: [
            "Paper-based travelers and work instructions.",
            "Lack of real-time production visibility.",
            "Unplanned machine downtime.",
            "Inconsistent quality tracking."
        ],
        solutions: [
            "Digital work instructions.",
            "Real-time OEE dashboards.",
            "Predictive maintenance alerts.",
            "Automated quality data capture."
        ],
        techStack: ["Siemens Opcenter", "Rockwell FactoryTalk", "SAP DM", "Ignition"],
        faqs: [
            { question: "Do you support legacy machines?", answer: "Yes, we use IoT gateways to extract data from legacy PLCs and sensors." }
        ]
    },
    {
        id: "iot",
        title: "IoT & Connected Operations",
        slug: "iot-connected-operations",
        shortDescription: "Real-time visibility and analytics for connected assets.",
        iconName: "Wifi",
        description: "Unlock value from your connected assets. We build end-to-end IoT solutions that collect, analyze, and act on data from sensors and devices. From smart products to connected factories, we help you harness the power of the Industrial Internet of Things (IIoT).",
        features: [
            "IIoT Platform Implementation (ThingWorx, Azure IoT)",
            "Edge Computing Solutions",
            "Sensor Integration & Data Acquisition",
            "Remote Asset Monitoring",
            "Predictive Analytics & Maintenance",
            "IoT Security Frameworks"
        ],
        outcomes: [
            "New service-based revenue models",
            "Reduced unplanned downtime",
            "Energy consumption optimization",
            "Enhanced customer experience",
            "Data-driven product improvements"
        ],
        process: [
            { title: "Use Case", description: "Defining value creating scenarios for connected data." },
            { title: "Connectivity", description: "Selecting sensors and protocols for data acquisition." },
            { title: "Platform", description: "Ingesting and processing data at scale." },
            { title: "Action", description: "Building applications and dashboards for insights.", iconName: "Lightbulb" }
        ],
        valueProps: [
            { title: "New Revenue Models", description: "Enable Product-as-a-Service and usage-based billing.", iconName: "CreditCard" },
            { title: "Predictive Maintenance", description: "Fix issues before they cause downtime.", iconName: "Wrench" },
            { title: "Customer Insights", description: "Understand exactly how customers use your products.", iconName: "UserCheck" },
            { title: "Remote Updates", description: "Push software updates and feature unlocks over the air.", iconName: "UploadCloud" }
        ],
        relatedServices: ["digital-manufacturing", "cloud-transformation", "enterprise-systems"],
        challenges: [
            "Dark data from unconnected assets.",
            "Reactive service models.",
            "Inability to monetize usage data.",
            "Security concerns with connected devices."
        ],
        solutions: [
            "Secure edge-to-cloud connectivity.",
            "Predictive service algorithms.",
            "Usage-based billing models.",
            "End-to-end device identity management."
        ],
        techStack: ["Azure IoT Hub", "AWS IoT Core", "ThingWorx", "MQTT"],
        faqs: [
            { question: "Is IoT expensive to implement?", answer: "We start with high-ROI pilot projects to prove value before scaling." }
        ]
    },
    {
        id: "enterprise",
        title: "Enterprise Systems",
        slug: "enterprise-systems",
        shortDescription: "Optimization of ERP and business-critical applications.",
        iconName: "LayoutGrid",
        description: "Ensure your backbone business systems are agile and aligned with your strategy. We provide consulting and implementation services for major ERP platforms, ensuring they support your evolving business models and integrate seamlessly with your technical ecosystem.",
        features: [
            "ERP Implementation & Upgrades",
            "Business Process Re-engineering",
            "Supply Chain Management (SCM) Solutions",
            "Customer Relationship Management (CRM) Integration",
            "Business Intelligence & Reporting",
            "Change Management & Training"
        ],
        outcomes: [
            "Streamlined business operations",
            "Wait-time reduction in workflows",
            "Improved financial visibility",
            "Enhanced supplier collaboration",
            "Higher user adoption rates"
        ],
        process: [
            { title: "Analysis", description: "Gap analysis between business needs and ERP capabilities." },
            { title: "Configuration", description: "Tailoring the system to map to optimized workflows." },
            { title: "Testing", description: "Rigorous UAT and performance validation." },
            { title: "Go-Live", description: "Supported launch with hyper-care period.", iconName: "Flag" }
        ],
        valueProps: [
            { title: "Unified Operations", description: "Single system of record for finance, HR, and supply chain.", iconName: "Server" },
            { title: "Real-Time Reporting", description: "Instant access to financial and operational KPIs.", iconName: "PieChart" },
            { title: "Standardized Processes", description: "Enforce best practices across global subsidiaries.", iconName: "Globe" },
            { title: "Improved Margins", description: "Identify and eliminate inefficiencies in the value chain.", iconName: "TrendingUp" }
        ],
        relatedServices: ["integration", "data-migration", "plm-services"],
        challenges: [
            "Rigid systems that don't match reality.",
            "Poor user adoption.",
            "Difficulty reporting across regions.",
            "Supply chain opacity."
        ],
        solutions: [
            "Process-first configuration.",
            "Intuitive UI overlays.",
            "Global template rollouts.",
            "Real-time inventory tracking."
        ],
        techStack: ["SAP S/4HANA", "Oracle NetSuite", "Microsoft Dynamics 365"],
        faqs: [
            { question: "Do you handle training?", answer: "Yes, we provide comprehensive role-based training and documentation." }
        ]
    },
    {
        id: "cyber-security",
        title: "Cyber Security & Industrial Defense",
        slug: "cyber-security",
        shortDescription: "Comprehensive protection for IT/OT convergence and intellectual property.",
        iconName: "Shield",
        description: "In the era of Industry 4.0, the convergence of IT and OT systems creates new vulnerabilities. Our Cyber Security practice is specifically tailored for manufacturing environments, protecting your intellectual property, production uptime, and connected assets from evolving digital threats.",
        features: [
            "OT/ICS Security Assessments",
            "NIST / ISO 27001 Compliance",
            "Secure Remote Access Solutions",
            "Industrial Network Segmentation",
            "Threat Detection & Response (XDR)",
            "Vulnerability Management"
        ],
        outcomes: [
            "Zero disruption to production lines",
            "Protection of critical IP and designs",
            "Compliance with global regulations",
            "Secure collaboration with partners",
            "Reduced improved resilience to ransomware"
        ],
        process: [
            { title: "Assess", description: "Vulnerability scanning of IT and OT environment." },
            { title: "Harden", description: "Implementing firewalls, segmentation, and access controls." },
            { title: "Monitor", description: "24/7 scanning for anomalies and threats." },
            { title: "Respond", description: "Rapid incident response protocols to minimize impact.", iconName: "Siren" }
        ],
        valueProps: [
            { title: "Production Uptime", description: "Prevent cyber-attacks from stopping your assembly lines.", iconName: "Activity" },
            { title: "IP Protection", description: "Safeguard your designs and trade secrets from theft.", iconName: "Lock" },
            { title: "Regulatory Readiness", description: "Ensure compliance with CMMC, GDPR, and other standards.", iconName: "FileCheck" },
            { title: "Secure Access", description: "Enable vendors to support machines remotely without risk.", iconName: "Key" }
        ],
        relatedServices: ["iot-connected-operations", "cloud-transformation", "enterprise-systems"],
        challenges: [
            "Legacy machines running outdated OS.",
            "Unsecured remote access points.",
            "Convergence of IT and OT networks.",
            "Lack of visibility into industrial traffic."
        ],
        solutions: [
            "Industrial DMZ implementation.",
            "Passive network monitoring.",
            "Identity and Access Management (IAM).",
            "Virtual patching for legacy assets."
        ],
        techStack: ["Claroty", "Nozomi Networks", "Palo Alto Networks", "CrowdStrike"],
        faqs: [
            { question: "Do you secure legacy PLCs?", answer: "Yes, we implement compensating controls to secure legacy hardware that cannot be patched." }
        ]
    },
];
