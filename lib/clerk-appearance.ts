import { dark } from "@clerk/ui/themes";

/**
 * Clerk appearance configuration for the app.
 *
 * Uses Clerk's `dark` prebuilt theme as the base, then overrides every
 * color variable to point at the app's own CSS custom properties so the
 * auth pages stay in sync with the design system — no hardcoded colors.
 *
 * If a design token changes in `globals.css`, Clerk's forms update with it.
 */
export const clerkAppearance = {
  baseTheme: dark,
  variables: {
    // Surfaces
    colorBackground: "var(--color-background)",
    colorInputBackground: "var(--color-elevated)",
    colorInput: "var(--color-border)",

    // Text
    colorForeground: "var(--color-foreground)",
    colorMutedForeground: "var(--color-muted-foreground)",
    colorInputForeground: "var(--color-foreground)",
    colorInputPlaceholderText: "var(--color-muted-foreground)",
    colorNeutral: "var(--color-foreground)",

    // Brand / primary
    colorPrimary: "var(--color-primary)",
    colorPrimaryForeground: "var(--color-primary-foreground)",
    colorPrimaryHover: "var(--color-primary)",
    colorPrimaryPressed: "var(--color-primary)",
    colorShimmer: "var(--color-muted)",

    // Borders / rings
    colorBorder: "var(--color-border)",
    colorRing: "var(--color-ring)",
    colorModalBackdrop: "rgba(0, 0, 0, 0.6)",

    // States
    colorDanger: "var(--color-destructive)",
    colorDangerForeground: "var(--color-destructive-foreground)",
    colorSuccess: "var(--color-state-success)",
    colorWarning: "var(--color-state-warning)",

    // Buttons (secondary / ghost)
    colorSecondary: "var(--color-secondary)",
    colorSecondaryForeground: "var(--color-secondary-foreground)",
    colorSecondaryHover: "var(--color-subtle)",
    colorSecondaryPressed: "var(--color-subtle)",

    // Avatar / popovers
    colorAvatarBackground: "var(--color-elevated)",
    colorAvatarForeground: "var(--color-foreground)",
    colorPopoverBackground: "var(--color-popover)",
    colorPopoverForeground: "var(--color-popover-foreground)",

    // Per-foundation overrides (radius / spacing / typography)
    borderRadius: "var(--radius)",
    fontFamily: "var(--font-sans)",
    fontFamilyButtons: "var(--font-sans)",
    fontSize: "14px",
  },
  elements: {
    rootBox: {
      width: "100%",
    },
    card: {
      backgroundColor: "var(--color-card)",
      borderColor: "var(--color-border)",
      borderRadius: "var(--radius-2xl)",
      boxShadow: "none",
    },
    cardBox: {
      width: "100%",
    },
    socialButtons: {
      gap: "0.5rem",
    },
    formButtonPrimary: {
      backgroundColor: "var(--color-primary)",
      color: "var(--color-primary-foreground)",
      "&:hover": {
        backgroundColor: "var(--color-primary)",
        opacity: "0.9",
      },
    },
    formFieldInput: {
      backgroundColor: "var(--color-elevated)",
      borderColor: "var(--color-border)",
      color: "var(--color-foreground)",
      "&:focus": {
        borderColor: "var(--color-ring)",
        boxShadow: "0 0 0 3px color-mix(in oklab, var(--color-ring) 35%, transparent)",
      },
    },
    footerActionLink: {
      color: "var(--color-primary)",
    },
    identityPreviewEditButton: {
      color: "var(--color-primary)",
    },
  },
} as const;