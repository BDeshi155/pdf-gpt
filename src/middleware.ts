import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import { UserRole } from '@/types';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Super Admin only routes
    if (path.startsWith('/admin/super')) {
      if (token?.role !== UserRole.SUPER_ADMIN) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }

    // Admin routes (Super Admin, Admin, or Pro with admin flag)
    if (path.startsWith('/admin')) {
      const isAdminUser = 
        token?.role === UserRole.SUPER_ADMIN || 
        token?.role === UserRole.ADMIN || 
        token?.isAdmin === true;
      
      if (!isAdminUser) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;

        // Public routes
        const publicRoutes = [
          '/',
          '/pricing',
          '/auth/login',
          '/auth/signup',
          '/auth/forgot-password',
          '/auth/reset-password',
          '/auth/error',
        ];

        if (publicRoutes.some((route) => path === route || path.startsWith('/api/auth'))) {
          return true;
        }

        // Protected routes require authentication
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
