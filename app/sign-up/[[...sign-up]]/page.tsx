import * as React from "react";
import { SignUp } from "@clerk/nextjs";

import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { Bot, GitBranch, Workflow } from "lucide-react";

const SIGN_UP_HEADLINE = "Design systems at the speed of thought.";

const SIGN_UP_SUBTITLE =
  "Sign up to start building real-time, AI-assisted system architectures on a shared canvas.";

const SIGN_UP_HIGHLIGHTS = [
  {
    icon: Bot,
    title: "AI Architecture Generation",
    description:
      "Describe your system, AI maps it to nodes and edges on a live canvas.",
  },
  {
    icon: GitBranch,
    title: "Real-time Collaboration",
    description:
      "Live cursors, presence indicators, and shared node editing across your team.",
  },
  {
    icon: Workflow,
    title: "Instant Spec Generation",
    description:
      "Export a complete Markdown technical spec directly from the canvas graph.",
  },
] as const;

export default function SignUpPage() {
  return (
    <AuthPageShell
      headline={SIGN_UP_HEADLINE}
      subtitle={SIGN_UP_SUBTITLE}
      highlights={SIGN_UP_HIGHLIGHTS}
    >
      <SignUp />
    </AuthPageShell>
  );
}