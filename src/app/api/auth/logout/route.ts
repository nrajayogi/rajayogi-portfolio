import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
    const cookieStore = await cookies();
    cookieStore.delete({
        name: "session",
        path: "/",
    });

    const response = NextResponse.json({ success: true });
    response.cookies.set("session", "", {
        path: "/",
        maxAge: 0,
        expires: new Date(0),
        httpOnly: true,
        sameSite: "strict",
    });

    return response;
}
