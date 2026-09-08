"use client";

import { useEffect, useState } from "react";
import { Mail, Clock, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface Submission {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    message: string;
    date: string;
    status: 'unread' | 'read';
}

export function Inbox() {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    useEffect(() => {
        fetch('/api/submissions')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setSubmissions(data);
                }
            })
            .catch(err => console.error("Failed to fetch submissions", err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-8 text-slate-400">Loading inbox...</div>;

    const selectedSubmission = submissions.find(s => s.id === selectedId);

    return (
        <div className="h-full flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-800 bg-slate-900 text-slate-100">
            {/* List */}
            <div className="w-full md:w-1/3 overflow-y-auto h-[300px] md:h-full">
                <div className="p-4 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <Mail className="text-blue-500" size={20} />
                        Inbox ({submissions.length})
                    </h2>
                </div>
                {submissions.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 text-sm">No messages yet.</div>
                ) : (
                    <div className="divide-y divide-slate-800/50">
                        {submissions.map(sub => (
                            <div
                                key={sub.id}
                                onClick={() => setSelectedId(sub.id)}
                                className={cn(
                                    "p-4 cursor-pointer hover:bg-slate-800/50 transition-colors",
                                    selectedId === sub.id ? "bg-slate-800 border-l-2 border-blue-500" : "border-l-2 border-transparent"
                                )}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className={cn("font-medium text-sm truncate pr-2", sub.status === 'unread' ? "text-white" : "text-slate-400")}>
                                        {sub.firstName} {sub.lastName}
                                    </span>
                                    <span className="text-[10px] text-slate-500 whitespace-nowrap">
                                        {new Date(sub.date).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="text-xs text-slate-500 truncate">{sub.email}</div>
                                <p className="text-xs text-slate-400 mt-2 line-clamp-2">{sub.message}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Detail */}
            <div className="w-full md:w-2/3 h-full overflow-y-auto bg-slate-900/50">
                {selectedSubmission ? (
                    <div className="p-8">
                        <div className="flex justify-between items-start mb-8 border-b border-slate-800 pb-6">
                            <div>
                                <h1 className="text-2xl font-semibold text-white mb-2">
                                    {selectedSubmission.firstName} {selectedSubmission.lastName}
                                </h1>
                                <a href={`mailto:${selectedSubmission.email}`} className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-2">
                                    <Mail size={14} /> {selectedSubmission.email}
                                </a>
                            </div>
                            <div className="text-right text-slate-500 text-sm flex flex-col items-end gap-1">
                                <span className="flex items-center gap-1"><Clock size={14} /> {new Date(selectedSubmission.date).toLocaleTimeString()}</span>
                                <span>{new Date(selectedSubmission.date).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <div className="prose prose-invert max-w-none">
                            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <MessageSquare size={16} /> Message
                            </h3>
                            <div className="text-slate-300 whitespace-pre-wrap leading-relaxed bg-slate-800/30 p-6 rounded-[4px] border border-slate-800">
                                {selectedSubmission.message}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500">
                        <Mail size={48} className="mb-4 opacity-20" />
                        <p>Select a message to read</p>
                    </div>
                )}
            </div>
        </div>
    );
}
