import * as React from "react";

import {
  Dialog as DialogPrimitive,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

/**
 * App-level Dialog.
 *
 * Wraps the generated shadcn Dialog so the overlay matches the dark design
 * system — elevated surface, `rounded-3xl`, and backdrop blur — without
 * modifying the protected `components/ui/*` foundation components.
 */
function Dialog({ ...props }: React.ComponentProps<typeof DialogPrimitive>) {
  return <DialogPrimitive {...props} />;
}

function DialogContentWrapper({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogContent>) {
  return (
    <DialogContent
      className={cn(
        "rounded-3xl border-surface-border bg-elevated backdrop-blur",
        className,
      )}
      {...props}
    >
      {children}
    </DialogContent>
  );
}

export {
  Dialog,
  DialogClose,
  DialogContentWrapper as DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
