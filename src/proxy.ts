import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC_PATHS = ["/auth"];

function getToken(req: NextRequest) {
    return req.cookies.get("access_token")?.value;
}

async function getRole(token?: string) {
    if (!token) return null;

    try {
        const secret = new TextEncoder().encode(
            process.env.JWT_SECRET
        );

        const { payload } = await jwtVerify(token, secret);
        return payload?.role || null;
    } catch {
        return null;
    }
}

export async function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;

    const token = getToken(req);
    const role = await getRole(token);

    const isPublic = PUBLIC_PATHS.some((p) =>
        pathname.startsWith(p)
    );

    const isAdmin = pathname.startsWith("/admin");

    if (isPublic) {
        if (token && role) {
            return NextResponse.redirect(new URL("/", req.url));
        }
        return NextResponse.next();
    }

    if (!token || !role) {
        return NextResponse.redirect(
            new URL("/auth/login", req.url)
        );
    }

    if (isAdmin) {
        if (role !== "ADMIN" && role !== "MANAGER") {
            return NextResponse.redirect(
                new URL("/unauthorized", req.url)
            );
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/admin/:path*", "/auth/:path*"],
};