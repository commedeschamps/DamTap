"use client";

import { forwardRef } from "react";
import { motion, useIsPresent, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import { layoutTransition, pressTransition } from "@/lib/motion";

type Props = { label: string; onRemove: () => void };
const FilterChip = forwardRef<HTMLButtonElement, Props>(function FilterChip({ label, onRemove }, ref) {
  const present = useIsPresent();
  const reducedMotion = useReducedMotion();
  return <motion.button
    ref={ref}
    className="filter-chip motion-pressable"
    layout={reducedMotion ? false : "position"}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, transition: { duration: reducedMotion ? 0 : 0.1 } }}
    whileTap={reducedMotion ? undefined : { scale: 0.97, transition: pressTransition }}
    transition={reducedMotion ? { duration: 0 } : layoutTransition}
    onClick={onRemove}
    aria-label={`Убрать фильтр: ${label}`}
    inert={!present}
  ><span>{label}</span><X size={14} aria-hidden="true" /></motion.button>;
});
export default FilterChip;
