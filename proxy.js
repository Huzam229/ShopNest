import { NextResponse } from "next/server";
import { USER_DASHBOARD, WEBSITE_LOGIN } from "./routes/WebRoutes";
import { jwtVerify } from "jose";
import { ADMIN_DASHBOARD } from "./routes/AdminPanelRoutes";

export async function proxy(request) {
    try {
        const pathname = request.nextUrl.pathname;

        const hasToken = request.cookies.has('access-token');

        // Not logged in
        if (!hasToken) {
            if (!pathname.startsWith('/auth')) {
                return NextResponse.redirect(new URL(WEBSITE_LOGIN, request.url));
            }
            return NextResponse.next();
        }
        const access_token = request.cookies.get('access-token')?.value;
        const { payload } = await jwtVerify(
            access_token,
            new TextEncoder().encode(process.env.JWT_SECRET)
        );
        const role = payload.role;
        // Logged-in user should not access auth pages
        if (pathname.startsWith('/auth')) {
            const redirectPath =
                role === 'admin' ? ADMIN_DASHBOARD : USER_DASHBOARD;
            return NextResponse.redirect(new URL(redirectPath, request.url));
        }
        // protect admin route 
        if (pathname.startsWith('/admin') && role !== 'admin') {
            return NextResponse.redirect(new URL(WEBSITE_LOGIN, request.url));
        }
        // protect user route
        if (pathname.startsWith('/my-account') && role !== 'user') {
            return NextResponse.redirect(new URL(USER_DASHBOARD, request.url));
        }
        // allow other routes
        return NextResponse.next();

    } catch (error) {
        console.log(error)
        return NextResponse.redirect(new URL(WEBSITE_LOGIN, request.url));
    }
}

export const config = {
    matcher: ['/admin/:path*', '/my-account/:path*', '/auth/:path*']
}