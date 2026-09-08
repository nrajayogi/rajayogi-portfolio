"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
    X, 
    Download, 
    ExternalLink, 
    FileText, 
    GraduationCap, 
    Briefcase, 
    Sparkles, 
    CheckCircle2, 
    Code, 
    Figma, 
    Globe, 
    Mail, 
    Phone, 
    MapPin, 
    Languages, 
    Eye
} from "lucide-react";

interface ResumeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
    const [viewMode, setViewMode] = useState<"interactive" | "original">("interactive");

    if (!isOpen) return null;

    const experiences = [
        {
            role: "Project-based UI/UX Designer",
            company: "Homemade B.V.",
            period: "Sep 2024 — Feb 2026",
            location: "Enschede, Netherlands",
            domain: "Food Tech & Behavioral Incentive Architecture",
            tag: "PRODUCTION",
            github: "https://github.com/nrajayogi/homemade",
            website: "https://www.homemadechefs.com/"
        },
        {
            role: "UI/UX Design Intern",
            company: "AXAL Power B.V.",
            period: "April 2025 — August",
            location: "Enschede, Netherlands",
            domain: "CleanTech Hardware UI & CPMS Cloud Energy",
            tag: "CLEANTECH",
            website: "https://axalpower.com/"
        },
        {
            role: "Visiting Project Research Engineer",
            company: "IIT Kanpur",
            period: "Aug 2022 — June 2024",
            location: "Kanpur, India",
            domain: "Systems Research & Threat Telemetry",
            tag: "RESEARCH"
        },
        {
            role: "User Experience Specialist",
            company: "C3i Hub IIT Kanpur",
            period: "Jul 2022 — June 2024",
            location: "Kanpur, India",
            domain: "Cybersecurity & Forensic Investigative Workbench",
            tag: "CYBERSEC"
        },
        {
            role: "User Experience Lead",
            company: "Brang",
            period: "Nov 2021 — May 2022",
            location: "Australia",
            domain: "Product UX Architecture",
            tag: "LEAD"
        },
        {
            role: "User Interface & UX Designer (Intern)",
            company: "Superworld",
            period: "Feb 2021 — Oct 2021",
            location: "United States",
            domain: "Spatial & Virtual Worlds",
            tag: "XR / VIRTUAL"
        }
    ];

    const education = [
        {
            institution: "University of Twente",
            degree: "Masters in Interaction Technology",
            period: "Sep 2024 — July 2026",
            grade: "GPA 7.2",
            location: "Enschede, Netherlands",
            highlight: "Thesis: Worker-Centered Industrial XR Hoist Assistance"
        },
        {
            institution: "Koneru Lakshmaiah University (KLU)",
            degree: "B.Tech in Computer Science & Engineering",
            period: "July 2023",
            grade: "GPA 7.5",
            location: "India"
        },
        {
            institution: "University of Illinois at Chicago (UIC)",
            degree: "Engineering & Design Foundation",
            period: "August 2017 — December 2019",
            location: "Chicago, USA"
        },
        {
            institution: "Awwwards Academy",
            degree: "Memorable UI Design for Interactive Experiences",
            period: "December 2023",
            location: "Global"
        }
    ];

    const ventures = [
        { name: "Startnew", role: "Co-Founder", location: "Netherlands", status: "Paused" },
        { name: "KISSS", role: "Co-Founder", location: "India", status: "August 2022 — Present (Paused)" }
    ];

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 md:p-10">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/85 backdrop-blur-xl"
                />

                {/* Modal Container */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.94, y: 24 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.94, y: 24 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="relative w-full max-w-5xl max-h-[92vh] bg-[#0A0A0F] border border-white/15 rounded-[4px] shadow-[0_25px_70px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col z-10 text-white"
                >
                    {/* Header Bar */}
                    <div className="p-5 sm:p-6 border-b border-white/10 flex flex-wrap items-center justify-between gap-4 bg-[#12121A]/90 backdrop-blur-md sticky top-0 z-30">
                        <div className="flex items-center gap-3">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#CCFF00] animate-pulse" />
                            <div>
                                <h3 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2 font-sans">
                                    <span>RAJAYOGI NANDINA // OFFICIAL CV</span>
                                    <span className="text-[10px] font-sans px-2 py-0.5 rounded-[4px] bg-white/10 text-white/70 border border-white/10">
                                        M.Sc. I-TECH
                                    </span>
                                </h3>
                                <p className="text-[11px] font-sans text-white/50">
                                    DECLASSIFIED ARCHIVE · TOTAL PROJECTS: 12+ · ENSCHEDE, NL
                                </p>
                            </div>
                        </div>

                        {/* Top Controls */}
                        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
                            {/* Toggle View Mode */}
                            <div className="flex items-center p-1 rounded-[4px] bg-white/5 border border-white/10">
                                <button
                                    onClick={() => setViewMode("interactive")}
                                    className={`px-2.5 py-1 rounded-[4px] text-xs font-sans transition-all ${
                                        viewMode === "interactive" 
                                            ? "bg-[#CCFF00] text-black font-bold shadow-sm" 
                                            : "text-white/60 hover:text-white"
                                    }`}
                                >
                                    Dossier View
                                </button>
                                <button
                                    onClick={() => setViewMode("original")}
                                    className={`px-2.5 py-1 rounded-[4px] text-xs font-sans transition-all ${
                                        viewMode === "original" 
                                            ? "bg-[#CCFF00] text-black font-bold shadow-sm" 
                                            : "text-white/60 hover:text-white"
                                    }`}
                                >
                                    Original Scan
                                </button>
                            </div>

                            {/* Download PDF Button */}
                            <a
                                href="/Rajayogi_Nandina_Resume.pdf"
                                download="Rajayogi_Nandina_Resume.pdf"
                                data-track-action="DOWNLOAD_RESUME"
                                data-track-title="Rajayogi_Nandina_Resume.pdf"
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-white text-black hover:bg-[#CCFF00] text-xs font-sans font-bold tracking-wider transition-all shadow-md"
                            >
                                <Download size={13} />
                                <span className="hidden sm:inline">PDF</span>
                            </a>

                            {/* Figma Link */}
                            <a
                                href="https://www.figma.com/design/ojbXGMlyGZzwofQsCp651d/Portfolio?m=auto&t=nVbnyyDjAJzu5tzD-6"
                                target="_blank"
                                rel="noopener noreferrer"
                                data-track-action="CLICK_EXTERNAL_FIGMA"
                                data-track-title="Figma Master Design System Canvas"
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-sans transition-all"
                                title="Open Figma Source Portfolio"
                            >
                                <Figma size={13} className="text-[#00F0FF]" />
                                <span className="hidden md:inline">Figma</span>
                                <ExternalLink size={11} />
                            </a>

                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="p-1.5 rounded-[4px] bg-white/5 hover:bg-white/15 text-white/60 hover:text-white transition-colors cursor-pointer"
                                aria-label="Close"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Modal Scrollable Body */}
                    <div className="p-6 md:p-8 overflow-y-auto space-y-8 max-h-[calc(92vh-80px)]">
                        
                        {viewMode === "original" ? (
                            /* ORIGINAL DOCUMENT VIEW */
                            <div className="flex flex-col items-center w-full">
                                <div className="w-full max-w-4xl h-[72vh] rounded-[4px] overflow-hidden border-2 border-white/20 shadow-2xl bg-white hidden sm:block">
                                    <iframe
                                        src="/Rajayogi_Nandina_Resume.pdf#view=FitH"
                                        className="w-full h-full border-0"
                                        title="Rajayogi Nandina Resume PDF"
                                    />
                                </div>
                                <div className="relative w-full max-w-2xl rounded-[4px] overflow-hidden border-2 border-white/20 shadow-2xl bg-white sm:hidden">
                                    <Image
                                        src="/images/resume-preview.png"
                                        alt="Rajayogi Nandina Resume"
                                        width={1200}
                                        height={1600}
                                        className="w-full h-auto object-contain"
                                        priority
                                    />
                                </div>
                                <div className="mt-5 flex flex-wrap justify-center gap-4">
                                    <a
                                        href="/Rajayogi_Nandina_Resume.pdf"
                                        download="Rajayogi_Nandina_Resume.pdf"
                                        className="px-6 py-2.5 rounded-[4px] bg-[#CCFF00] text-black font-bold text-xs font-sans uppercase tracking-widest hover:bg-white transition-all shadow-lg flex items-center gap-2"
                                    >
                                        <Download size={14} />
                                        <span>Download High-Res PDF (2.3MB)</span>
                                    </a>
                                    <a
                                        href="/Rajayogi_Nandina_Resume.pdf"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-6 py-2.5 rounded-[4px] bg-white/10 text-white font-bold text-xs font-sans uppercase tracking-widest hover:bg-white/20 transition-all border border-white/20 flex items-center gap-2"
                                    >
                                        <ExternalLink size={14} />
                                        <span>Open PDF In New Tab</span>
                                    </a>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* INTERACTIVE BRUTALIST DOSSIER VIEW */}
                                {/* Identity & Quick Contact Matrix */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="p-5 rounded-[4px] bg-white/[0.03] border border-white/10 md:col-span-2 flex flex-col justify-between">
                                        <div>
                                            <div className="text-[10px] font-sans uppercase text-[#00F0FF] tracking-widest mb-1">
                                                CANDIDATE DOSSIER // DECLASSIFIED
                                            </div>
                                            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                                                Rajayogi Nandina
                                            </h2>
                                            <p className="text-sm text-neutral-300 mt-1 font-sans">
                                                Masters Student in Interaction Technology (M.Sc. I-Tech) at the University of Twente. Specializing in spatial computing, physical human-robot collaboration, and high-density digital systems.
                                            </p>
                                        </div>
                                        <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap gap-4 text-xs font-sans text-white/60">
                                            <span className="flex items-center gap-1.5 text-white/80">
                                                <MapPin size={12} className="text-[#CCFF00]" /> Enschede, Netherlands
                                            </span>
                                            <span className="flex items-center gap-1.5 text-white/80">
                                                <Mail size={12} className="text-[#00F0FF]" /> rajayogi2000@gmail.com
                                            </span>
                                            <span className="flex items-center gap-1.5 text-white/80">
                                                <Phone size={12} className="text-[#FF007F]" /> (+31) 6 29780970
                                            </span>
                                        </div>
                                    </div>

                                    {/* Languages & Thesis Tag */}
                                    <div className="p-5 rounded-[4px] bg-white/[0.03] border border-white/10 flex flex-col justify-between space-y-4">
                                        <div>
                                            <div className="text-[10px] font-sans uppercase text-[#CCFF00] tracking-widest mb-2 flex items-center gap-1.5">
                                                <Languages size={13} />
                                                <span>Languages</span>
                                            </div>
                                            <div className="space-y-1.5 text-xs font-sans">
                                                <div className="flex justify-between text-neutral-300">
                                                    <span>English</span>
                                                    <span className="text-[#00F0FF]">Professional Working</span>
                                                </div>
                                                <div className="flex justify-between text-neutral-300">
                                                    <span>Dutch</span>
                                                    <span className="text-amber-400">Learner</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-3 border-t border-white/10">
                                            <div className="text-[10px] font-sans uppercase text-white/50 tracking-widest mb-1">
                                                M.Sc. Thesis Domain
                                            </div>
                                            <p className="text-xs text-white/80 font-sans leading-tight">
                                                Voice, suggested & semi-automatic hoist XR assistance (N=15 empirical study).
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Experience Section */}
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-xs font-sans uppercase tracking-widest text-[#CCFF00] flex items-center gap-2">
                                            <Briefcase size={14} />
                                            <span>Industry Experience & Roles</span>
                                        </h4>
                                        <span className="text-[10px] font-sans text-white/40">6 TOTAL ROLES</span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {experiences.map((exp, i) => (
                                            <div
                                                key={i}
                                                className="p-4 rounded-[4px] bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 transition-colors flex flex-col justify-between"
                                            >
                                                <div>
                                                    <div className="flex items-center justify-between mb-1.5">
                                                        <span className="text-[9px] font-sans font-bold px-2 py-0.5 rounded-[4px] bg-white/10 text-[#00F0FF]">
                                                            {exp.tag}
                                                        </span>
                                                        <span className="text-[10px] font-sans text-white/50">
                                                            {exp.period}
                                                        </span>
                                                    </div>
                                                    <h5 className="font-bold text-sm text-white">{exp.role}</h5>
                                                    <p className="text-xs text-[#CCFF00] font-sans mt-0.5">{exp.company} · {exp.location}</p>
                                                    <p className="text-xs text-neutral-400 mt-2 font-sans">{exp.domain}</p>
                                                </div>

                                                {(exp.website || exp.github) && (
                                                    <div className="mt-3 pt-2 border-t border-white/5 flex gap-3 text-[10px] font-sans">
                                                        {exp.website && (
                                                            <a
                                                                href={exp.website}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-cyan-300 hover:underline flex items-center gap-1"
                                                            >
                                                                <span>Live Product ↗</span>
                                                            </a>
                                                        )}
                                                        {exp.github && (
                                                            <a
                                                                href={exp.github}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-amber-300 hover:underline flex items-center gap-1"
                                                            >
                                                                <span>Code Repo ↗</span>
                                                            </a>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Extracurricular Entrepreneurship */}
                                <div>
                                    <div className="text-xs font-sans uppercase tracking-widest text-[#FF007F] mb-3 flex items-center gap-2">
                                        <Sparkles size={14} />
                                        <span>Entrepreneurship & Ventures</span>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {ventures.map((v, i) => (
                                            <div key={i} className="p-4 rounded-[4px] bg-white/[0.02] border border-white/10">
                                                <div className="flex items-center justify-between">
                                                    <h5 className="font-bold text-sm text-white">{v.name}</h5>
                                                    <span className="text-[10px] font-sans px-2 py-0.5 rounded-[4px] bg-white/5 text-neutral-400">
                                                        {v.status}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-neutral-400 mt-1">{v.role} · {v.location}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Skills Matrix */}
                                <div>
                                    <div className="text-xs font-sans uppercase tracking-widest text-[#00F0FF] mb-3 flex items-center gap-2">
                                        <Code size={14} />
                                        <span>Skills & Technologies</span>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div className="p-4 rounded-[4px] bg-white/[0.02] border border-white/10">
                                            <div className="text-[10px] font-sans uppercase text-white/50 mb-2">Design Core</div>
                                            <div className="flex flex-wrap gap-1.5 text-xs">
                                                {["Web Design", "Mobile Design", "User Experience", "Wireframing", "Prototyping", "Testing", "Design Systems"].map((s, idx) => (
                                                    <span key={idx} className="px-2 py-1 rounded-[4px] bg-white/5 text-neutral-300 text-[11px]">
                                                        {s}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="p-4 rounded-[4px] bg-white/[0.02] border border-white/10">
                                            <div className="text-[10px] font-sans uppercase text-white/50 mb-2">Development</div>
                                            <div className="flex flex-wrap gap-1.5 text-xs">
                                                {["HTML5", "CSS3", "React JS", "Next.js", "React Native", "TypeScript"].map((s, idx) => (
                                                    <span key={idx} className="px-2 py-1 rounded-[4px] bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-[11px]">
                                                        {s}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="p-4 rounded-[4px] bg-white/[0.02] border border-white/10">
                                            <div className="text-[10px] font-sans uppercase text-white/50 mb-2">Tools & Modern AI</div>
                                            <div className="flex flex-wrap gap-1.5 text-xs">
                                                {["Figma", "Unity", "Miro", "Anti Gravity", "Claude", "Cursor", "Adobe Suite"].map((s, idx) => (
                                                    <span key={idx} className="px-2 py-1 rounded-[4px] bg-[#CCFF00]/10 text-[#CCFF00] border border-[#CCFF00]/20 text-[11px]">
                                                        {s}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Education & Academic Track */}
                                <div>
                                    <div className="text-xs font-sans uppercase tracking-widest text-[#CCFF00] mb-3 flex items-center gap-2">
                                        <GraduationCap size={14} />
                                        <span>Education & Certifications</span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {education.map((edu, i) => (
                                            <div key={i} className="p-4 rounded-[4px] bg-white/[0.02] border border-white/10">
                                                <div className="flex items-center justify-between text-[10px] font-sans text-white/50 mb-1">
                                                    <span>{edu.period}</span>
                                                    {edu.grade && <span className="text-[#CCFF00] font-bold">{edu.grade}</span>}
                                                </div>
                                                <h5 className="font-bold text-sm text-white">{edu.institution}</h5>
                                                <p className="text-xs text-neutral-300 mt-0.5">{edu.degree}</p>
                                                {edu.highlight && (
                                                    <p className="text-[11px] text-[#00F0FF] mt-2 font-sans">
                                                        ↳ {edu.highlight}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
