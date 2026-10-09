"use client";

import { useEffect, useRef } from "react";

import { listenForBackgroundTaps } from "@/lib/backgroundTap";
import { cn } from "@/lib/utils";

// Cells shrink below sm so a phone shows a grid, not a few big squares. Keep
// these in step with the bg-size classes on the root element.
const CELL = 56;
const CELL_NARROW = 40;
const WIDE_QUERY = "(min-width: 640px)";
// The mask stays fully opaque up to this fraction of its radius, then fades to the edges.
const MASK_SOLID = 0.4;
const HOVER_ALPHA = 0.09;
// All 8 neighbours share one level, so the hovered cell reads as a square, not a blob.
const NEIGHBOUR_LEVEL = 0.25;
// Caps the mask compensation where the mask nears zero and a cell barely shows.
const MAX_MASK_BOOST = 3;
// A click is an action, not a glance, so its wave reads brighter than the hover light.
const RIPPLE_ALPHA = 0.15;
// Lit cells fade with this time constant, so the cursor leaves a short trail.
const TRAIL_MS = 300;
const RIPPLE_MS_PER_CELL = 45;
const RIPPLE_WIDTH = 1.2;
const RIPPLE_REACH = 12;
const RIPPLE_END = RIPPLE_REACH + 2 * RIPPLE_WIDTH;
const MAX_RIPPLES = 6;

type Cell = { col: number; row: number };
type Ripple = Cell & { start: number };

/** Hero grid whose cells light up under the mouse and ripple out from a click or tap. */
export default function RippleGrid({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const wide = window.matchMedia(WIDE_QUERY);
    let cellSize = CELL;
    let cols = 0;
    let rows = 0;
    let levels = new Float32Array(0);
    let masks = new Float32Array(0);
    let hover: Cell | null = null;
    // Mask value at the last hovered cell; the trail keeps it after the cursor leaves.
    let anchorMask = 1;
    let pointer: { x: number; y: number } | null = null;
    let ripples: Ripple[] = [];
    let frame = 0;
    let last = 0;

    const cellAt = (x: number, y: number): Cell | null => {
      const rect = canvas.getBoundingClientRect();
      const left = x - rect.left;
      const top = y - rect.top;
      if (left < 0 || top < 0 || left >= rect.width || top >= rect.height) {
        return null;
      }
      return {
        col: Math.floor(left / cellSize),
        row: Math.floor(top / cellSize),
      };
    };

    const render = (now: number) => {
      const decay = last ? Math.exp(-(now - last) / TRAIL_MS) : 1;
      last = now;
      ripples = ripples.filter(
        (ripple) => (now - ripple.start) / RIPPLE_MS_PER_CELL < RIPPLE_END,
      );
      // The loop stops once nothing fades or travels, even with the mouse resting on a cell.
      let changing = ripples.length > 0;

      ctx.clearRect(0, 0, cols * cellSize, rows * cellSize);
      ctx.fillStyle = "#ffffff";
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const index = row * cols + col;
          const ring = hover
            ? Math.max(Math.abs(col - hover.col), Math.abs(row - hover.row))
            : Infinity;
          const target = ring === 0 ? 1 : ring === 1 ? NEIGHBOUR_LEVEL : 0;
          const fading = levels[index] * decay;
          if (fading > target + 0.01) changing = true;
          levels[index] = Math.max(fading > 0.01 ? fading : 0, target);

          // Cancels the mask locally, so cells at one level look identical on
          // screen even where the mask fades across the hovered block.
          const boost = Math.min(
            MAX_MASK_BOOST,
            anchorMask / Math.max(masks[index], 0.001),
          );
          let alpha = levels[index] * HOVER_ALPHA * boost;
          for (const ripple of ripples) {
            const distance = Math.hypot(col - ripple.col, row - ripple.row);
            const front = (now - ripple.start) / RIPPLE_MS_PER_CELL;
            const wave =
              Math.exp(-(((distance - front) / RIPPLE_WIDTH) ** 2)) *
              Math.max(0, 1 - distance / RIPPLE_REACH);
            alpha = Math.max(alpha, wave * RIPPLE_ALPHA);
          }
          if (alpha < 0.001) continue;

          ctx.globalAlpha = alpha;
          // Inset by the 1px grid line so the CSS lines stay untouched.
          ctx.fillRect(
            col * cellSize + 1,
            row * cellSize + 1,
            cellSize - 1,
            cellSize - 1,
          );
        }
      }
      ctx.globalAlpha = 1;
      frame = changing ? requestAnimationFrame(render) : 0;
    };

    const start = () => {
      if (frame) return;
      last = 0;
      frame = requestAnimationFrame(render);
    };

    const resize = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Crossing sm resizes the canvas too, so the observer also picks up the new cell size.
      cellSize = wide.matches ? CELL : CELL_NARROW;
      cols = Math.ceil(width / cellSize);
      rows = Math.ceil(height / cellSize);
      levels = new Float32Array(cols * rows);
      // Same radial the CSS mask draws, sampled at each cell centre.
      masks = new Float32Array(cols * rows);
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const distance = Math.hypot(
            ((col + 0.5) * cellSize - width / 2) / (width / 2),
            ((row + 0.5) * cellSize - height / 2) / (height / 2),
          );
          masks[row * cols + col] = Math.min(
            1,
            Math.max(0, (1 - distance) / (1 - MASK_SOLID)),
          );
        }
      }
      start();
    };

    const updateHover = (target: EventTarget | null) => {
      const overNav = target instanceof Element && target.closest("nav");
      const next = pointer && !overNav ? cellAt(pointer.x, pointer.y) : null;
      if (next?.col === hover?.col && next?.row === hover?.row) return;
      hover = next;
      if (next) anchorMask = masks[next.row * cols + next.col];
      start();
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      pointer = { x: event.clientX, y: event.clientY };
      updateHover(event.target);
    };

    const handlePointerLeave = () => {
      pointer = null;
      updateHover(null);
    };

    // Scrolling moves the grid under a resting cursor.
    const handleScroll = () => {
      if (!pointer) return;
      updateHover(document.elementFromPoint(pointer.x, pointer.y));
    };

    const rippleAt = (x: number, y: number) => {
      const cell = cellAt(x, y);
      if (!cell) return;
      if (reducedMotion.matches) {
        // No travelling wave; the clicked cell still glows as confirmation.
        levels[cell.row * cols + cell.col] = 1;
      } else {
        ripples = [
          ...ripples.slice(-(MAX_RIPPLES - 1)),
          { ...cell, start: performance.now() },
        ];
      }
      start();
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    const stopTaps = listenForBackgroundTaps(rippleAt);
    const root = document.documentElement;
    const passive = { passive: true };
    window.addEventListener("pointermove", handlePointerMove, passive);
    window.addEventListener("scroll", handleScroll, passive);
    root.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      observer.disconnect();
      stopTaps();
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("scroll", handleScroll);
      root.removeEventListener("pointerleave", handlePointerLeave);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      aria-hidden
      style={{
        maskImage: `radial-gradient(ellipse 50% 50% at 50% 50%, black ${MASK_SOLID * 100}%, transparent 100%)`,
      }}
      className={cn(
        "bg-dark-100 relative bg-[linear-gradient(rgba(255,255,255,0.17)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.17)_1px,transparent_1px)] bg-size-[40px_40px] sm:bg-size-[56px_56px]",
        className,
      )}
    >
      <canvas ref={canvasRef} className="absolute inset-0 size-full" />
    </div>
  );
}
