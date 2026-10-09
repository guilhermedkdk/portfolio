import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

/** Inline list of technologies separated by slashes. */
export default function TechStack({
  items,
  className,
}: {
  items: readonly string[];
  className?: string;
}) {
  const t = useTranslations("Common");

  // The slashes carry empty alt text, so screen readers skip them.
  return (
    <ul
      aria-label={t("stackLabel")}
      className={cn("flex flex-wrap gap-y-1.5", className)}
    >
      {items.map((item) => (
        <li
          key={item}
          className="text-sm font-medium text-stone-200 not-last:after:mx-2.5 not-last:after:font-normal not-last:after:text-stone-200/50 not-last:after:content-['/'/'']"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
