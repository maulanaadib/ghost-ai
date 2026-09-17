import {
  Card as CardPrimitive,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * App-level Card.
 *
 * Wraps the generated shadcn Card to enforce the design-system radius scale
 * (`rounded-2xl` for cards/panels) without modifying the protected
 * `components/ui/*` foundation components.
 */
function Card({ className, ...props }: React.ComponentProps<typeof CardPrimitive>) {
  return (
    <CardPrimitive
      data-slot="card"
      className={cn("rounded-2xl bg-surface border-surface-border", className)}
      {...props}
    />
  );
}

export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
};
