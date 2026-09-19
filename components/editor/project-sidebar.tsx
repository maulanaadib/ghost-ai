"use client";

import * as React from "react";
import { MoreHorizontal, Pencil, Plus, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

import type { ProjectSummary } from "@/components/editor/hooks/use-project-dialogs";

/**
 * One row in the sidebar's project list. Renders a project name and (when
 * the viewer is the owner) a small action menu exposing rename + delete.
 *
 * The menu uses an inline popover driven by local state, so we don't need
 * to drag a primitive dropdown into scope for a single use.
 */
export interface ProjectSidebarItemProps {
  /** Project rendered by this row. */
  project: ProjectSummary;
  /** Whether the current viewer owns the project (controls action visibility). */
  isOwner: boolean;
  /** Opens the Rename dialog for this project. */
  onRename: (project: ProjectSummary) => void;
  /** Opens the Delete dialog for this project. */
  onDelete: (project: ProjectSummary) => void;
}

function ProjectSidebarItem({
  project,
  isOwner,
  onRename,
  onDelete,
}: ProjectSidebarItemProps) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  // Click-outside closes the per-item menu. We attach the listener only
  // while the menu is open so the rest of the list stays inert.
  React.useEffect(() => {
    if (!menuOpen) return;
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [menuOpen]);

  return (
    <div
      ref={containerRef}
      className="group relative flex items-center gap-2 rounded-xl px-2 py-2 text-sm transition-colors hover:bg-subtle"
    >
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-copy-primary">{project.name}</span>
        {!isOwner ? (
          <span className="text-[11px] text-copy-faint">Shared with you</span>
        ) : null}
      </div>

      {isOwner ? (
        <div className="relative shrink-0">
          <button
            type="button"
            aria-label={`Open actions for ${project.name}`}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className={cn(
              "inline-flex size-7 items-center justify-center rounded-md text-copy-secondary transition-colors hover:bg-elevated hover:text-copy-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-base",
              menuOpen && "bg-elevated text-copy-primary",
              // Hide the trigger until row hover/focus so the list reads as
              // a clean project list. Owner rows still get a visible affordance
              // when the menu itself is open.
              !menuOpen &&
                "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100",
            )}
          >
            <MoreHorizontal className="size-4" aria-hidden="true" />
          </button>

          {menuOpen ? (
            <div
              role="menu"
              aria-label={`Actions for ${project.name}`}
              className="absolute right-0 top-9 z-50 flex min-w-[10rem] flex-col overflow-hidden rounded-xl border border-surface-border bg-elevated py-1 shadow-lg"
            >
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  onRename(project);
                }}
                className="flex items-center gap-2 px-3 py-2 text-left text-sm text-copy-primary transition-colors hover:bg-subtle focus-visible:bg-subtle focus-visible:outline-none"
              >
                <Pencil className="size-4" aria-hidden="true" />
                Rename
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  onDelete(project);
                }}
                className="flex items-center gap-2 px-3 py-2 text-left text-sm text-state-error transition-colors hover:bg-subtle focus-visible:bg-subtle focus-visible:outline-none"
              >
                <Trash2 className="size-4" aria-hidden="true" />
                Delete
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function ProjectSidebarEmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 py-12 text-center">
      <div className="text-sm font-medium text-copy-primary">{label}</div>
      <p className="max-w-[18rem] text-xs text-copy-muted">
        Projects you create or that are shared with you will appear here.
      </p>
    </div>
  );
}

/**
 * Project Sidebar — floating left-side panel that overlays the editor canvas.
 *
 * Opens and closes via the `isOpen` prop; the parent owns visibility so the
 * sidebar can be triggered from anywhere (typically the EditorNavbar toggle).
 * Because it is positioned absolutely over the canvas, opening it does not
 * shift the underlying page content.
 */
export interface ProjectSidebarProps {
  /** Whether the sidebar is currently visible. */
  isOpen: boolean;
  /** Called when the user clicks the close button or requests dismissal. */
  onClose: () => void;
  /** Triggered when the user clicks the "New Project" button. */
  onNewProject?: () => void;
  /** Projects owned by the current viewer. */
  ownedProjects: ProjectSummary[];
  /** Projects shared with the current viewer (no actions exposed). */
  sharedProjects: ProjectSummary[];
  /** Opens the Rename dialog for a specific project. */
  onRenameProject: (project: ProjectSummary) => void;
  /** Opens the Delete dialog for a specific project. */
  onDeleteProject: (project: ProjectSummary) => void;
  /** Additional classes for the floating panel container. */
  className?: string;
}

function ProjectSidebar({
  isOpen,
  onClose,
  onNewProject,
  ownedProjects,
  sharedProjects,
  onRenameProject,
  onDeleteProject,
  className,
}: ProjectSidebarProps) {
  return (
    <>
      {/*
        Mobile backdrop scrim. Only mounted on small screens (`md:hidden`)
        so the desktop layout is unaffected. Clicking the scrim closes the
        sidebar — tapping outside the panel should always dismiss it.
      */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={cn(
          "fixed top-12 right-0 bottom-0 left-0 z-30 bg-black/40 backdrop-blur-sm transition-opacity duration-200 md:hidden",
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
      />

      <aside
        data-slot="project-sidebar"
        data-state={isOpen ? "open" : "closed"}
        aria-hidden={!isOpen}
        className={cn(
          "pointer-events-none fixed top-12 left-0 z-40 flex h-[calc(100vh-3rem)] w-72 shrink-0 flex-col border-r border-surface-border bg-surface/90 backdrop-blur transition-transform duration-200 ease-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
          className,
        )}
      >
        <div className="pointer-events-auto flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-surface-border px-4 py-3">
            <h2 className="text-sm font-semibold text-copy-primary">
              Projects
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close projects sidebar"
              className="inline-flex size-7 items-center justify-center rounded-md text-copy-secondary transition-colors hover:bg-subtle hover:text-copy-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-base"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>

          <Tabs
            defaultValue="my-projects"
            className="flex flex-1 flex-col gap-0 px-2 pt-2"
          >
            <TabsList variant="line" className="w-full">
              <TabsTrigger value="my-projects">My Projects</TabsTrigger>
              <TabsTrigger value="shared">Shared</TabsTrigger>
            </TabsList>

            <TabsContent
              value="my-projects"
              className="mt-0 flex flex-1 flex-col gap-1 overflow-y-auto px-1 py-2"
            >
              {ownedProjects.length > 0 ? (
                ownedProjects.map((project) => (
                  <ProjectSidebarItem
                    key={project.id}
                    project={project}
                    isOwner
                    onRename={onRenameProject}
                    onDelete={onDeleteProject}
                  />
                ))
              ) : (
                <ProjectSidebarEmptyState label="No projects yet" />
              )}
            </TabsContent>

            <TabsContent
              value="shared"
              className="mt-0 flex flex-1 flex-col gap-1 overflow-y-auto px-1 py-2"
            >
              {sharedProjects.length > 0 ? (
                sharedProjects.map((project) => (
                  <ProjectSidebarItem
                    key={project.id}
                    project={project}
                    isOwner={false}
                    onRename={onRenameProject}
                    onDelete={onDeleteProject}
                  />
                ))
              ) : (
                <ProjectSidebarEmptyState label="Nothing shared with you" />
              )}
            </TabsContent>
          </Tabs>

          <div className="border-t border-surface-border p-3">
            <Button
              type="button"
              variant="default"
              className="w-full"
              onClick={onNewProject}
            >
              <Plus className="size-4" aria-hidden="true" />
              New Project
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}

export { ProjectSidebar };