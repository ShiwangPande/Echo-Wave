import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Create a matcher for public routes (e.g., sign-in, sign-up, upload, etc.)
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)', 
  '/sign-up(.*)', 
  '/api/uploadthing',
]);

export default clerkMiddleware(async (auth, request) => {
  // Check if the request URL matches any public route
  if (isPublicRoute(request)) {
    return; // Allow public routes without requiring authentication
  }

  // Protect private routes (non-public routes)
  try {
    await auth.protect(); // This ensures the user is authenticated
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    // Handle unauthorized access or redirection for unauthenticated users
    return new Response('Unauthorized', { status: 401 });
  }
});

export const config = {
  matcher: [
    // Match all routes except static assets and files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
