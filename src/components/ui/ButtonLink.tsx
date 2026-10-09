import type { ReactNode } from "react";
import type { IconType } from "react-icons";

import { cn } from "@/lib/utils";

import { outlineSurface, shinySurface } from "./surfaces";

/** Compact external link in the site's two button styles: shiny for the main action, outlined for the rest. */
export default function ButtonLink({
  href,
  Icon,
  variant = "outline",
  ariaLabel,
  children,
}: {
  href: string;
  Icon: IconType;
  variant?: "shiny" | "outline";
  ariaLabel?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex h-10 items-center gap-2 px-4 text-sm font-medium",
        variant === "shiny" ? cn(shinySurface, "text-white") : outlineSurface,
      )}
    >
      <Icon aria-hidden className="size-4.5 shrink-0" />
      {children}
    </a>
  );
}
