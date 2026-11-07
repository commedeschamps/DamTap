export function readFavoriteIds(raw: string): string[] {
  try {
    const saved: unknown = JSON.parse(raw);
    return Array.isArray(saved) ? [...new Set(saved.filter((id): id is string => typeof id === "string"))] : [];
  } catch { return []; }
}

/** Explicit membership makes an Undo safe after unrelated favorite changes. */
export function withFavoriteMembership(favorites: string[], id: string, selected: boolean): string[] {
  return selected ? [...new Set([...favorites, id])] : favorites.filter(item => item !== id);
}
