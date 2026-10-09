"use client";

import { useEffect, useRef } from "react";

import { listenForBackgroundTaps } from "@/lib/backgroundTap";
import { cn } from "@/lib/utils";

// One star per this many square pixels, so the sky is as dense at every width.
const AREA_PER_STAR = 1800;
// Far to near: nearer stars are bigger and brighter and pass faster (px/s).
const LAYERS = [
  { share: 0.55, radius: [0.45, 0.7], alpha: [0.25, 0.45], speed: 4 },
  { share: 0.33, radius: [0.7, 1], alpha: [0.45, 0.7], speed: 10 },
  { share: 0.12, radius: [1, 1.4], alpha: [0.7, 1], speed: 20 },
] as const;
const TWINKLE_SHARE = 0.3;
// A few stars carry the meteors' blue, so their tint belongs to the sky.
const BLUE_SHARE = 0.12;
const STAR_WHITE = "#ededed";
const STAR_BLUE = "#bfdbfe";
const METEOR_GAP_MS = [2500, 5500] as const;
// Soon after the sky scrolls in, so the visitor sees one without waiting.
const FIRST_METEOR_MS = 700;
const MAX_METEORS = 5;
// Leftward and slightly down, the way the stars drift.
const METEOR_ANGLE_DEG = [160, 170] as const;
const METEOR_LIFE_MS = [700, 1100] as const;

type Range = readonly [number, number];

type Star = {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  speed: number;
  twinkle: number;
  phase: number;
  color: string;
};

type Meteor = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  length: number;
  start: number;
  life: number;
};

const between = ([min, max]: Range) => min + Math.random() * (max - min);

const pickLayer = () => {
  let roll = Math.random();
  for (const layer of LAYERS) {
    roll -= layer.share;
    if (roll < 0) return layer;
  }
  return LAYERS[LAYERS.length - 1];
};

/** Footer night sky: stars drift past, meteors cross now and then, and a click or tap launches one. */
export default function StarrySky({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0;
    let height = 0;
    let stars: Star[] = [];
    let meteors: Meteor[] = [];
    let inView = false;
    let frame = 0;
    let last = 0;
    let nextMeteor = 0;

    const seed = () => {
      const count = Math.round((width * height) / AREA_PER_STAR);
      stars = Array.from({ length: count }, () => {
        const layer = pickLayer();
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          radius: between(layer.radius),
          alpha: between(layer.alpha),
          speed: layer.speed,
          twinkle: Math.random() < TWINKLE_SHARE ? between([0.8, 2.2]) : 0,
          phase: Math.random() * Math.PI * 2,
          color: Math.random() < BLUE_SHARE ? STAR_BLUE : STAR_WHITE,
        };
      });
    };

    const launch = (x: number, y: number, now: number) => {
      const angle = (between(METEOR_ANGLE_DEG) * Math.PI) / 180;
      // Scaled to the width so a meteor takes about as long to cross a phone as a desktop.
      const speed = Math.min(900, Math.max(380, width * 0.65));
      meteors = [
        ...meteors.slice(-(MAX_METEORS - 1)),
        {
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          length: speed * 0.16,
          start: now,
          life: between(METEOR_LIFE_MS),
        },
      ];
    };

    const drawMeteor = (meteor: Meteor, now: number) => {
      const elapsed = now - meteor.start;
      const progress = elapsed / meteor.life;
      const fade =
        progress < 0.12
          ? progress / 0.12
          : progress < 0.45
            ? 1
            : (1 - progress) / 0.55;
      const headX = meteor.x + (meteor.vx * elapsed) / 1000;
      const headY = meteor.y + (meteor.vy * elapsed) / 1000;
      const speed = Math.hypot(meteor.vx, meteor.vy);
      // The tail grows out of the launch point instead of appearing at full length.
      const length = Math.min(meteor.length, (speed * elapsed) / 1000);
      const tailX = headX - (meteor.vx / speed) * length;
      const tailY = headY - (meteor.vy / speed) * length;

      const tail = ctx.createLinearGradient(headX, headY, tailX, tailY);
      tail.addColorStop(0, `rgba(255, 255, 255, ${fade})`);
      tail.addColorStop(0.2, `rgba(147, 197, 253, ${0.75 * fade})`);
      tail.addColorStop(1, "rgba(59, 130, 246, 0)");
      ctx.strokeStyle = tail;
      ctx.lineWidth = 1.5;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(headX, headY);
      ctx.stroke();

      ctx.fillStyle = `rgba(255, 255, 255, ${fade})`;
      ctx.beginPath();
      ctx.arc(headX, headY, 1.2, 0, Math.PI * 2);
      ctx.fill();
    };

    const draw = (now: number, dt: number) => {
      ctx.clearRect(0, 0, width, height);
      const seconds = now / 1000;
      for (const star of stars) {
        star.x -= star.speed * dt;
        if (star.x < -star.radius) star.x += width + 2 * star.radius;
        const twinkle = star.twinkle
          ? 0.6 + 0.4 * Math.sin(seconds * star.twinkle + star.phase)
          : 1;
        ctx.globalAlpha = star.alpha * twinkle;
        ctx.fillStyle = star.color;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      meteors = meteors.filter((meteor) => now - meteor.start < meteor.life);
      for (const meteor of meteors) drawMeteor(meteor, now);
    };

    const render = (now: number) => {
      // Capped so a stalled frame does not jump the stars.
      const dt = last ? Math.min(now - last, 100) / 1000 : 0;
      last = now;
      if (now >= nextMeteor) {
        // Born below the masked fade and right of the content, in open sky.
        launch(
          between([0.5, 1.05]) * width,
          between([0.3, 0.65]) * height,
          now,
        );
        nextMeteor = now + between(METEOR_GAP_MS);
      }
      draw(now, dt);
      frame = requestAnimationFrame(render);
    };

    // The loop only runs while the sky is on screen; otherwise a still frame stays.
    const update = () => {
      const running = inView && !document.hidden && !reducedMotion.matches;
      if (running && !frame) {
        last = 0;
        nextMeteor = performance.now() + FIRST_METEOR_MS;
        frame = requestAnimationFrame(render);
      } else if (!running) {
        cancelAnimationFrame(frame);
        frame = 0;
        meteors = [];
        draw(performance.now(), 0);
      }
    };

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
      update();
    };

    const handleTap = (x: number, y: number) => {
      if (reducedMotion.matches) return;
      const rect = canvas.getBoundingClientRect();
      const left = x - rect.left;
      const top = y - rect.top;
      if (left < 0 || top < 0 || left > rect.width || top > rect.height) return;
      launch(left, top, performance.now());
    };

    const intersection = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      update();
    });
    intersection.observe(canvas);
    const sizeObserver = new ResizeObserver(resize);
    sizeObserver.observe(canvas);
    const stopTaps = listenForBackgroundTaps(handleTap);
    document.addEventListener("visibilitychange", update);
    reducedMotion.addEventListener("change", update);

    return () => {
      intersection.disconnect();
      sizeObserver.disconnect();
      stopTaps();
      document.removeEventListener("visibilitychange", update);
      reducedMotion.removeEventListener("change", update);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div aria-hidden className={cn("pointer-events-none", className)}>
      <canvas ref={canvasRef} className="size-full" />
    </div>
  );
}
