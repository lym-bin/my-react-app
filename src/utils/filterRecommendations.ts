// src/utils/filterRecommendations.ts
// AI 추천 결과 검증 (테스트하기 쉽게 recommend.ts에서 분리)
import type { Product } from "../ProductList/ProductsData.js";

export interface Recommendation {
  id: number;
  reason: string;
}

// AI가 준 추천(모양을 믿지 않음)과 후보 목록을 받아서, 규칙을 통과한 것만 돌려줌
export function filterRecommendations(
  items: { id?: unknown; reason?: unknown }[],
  candidates: Product[],
): Recommendation[] {
  const results: Recommendation[] = [];
  const usedCategories: string[] = [];

  for (const item of items) {
    // 규칙 1: 후보에 있나 (없는 상품, 자기 자신, 같은 카테고리가 한 번에 걸림)
    const match = candidates.find((p) => p.id === item.id);
    if (!match) continue;

    // 규칙 2: 이유가 글자이고 비어 있지 않나
    if (typeof item.reason !== "string" || item.reason.trim() === "") continue;

    // 규칙 3: 20자 이하인가
    if (item.reason.length > 20) continue;

    // 규칙 4: 이미 고른 카테고리인가
    if (usedCategories.includes(match.category)) continue;

    results.push({ id: match.id, reason: item.reason });
    usedCategories.push(match.category);

    // 규칙 5: 3개 모이면 그만
    if (results.length === 3) break;
  }

  return results;
}
