// src/ProductList/categories.ts
// Header 카테고리 드롭다운, QuickNav, ProductData 참조

export const CATEGORIES = [
  {
    id: "outer",
    label: "OUTER",
  },
  {
    id: "top",
    label: "TOP",
  },
  {
    id: "pants",
    label: "PANTS",
  },
  {
    id: "shoes",
    label: "SHOES",
  },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];
