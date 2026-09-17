import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes without style conflicts.
 *
 * Combines `clsx` (conditional class composition) with `tailwind-merge`
 * (conflict resolution for Tailwind utilities) so later classes win.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
