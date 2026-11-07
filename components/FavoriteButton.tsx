"use client";

import { Heart } from "lucide-react";
import { motion, useAnimationControls, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { motionEase, pressTransition } from "@/lib/motion";
import Hint from "./Hint";

type Props = {
  favorite: boolean;
  onToggle: () => void;
  label: string;
  className: string;
  children?: ReactNode;
  hint?: string;
};

export default function FavoriteButton({ favorite, onToggle, label, className, children, hint }: Props) {
  const heart = useAnimationControls();
  const reducedMotion = useReducedMotion();
  const button = <motion.button
    className={`${className} motion-pressable`}
    aria-label={label}
    aria-pressed={favorite}
    whileTap={reducedMotion ? undefined : { scale: 0.94 }}
    transition={pressTransition}
    onClick={() => {
      onToggle();
      if (!reducedMotion) void heart.start({ scale: [1, 0.85, 1.18, 1], rotate: [0, -8, 0], transition: { duration: 0.36, ease: motionEase } });
    }}
  ><motion.span className="favorite-glyph" initial={false} animate={heart}><Heart size={children ? 19 : 22} fill={favorite ? "currentColor" : "none"} aria-hidden="true" /></motion.span>{children}</motion.button>;
  return hint ? <Hint label={hint}>{button}</Hint> : button;
}
