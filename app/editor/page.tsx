"use client";

import * as React from "react";

import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { UserMenu } from "@/components/editor/user-menu";

/**
 * Editor route shell.
 *
 * This is the redirect target for authenticated users coming from `/`. It
 * mounts the existing editor chrome (navbar + sidebar) so the auth flow has
 * somewhere real to land. The canvas itself is intentionally a placeholder
 * for now — the actual collaborative canvas ships with a later feature.
 */
function EditorCanvas() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-base">
      <div className="flex max-w-sm flex-col items-center gap-3 text-center">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent-dim text-brand">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <rect x="3" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" />
          </svg>
        </div>
        <h2 className="text-base font-semibold text-copy-primary">
          Canvas coming soon
        </h2>
        <p className="text-sm text-copy-muted">
          The collaborative system design canvas will arrive in the next
          feature.
        </p>
      </div>
    </div>
  );
}

export default function EditorPage() {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  return (
    <div className="relative flex h-svh w-full flex-col bg-base">
      <EditorNavbar
        sidebarOpen={sidebarOpen}
        onSidebarToggle={() => setSidebarOpen((open) => !open)}
        right={<UserMenu />}
      />
      <ProjectSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <EditorCanvas />
    </div>
  );
}