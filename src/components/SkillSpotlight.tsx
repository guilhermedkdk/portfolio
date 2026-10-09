"use client";

import { useEffect, useRef, useState } from "react";

import { skillItems } from "@/lib/constants";
import { cn } from "@/lib/utils";

const STEP_MS = 1800;
const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

/** Hero's stack row: names one technology at a time and lights its icon; hovering an icon holds it. */
export default function SkillSpotlight({ label }: { label: string }) {
  // `previous` leaves upwards while the next word rises from below.
  const [{ active, previous }, setSpot] = useState({ active: 0, previous: -1 });
  const [held, setHeld] = useState(false);
  const slotRef = useRef<HTMLSpanElement>(null);
  const [widths, setWidths] = useState<{ slot: number; words: number[] }>({
    slot: 0,
    words: [],
  });

  const show = (index: number) =>
    setSpot((spot) =>
      spot.active === index ? spot : { active: index, previous: spot.active },
    );

  // The slot stays as wide as the longest word, so nothing reflows; the phrase
  // shifts by half the spare room to stay centred, inside a heading stretched
  // to the icon row. Re-measured when the web font swaps in or a breakpoint
  // resizes the text.
  useEffect(() => {
    const slot = slotRef.current;
    if (!slot) return;
    const words = [...slot.children];
    const measure = () =>
      setWidths({
        slot: slot.getBoundingClientRect().width,
        words: words.map((word) => word.getBoundingClientRect().width),
      });
    const observer = new ResizeObserver(measure);
    [slot, ...words].forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  // Restarts on every change, so a word released from a hover still gets its full turn.
  useEffect(() => {
    if (held || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setTimeout(
      () =>
        setSpot({ active: (active + 1) % skillItems.length, previous: active }),
      STEP_MS,
    );
    return () => clearTimeout(timer);
  }, [active, held]);

  // Reduced motion drops the rotating word and shows every icon in colour.
  return (
    <>
      <h2
        style={{ animationDelay: "350ms" }}
        className="animate-enter self-stretch text-base font-medium tracking-[0.2em] text-stone-200/60 uppercase max-[360px]:text-sm"
      >
        <span
          style={{
            translate: `${(widths.slot - (widths.words[active] ?? 0)) / 2}px`,
          }}
          className={cn(
            "inline-block transition-[translate] duration-500",
            EASE,
          )}
        >
          {label}{" "}
          <span
            ref={slotRef}
            aria-hidden
            className="inline-grid justify-items-start text-left font-semibold whitespace-nowrap text-stone-200 motion-reduce:hidden"
          >
            {skillItems.map(({ name }, index) => (
              <span
                key={name}
                className={cn(
                  "col-start-1 row-start-1 transition-[opacity,translate,filter] duration-500",
                  EASE,
                  index !== active && "opacity-0 blur-xs",
                  index !== active &&
                    (index === previous ? "-translate-y-2" : "translate-y-2"),
                )}
              >
                {name}
              </span>
            ))}
          </span>
        </span>
      </h2>
      <ul className="flex flex-wrap items-center justify-center gap-x-3 gap-y-6 min-[340px]:gap-x-4 min-[400px]:gap-x-6 sm:gap-x-12">
        {skillItems.map(({ name, Icon, iconColor }, index) => (
          <li
            key={name}
            style={{ animationDelay: `${450 + index * 60}ms` }}
            className="animate-enter-scale"
            onPointerEnter={() => {
              setHeld(true);
              show(index);
            }}
            onPointerLeave={() => setHeld(false)}
          >
            <Icon
              aria-hidden
              className={cn(
                "size-7 transition duration-500 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:grayscale-0 min-[400px]:size-8 sm:size-10",
                EASE,
                iconColor,
                index === active ? "-translate-y-1" : "opacity-50 grayscale",
              )}
            />
            <span className="sr-only">{name}</span>
          </li>
        ))}
      </ul>
    </>
  );
}
