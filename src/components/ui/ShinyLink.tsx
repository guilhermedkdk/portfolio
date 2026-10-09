import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { shinySurface } from "./surfaces";

/** Shimmering call-to-action. Always renders an anchor: every use is a link. */
export default function ShinyLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      className={cn(
        shinySurface,
        "group relative inline-flex h-12 items-center justify-center gap-2.5 self-start px-6 font-medium text-white transition-colors max-[375px]:h-10 max-[375px]:px-4 max-[375px]:text-sm",
      )}
    >
      {children}
      {icon && (
        <span className="inline-flex transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1">
          {icon}
        </span>
      )}
    </a>
  );
}
