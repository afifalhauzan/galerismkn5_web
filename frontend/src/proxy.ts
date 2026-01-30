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
  '/', // Homepage should be accessible to everyone
  '/api',
  '/forgot-password',
  '/_next',
  '/favicon.ico',
  '/public',
  '/test',
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get the REAL domain from Caddy headers
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
  const protocol = request.headers.get('x-forwarded-proto') || 'https';
  const frontendUrl = `${protocol}://${host}`;

  // Check for your specific production cookie names
  const laravelSession = request.cookies.get('laravel-session')?.value; // Development session name
  const galeriSession = request.cookies.get('galeri-smkn-5-session')?.value; // Production session name
  const xsrfCookie = request.cookies.get('XSRF-TOKEN')?.value;

  // Auth check either in production or development
  const hasAuthCookie = !!galeriSession || !!laravelSession;

  // Debug logging - refined for production
  console.log('🔄 Proxy executing for path:', pathname);
  console.log('🌐 Real Request URL:', `${frontendUrl}${pathname}`);
  console.log('🍪 Laravel (LOCALHOST) Session:', !!laravelSession ? '✅ Found' : '❌ Missing');
  console.log('🍪 Galeri (PROD) Session:', !!galeriSession ? '✅ Found' : '❌ Missing');
  console.log('🔐 XSRF cookie present:', !!xsrfCookie);
  console.log('🔒 Auth Status:', hasAuthCookie ? 'Authenticated' : 'Guest');
  console.log('🏠 Frontend URL:', frontendUrl);

  // Skip proxy for excluded routes - use exact match for root route to avoid conflicts
  if (EXCLUDED_ROUTES.some(route => {
    if (route === '/') {
      return pathname === '/'; // Exact match for homepage
    }
    return pathname.startsWith(route);
  })) {
    console.log('⏭️ Skipping proxy for excluded route:', pathname);
    return NextResponse.next();
  }

  // Check route types
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
  const isAuthRoute = AUTH_ROUTES.some(route => pathname.startsWith(route));

  console.log('🛡️ Is protected route:', isProtectedRoute);
  console.log('🔐 Is auth route:', isAuthRoute);

  // Handle authentication routes - redirect authenticated users to dashboard
  if (isAuthRoute) {
    // If user has valid session and XSRF tokens, redirect to dashboard immediately
    if (hasAuthCookie && xsrfCookie) {
      console.log('🔄 Authenticated user on auth route, redirecting to dashboard');
      const dashboardUrl = new URL('/dashboard', frontendUrl);
      console.log('🔗 Dashboard redirect URL:', dashboardUrl.toString());
      return NextResponse.redirect(dashboardUrl);
    }

    console.log('✅ Guest user accessing auth route, allowing access');
    return NextResponse.next();
  }

  // Handle protected routes - session check and password validation
  if (isProtectedRoute) {
    // Basic session check - if no session cookies, definitely not authenticated
    if (!hasAuthCookie) {
      console.log('🚫 No session cookie found, redirecting to login from:', pathname);
      const loginUrl = new URL('/login', frontendUrl);
      console.log('🔗 Login redirect URL:', loginUrl.toString());
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    console.log('✅ Session cookie present, checking password status for protected route');
    
    // Check password status for authenticated user on protected route
    try {
      // Use internal backend URL for middleware API calls (Docker container network)
      const internalApiUrl = process.env.NODE_ENV === 'production' ? 'http://backend:8000/api' : 'http://localhost:8000/api';
      // Fallback to external URL if internal DNS fails
      const externalApiUrl = `${frontendUrl}/api`;
      
      let apiUrl = internalApiUrl;
      let useFallback = false;
      
      console.log('📡 Making API call to:', `${apiUrl}/auth/password-check`);

      let response;
      try {
        response = await fetch(`${apiUrl}/auth/password-check`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Cookie': request.headers.get('cookie') || '', // Forward cookies for authentication
            'Host': 'galerismkn5.duckdns.org', // Tell Laravel which domain you are
          },
        });
      } catch (dnsError) {
        console.log('⚠️ DNS resolution failed for internal backend, trying external URL');
        console.error('DNS Error:', dnsError.message);
        apiUrl = externalApiUrl;
        useFallback = true;
        
        response = await fetch(`${apiUrl}/auth/password-check`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Cookie': request.headers.get('cookie') || '', // Forward cookies for authentication
          },
        });
      }

      console.log('📡 API response status:', response.status, useFallback ? '(using fallback URL)' : '(using internal URL)');

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
      } else if (response.status === 401) {
        console.log('🚫 Authentication invalid, redirecting to login');
        const loginUrl = new URL('/login', frontendUrl);
        console.log('🔗 401 Login redirect URL:', loginUrl.toString());
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }
    } catch (error) {
      console.error('❌ Proxy password check error:', error);
      // On error, allow request to continue to avoid breaking the app
    }

    console.log('✅ Password check passed, allowing access to protected route');
    return NextResponse.next();
  }

  // Handle change-password route
  if (pathname === '/change-password') {
    console.log('🔑 Handling change-password route');

    // Basic session check
    if (!hasAuthCookie) {
      console.log('🚫 No session for change-password page, redirecting to login');
      const loginUrl = new URL('/login', frontendUrl);
      console.log('🔗 Change-password login redirect URL:', loginUrl.toString());
      return NextResponse.redirect(loginUrl);
    }

    // Check if user still needs password change
    try {
      // Use internal backend URL for middleware API calls (Docker container network)
      const internalApiUrl = process.env.NODE_ENV === 'production' ? 'http://backend:8000/api' : 'http://localhost:8000/api';
      // Fallback to external URL if internal DNS fails
      const externalApiUrl = `${frontendUrl}/api`;
      
      let apiUrl = internalApiUrl;
      let useFallback = false;
      
      console.log('📡 Making API call to:', `${apiUrl}/auth/password-check`);

      let response;
      try {
        response = await fetch(`${apiUrl}/auth/password-check`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Cookie': request.headers.get('cookie') || '', // Forward cookies for authentication
            'Host': 'galerismkn5.duckdns.org', // Tell Laravel which domain you are
          },
        });
      } catch (dnsError) {
        console.log('⚠️ DNS resolution failed for internal backend, trying external URL');
        console.error('DNS Error:', dnsError.message);
        apiUrl = externalApiUrl;
        useFallback = true;
        
        response = await fetch(`${apiUrl}/auth/password-check`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Cookie': request.headers.get('cookie') || '', // Forward cookies for authentication
          },
        });
      }

      console.log('📡 API response status:', response.status, useFallback ? '(using fallback URL)' : '(using internal URL)');

      if (response.ok) {
        const responseData = await response.json();
        console.log('📋 Password check data:', responseData);

        // Extract the actual data from the response
        const data = responseData.data || responseData;

        // If user doesn't need password change but is on change-password page, redirect to dashboard
        if (!data.needs_password_change) {
          console.log('✅ Password already changed, redirecting to dashboard');
          const dashboardUrl = new URL('/dashboard', frontendUrl);
          console.log('🔗 Dashboard redirect URL:', dashboardUrl.toString());
          return NextResponse.redirect(dashboardUrl);
        }
      }
    } catch (error) {
      console.error('❌ Change-password route error:', error);
    }

    console.log('✅ Allowing access to change-password page');
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