import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Define the public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/',                // Home page
  '/sign-in(.*)',      // Sign-in page and its sub-routes
  '/sign-up(.*)',      // Sign-up page and its sub-routes
]);

export default clerkMiddleware(async (auth, request) => {

  if (!isPublicRoute(request)) {
    await auth.protect();  // Ensure the user is authenticated
  }
}, {
  publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  secretKey: process.env.CLERK_SECRET_KEY,
  domain: 'https://echo-wave-pied.vercel.app',  
  signInUrl: '/sign-in',  // Redirect to this URL if unauthenticated
  signUpUrl: '/sign-up',  // Redirect to this URL if unauthenticated
  afterSignInUrl: '/',  // Redirect here after successful sign-in
  afterSignUpUrl: '/',  // Redirect here after successful sign-up
  isSatellite: false,  
});

export const config = {
  matcher: [
    // This regex skips Next.js internals and static files, but matches other routes
    '/((?!.+\.[\w]+$|_next).*)',  // Match all non-static, non-internal routes
    '/',                         // Always run for the root path
    '/(api|trpc)(.*)',            // Always run for API or tRPC routes
  ],
};
