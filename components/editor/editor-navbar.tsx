"use client";

import * as React from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Editor Navbar — fixed-height top bar that frames every editor screen.
 *
 * Layout: three sections (left, center, right). The left section hosts the
 * sidebar toggle; the center is reserved for project/canvas context that will
 * arrive in later chapters; the right section is intentionally empty for now.
 *
 * Visibility of the left sidebar is controlled by the parent via
 * `sidebarOpen` + `onSidebarToggle`. The navbar itself does not own the
 * sidebar state — it only reflects it and emits toggle events.
 */
export interface EditorNavbarProps {
  /** Whether the left sidebar is currently open. */
  sidebarOpen: boolean;
  /** Toggle handler invoked when the user clicks the sidebar button. */
  onSidebarToggle: () => void;
  /** Optional center content (project name, breadcrumbs, etc.). */
  center?: React.ReactNode;
  /** Optional right section content (overrides the empty default). */
  right?: React.ReactNode;
  /** Additional classes for the outer bar. */
  className?: string;
}

function EditorNavbar({
  sidebarOpen,
  onSidebarToggle,
  center,
  right,
  className,
}: EditorNavbarProps) {
  return (
    <header
      data-slot="editor-navbar"
      className={cn(
        "flex h-12 shrink-0 items-center justify-between border-b border-surface-border bg-surface px-2",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onSidebarToggle}
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          aria-expanded={sidebarOpen}
          className="inline-flex size-9 items-center justify-center rounded-md text-copy-secondary transition-colors hover:bg-subtle hover:text-copy-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-base"
        >
          {sidebarOpen ? (
            <PanelLeftClose className="size-4" aria-hidden="true" />
          ) : (
            <PanelLeftOpen className="size-4" aria-hidden="true" />
          )}
        </button>
      </div>

      <div className="flex items-center gap-2">{center}</div>

      <div className="flex items-center justify-end gap-2">{right}</div>
    </header>
  );
}

export { EditorNavbar };