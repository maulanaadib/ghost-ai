# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Feature 03 in progress — authentication via Clerk.

## Current Goal

- Implement Feature 03 per `context/feature-specs/03-auth.md`: wrap root layout with `ClerkProvider` using Clerk's `dark` theme; override Clerk appearance variables via the app's existing CSS variables (no hardcoded colors); create two-panel `/sign-in` and `/sign-up` pages (logo + tagline + short feature list on the left, centered Clerk form on the right; form-only on small screens; no gradients, no oversized hero sections, no feature cards, no scroll-heavy layouts); install `@clerk/ui`; add `proxy.ts` at the project root with public routes for sign-in/sign-up only (protect everything else by default); redirect authenticated `/` visitors to `/editor` and unauthenticated ones to `/sign-in`; add Clerk's `UserButton` to the editor navbar right section (keep Clerk's default user menu and profile flows intact, do not rebuild or heavily customize Clerk internals); use existing Clerk env vars (no renaming or new ones).

## Completed

- **01-design-system** — dark design system and UI primitives. shadcn/ui installed and configured (`components.json`, new-york style); `lucide-react` added; `lib/utils.ts` provides `cn()`; all dark theme tokens from `context/ui-context.md` mapped into `app/globals.css` via `@theme inline`. Verified: `tsc`, `eslint`, and `next build` all pass, and every component renders with the correct dark token values (no light styling).
- **02-editor** — editor chrome shell. Added two app-level components:
  - `components/editor/editor-navbar.tsx` — fixed-height (`h-12`) top bar with left/center/right sections. Left section hosts a `PanelLeftOpen` / `PanelLeftClose` toggle button; visibility is controlled by parent state (`sidebarOpen` + `onSidebarToggle`). Dark `bg-surface` background with a subtle bottom border.
  - `components/editor/project-sidebar.tsx` — floating overlay panel (`fixed top-12 left-0`, `w-72`) that slides in from the left via `translate-x` and never pushes page content. Accepts `isOpen` + `onClose`. Header with a `Projects` title and an `X` close button. shadcn `Tabs` (`My Projects` / `Shared`) using the line variant, with empty-state placeholders in each panel. Full-width `New Project` button with a `Plus` icon pinned to the bottom.
  - Dialog pattern — verified that `components/primitives/dialog.tsx` already exposes `DialogTitle`, `DialogDescription`, `DialogHeader`, `DialogFooter`, and a `DialogContent` wrapper that applies the dark design-system tokens (`rounded-3xl`, `bg-elevated`, `border-surface-border`, `backdrop-blur`). No changes needed; future features can consume `@/components/primitives/dialog` directly. Verified: `tsc --noEmit`, `eslint .`, and `next build` all pass.
- **03-auth** — Clerk authentication wired into the Next.js app per `context/feature-specs/03-auth.md`. Installed `@clerk/ui` for the `dark` theme. Wrapped the root layout with `ClerkProvider` and applied Clerk's `dark` base theme; Clerk appearance variables are overridden with the app's existing CSS variables so no hardcoded colors leak into Clerk's forms. Added `proxy.ts` at the project root that protects every route by default and exposes only `/sign-in(.*)` and `/sign-up(.*)` (env vars are read via `NEXT_PUBLIC_CLERK_SIGN_IN_URL` / `NEXT_PUBLIC_CLERK_SIGN_UP_URL`). Created two-panel `/sign-in/[[...sign-in]]/page.tsx` and `/sign-up/[[...sign-up]]/page.tsx`: a compact left column with logo, tagline, and a short text-only feature list; the centered `<SignIn />` / `<SignUp />` form on the right; on small screens the left column hides and the form takes the full width. No gradients, oversized hero sections, or feature cards. Updated `/` to use `auth()`: authenticated users redirect to `/editor`, unauthenticated users redirect to `/sign-in`. Added Clerk's built-in `<UserButton />` to the editor navbar's right section via a thin presentational `UserMenu` wrapper; Clerk's default user menu and profile flows remain intact. Added a minimal `/editor` route that mounts the existing `EditorNavbar` (with `UserMenu` injected into its `right` slot) and the existing `ProjectSidebar` so the navbar/sidebar chrome has a real consumer and so `/` → `/editor` is reachable without a 404. Verified: `tsc --noEmit`, `eslint .`, and `next build` all pass.

## In Progress

- None.

## Next Up

- Feature 04 (TBD).

## Open Questions

- None.

## Architecture Decisions

- **Tailwind v4 token naming**: in Tailwind v4 the utility name is derived from the token suffix, so `--color-bg-surface` would generate `bg-bg-surface`, not `bg-surface`. Surface tokens are therefore named `--color-base` / `--color-surface` / `--color-elevated` / `--color-subtle` to yield the `bg-base`, `bg-surface`, `bg-elevated`, `bg-subtle` utilities used across the app.
- **shadcn semantic tokens** (`--color-card`, `--color-primary`, `--color-muted`, …) are aliased to the design-system CSS variables so generated components pick up the dark theme without modification.
- **Protected foundation components**: `components/ui/*` are left as generated by the CLI. The only change made was repointing imports to the project's own `@/lib/utils` `cn()` and to the scoped `@radix-ui/*` packages. Design-system-specific styling (Card `rounded-2xl`/`bg-surface`, Dialog `rounded-3xl`/`bg-elevated`/`backdrop-blur`) lives in app-level wrappers at `components/primitives/`.
- **Editor chrome — navbar state**: `EditorNavbar` is a controlled component. The parent owns `sidebarOpen` and emits toggle events; the navbar does not duplicate state. This keeps the sidebar toggleable from anywhere (e.g. a future command palette) without coupling the navbar to the sidebar.
- **Editor chrome — sidebar overlays, never pushes**: `ProjectSidebar` is a `position: fixed` panel that uses `translate-x` to slide in/out. It does not participate in layout flow, so opening it cannot push or reflow the editor canvas. Closed state hides the panel (`pointer-events-none`, `aria-hidden="true"`) and translates it off-screen.
- **Auth — `proxy.ts` (Next.js 16)**: Next.js 16 renamed `middleware.ts` to `proxy.ts`. The Clerk middleware helper is still `clerkMiddleware` from `@clerk/nextjs/server`; only the filename changes. `proxy.ts` lives at the project root alongside `app/`, not under `app/`.
- **Auth — protected-first routing**: by default every route is protected; only `/sign-in(.*)` and `/sign-up(.*)` are public. Public paths are read from `NEXT_PUBLIC_CLERK_SIGN_IN_URL` / `NEXT_PUBLIC_CLERK_SIGN_UP_URL` so they remain in sync with the actual page locations.
- **Auth — Clerk appearance driven by CSS variables**: Clerk's appearance is configured with `theme: dark` (base) plus a `variables` block that points every Clerk color token at the app's CSS custom properties (`--color-background`, `--color-foreground`, `--color-primary`, `--color-border`, etc.). Components never hardcode colors — when a design token changes, Clerk's forms change with it.
- **Auth — sign-in/sign-up page layout**: each auth page is a two-column flex layout on `md+` screens. Left column holds the brand block (logo + tagline + a short text-only feature list). Right column centers the Clerk `<SignIn />` / `<SignUp />` form. On small screens the left column is hidden and the form takes the full width — no scroll, no oversized hero, no gradients.
- **Auth — UserButton mounted, not rebuilt**: the editor navbar receives a thin `UserMenu` wrapper that just renders Clerk's `<UserButton />`. We do not customize Clerk's profile flows; the default user menu and account management are kept intact.

## Session Notes

- shadcn CLI (new-york style) generates components that import `cn` from the `cn` package and primitives from the `radix-ui` umbrella package. Both were replaced: `cn` → `@/lib/utils`, `radix-ui` → the scoped `@radix-ui/react-*` packages (`Slot.Root` → `Slot`). The `cn` and `radix-ui` packages were then uninstalled.
- Installed runtime deps: `@radix-ui/react-{slot,dialog,tabs,scroll-area}`, `class-variance-authority`, `clsx`, `tailwind-merge`, `tw-animate-css`, `lucide-react`.
- Components added: `button`, `card`, `dialog`, `input`, `tabs`, `textarea`, `scroll-area` in `components/ui/`.
- `app/layout.tsx` already loads Geist Sans/Mono via `next/font/google` and applies the `--font-geist-sans` / `--font-geist-mono` variables; `globals.css` maps them to `--font-sans` / `--font-mono`.
- Feature 02 — editor chrome. Both new components are `"use client"` because they own browser interaction (toggle, slide animation, button focus). State lives in the parent so the navbar can stay presentational and the sidebar can be triggered from anywhere. Sidebar uses `fixed top-12 left-0` (anchored just below the `h-12` navbar) and translates via `translate-x-full ↔ translate-x-0`; this keeps the canvas layout untouched when the sidebar opens. Verified by running `tsc --noEmit`, `eslint .`, and `next build` — all clean.
- Feature 03 — Clerk auth. Next.js 16 + the latest `@clerk/nextjs` use `clerkMiddleware` from `@clerk/nextjs/server` inside a `proxy.ts` at the project root (the legacy `middleware.ts` is gone in 16). Public routes are declared with `createRouteMatcher` and the redirect uses `NEXT_PUBLIC_CLERK_SIGN_IN_URL` / `NEXT_PUBLIC_CLERK_SIGN_UP_URL` so adding new public routes later stays in sync with the actual page locations. The dark theme comes from `@clerk/ui` (`import { dark } from "@clerk/ui/themes"`), and appearance variables are wired to the app's CSS custom properties so the auth pages match the rest of the dark workspace without any hardcoded colors. `/` is a tiny server component that calls `await auth()` and redirects — unauthenticated → `/sign-in`, authenticated → `/editor`. Editor's `/editor` page renders `EditorNavbar` (with `<UserMenu />` injected into its `right` slot) plus `ProjectSidebar` so the chrome has a real consumer; the actual canvas will arrive in a later feature. Verified by running `tsc --noEmit`, `eslint .`, and `next build` — all clean.
