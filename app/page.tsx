import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

const DEFAULT_SIGN_IN_URL = "/sign-in";
const EDITOR_URL = "/editor";

/**
 * Root entry point.
 *
 * Authenticated users are sent to `/editor`. Unauthenticated users are
 * sent to the configured sign-in page. The proxy lets `/` through, so this
 * page is the single decision point.
 */
export default async function HomePage() {
  const { isAuthenticated } = await auth();

  if (isAuthenticated) {
    redirect(EDITOR_URL);
  }

  const signInUrl =
    process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL ?? DEFAULT_SIGN_IN_URL;
  redirect(signInUrl);
}
