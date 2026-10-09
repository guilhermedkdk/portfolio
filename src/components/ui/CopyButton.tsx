"use client";

import { useEffect, useRef, useState } from "react";
import {
  IoAlertCircleOutline,
  IoCheckmark,
  IoCopyOutline,
} from "react-icons/io5";

import { cn } from "@/lib/utils";

const FEEDBACK_MS = 2000;

const icons = {
  idle: IoCopyOutline,
  copied: IoCheckmark,
  failed: IoAlertCircleOutline,
};

/** Icon button that copies `value` to the clipboard and confirms or reports it in place. */
export default function CopyButton({
  value,
  label,
  copiedLabel,
  failedLabel,
  className,
}: {
  value: string;
  label: string;
  copiedLabel: string;
  failedLabel: string;
  className?: string;
}) {
  const [status, setStatus] = useState<keyof typeof icons>("idle");
  const timer = useRef<number>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const handleClick = async () => {
    // Rejects on denied permission or an insecure origin; the address stays
    // visible next to the button to copy by hand.
    const next = await navigator.clipboard.writeText(value).then(
      () => "copied" as const,
      () => "failed" as const,
    );
    setStatus(next);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setStatus("idle"), FEEDBACK_MS);
  };

  const Icon = icons[status];

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        aria-label={label}
        title={status === "failed" ? failedLabel : label}
        className={cn(
          "flex cursor-pointer items-center justify-center text-white/80 transition-colors duration-200 hover:text-white",
          className,
        )}
      >
        <Icon className="size-5" aria-hidden />
      </button>
      <span role="status" className="sr-only">
        {status === "copied"
          ? copiedLabel
          : status === "failed"
            ? failedLabel
            : ""}
      </span>
    </>
  );
}
