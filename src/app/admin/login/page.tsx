"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

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
                // Remove insecure local storage usage
                localStorage.removeItem("vyantraa_admin_session");
                router.push("/admin");
                router.refresh(); // Refresh to update middleware state
            } else {
                setError(data.message || "Invalid credentials");
            }
        } catch (_) {
            setError("Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-xl p-8">
                <div className="flex flex-col items-center mb-8">
                    <div className="p-3 bg-blue-600/10 rounded-full mb-4">
                        <Lock className="w-6 h-6 text-blue-500" />
                    </div>
                    <h1 className="text-xl font-bold text-white">Admin Access</h1>
                    <p className="text-slate-500 text-sm mt-1">Sign in to manage content</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-[#5B6B7C] text-[10px] uppercase font-bold tracking-wider mb-2">
                            Username
                        </label>
                        <input
                            name="username"
                            type="text"
                            required
                            className="w-full bg-[#12141C] border border-[#2A2E3B] rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                            placeholder="Enter your username"
                            disabled={loading}
                            value={username} // Added value prop
                            onChange={(e) => { setUsername(e.target.value); setError(""); }} // Added onChange handler
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>

                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6">
                        Enter Dashboard
                    </Button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-slate-600 text-xs">Protected System • Authorized Personnel Only</p>
                </div>
            </div>
        </div>
    );
}
