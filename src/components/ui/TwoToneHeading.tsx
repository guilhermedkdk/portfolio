import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Rich-text tags for two-tone headlines: `<hl>` lifts a phrase to full strength, `<br></br>` breaks the line. */
export const twoToneTags = {
  hl: (chunks: ReactNode) => <span className="text-stone-200">{chunks}</span>,
  br: () => <br />,
};

/** Display headline in muted copy whose `<hl>` phrases stand out; size and alignment come from the caller. */
export default function TwoToneHeading({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <h2
      className={cn(
        "font-display font-bold tracking-tight text-balance text-stone-200/50",
        className,
      )}
    >
      {children}
    </h2>
  );
}
