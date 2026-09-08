import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const JWT_ISSUER = "rajayogi-portfolio";
const JWT_AUDIENCE = "rajayogi-admin-portal";

// Edge-compliant in-memory fallback key generated per instance if env var is missing
function generateRuntimeEntropy(): string {
    if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
        const bytes = new Uint8Array(32);
        crypto.getRandomValues(bytes);
        return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
    }
    return "runtime_fallback_entropy_" + Date.now();
}

const runtimeEntropy = generateRuntimeEntropy();

function getSigningKey(): Uint8Array {
    const secret = process.env.JWT_SECRET_KEY || runtimeEntropy;
    return new TextEncoder().encode(secret);
}

export interface AdminSessionPayload {
    sub: string;
    email: string;
    role: "admin";
    jti: string;
    iss: string;
    aud: string;
    iat?: number;
    exp?: number;
    [key: string]: unknown;
}

/**
 * Mint a cryptographically secure 256-bit HMAC JWT token
 */
export async function signToken(payload: { email: string; role?: "admin" }): Promise<string> {
    const key = getSigningKey();
    const jti = crypto.randomUUID();

    return await new SignJWT({
        email: payload.email,
        role: payload.role || "admin",
    })
        .setProtectedHeader({ alg: "HS256" })
        .setSubject(payload.email)
        .setIssuer(JWT_ISSUER)
        .setAudience(JWT_AUDIENCE)
        .setJti(jti)
        .setIssuedAt()
        .setExpirationTime("24h")
        .sign(key);
}

/**
 * Verify token authenticity, issuer, audience, and expiry
 */
export async function verifyToken(token: string): Promise<AdminSessionPayload | null> {
    try {
        const key = getSigningKey();
        const { payload } = await jwtVerify(token, key, {
            algorithms: ["HS256"],
            issuer: JWT_ISSUER,
            audience: JWT_AUDIENCE,
            clockTolerance: 15, // 15 seconds clock skew tolerance
        });

        if (payload.role !== "admin") {
            return null;
        }

        return payload as unknown as AdminSessionPayload;
    } catch {
        return null;
    }
}

/**
 * Destroy active session cookie
 */
export async function logout(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete("session");
}

/**
 * Retrieve session for Server Components or Server Actions
 */
export async function getSession(): Promise<AdminSessionPayload | null> {
    try {
        const cookieStore = await cookies();
        const session = cookieStore.get("session")?.value;
        if (!session) return null;
        return await verifyToken(session);
    } catch {
        return null;
    }
}

/**
 * Comprehensive API Route & Server Guard
 * Accepts NextRequest, standard Request, or can be called parameterless in server actions
 */
export async function verifyAdminSession(request?: NextRequest | Request): Promise<AdminSessionPayload | null> {
    let token: string | undefined;

    if (request) {
        // 1. Check cookies via NextRequest if available
        if ("cookies" in request && typeof (request as NextRequest).cookies?.get === "function") {
            token = (request as NextRequest).cookies.get("session")?.value;
        } else {
            // 2. Parse cookie header on standard Request
            const cookieHeader = request.headers.get("cookie") || "";
            const match = cookieHeader.match(/session=([^;]+)/);
            token = match ? match[1] : undefined;
        }

        // 3. Optional Bearer token header support for automated security tooling
        if (!token) {
            const authHeader = request.headers.get("authorization");
            if (authHeader?.startsWith("Bearer ")) {
                token = authHeader.substring(7).trim();
            }
        }
    } else {
        return await getSession();
    }

    if (!token) {
        return null;
    }

    return await verifyToken(token);
}

export async function updateSession(request: NextRequest): Promise<NextResponse | undefined> {
    const session = request.cookies.get("session")?.value;
    if (!session) return;

    const parsed = await verifyToken(session);
    if (!parsed) return;

    const res = NextResponse.next();
    res.cookies.set({
        name: "session",
        value: await signToken({ email: parsed.email, role: "admin" }),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24, // 24h
    });
    return res;
}
