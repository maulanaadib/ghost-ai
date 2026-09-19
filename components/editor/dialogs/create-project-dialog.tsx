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

import {
  slugifyProjectName,
  useProjectDialogs,
} from "@/components/editor/hooks/use-project-dialogs";

/**
 * Create Project dialog.
 *
 * Captures a project name and surfaces a live slug preview so the user can
 * see exactly what URL they will get. The preview reuses the same slug rule
 * the server will use, so there are no surprises once the API lands.
 *
 * Form state lives inside `CreateProjectForm` so it resets naturally when
 * the parent remounts the form via the `formKey` prop (driven by `kind`
 * transitions). That avoids resetting state in an effect — the form is
 * simply a fresh instance each time the dialog opens.
 */
export interface CreateProjectDialogProps {
  /** Currently-open dialog kind — dialog mounts only when this is "create". */
  kind: ReturnType<typeof useProjectDialogs>["kind"];
  /** Whether the dialog is currently performing a submit. */
  isSubmitting: boolean;
  /** Called when the user cancels or dismisses the dialog. */
  onClose: () => void;
  /** Called when the user confirms creation. Resolves after mock work. */
  onSubmit: () => Promise<void>;
}

function CreateProjectForm({
  onClose,
  onSubmit,
  isSubmitting,
}: {
  onClose: () => void;
  onSubmit: () => Promise<void>;
  isSubmitting: boolean;
}) {
  const [name, setName] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const slug = slugifyProjectName(name);
  const trimmed = name.trim();
  const canSubmit = trimmed.length > 0 && !isSubmitting;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    onSubmit();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <DialogHeader>
        <DialogTitle>New Project</DialogTitle>
        <DialogDescription>
          Give your architecture workspace a name. You can rename it later.
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="create-project-name"
          className="text-xs font-medium text-copy-secondary"
        >
          Project name
        </label>
        <Input
          id="create-project-name"
          name="name"
          autoFocus
          autoComplete="off"
          placeholder="e.g. Marketplace Platform"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            if (error) setError(null);
          }}
          aria-invalid={error ? true : undefined}
          aria-describedby="create-project-slug"
          disabled={isSubmitting}
          className={cn(
            error && "border-state-error focus-visible:ring-state-error/40",
          )}
        />
        {error ? (
          <p
            id="create-project-name-error"
            role="alert"
            className="text-xs text-state-error"
          >
            {error}
          </p>
        ) : (
          <p
            id="create-project-slug"
            className="break-all text-xs text-copy-muted"
          >
            {slug ? (
              <>
                <span className="text-copy-faint">Slug:</span>{" "}
                <span className="font-mono text-copy-secondary">{slug}</span>
              </>
            ) : (
              <span className="text-copy-faint">
                Start typing to preview the slug.
              </span>
            )}
          </p>
        )}
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
          {isSubmitting ? "Creating…" : "Create project"}
        </Button>
      </DialogFooter>
    </form>
  );
}

function CreateProjectDialog({
  kind,
  isSubmitting,
  onClose,
  onSubmit,
}: CreateProjectDialogProps) {
  // The form is keyed by `kind`. When the dialog opens, the kind becomes
  // "create" and a fresh form mounts with empty state — no `useEffect`
  // reset needed. When it closes, the form unmounts cleanly.
  const open = kind === "create";
  const formKey = open ? "create" : "closed";

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <DialogContent className="sm:max-w-md">
        {open ? (
          <CreateProjectForm
            key={formKey}
            onClose={onClose}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

export { CreateProjectDialog };