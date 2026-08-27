// src/ProductList/optionsData.ts
// 색상/사이즈 옵션의 단일 소스. ProductDetailPage(상세 옵션 기본값)와
// FilterSidebar(필터 값)가 같은 value 체계를 쓰도록 여기서만 관리합니다.

export interface ColorOption {
  value: string;
  label: string;
}

export const COLOR_OPTIONS: ColorOption[] = [
  { value: "black", label: "블랙" },
  { value: "white", label: "화이트" },
  { value: "gray", label: "그레이" },
  { value: "beige", label: "베이지" },
  { value: "brown", label: "브라운" },
  { value: "blue", label: "블루" },
  { value: "red", label: "레드" },
  { value: "yellow", label: "옐로우" },
];

export const SIZE_OPTIONS: string[] = [
  "XXXS",
  "XXS",
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
];
