import { env } from 'next-runtime-env';
import { NextRequest, NextResponse } from 'next/server';

// Define protected routes that require authentication
const PROTECTED_ROUTES = [
  '/dashboard',
  '/siswa',
  '/guru', 
  '/admin',
  '/projects',
  '/penilaian',
  '/nilaikarya',
  '/users',
  '/settings',
  '/profile',
];

// Authentication routes (should redirect to dashboard if already logged in)
const AUTH_ROUTES = ['/login', '/register'];

// Routes that should be accessible without any checks
const EXCLUDED_ROUTES = [
  '/api',
  '/forgot-password',
  '/_next',
  '/favicon.ico',
  '/public',
  '/test',
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;
  
  // Prevent redirect loops by checking if we're coming from a redirect
  const isRedirect = request.headers.get('referer')?.includes(request.nextUrl.origin);
  
  // Debug logging - will appear in your terminal
  console.log('🔄 Proxy executing for path:', pathname);
  console.log('🌐 Request URL:', request.url);
  console.log('🌐 Request nextUrl origin:', request.nextUrl.origin);
  console.log('🔑 Token present:', !!token);
  console.log('🔄 Is redirect:', isRedirect);
  
  // Get frontend URL explicitly
  const frontendUrl = request.nextUrl.origin; // This should be http://localhost:3000
  console.log('🏠 Frontend URL:', frontendUrl);
  
  // Skip proxy for excluded routes
  if (EXCLUDED_ROUTES.some(route => pathname.startsWith(route))) {
    console.log('⏭️ Skipping proxy for excluded route:', pathname);
    return NextResponse.next();
  }

  // Check route types
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
  const isAuthRoute = AUTH_ROUTES.some(route => pathname.startsWith(route));

  console.log('🛡️ Is protected route:', isProtectedRoute);
  console.log('🔐 Is auth route:', isAuthRoute);

  // Handle authentication routes
  if (isAuthRoute) {
    // If user is authenticated and trying to access auth routes, redirect to dashboard
    if (token) {
      console.log('🔀 Redirecting authenticated user from auth route to dashboard');
      const dashboardUrl = new URL('/dashboard', frontendUrl);
      console.log('🔗 Dashboard redirect URL:', dashboardUrl.toString());
      return NextResponse.redirect(dashboardUrl);
    }
    console.log('✅ Allowing access to auth route for unauthenticated user');
    return NextResponse.next();
  }

  // Handle protected routes
  if (isProtectedRoute) {
    // If user is not authenticated and trying to access protected routes
    if (!token) {
      console.log('🚫 Redirecting unauthenticated user to login from:', pathname);
      const loginUrl = new URL('/login', request.nextUrl.origin);
      console.log('🔗 Login redirect URL:', loginUrl.toString());
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // For authenticated users accessing protected routes, check password change status
    console.log('🔍 Checking password status for authenticated user on protected route');
    try {
      const apiUrl = env('NEXT_PUBLIC_API_URL') || 'http://localhost:8000';
      console.log('📡 Making API call to:', `${apiUrl}/auth/password-check`);
      
      const response = await fetch(`${apiUrl}/auth/password-check`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      console.log('📡 API response status:', response.status);

      if (response.ok) {
        const responseData = await response.json();
        console.log('📋 Password check data:', responseData);
        
        // Extract the actual data from the response
        const data = responseData.data || responseData;
        
        // If user needs to change password and not already on change-password page
        if (data.needs_password_change && pathname !== '/change-password') {
          console.log('🔄 User needs password change, redirecting to change-password page');
          const changePasswordUrl = new URL('/change-password', frontendUrl);
          console.log('🔗 Change password redirect URL:', changePasswordUrl.toString());
          return NextResponse.redirect(changePasswordUrl);
        }
        
        // If user doesn't need password change but is on change-password page, redirect to dashboard
        if (!data.needs_password_change && pathname === '/change-password') {
          console.log('✅ Password already changed, redirecting to dashboard');
          const dashboardUrl = new URL('/dashboard', frontendUrl);
          console.log('🔗 Dashboard redirect URL:', dashboardUrl.toString());
          return NextResponse.redirect(dashboardUrl);
        }
        
        console.log('✅ Password check passed, allowing access');
      } else if (response.status === 401) {
        console.log('🚫 Token invalid/expired, redirecting to login');
        // Token invalid or expired, redirect to login
        const loginUrl = new URL('/login', request.nextUrl.origin);
        console.log('🔗 401 Login redirect URL:', loginUrl.toString());
        loginUrl.searchParams.set('redirect', pathname);
        const redirectResponse = NextResponse.redirect(loginUrl);
        redirectResponse.cookies.delete('token');
        return redirectResponse;
      }
    } catch (error) {
      console.error('❌ Proxy password check error:', error);
      // On error, allow request to continue to avoid breaking the app
      // The client-side components will handle the error appropriately
    }
  }

  // Handle change-password route separately
  if (pathname === '/change-password') {
    console.log('🔑 Handling change-password route');
    // Must be authenticated to access change-password page
    if (!token) {
      console.log('🚫 No token for change-password page, redirecting to login');
      const loginUrl = new URL('/login', request.nextUrl.origin);
      console.log('🔗 Change-password login redirect URL:', loginUrl.toString());
      return NextResponse.redirect(loginUrl);
    }
    
    // Check if password has been changed (to handle post-change redirect)
    try {
      const apiUrl = env('NEXT_PUBLIC_API_URL') || 'http://localhost:8000';
      console.log('📡 Checking password status on change-password page:', `${apiUrl}/auth/password-check`);
      
      const response = await fetch(`${apiUrl}/auth/password-check`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        const data = responseData.data || responseData;
        
        // If password has been changed, redirect to dashboard
        if (!data.needs_password_change) {
          console.log('✅ Password changed successfully, redirecting to dashboard');
          const dashboardUrl = new URL('/dashboard', frontendUrl);
          console.log('🔗 Post-change dashboard redirect URL:', dashboardUrl.toString());
          return NextResponse.redirect(dashboardUrl);
        }
      }
    } catch (error) {
      console.error('❌ Error checking password status on change-password page:', error);
    }
    
    console.log('✅ Allowing access to change-password page');
    // If authenticated, allow access to change-password page
    return NextResponse.next();
  }

  console.log('⏭️ Continuing to next middleware/page');
  return NextResponse.next();
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
     * - test (keep test page accessible)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public|test).*)',
  ],
};