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
] as const; // as const로 고정된 배열

// typeof CATEGORIES: 배열 전체의 타입
// [number]: 그 배열 "요소 하나"의 타입({id: "outer", label: "아우터"} | {id:"top", label:"상의"} |.. 4개 객체중 하나)
// ["id"]: 그 객체들에서 id 필드만 뽑아냄 -> "outer" | "top" | "pants" | "shoes"
export type CategoryId = (typeof CATEGORIES)[number]["id"];
