import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

/**
 * Next.js 16 Proxy (formerly `middleware.ts`).
 *
 * Protected-first: by default every route requires authentication. Only the
 * Clerk sign-in and sign-up pages are public. The actual public paths are
 * read from `NEXT_PUBLIC_CLERK_SIGN_IN_URL` / `NEXT_PUBLIC_CLERK_SIGN_UP_URL`
 * so the matcher stays in sync with the real page locations.
 *
 * If those env vars are not set, fall back to the Clerk defaults (`/sign-in`
 * and `/sign-up`).
 */
const signInUrl = process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL ?? "/sign-in";
const signUpUrl = process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL ?? "/sign-up";

const isPublicRoute = createRouteMatcher([
  "/",
  "/api/webhooks(.*)",
  `${signInUrl}(.*)`,
  `${signUpUrl}(.*)`,
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Run on every request except Next.js internals and static files.
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run on API/trpc routes.
    "/(api|trpc)(.*)",
  ],
};