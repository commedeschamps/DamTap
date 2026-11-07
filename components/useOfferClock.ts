"use client";
import { useEffect, useState } from "react";

export default function useOfferClock(initialNow: number) {
  const [now, setNow] = useState(initialNow);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    const timer = window.setInterval(tick, 1000);
    window.addEventListener("focus", tick);
    return () => { window.clearInterval(timer); window.removeEventListener("focus", tick); };
  }, []);
  return now;
}
