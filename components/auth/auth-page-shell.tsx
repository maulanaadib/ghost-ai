import * as React from "react";
import {
  Bot,
  GitBranch,
  Layers,
  type LucideIcon,
  Workflow,
} from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Two-column layout shared by the sign-in and sign-up pages.
 *
 * Left column: a darker brand panel with a logo, a large multi-line
 * headline, a short subtitle, and a feature list (icon in a rounded
 * box, bold title, short description). The panel uses `bg-panel` so it
 * is visibly distinct from the main page background.
 *
 * Right column: centered Clerk form slot on the main page background.
 *
 * On small screens the left column is hidden and the form fills the
 * viewport. No gradients, no oversized hero, no marketing imagery.
 */
export interface AuthHighlight {
  /** Lucide icon shown inside the rounded square. */
  icon: LucideIcon;
  /** Bold one-line title. */
  title: string;
  /** Short muted description. */
  description: string;
}

export interface AuthPageShellProps {
  /** Multi-line headline shown prominently on the left panel. */
  headline: string;
  /** Short subtitle shown directly under the headline. */
  subtitle: string;
  /** Feature list shown under the subtitle. */
  highlights: readonly AuthHighlight[];
  /** The Clerk form (or any content) for the right panel. */
  children: React.ReactNode;
  /** Additional classes for the outer container. */
  className?: string;
}

function BrandLogo() {
  return (
    <div
      aria-hidden="true"
      className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-accent-dim text-brand"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
      >
        <path d="M3 20V4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v16" />
        <path d="M3 20h18" />
        <path d="M8 9h8" />
        <path d="M8 13h6" />
        <path d="M8 17h4" />
      </svg>
    </div>
  );
}

function HighlightRow({ icon: Icon, title, description }: AuthHighlight) {
  return (
    <li className="flex items-start gap-3">
      <span
        aria-hidden="true"
        className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-subtle text-brand"
      >
        <Icon className="h-4 w-4" />
      </span>
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-semibold text-copy-primary">
          {title}
        </span>
        <span className="text-xs leading-relaxed text-copy-muted">
          {description}
        </span>
      </div>
    </li>
  );
}

function AuthPageShell({
  headline,
  subtitle,
  highlights,
  children,
  className,
}: AuthPageShellProps) {
  return (
    <main
      className={cn(
        "flex min-h-svh w-full flex-col bg-base text-copy-primary md:flex-row",
        className,
      )}
    >
      <aside
        className="hidden flex-col justify-between border-r border-surface-border bg-panel p-10 md:flex md:w-1/2 md:p-14 lg:p-16"
      >
        <div className="flex flex-col gap-12">
          <div className="flex items-center gap-3">
            <BrandLogo />
            <span className="text-base font-semibold tracking-tight text-copy-primary">
              Ghost AI
            </span>
          </div>

          <div className="flex flex-col gap-4">
            <h1 className="text-balance text-4xl font-semibold leading-[1.1] tracking-tight text-copy-primary md:text-5xl lg:text-[3.5rem]">
              {headline}
            </h1>
            <p className="max-w-md text-sm leading-relaxed text-copy-muted md:text-base">
              {subtitle}
            </p>
          </div>

          <ul className="flex max-w-md flex-col gap-4">
            {highlights.map((highlight) => (
              <HighlightRow
                key={highlight.title}
                icon={highlight.icon}
                title={highlight.title}
                description={highlight.description}
              />
            ))}
          </ul>
        </div>

        <p className="text-xs text-copy-faint">
          © 2026 Ghost AI. All rights reserved.
        </p>
      </aside>

      <section className="flex flex-1 items-center justify-center px-6 py-12 md:px-12">
        <div className="w-full max-w-sm">{children}</div>
      </section>
    </main>
  );
}

export { AuthPageShell, BrandLogo };
export { Bot, GitBranch, Layers, Workflow };