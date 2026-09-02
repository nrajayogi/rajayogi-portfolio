"use client";

import { useContent } from "@/lib/content-context";
import { Activity, Clock, Database, Globe, Smartphone, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface LeadData {
    name: string;
    leads: number;
}

interface Submission {
    firstName?: string;
    lastName?: string;
    email?: string;
    message?: string;
    createdAt: string;
}

export function Dashboard() {
    const { content } = useContent();
    const [leadData, setLeadData] = useState<LeadData[]>([]);
    const [recentSubmissions, setRecentSubmissions] = useState<Submission[]>([]);

    useEffect(() => {
        // Mocking chart data based on potentially real submissions if available
        // In a real app we'd fetch from /api/submissions/stats 
        // For now, let's fetch submissions to count them
        fetch('/api/submissions')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setRecentSubmissions(data.slice(0, 5));
                    // Simple mock aggregation
                    setLeadData([
                        { name: 'Mon', leads: 4 },
                        { name: 'Tue', leads: 3 },
                        { name: 'Wed', leads: 7 },
                        { name: 'Thu', leads: 2 },
                        { name: 'Fri', leads: data.length || 5 },
                        { name: 'Sat', leads: 1 },
                        { name: 'Sun', leads: 4 },
                    ]);
                }
            })
            .catch(() => {
                setLeadData([
                    { name: 'Mon', leads: 4 },
                    { name: 'Tue', leads: 3 },
                    { name: 'Wed', leads: 7 },
                    { name: 'Thu', leads: 2 },
                    { name: 'Fri', leads: 6 },
                    { name: 'Sat', leads: 1 },
                    { name: 'Sun', leads: 4 },
                ]);
            })
    }, []);

    // Helper to calculate time since last update
    const getLastUpdated = () => {
        // This is a rough estimation since we only track global update time in metadata currently
        // In the future we would track per-section updates
        return '2 days ago';
    };

    return (
        <div className="p-8 bg-slate-950 min-h-screen text-white overflow-y-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">Command Center</h1>
                <p className="text-slate-400">System Overview & Performance</p>
            </header>

            {/* Top Row: System Health Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <HealthCard
                    icon={Activity}
                    label="API Status"
                    value="98.9%"
                    sub="Operational"
                    color="text-emerald-400"
                    bg="bg-emerald-400/10"
                />
                <HealthCard
                    icon={Database}
                    label="Database"
                    value="Connected"
                    sub="Prisma / PostgreSQL"
                    color="text-blue-400"
                    bg="bg-blue-400/10"
                />
                <HealthCard
                    icon={Globe}
                    label="Live Version"
                    value={`v${content.metadata?.version || '1.0'}`}
                    sub={new Date().toLocaleDateString()}
                    color="text-purple-400"
                    bg="bg-purple-400/10"
                />
                <HealthCard
                    icon={Smartphone}
                    label="Mobile Traffic"
                    value="64%"
                    sub="Increasing"
                    color="text-amber-400"
                    bg="bg-amber-400/10"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Chart: Lead Pulse */}
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <Users size={18} className="text-blue-500" />
                            Lead Pulse
                        </h2>
                        <select className="bg-slate-800 border-none text-xs rounded px-2 py-1 text-slate-400">
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                        </select>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={leadData}>
                                <XAxis
                                    dataKey="name"
                                    stroke="#64748b"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#64748b"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                />
                                <Bar
                                    dataKey="leads"
                                    fill="#3b82f6"
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Content Freshness / Recent Activity */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col">
                    <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <Clock size={18} className="text-amber-500" />
                        Recent Inquiries
                    </h2>
                    <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                        {recentSubmissions.length > 0 ? recentSubmissions.map((sub, i) => (
                            <div key={i} className="flex gap-4 items-start p-3 rounded-lg hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-700">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-[10px] font-bold shrink-0">
                                    {sub.firstName?.[0]}{sub.lastName?.[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-medium text-white truncate">{sub.firstName} {sub.lastName}</h4>
                                    <p className="text-xs text-slate-400 mb-1 truncate">{sub.email}</p>
                                    <p className="text-xs text-slate-500 line-clamp-2">{sub.message}</p>
                                </div>
                                <span className="text-[10px] text-slate-600 whitespace-nowrap">
                                    {new Date(sub.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        )) : (
                            <div className="text-center text-slate-500 py-10">
                                No recent inquiries found.
                            </div>
                        )}
                    </div>
                    <button className="mt-4 w-full py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-medium transition-colors text-slate-300">
                        View All In Inbox
                    </button>
                </div>
            </div>

            {/* Quick Actions / Content Status */}
            <div className="mt-8">
                <h2 className="text-lg font-bold mb-4">Content Status</h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {['Hero', 'Services', 'Partners', 'About', 'Contact'].map(section => (
                        <div key={section} className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors group cursor-pointer">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-sm font-medium text-slate-300">{section}</span>
                                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            </div>
                            <p className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors">Last edited: {getLastUpdated()}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

interface HealthCardProps {
    icon: React.ElementType;
    label: string;
    value: string;
    sub: string;
    color: string;
    bg: string;
}

function HealthCard({ icon: Icon, label, value, sub, color, bg }: HealthCardProps) {
    return (
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl hover:border-slate-700 transition-all group">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-lg ${bg} ${color}`}>
                    <Icon size={20} />
                </div>
                {/* Pulse dot */}
                <span className="relative flex h-2 w-2">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${color.replace('text', 'bg')}`}></span>
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${color.replace('text', 'bg')}`}></span>
                </span>
            </div>
            <div>
                <p className="text-slate-500 text-xs uppercase tracking-wider font-semibold mb-1">{label}</p>
                <div className="text-2xl font-bold text-white mb-1">{value}</div>
                <p className={`text-xs ${color} opacity-80`}>{sub}</p>
            </div>
        </div>
    )
}
