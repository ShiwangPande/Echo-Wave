import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Create a matcher for public routes (e.g., sign-in, sign-up, and upload)
const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', '/api/uploadthing'])

export default clerkMiddleware(async (auth, request) => {
  // Protect all routes except public ones
  if (!isPublicRoute(request)) {
    await auth.protect()  // Protect the route, requiring authentication
  }
})

export const config = {
  matcher: [
    // Excludes static assets like images, CSS, JS, and Next.js files (e.g., _next/*)
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes (e.g., /api/*)
    '/(api|trpc)(.*)',
  ],
}
