import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Only protect /admin routes
    if (pathname.startsWith("/admin")) {
        // Public admin route: /admin/login
        if (pathname === "/admin/login") {
            const session = request.cookies.get("session")?.value;
            if (session && (await verifyToken(session))) {
                return NextResponse.redirect(new URL("/admin", request.url));
            }
            return NextResponse.next();
        }

        // Protected /admin routes: verify session cookie
        const session = request.cookies.get("session")?.value;
        const validSession = session ? await verifyToken(session) : null;

        if (!validSession) {
            return NextResponse.redirect(new URL("/admin/login", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};
