"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/primitives/dialog";
import { cn } from "@/lib/utils";

import type {
  ProjectSummary,
  UseProjectDialogsResult,
} from "@/components/editor/hooks/use-project-dialogs";

/**
 * Rename Project dialog.
 *
 * Prefilled with the current project name so the user lands directly in an
 * edit-ready state. The input auto-focuses on mount so the first keystroke
 * replaces the placeholder selection, and submitting with Enter works
 * because the form is the implicit submit target.
 *
 * Form state lives inside `RenameProjectForm` so it resets naturally when
 * the parent remounts the form via the `formKey` prop (driven by the
 * currently-edited project's `id`). That avoids resetting state in an
 * effect — each target project gets a fresh form instance.
 */
export interface RenameProjectDialogProps {
  /** Currently-open dialog kind — dialog mounts only when this is "rename". */
  kind: UseProjectDialogsResult["kind"];
  /** Project currently being renamed, or null when nothing is open. */
  project: ProjectSummary | null;
  /** Whether the dialog is currently performing a submit. */
  isSubmitting: boolean;
  /** Called when the user cancels or dismisses the dialog. */
  onClose: () => void;
  /** Called when the user confirms the rename. Resolves after mock work. */
  onSubmit: () => Promise<void>;
}

function RenameProjectForm({
  project,
  onClose,
  onSubmit,
  isSubmitting,
}: {
  project: ProjectSummary;
  onClose: () => void;
  onSubmit: () => Promise<void>;
  isSubmitting: boolean;
}) {
  const [name, setName] = React.useState(project.name);
  const [error, setError] = React.useState<string | null>(null);

  const trimmed = name.trim();
  const unchanged = trimmed === project.name.trim();
  const canSubmit = trimmed.length > 0 && !unchanged && !isSubmitting;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    onSubmit();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <DialogHeader>
        <DialogTitle>Rename project</DialogTitle>
        <DialogDescription>
          Currently editing{" "}
          <span className="font-medium text-copy-primary">{project.name}</span>.
          Changes apply to this project only.
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="rename-project-name"
          className="text-xs font-medium text-copy-secondary"
        >
          Project name
        </label>
        <Input
          id="rename-project-name"
          name="name"
          autoFocus
          autoComplete="off"
          placeholder="Project name"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            if (error) setError(null);
          }}
          aria-invalid={error ? true : undefined}
          disabled={isSubmitting}
          className={cn(
            error && "border-state-error focus-visible:ring-state-error/40",
          )}
        />
        {error ? (
          <p
            id="rename-project-name-error"
            role="alert"
            className="text-xs text-state-error"
          >
            {error}
          </p>
        ) : unchanged ? (
          <p className="text-xs text-copy-faint">
            No changes yet. Enter a new name to save.
          </p>
        ) : null}
      </div>

      <DialogFooter className="gap-2">
        <Button
          type="button"
          variant="ghost"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={!canSubmit}>
          {isSubmitting ? "Saving…" : "Save changes"}
        </Button>
      </DialogFooter>
    </form>
  );
}

function RenameProjectDialog({
  kind,
  project,
  isSubmitting,
  onClose,
  onSubmit,
}: RenameProjectDialogProps) {
  const open = kind === "rename" && project !== null;

  // Keyed by the target project id so switching projects without closing
  // the dialog still remounts the form with the new project's name.
  const formKey = open && project ? `rename-${project.id}` : "closed";

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <DialogContent className="sm:max-w-md">
        {open && project ? (
          <RenameProjectForm
            key={formKey}
            project={project}
            onClose={onClose}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

export { RenameProjectDialog };