"use client";

import { useState } from "react";
import { Lock, ArrowRight, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
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

            if (res.ok && data.success) {
                // Hard navigation to guarantee session cookie is sent on serverless Vercel
                window.location.href = "/admin";
            } else {
                setError(data.message || "Invalid credentials");
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
                    <div className="p-3 bg-blue-600/15 border border-blue-500/30 rounded-[4px] mb-3 text-blue-400 shadow-inner">
                        <Lock className="w-6 h-6" />
                    </div>
                    <h1 className="text-xl font-black text-white tracking-tight">Admin Telemetry Portal</h1>
                    <p className="text-slate-400 text-xs mt-1">Portfolio Command & Forensics</p>
                </div>

                {/* Security Badge */}
                <div className="mb-6 p-2.5 rounded-[4px] bg-slate-950 border border-slate-800 flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <p className="text-[10px] font-mono text-slate-400 leading-tight">
                        Protected by 256-bit HMAC JWT & rate-limited edge authentication.
                    </p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-slate-400 text-[11px] uppercase font-mono tracking-wider mb-1.5">
                            Username or Email
                        </label>
                        <input
                            name="username"
                            type="text"
                            required
                            autoComplete="username"
                            className="w-full bg-slate-950 border border-slate-800 rounded-[4px] px-4 py-3 text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-xs font-mono placeholder:text-slate-600"
                            placeholder="rajayogi2000@gmail.com"
                            disabled={loading}
                            value={username}
                            onChange={(e) => { setUsername(e.target.value); setError(""); }}
                        />
                    </div>

                    <div>
                        <label className="block text-slate-400 text-[11px] uppercase font-mono tracking-wider mb-1.5">
                            Master Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                autoComplete="current-password"
                                className="w-full bg-slate-950 border border-slate-800 rounded-[4px] px-4 py-3 pr-10 text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-xs font-mono placeholder:text-slate-600"
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                                placeholder="••••••••••••••••"
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                                tabIndex={-1}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 rounded-[4px] bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs text-center font-medium leading-relaxed">
                            {error}
                        </div>
                    )}

                    <Button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-[4px] text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
                    >
                        <span>{loading ? "Authenticating..." : "Access Telemetry"}</span>
                        <ArrowRight size={14} />
                    </Button>
                </form>

                {/* Footer note */}
                <div className="mt-6 pt-4 border-t border-slate-800 text-center">
                    <p className="text-[10px] font-mono text-slate-500">
                        Session tokens expire in 24h &bull; HTTP-Only Strict
                    </p>
                </div>

            </div>
        </div>
    );
}
