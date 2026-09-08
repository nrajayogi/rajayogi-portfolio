import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const secretKey = process.env.JWT_SECRET_KEY || "fallback_secret_key_for_dev_only";
const key = new TextEncoder().encode(secretKey);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function signToken(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(key);
}

export async function verifyToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, key, {
            algorithms: ["HS256"],
        });
        return payload;
    } catch {
        return null;
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function login(formData: FormData) {
    // Verify credentials
    // Create the session
    // Save the session in a cookie
}

export async function logout() {
    // Destroy the session
    (await cookies()).delete("session");
}

export async function getSession() {
    const session = (await cookies()).get("session")?.value;
    if (!session) return null;
    return await verifyToken(session);
}

export async function updateSession(request: NextRequest) {
    const session = request.cookies.get("session")?.value;
    if (!session) return;

    // Refresh the session so it doesn't expire
    const parsed = await verifyToken(session);
    if (!parsed) return;

    parsed.expires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins rolling

    const res = NextResponse.next();
    res.cookies.set({
        name: "session",
        value: await signToken(parsed),
        httpOnly: true,
        secure: true, // Force secure in prod
        sameSite: "lax",
        // No 'expires' or 'maxAge' = Session Cookie (deleted on browser close)
    });
    return res;
}
