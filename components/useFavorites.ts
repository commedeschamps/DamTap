"use client";

import { useMemo, useSyncExternalStore } from "react";
import { toast } from "sonner";
import { readFavoriteIds, withFavoriteMembership } from "@/lib/favorites";

const key = "damtap-favorites";
const changed = "damtap-favorites-changed";
let inMemory: string | null = null;

function subscribe(notify: () => void) {
  window.addEventListener("storage", notify);
  window.addEventListener(changed, notify);
  return () => { window.removeEventListener("storage", notify); window.removeEventListener(changed, notify); };
}
function snapshot() {
  if (inMemory !== null) return inMemory;
  try { return localStorage.getItem(key) || "[]"; } catch { return "[]"; }
}
const serverSnapshot = () => "[]";
function setFavorite(id: string, selected: boolean) {
  const next = JSON.stringify(withFavoriteMembership(readFavoriteIds(snapshot()), id, selected));
  let persisted = true;
  try { localStorage.setItem(key, next); inMemory = null; } catch { inMemory = next; persisted = false; }
  window.dispatchEvent(new Event(changed));
  return persisted;
}

export default function useFavorites(): [string[], (id: string) => void] {
  const raw = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const favorites = useMemo(() => readFavoriteIds(raw), [raw]);
  function toggle(id: string) {
    const wasSelected = readFavoriteIds(snapshot()).includes(id);
    const persisted = setFavorite(id, !wasSelected);
    toast.success(wasSelected ? "Убрано из избранного" : "Добавлено в избранное", {
      id: `favorite-${id}`,
      description: persisted ? "Избранное сохранено в этом браузере." : "Изменение сохранится только до закрытия страницы.",
      action: { label: "Отменить", onClick: () => { setFavorite(id, wasSelected); } },
    });
  }
  return [favorites, toggle];
}
