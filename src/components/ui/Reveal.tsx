"use client";

import { motion, MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

const OFFSET = 40;

const origins = {
  below: { y: OFFSET },
  above: { y: -OFFSET },
  left: { x: -OFFSET },
  right: { x: OFFSET },
} as const;

/** Fades and slides its content into place the first time it scrolls into view. */
export default function Reveal({
  from = "below",
  delay = 0,
  className,
  children,
}: {
  from?: keyof typeof origins;
  delay?: number;
  className?: string;
  children: ReactNode;
}) {
  // "user" drops the slide but keeps the fade when the OS asks for reduced motion.
  // data-reveal is the hook for the no-JS fallback in the root layout.
  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        data-reveal
        className={className}
        initial={{ opacity: 0, ...origins[from] }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -80px 0px" }}
        transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </MotionConfig>
  );
}
