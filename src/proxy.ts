import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Define protected routes
    if (pathname.startsWith("/admin")) {
        // Allow public admin routes (login)
        if (pathname === "/admin/login") {
            // Optional: Redirect to /admin if already logged in?
            const session = request.cookies.get("session")?.value;
            if (session && await verifyToken(session)) {
                return NextResponse.redirect(new URL("/admin", request.url));
            }
            return NextResponse.next();
        }

        // 2. Check for session cookie
        const session = request.cookies.get("session")?.value;
        const validSession = session ? await verifyToken(session) : null;

        // 3. Redirect to login if invalid
        if (!validSession) {
            return NextResponse.redirect(new URL("/admin/login", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};
