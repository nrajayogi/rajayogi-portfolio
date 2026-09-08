import { signToken } from "@/lib/auth";
import { NextResponse } from "next/server";
import crypto from "crypto";

// In-memory rate limiting map: ip -> { attempts: number, lockUntil: number }
interface RateLimitRecord {
    attempts: number;
    lockUntil: number;
}
const rateLimitMap = new Map<string, RateLimitRecord>();

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

function getClientIp(request: Request): string {
    const forwarded = request.headers.get("x-forwarded-for");
    if (forwarded) {
        return forwarded.split(",")[0].trim();
    }
    return request.headers.get("x-real-ip") || "unknown-client";
}

function timingSafeEqualStr(a: string, b: string): boolean {
    const bufA = crypto.createHash("sha256").update(a).digest();
    const bufB = crypto.createHash("sha256").update(b).digest();
    return crypto.timingSafeEqual(bufA, bufB);
}

export async function POST(request: Request) {
    const clientIp = getClientIp(request);
    const now = Date.now();

    // 1. Rate Limiting Check
    const rateRecord = rateLimitMap.get(clientIp);
    if (rateRecord && rateRecord.lockUntil > now) {
        const remainingSeconds = Math.ceil((rateRecord.lockUntil - now) / 1000);
        return NextResponse.json(
            {
                success: false,
                message: `Too many failed attempts. Account temporarily locked for ${remainingSeconds}s.`,
                retryAfter: remainingSeconds,
            },
            {
                status: 429,
                headers: { "Retry-After": remainingSeconds.toString() },
            }
        );
    }

    try {
        const body = await request.json();
        const username = typeof body.username === "string" ? body.username.trim() : "";
        const password = typeof body.password === "string" ? body.password : "";

        if (!username || !password) {
            return NextResponse.json({ success: false, message: "Username and password required" }, { status: 400 });
        }

        // Expected production credentials from environment
        const expectedEmail = (process.env.ADMIN_EMAIL || "rajayogi2000@gmail.com").trim().toLowerCase();
        const expectedPassword = process.env.ADMIN_PASSWORD;

        if (!expectedPassword) {
            console.error("ADMIN_PASSWORD environment variable is not configured.");
            return NextResponse.json(
                { success: false, message: "Authentication service temporarily unavailable." },
                { status: 503 }
            );
        }

        // Validate username/handle
        const inputUser = username.toLowerCase();
        const isValidUser =
            inputUser === expectedEmail ||
            inputUser === "rajayogi" ||
            inputUser === "admin";

        // Validate password with constant-time comparison
        const isValidPassword = timingSafeEqualStr(password, expectedPassword);

        if (isValidUser && isValidPassword) {
            // Reset rate limiter on successful authentication
            rateLimitMap.delete(clientIp);

            // Mint cryptographically signed token with strict claims
            const token = await signToken({
                email: expectedEmail,
                role: "admin",
            });

            const response = NextResponse.json({
                success: true,
                message: "Authentication successful",
            });

            // Set secure session cookie
            response.cookies.set("session", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                path: "/",
                maxAge: 60 * 60 * 24, // 24 hours
            });

            return response;
        }

        // Record failed attempt
        const currentRecord = rateLimitMap.get(clientIp) || { attempts: 0, lockUntil: 0 };
        currentRecord.attempts += 1;
        if (currentRecord.attempts >= MAX_FAILED_ATTEMPTS) {
            currentRecord.lockUntil = now + LOCKOUT_DURATION_MS;
        }
        rateLimitMap.set(clientIp, currentRecord);

        const remainingAttempts = Math.max(0, MAX_FAILED_ATTEMPTS - currentRecord.attempts);

        return NextResponse.json(
            {
                success: false,
                message: remainingAttempts > 0
                    ? `Invalid credentials. ${remainingAttempts} attempts remaining.`
                    : `Too many failed attempts. Locked for 15 minutes.`,
            },
            { status: 401 }
        );
    } catch {
        return NextResponse.json(
            { success: false, message: "Authentication service error" },
            { status: 500 }
        );
    }
}
