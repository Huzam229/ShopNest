import { NextResponse } from "next/server";
import { USER_DASHBOARD, WEBSITE_LOGIN } from "./routes/WebRoutes";
import { jwtVerify } from "jose";
import { ADMIN_DASHBOARD } from "./routes/AdminPanelRoutes";

// Created once at module level, not on every request
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function proxy(request) {
    try {
        const pathname = request.nextUrl.pathname;
        const access_token = request.cookies.get('access-token')?.value;

        if (!access_token) {
            if (!pathname.startsWith('/auth')) {
                return NextResponse.redirect(new URL(WEBSITE_LOGIN, request.url));
            }
            return NextResponse.next();
        }

        const { payload } = await jwtVerify(access_token, JWT_SECRET);
        const role = payload.role;

        if (pathname.startsWith('/auth')) {
            const redirectPath = role === 'admin' ? ADMIN_DASHBOARD : USER_DASHBOARD;
            return NextResponse.redirect(new URL(redirectPath, request.url));
        }

        if (pathname.startsWith('/admin') && role !== 'admin') {
            return NextResponse.redirect(new URL(USER_DASHBOARD, request.url));
        }

        if (pathname.startsWith('/my-account') && role !== 'user') {
            return NextResponse.redirect(new URL(ADMIN_DASHBOARD, request.url));
        }

        return NextResponse.next();

    } catch (error) {
        console.error('Middleware auth error:', error.message);
        const response = NextResponse.redirect(new URL(WEBSITE_LOGIN, request.url));
        response.cookies.delete('access-token');
        return response;
    }
}

export const config = {
    matcher: ['/admin/:path*', '/my-account/:path*', '/auth/:path*'],
};