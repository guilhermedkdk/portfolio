import type { ReactNode } from "react";

/** Section title with the white-to-gray gradient shared across the page. */
export default function GradientHeading({
  as: Tag = "h2",
  children,
}: {
  as?: "h2" | "h3";
  children: ReactNode;
}) {
  // w-fit so the gradient spans the word; a stretched flex item would fade across the whole row.
  return (
    <Tag className="font-display w-fit bg-linear-to-r from-stone-200 from-60% to-stone-200/50 bg-clip-text text-3xl font-bold tracking-tight text-transparent max-[375px]:text-2xl sm:text-4xl">
      {children}
    </Tag>
  );
}
