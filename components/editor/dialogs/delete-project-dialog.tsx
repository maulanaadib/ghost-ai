"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/primitives/dialog";

import type {
  ProjectSummary,
  UseProjectDialogsResult,
} from "@/components/editor/hooks/use-project-dialogs";

/**
 * Delete Project dialog.
 *
 * Strictly confirm-only — no input, no undo timer. The confirm button uses
 * the `destructive` variant so it visually stands out from the regular
 * surface. The project name is shown explicitly to prevent mis-clicks on
 * similarly-named entries.
 */
export interface DeleteProjectDialogProps {
  /** Currently-open dialog kind — dialog mounts only when this is "delete". */
  kind: UseProjectDialogsResult["kind"];
  /** Project currently being deleted, or null when nothing is open. */
  project: ProjectSummary | null;
  /** Whether the dialog is currently performing a submit. */
  isSubmitting: boolean;
  /** Called when the user cancels or dismisses the dialog. */
  onClose: () => void;
  /** Called when the user confirms deletion. Resolves after mock work. */
  onSubmit: () => Promise<void>;
}

function DeleteProjectDialog({
  kind,
  project,
  isSubmitting,
  onClose,
  onSubmit,
}: DeleteProjectDialogProps) {
  const open = kind === "delete";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;
    onSubmit();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Delete project</DialogTitle>
            <DialogDescription>
              {project ? (
                <>
                  This will permanently delete{" "}
                  <span className="font-medium text-copy-primary">
                    {project.name}
                  </span>
                  , including its canvas and any generated specs. This action
                  cannot be undone.
                </>
              ) : (
                "This will permanently delete the project. This action cannot be undone."
              )}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Deleting…" : "Delete project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export { DeleteProjectDialog };