"use client";

import { forwardRef } from "react";
import { motion, useIsPresent, useReducedMotion } from "motion/react";
import type { Offer } from "@/data/offers";
import { layoutTransition } from "@/lib/motion";
import OfferCard from "./OfferCard";

type Props = { offer: Offer; favorite: boolean; onFavorite: () => void; href: string };
const CatalogueCard = forwardRef<HTMLDivElement, Props>(function CatalogueCard(props, ref) {
  const present = useIsPresent();
  const reducedMotion = useReducedMotion();
  return <motion.div
    ref={ref}
    className="catalogue-card-wrap"
    layout={reducedMotion ? false : "position"}
    initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: reducedMotion ? 0 : 4, transition: { duration: reducedMotion ? 0 : 0.12 } }}
    transition={reducedMotion ? { duration: 0 } : layoutTransition}
    inert={!present}
  ><OfferCard {...props} /></motion.div>;
});
export default CatalogueCard;
