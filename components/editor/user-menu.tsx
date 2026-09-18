"use client";

import * as React from "react";
import { UserButton } from "@clerk/nextjs";

/**
 * UserMenu — thin presentational wrapper around Clerk's `<UserButton />`.
 *
 * Clerk's default user menu and profile flows are kept intact; we only mount
 * the button with the project-aligned appearance. Use this anywhere a
 * profile menu needs to appear (e.g. the editor navbar's right section).
 */
function UserMenu() {
  return (
    <UserButton
      appearance={{
        elements: {
          userButtonBox: "h-8",
          userButtonTrigger:
            "rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-base",
        },
      }}
    />
  );
}

export { UserMenu };