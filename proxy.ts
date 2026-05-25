import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export const config = {
    matcher: [
        "/",
        "/admin/:path*",
        "/auth/:path*",
    ],
};

function getToken(req: NextRequest) {
    return req.cookies.get("access_token")?.value;
}

async function getRole(token?: string) {
    if (!token) return null;

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        return (payload.role as string)?.toUpperCase();
    } catch {
        return null;
    }
}

export async function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const token = getToken(req);
    const role = await getRole(token);

    const isAuthRoute = pathname.startsWith("/auth");
    const isAdminRoute = pathname.startsWith("/admin");

    if (isAuthRoute) {
        if (token && role) {
            return NextResponse.redirect(new URL("/", req.url));
        }
        return NextResponse.next();
    }

    if (!token || !role) {
        return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    const ROLE_ACCESS: Record<string, { allowAdmin: boolean }> = {
        ADMIN: { allowAdmin: true },
        MANAGER: { allowAdmin: true },
        CASHIER: { allowAdmin: false },
        BARISTA: { allowAdmin: false }, // IMPORTANT: fix missing role
    };

    const permissions = ROLE_ACCESS[role];

    if (!permissions) {
        return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    if (isAdminRoute && !permissions.allowAdmin) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
}