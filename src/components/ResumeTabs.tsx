"use client";

import {
  type KeyboardEvent,
  type ReactNode,
  useId,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";

import Reveal from "./ui/Reveal";

type Tab = { id: string; label: string; icon: ReactNode; content: ReactNode };

/** Section heading with a segmented switch between server-rendered panels. */
export default function ResumeTabs({
  heading,
  label,
  tabs,
}: {
  heading: ReactNode;
  label: string;
  tabs: readonly Tab[];
}) {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();

  // Arrow keys move focus and selection together, per the ARIA tabs pattern.
  const handleKeyDown = (event: KeyboardEvent) => {
    const last = tabs.length - 1;
    const targets: Record<string, number> = {
      ArrowRight: active === last ? 0 : active + 1,
      ArrowLeft: active === 0 ? last : active - 1,
      Home: 0,
      End: last,
    };
    const next = targets[event.key];
    if (next === undefined) return;
    event.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  // Equal columns let the pill slide by its own width. Below sm the labels
  // collapse to icons so the switch stays on the heading's row; they remain
  // as sr-only text, which keeps each tab's accessible name. Unhiding a panel
  // restarts its CSS animation, so each switch fades the new list in.
  return (
    <div className="mx-auto mt-20 max-w-3xl">
      <Reveal from="above" className="flex items-center justify-between gap-4">
        {heading}

        <div
          role="tablist"
          aria-label={label}
          onKeyDown={handleKeyDown}
          className="bg-dark-200/60 relative grid shrink-0 auto-cols-fr grid-flow-col rounded-xl border border-stone-200/10 p-1"
        >
          <span
            aria-hidden
            className="bg-dark-300 absolute inset-y-1 left-1 rounded-lg inset-ring inset-ring-stone-200/10 transition-[translate] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              width: `calc((100% - 0.5rem) / ${tabs.length})`,
              translate: `${active * 100}% 0`,
            }}
          />
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${tab.id}`}
              aria-selected={index === active}
              aria-controls={`${baseId}-panel-${tab.id}`}
              tabIndex={index === active ? 0 : -1}
              onClick={() => setActive(index)}
              className={cn(
                "relative flex cursor-pointer items-center justify-center rounded-lg p-2.5 font-medium transition-colors duration-200 sm:px-4 sm:py-2",
                index === active
                  ? "text-stone-200"
                  : "text-stone-200/60 hover:text-stone-200",
              )}
            >
              <span aria-hidden className="sm:hidden">
                {tab.icon}
              </span>
              <span className="max-sm:sr-only">{tab.label}</span>
            </button>
          ))}
        </div>
      </Reveal>

      <Reveal from="above" delay={0.15} className="mt-9">
        {tabs.map((tab, index) => (
          <div
            key={tab.id}
            role="tabpanel"
            id={`${baseId}-panel-${tab.id}`}
            aria-labelledby={`${baseId}-tab-${tab.id}`}
            hidden={index !== active}
            className="animate-panel-in"
          >
            {tab.content}
          </div>
        ))}
      </Reveal>
    </div>
  );
}
