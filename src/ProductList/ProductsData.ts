// src/ProductList/ProductsData.ts
import type { CategoryId } from "./Categories";
import { COLOR_OPTIONS, type ColorOption } from "./OptionsData";

export interface Product {
  id: number;
  name: string;
  price: number;
  category: CategoryId;
  imgSrc: string;
  images?: string[]; // 추가 이미지들 담을 배열 추가
  isLarge?: boolean;
  similarProductIds?: number[]; // 비슷한 제품들의 ID배열 추가
  reviewProductIds?: number[]; // 후기 컷용 ID 배열 추가
  colors?: ColorOption[]; // 상품별 선택 가능한 색상 (없으면 전체 옵션 노출)
  sizes?: string[]; // 상품별 선택 가능한 사이즈 (없으면 전체 옵션 노출)
}

// COLOR_OPTIONS(단일 소스)에서 value 기준으로 골라 상품에 붙이기 위한 헬퍼
function pickColors(...values: string[]): ColorOption[] {
  return COLOR_OPTIONS.filter((c) => values.includes(c.value));
}

export const PRODUCTS: Product[] = [
  // --- 상의 (Top) ---
  {
    id: 1,
    name: "프리미엄 코튼 오버사이즈 화이트 티셔츠",
    price: 48000,
    category: "top",
    imgSrc: "images/modalgrid_1.jpg",
    images: [
      "images/premium-cotton-oversized-white-tshirt.png",
      "images/premium-cotton-oversized-white-tshirt-model.jpg",
    ],
    similarProductIds: [2, 3], // 외부에서 상품 목록을 받아올 수 있게 추가
    reviewProductIds: [3, 4], // 후기컷
    colors: pickColors("white", "black", "beige", "gray"),
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 2,
    name: "베이직 시그니처 화이트 셔츠",
    price: 64000,
    category: "top",
    imgSrc: "images/modalgrid_3.jpg",
    colors: pickColors("white", "black", "blue"),
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    id: 3,
    name: "릴랙스드 핏 니트 풀오버",
    price: 82000,
    category: "top",
    imgSrc: "images/relaxed-fit-knit-pullover.jpg",
    colors: pickColors("beige", "brown", "black"),
    sizes: ["S", "M", "L"],
  },
  {
    id: 4,
    name: "스트라이프 코튼 롱슬리브",
    price: 55000,
    category: "top",
    imgSrc: "images/stripe-cotton-long-sleeve.jpg",
    colors: pickColors("white", "blue", "black"),
    sizes: ["XS", "S", "M", "L", "XL"],
  },

  // --- 아우터 (Outer) ---
  {
    id: 5,
    name: "클래식 울 블렌드 오버사이즈 자켓",
    price: 189000,
    category: "outer",
    imgSrc: "images/modalgrid_2.jpg",
    colors: pickColors("black", "gray", "brown"),
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 6,
    name: "빈티지 워시드 데님 자켓",
    price: 135000,
    category: "outer",
    imgSrc: "images/modalgrid_5.jpg",
    colors: pickColors("blue", "black"),
    sizes: ["S", "M", "L"],
  },
  {
    id: 7,
    name: "미니멀 하프 트렌치 코트",
    price: 210000,
    category: "outer",
    imgSrc: "images/modalgrid_2.jpg",
    isLarge: true,
    colors: pickColors("beige", "black", "brown"),
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 8,
    name: "모던 싱글 체스터필드 코트",
    price: 260000,
    category: "outer",
    imgSrc: "images/modalgrid_5.jpg",
    colors: pickColors("black", "gray", "brown"),
  },

  // --- 바지 (Pants) ---
  {
    id: 9,
    name: "와이드 핏 베이지 슬랙스",
    price: 79000,
    category: "pants",
    imgSrc: "images/modalgrid_4.jpg",
    isLarge: true,
    colors: pickColors("beige", "black", "gray"),
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    id: 10,
    name: "센스 투턱 스트레이트 팬츠",
    price: 68000,
    category: "pants",
    imgSrc: "images/modalgrid_4.jpg",
    colors: pickColors("black", "gray", "brown"),
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 11,
    name: "캐주얼 코튼 데님 팬츠",
    price: 72000,
    category: "pants",
    imgSrc: "images/modalgrid_4.jpg",
    colors: pickColors("blue", "black"),
    sizes: ["XS", "S", "M", "L"],
  },
  {
    id: 12,
    name: "이지 드로우스트링 조거 팬츠",
    price: 59000,
    category: "pants",
    imgSrc: "images/modalgrid_4.jpg",
    colors: pickColors("black", "gray", "beige"),
    sizes: ["S", "M", "L", "XL"],
  },

  // --- 신발 (Shoes) ---
  {
    id: 13,
    name: "미니멀 가죽 레더 스니커즈",
    price: 143000,
    category: "shoes",
    imgSrc: "images/modalgrid_6.jpg",
    colors: pickColors("black", "white", "gray"),
    sizes: ["S", "M", "L"],
  },
  {
    id: 14,
    name: "클래식 스웨이드 로퍼",
    price: 165000,
    category: "shoes",
    imgSrc: "images/modalgrid_6.jpg",
    colors: pickColors("brown", "beige", "black"),
    sizes: ["S", "M", "L"],
  },
  {
    id: 15,
    name: "어반 컴포트 첼시 부츠",
    price: 198000,
    category: "shoes",
    imgSrc: "images/modalgrid_6.jpg",
    colors: pickColors("black", "brown"),
    sizes: ["M", "L", "XL"],
  },
  {
    id: 16,
    name: "데일리 캔버스 슬립온",
    price: 49000,
    category: "shoes",
    imgSrc: "images/modalgrid_6.jpg",
    colors: pickColors("white", "black", "red"),
    sizes: ["S", "M", "L", "XL"],
  },
];
