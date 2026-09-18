import * as React from "react";
import { SignIn } from "@clerk/nextjs";

import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { Bot, GitBranch, Workflow } from "lucide-react";

const SIGN_IN_HEADLINE = "Design systems at the speed of thought.";

const SIGN_IN_SUBTITLE =
  "Describe your architecture in plain English. Ghost AI maps it to a shared canvas your whole team can refine in real time.";

const SIGN_IN_HIGHLIGHTS = [
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

export default function SignInPage() {
  return (
    <AuthPageShell
      headline={SIGN_IN_HEADLINE}
      subtitle={SIGN_IN_SUBTITLE}
      highlights={SIGN_IN_HIGHLIGHTS}
    >
      <SignIn />
    </AuthPageShell>
  );
}