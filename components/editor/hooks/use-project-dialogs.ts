"use client";

import * as React from "react";

/**
 * Project metadata surfaced to the dialog flow. Today this is derived from
 * local mock data; later it will come from the Prisma layer. Keeping it as
 * a small typed shape lets dialogs render stable placeholders without
 * coupling to a specific data source.
 */
export interface ProjectSummary {
  /** Stable project identifier. */
  id: string;
  /** Display name shown to the user. */
  name: string;
}

/**
 * Slug used in URLs. Today this is derived purely from the project name; once
 * a real API is wired up it will come back from the server alongside the new
 * record. Keeping it client-derived keeps the live preview responsive while
 * we are still in the mock phase.
 */
export function slugifyProjectName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

/**
 * Which dialog (if any) is currently open. Only one dialog can be active at
 * a time — opening a new one implicitly closes the previous one.
 */
export type ProjectDialogKind = "create" | "rename" | "delete" | null;

/**
 * Snapshot of the dialog state at any point in time. Components read from
 * this and the hook never re-exposes the raw reducer.
 */
export interface ProjectDialogState {
  /** Currently-open dialog, or `null` when nothing is open. */
  kind: ProjectDialogKind;
  /** Project targeted by the rename/delete dialogs. `null` for create. */
  project: ProjectSummary | null;
}

/**
 * Public API exposed by `useProjectDialogs`. Each action is a stable callback
 * so consumers can pass them directly to JSX without memoizing.
 */
export interface UseProjectDialogsResult extends ProjectDialogState {
  /** Open the Create Project dialog (closes any other dialog). */
  openCreate: () => void;
  /** Open the Rename Project dialog for a specific project. */
  openRename: (project: ProjectSummary) => void;
  /** Open the Delete Project dialog for a specific project. */
  openDelete: (project: ProjectSummary) => void;
  /** Close whichever dialog is open without performing any action. */
  close: () => void;
  /** Whether a dialog is currently busy with a submit (used for buttons). */
  isSubmitting: boolean;
  /**
   * Submit the active dialog. Resolves once the (mock) work completes and
   * the dialog has been closed. Safe to call only when a dialog is open.
   */
  submit: () => Promise<void>;
}

const CLOSED_STATE: ProjectDialogState = { kind: null, project: null };

/**
 * Owns the editor's project-dialog state: which dialog is open, which
 * project it targets, and the in-flight submission flag.
 *
 * Today the submit handler simulates work with a short timer so the dialog
 * UX (disabled buttons, "Working…" labels) can be exercised without a real
 * API. The hook is the only place that knows about mock timing — when the
 * real mutation API arrives, only this function needs to change.
 */
export function useProjectDialogs(): UseProjectDialogsResult {
  const [state, setState] = React.useState<ProjectDialogState>(CLOSED_STATE);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  /**
   * Monotonic operation counter. Each submit captures the current value;
   * any deferred state-update gated on this counter is dropped if a newer
   * submit (or unrelated state change) has happened in the meantime. This
   * prevents a slow submission from resetting a dialog the user has since
   * reopened or replaced.
   */
  const submitTokenRef = React.useRef(0);

  const openCreate = React.useCallback(() => {
    setState({ kind: "create", project: null });
  }, []);

  const openRename = React.useCallback((project: ProjectSummary) => {
    setState({ kind: "rename", project });
  }, []);

  const openDelete = React.useCallback((project: ProjectSummary) => {
    setState({ kind: "delete", project });
  }, []);

  const close = React.useCallback(() => {
    // Block dismissal while a submission is in flight. The matching
    // success-path close happens inside `submit` once the operation token
    // is validated, so closing here would race the still-running work.
    if (isSubmitting) return;
    setState(CLOSED_STATE);
  }, [isSubmitting]);

  const submit = React.useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    // Operation token: incremented on every submit attempt. The deferred
    // close below is gated on this token still being current, so a stale
    // submission cannot slam shut a dialog the user opened afterwards.
    const token = ++submitTokenRef.current;
    try {
      // Simulate the request round-trip. Kept short so the UX is testable
      // without feeling sluggish, but long enough to render a loading state.
      await new Promise((resolve) => setTimeout(resolve, 350));
      if (token === submitTokenRef.current) {
        setState(CLOSED_STATE);
      }
    } finally {
      if (token === submitTokenRef.current) {
        setIsSubmitting(false);
      }
    }
  }, [isSubmitting]);

  return {
    kind: state.kind,
    project: state.project,
    isSubmitting,
    openCreate,
    openRename,
    openDelete,
    close,
    submit,
  };
}