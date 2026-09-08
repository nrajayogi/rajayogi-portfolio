"use client";

import { useState } from "react";
import { Lock, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (data.success) {
                // Hard navigation to guarantee cookie is sent on serverless Vercel
                window.location.href = "/admin";
            } else {
                setError(data.message || "Invalid credentials");
                setLoading(false);
            }
        } catch (_) {
            setError("Connection error. Please try again.");
            setLoading(false);
        }
    };

    const handleQuickFill = () => {
        setUsername("rajayogi");
        setPassword("admin123");
        setError("");
    };

    const handleInstantAccess = async () => {
        setError("");
        setLoading(true);
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: "rajayogi", password: "admin123" }),
            });
            const data = await res.json();
            if (data.success) {
                window.location.href = "/admin";
            } else {
                setError("Instant access failed.");
                setLoading(false);
            }
        } catch {
            setError("Connection error. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 selection:bg-blue-600 selection:text-white font-sans">
            <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-[4px] p-8 shadow-2xl">
                
                {/* Header */}
                <div className="flex flex-col items-center mb-6 text-center">
                    <div className="p-3 bg-blue-600/15 border border-blue-500/30 rounded-[4px] mb-3 text-blue-400">
                        <Lock className="w-6 h-6" />
                    </div>
                    <h1 className="text-xl font-black text-white tracking-tight">Admin Telemetry Portal</h1>
                    <p className="text-slate-400 text-xs mt-1">Rajayogi Nandina Portfolio Command</p>
                </div>

                {/* 1-Click Instant Owner Access Button */}
                <button
                    type="button"
                    onClick={handleInstantAccess}
                    disabled={loading}
                    className="w-full mb-5 py-3 px-4 rounded-[4px] bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 transition-all cursor-pointer disabled:opacity-50"
                >
                    <ShieldCheck size={16} />
                    <span>Instant Owner Access (1-Click)</span>
                </button>

                <div className="relative flex py-2 items-center mb-4">
                    <div className="flex-grow border-t border-slate-800"></div>
                    <span className="flex-shrink mx-3 text-[10px] uppercase font-mono text-slate-500">or sign in with password</span>
                    <div className="flex-grow border-t border-slate-800"></div>
                </div>

                {/* Login Form */}
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-slate-400 text-[11px] uppercase font-mono tracking-wider mb-1.5">
                            Username
                        </label>
                        <input
                            name="username"
                            type="text"
                            required
                            className="w-full bg-slate-950 border border-slate-800 rounded-[4px] px-4 py-3 text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-xs font-mono"
                            placeholder="admin or rajayogi"
                            disabled={loading}
                            value={username}
                            onChange={(e) => { setUsername(e.target.value); setError(""); }}
                        />
                    </div>

                    <div>
                        <label className="block text-slate-400 text-[11px] uppercase font-mono tracking-wider mb-1.5">
                            Password
                        </label>
                        <input
                            type="password"
                            required
                            className="w-full bg-slate-950 border border-slate-800 rounded-[4px] px-4 py-3 text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-xs font-mono"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); setError(""); }}
                            placeholder="••••••••"
                            disabled={loading}
                        />
                    </div>

                    {error && (
                        <div className="p-2.5 rounded-[4px] bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs text-center font-medium">
                            {error}
                        </div>
                    )}

                    <Button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-[4px] text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg shadow-blue-600/20"
                    >
                        <span>{loading ? "Authenticating..." : "Access Telemetry"}</span>
                        <ArrowRight size={14} />
                    </Button>
                </form>

                {/* 1-Click Quick Fill Helper */}
                <div className="mt-6 pt-5 border-t border-slate-800/80">
                    <button
                        type="button"
                        onClick={handleQuickFill}
                        className="w-full py-2 px-3 rounded-[4px] bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-mono flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                        <Sparkles size={13} className="text-amber-400" />
                        <span>Quick-Fill Credentials</span>
                    </button>
                    <p className="text-[10px] text-slate-500 text-center mt-3 font-mono">
                        Default: rajayogi / admin123
                    </p>
                </div>

            </div>
        </div>
    );
}
