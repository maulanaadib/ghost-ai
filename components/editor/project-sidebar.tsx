"use client";

import * as React from "react";
import { Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

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
  /** Additional classes for the floating panel container. */
  className?: string;
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

function ProjectSidebar({
  isOpen,
  onClose,
  onNewProject,
  className,
}: ProjectSidebarProps) {
  return (
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
          <h2 className="text-sm font-semibold text-copy-primary">Projects</h2>
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
            className="mt-0 flex flex-1 flex-col"
          >
            <ProjectSidebarEmptyState label="No projects yet" />
          </TabsContent>

          <TabsContent value="shared" className="mt-0 flex flex-1 flex-col">
            <ProjectSidebarEmptyState label="Nothing shared with you" />
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
  );
}

export { ProjectSidebar };