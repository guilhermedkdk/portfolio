"use client";

import Image from "next/image";
import {
  type FocusEvent,
  type KeyboardEvent,
  type PointerEvent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";

// Time to finish reading after the pointer leaves.
const LINGER_MS = 1200;
// Touch has no pointer to leave, so the bubble closes on its own.
const TOUCH_HOLD_MS = 4000;

const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";
const BUBBLE_ENTER = `opacity 200ms ease-out, scale 500ms ${EASE_OUT}, translate 450ms ${EASE_OUT}, width 450ms ${EASE_OUT}, height 450ms ${EASE_OUT}`;
const BUBBLE_EXIT = `opacity 200ms ease-in, scale 250ms ease-in, translate 450ms ${EASE_OUT}`;

// "quiet" keeps the last line so the bubble still shows it while it shrinks away.
type Bubble =
  | { kind: "typing" }
  | { kind: "speaking"; line: number }
  | { kind: "quiet"; line: number };

// A wrapped line box stays as wide as max-width, not as its longest line, so
// balanced two-line text would leave a gap on the right; measure the glyphs.
function fitBubble({
  bubble,
  content,
}: {
  bubble: HTMLElement;
  content: HTMLElement;
}) {
  let width = content.offsetWidth;
  const phrase = content.firstElementChild;
  if (phrase?.textContent) {
    const range = document.createRange();
    range.selectNodeContents(phrase);
    const lines = [...range.getClientRects()];
    // Rects come back transformed, and the bubble may be mid-scale.
    const scale = content.getBoundingClientRect().width / content.offsetWidth;
    const left = Math.min(...lines.map((line) => line.left));
    const right = Math.max(...lines.map((line) => line.right));
    const { paddingLeft, paddingRight } = getComputedStyle(phrase);
    width =
      (right - left) / scale +
      parseFloat(paddingLeft) +
      parseFloat(paddingRight);
  }
  bubble.style.width = `${Math.ceil(width)}px`;
  bubble.style.height = `${content.offsetHeight}px`;
}

/**
 * Hero photo that tilts on hover and speaks through a chat bubble. Until the
 * first line is heard, a typing indicator sits on the photo as the invitation;
 * each later hover or click says the next line.
 */
export default function Avatar({
  alt,
  label,
  lines,
}: {
  alt: string;
  label: string;
  lines: [string, ...string[]];
}) {
  // Typing from the server render: the dots pop in on first paint through CSS,
  // without waiting for hydration.
  const [bubble, setBubble] = useState<Bubble>({ kind: "typing" });
  const [tilted, setTilted] = useState(false);
  const [inView, setInView] = useState(true);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const bubbleRef = useRef<HTMLSpanElement>(null);
  const contentRef = useRef<HTMLSpanElement>(null);
  const closeTimer = useRef<number>(undefined);
  const lastPointer = useRef("");
  const keyboardFocus = useRef(false);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  // The bubble is sized explicitly so width and height can transition; the
  // content is laid out at its final size and the bubble clips it while growing.
  // Two lines can share a box size, so a line change refits without a resize.
  useLayoutEffect(() => {
    if (bubbleRef.current && contentRef.current) {
      fitBubble({ bubble: bubbleRef.current, content: contentRef.current });
    }
  }, [bubble]);

  // Catches the web font swapping in after the first fit.
  useEffect(() => {
    const bubbleNode = bubbleRef.current;
    const content = contentRef.current;
    if (!bubbleNode || !content) return;
    const observer = new ResizeObserver(() =>
      fitBubble({ bubble: bubbleNode, content }),
    );
    observer.observe(content);
    return () => observer.disconnect();
  }, []);

  // The typing loop rests while the photo is offscreen.
  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;
    const observer = new IntersectionObserver(([entry]) =>
      setInView(entry.isIntersecting),
    );
    observer.observe(button);
    return () => observer.disconnect();
  }, []);

  // `next` asks for a new line even while one is showing (a click); a hover
  // back onto a bubble that has not closed yet keeps the current one.
  const speak = (next: boolean) => {
    window.clearTimeout(closeTimer.current);
    setBubble((current) => {
      switch (current.kind) {
        case "typing":
          return { kind: "speaking", line: 0 };
        case "speaking":
          return next
            ? { kind: "speaking", line: (current.line + 1) % lines.length }
            : current;
        case "quiet":
          return { kind: "speaking", line: (current.line + 1) % lines.length };
        default: {
          const _exhaustive: never = current;
          return _exhaustive;
        }
      }
    });
  };

  const hush = () => {
    setBubble((current) =>
      current.kind === "speaking"
        ? { kind: "quiet", line: current.line }
        : current,
    );
    setTilted(false);
  };

  const hushAfter = (ms: number) => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(hush, ms);
  };

  const handlePointerEnter = (event: PointerEvent) => {
    if (event.pointerType === "touch") return;
    setTilted(true);
    speak(false);
  };

  const handlePointerLeave = (event: PointerEvent) => {
    if (event.pointerType === "touch") return;
    setTilted(false);
    hushAfter(LINGER_MS);
  };

  const handleClick = () => {
    speak(true);
    if (lastPointer.current === "touch") {
      setTilted(true);
      hushAfter(TOUCH_HOLD_MS);
    }
  };

  // Only keyboard focus opens the bubble; a mouse click also focuses the
  // button, and that focus must not hold the bubble open after the pointer leaves.
  const handleFocus = (event: FocusEvent<HTMLButtonElement>) => {
    if (!event.currentTarget.matches(":focus-visible")) return;
    keyboardFocus.current = true;
    setTilted(true);
    speak(false);
  };

  const handleBlur = () => {
    if (!keyboardFocus.current) return;
    keyboardFocus.current = false;
    setTilted(false);
    hushAfter(LINGER_MS);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    lastPointer.current = "";
    if (event.key !== "Escape") return;
    window.clearTimeout(closeTimer.current);
    hush();
  };

  const visible = bubble.kind === "typing" || bubble.kind === "speaking";

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-label={label}
        data-tilted={tilted || undefined}
        onPointerDown={(event) => (lastPointer.current = event.pointerType)}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onClick={handleClick}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="group relative size-20 cursor-pointer rounded-full focus-visible:outline-2 focus-visible:outline-offset-10 sm:size-24"
      >
        <Image
          src="/avatars/avatar.png"
          alt={alt}
          fill
          sizes="128px"
          priority
          className="transform-[rotate(var(--avatar-tilt))_scale(var(--avatar-zoom))] rounded-full border-2 border-neutral-700 object-cover [transition-property:--avatar-tilt,--avatar-zoom] duration-450 ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-data-tilted:[--avatar-tilt:-12deg] motion-safe:group-data-tilted:[--avatar-zoom:1.15]"
        />

        <span
          ref={bubbleRef}
          aria-hidden
          style={{ transition: visible ? BUBBLE_ENTER : BUBBLE_EXIT }}
          className={cn(
            "animate-bubble-pop absolute bottom-[80%] left-[78%] z-10 origin-bottom-left overflow-hidden rounded-2xl rounded-bl-[5px] bg-stone-100 text-left text-neutral-900 shadow-[0_10px_30px_-10px_rgb(0_0_0/0.6)] select-none",
            visible
              ? "scale-100 opacity-100"
              : "pointer-events-none scale-50 opacity-0",
            tilted && "motion-safe:translate-x-1 motion-safe:-translate-y-1",
          )}
        >
          <span
            ref={contentRef}
            className={cn(
              "block w-max",
              // In flow while typing, so the server-rendered bubble has a size
              // before hydration; pinned once talking, so the bubble clips the
              // line while it grows.
              bubble.kind !== "typing" && "absolute bottom-0 left-0",
            )}
          >
            {bubble.kind === "typing" ? (
              <span className="flex gap-1 px-3.5 py-3">
                {[0, 1, 2].map((dot) => (
                  <span
                    key={dot}
                    style={{ animationDelay: `${dot * 150}ms` }}
                    className={cn(
                      "animate-typing size-1.5 rounded-full bg-neutral-500",
                      !inView && "[animation-play-state:paused]",
                    )}
                  />
                ))}
              </span>
            ) : (
              <span
                key={bubble.line}
                className="animate-bubble-text block max-w-52 px-3.5 py-2 text-sm leading-snug font-medium text-balance max-[375px]:max-w-48 sm:max-w-80"
              >
                {lines[bubble.line]}
              </span>
            )}
          </span>
        </span>
      </button>

      <span aria-live="polite" className="sr-only">
        {bubble.kind === "speaking" ? lines[bubble.line] : ""}
      </span>
    </>
  );
}
