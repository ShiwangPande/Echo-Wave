import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define public routes
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/uploadthing',
]);

export default clerkMiddleware(async (auth, request) => {
  if (isPublicRoute(request)) {
    return; // Allow access to public routes
  }

  try {
    await auth.protect(); // Authenticate users for private routes
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    // Redirect unauthenticated users to sign-in
    const redirectUrl = `${process.env.NEXT_PUBLIC_CLERK_FRONTEND_API}/sign-in?redirect_url=${request.url}`;
    return Response.redirect(redirectUrl, 302);
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
