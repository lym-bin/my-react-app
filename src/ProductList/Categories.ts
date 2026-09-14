// src/ProductList/categories.ts
// Header 카테고리 드롭다운, QuickNav, ProductData 참조
// 카테고리 목록 단일 소스
export const CATEGORIES = [
  {
    id: "outer",
    label: "아우터",
  },
  {
    id: "top",
    label: "상의",
  },
  {
    id: "pants",
    label: "바지",
  },
  {
    id: "shoes",
    label: "신발",
  },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];
