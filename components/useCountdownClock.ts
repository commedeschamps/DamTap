"use client";

import { useSyncExternalStore } from "react";

// All mounted card timers share one browser subscription. SSR stays request-independent.
const listeners = new Set<() => void>();
let current: number | null = null;
let interval: ReturnType<typeof setInterval> | undefined;
function tick() {
  current = Date.now();
  listeners.forEach(listener => listener());
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) {
    tick();
    interval = setInterval(tick, 1000);
    window.addEventListener("focus", tick);
    document.addEventListener("visibilitychange", tick);
  }
  return () => {
    listeners.delete(listener);
    if (!listeners.size) {
      clearInterval(interval);
      window.removeEventListener("focus", tick);
      document.removeEventListener("visibilitychange", tick);
      current = null;
    }
  };
}
const snapshot = () => current;
const serverSnapshot = () => null;
export default function useCountdownClock() {
  return useSyncExternalStore(subscribe, snapshot, serverSnapshot);
}
