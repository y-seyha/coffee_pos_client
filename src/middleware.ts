import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const PUBLIC_PATHS = ["/auth"];

function getToken(req: NextRequest) {
    return req.cookies.get("access_token")?.value;
}

function getRole(token: string | undefined) {
    if (!token) return null;

    try {
        const decoded = jwt.decode(token) as any;
        return decoded?.role || null;
    } catch {
        return null;
    }
}

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    const token = getToken(req);
    const role = getRole(token);

    const isPublic = PUBLIC_PATHS.some((path) =>
        pathname.startsWith(path)
    );

    const isAdminRoute = pathname.startsWith("/admin");
    const isRootApp = pathname === "/";

    if (isPublic) {
        if (token && pathname.startsWith("/auth")) {
            return NextResponse.redirect(new URL("/", req.url));
        }
        return NextResponse.next();
    }

    if (!token) {
        return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    if (isAdminRoute) {
        if (role !== "ADMIN" && role !== "MANAGER") {
            return NextResponse.redirect(new URL("/unauthorized", req.url));
        }
        return NextResponse.next();
    }

    if (isRootApp) {
        if (role !== "ADMIN" && role !== "CASHIER") {
            return NextResponse.redirect(new URL("/auth/login", req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/",
        "/admin/:path*",
        "/auth/:path*",
    ],
};