"use client";

import { useMemo, useSyncExternalStore } from "react";

const key = "damtap-favorites";
const changed = "damtap-favorites-changed";
let inMemory: string | null = null;

function subscribe(notify: () => void) {
  window.addEventListener("storage", notify);
  window.addEventListener(changed, notify);
  return () => {
    window.removeEventListener("storage", notify);
    window.removeEventListener(changed, notify);
  };
}
function snapshot() {
  if (inMemory !== null) return inMemory;
  try { return localStorage.getItem(key) || "[]"; } catch { return "[]"; }
}
const serverSnapshot = () => "[]";

export default function useFavorites(): [string[], (id: string) => void] {
  const raw = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const favorites = useMemo(() => {
    try {
      const saved: unknown = JSON.parse(raw);
      return Array.isArray(saved) ? saved.filter((id): id is string => typeof id === "string") : [];
    } catch { return []; }
  }, [raw]);
  function toggle(id: string) {
    const next = JSON.stringify(favorites.includes(id) ? favorites.filter(item => item !== id) : [...favorites, id]);
    try { localStorage.setItem(key, next); inMemory = null; } catch { inMemory = next; }
    window.dispatchEvent(new Event(changed));
  }
  return [favorites, toggle];
}
