// src/Product/recentlyViewed.ts

const STORAGE_KEY = "objet-b-recently-viewed";
const MAX_ITEMS = 20;

export function addRecentlyViewed(id: number) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const ids: number[] = raw ? JSON.parse(raw) : [];
    const next = [id, ...ids.filter((existing) => existing !== id)].slice(
      0,
      MAX_ITEMS,
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // localStorage 사용 불가 환경은 무시
  }
}

export function getRecentlyViewed(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
