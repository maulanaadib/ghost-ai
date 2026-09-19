"use client";

import * as React from "react";
import { Plus } from "lucide-react";

import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { UserMenu } from "@/components/editor/user-menu";
import { CreateProjectDialog } from "@/components/editor/dialogs/create-project-dialog";
import { RenameProjectDialog } from "@/components/editor/dialogs/rename-project-dialog";
import { DeleteProjectDialog } from "@/components/editor/dialogs/delete-project-dialog";
import { Button } from "@/components/ui/button";
import {
  useProjectDialogs,
  type ProjectSummary,
} from "@/components/editor/hooks/use-project-dialogs";

/**
 * Mock owned projects — replaced by a real Prisma query once persistence
 * lands. The shape matches what the dialogs need so swapping the data
 * source later only touches this constant.
 */
const MOCK_OWNED_PROJECTS: ProjectSummary[] = [
  { id: "proj-marketplace", name: "Marketplace Platform" },
  { id: "proj-payments", name: "Payments Service" },
  { id: "proj-analytics", name: "Analytics Pipeline" },
];

const MOCK_SHARED_PROJECTS: ProjectSummary[] = [
  { id: "proj-design-system", name: "Design System v3" },
];

/**
 * Editor home — the empty workspace shown before the user picks a project.
 *
 * The canvas itself is a minimal placeholder; the real collaborative canvas
 * arrives with a later feature. The center column renders the home prompt
 * (heading + description + a `New Project` call-to-action) without any card
 * wrapper, per the editor home spec.
 */
function EditorHome({ onNewProject }: { onNewProject: () => void }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-base px-6">
      <div className="flex max-w-md flex-col items-center gap-4 text-center">
        <h1 className="text-xl font-semibold text-copy-primary sm:text-2xl">
          Create a project or open an existing one
        </h1>
        <p className="text-sm text-copy-muted">
          Start a new architecture workspace, or choose a project from the
          sidebar.
        </p>
        <Button
          type="button"
          variant="default"
          size="lg"
          onClick={onNewProject}
          className="mt-2"
        >
          <Plus className="size-4" aria-hidden="true" />
          New Project
        </Button>
      </div>
    </div>
  );
}

/**
 * Editor route shell.
 *
 * Hosts the editor chrome (navbar + sidebar), the home view, and the three
 * project dialogs. All dialog/form/loading state is owned by
 * `useProjectDialogs` so wiring a future API is a one-function change.
 */
export default function EditorPage() {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const dialogs = useProjectDialogs();

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
        onNewProject={dialogs.openCreate}
        ownedProjects={MOCK_OWNED_PROJECTS}
        sharedProjects={MOCK_SHARED_PROJECTS}
        onRenameProject={dialogs.openRename}
        onDeleteProject={dialogs.openDelete}
      />
      <EditorHome onNewProject={dialogs.openCreate} />

      <CreateProjectDialog
        kind={dialogs.kind}
        isSubmitting={dialogs.isSubmitting}
        onClose={dialogs.close}
        onSubmit={dialogs.submit}
      />
      <RenameProjectDialog
        kind={dialogs.kind}
        project={dialogs.project}
        isSubmitting={dialogs.isSubmitting}
        onClose={dialogs.close}
        onSubmit={dialogs.submit}
      />
      <DeleteProjectDialog
        kind={dialogs.kind}
        project={dialogs.project}
        isSubmitting={dialogs.isSubmitting}
        onClose={dialogs.close}
        onSubmit={dialogs.submit}
      />
    </div>
  );
}