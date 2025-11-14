import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ['/profile', '/profile/*', '/bookings', '/slots', '/slots/new'];
const authRoutes = ['/login', '/register'];
const providerOnlyRoutes = ['/slots', '/slots/new'];

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    try {

        const sessionResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/get-session`, {
            headers: {
                'Cookie': request.headers.get('cookie') || '',
            },
            credentials: 'include',
        });

        let session = null;
        if (sessionResponse.ok) {
            const data = await sessionResponse.json();
            session = data?.user;
        }

        const isProvidersList = pathname === '/providers';

        // Protect /providers/:id (single segment after /providers)
        const isProviderDetail =
            /^\/providers\/[^\/]+$/.test(pathname) && !isProvidersList;

        // Check if route requires authentication
        const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route)) || isProviderDetail;
        const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
        const isProviderRoute = providerOnlyRoutes.some(route => pathname.startsWith(route));

        // Redirect logged-in users away from auth pages
        if (isAuthRoute && session) {
            if (session.role === 'PROVIDER') {
                return NextResponse.redirect(new URL('/slots', request.url));
            } else {
                return NextResponse.redirect(new URL('/providers', request.url));
            }
        }

        // Redirect unauthenticated users from protected routes
        if (isProtectedRoute && !session) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        // Role-based access control
        if (session) {
            // Provider-only routes
            if (isProviderRoute && session.role !== 'PROVIDER') {
                return NextResponse.redirect(new URL('/unauthorized', request.url));
            }
        }

        return NextResponse.next();
    } catch (error) {
        console.error('Proxy error:', error);

        // If session check fails, redirect to login for protected routes
        const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

        if (isProtectedRoute) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        return NextResponse.next();
    }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)',
    ],
};