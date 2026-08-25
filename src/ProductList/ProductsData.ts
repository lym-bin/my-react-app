// src/ProductList/ProductsData.ts
import type { CategoryId } from "./Categories";

export interface Product {
  id: number;
  name: string;
  price: number;
  category: CategoryId;
  imgSrc: string;
  isLarge?: boolean;
}

export const PRODUCTS: Product[] = [
  // --- 상의 (Top) ---
  {
    id: 1,
    name: "프리미엄 코튼 오버사이즈 화이트 티셔츠",
    price: 48000,
    category: "top",
    imgSrc: "images/modalgrid_1.jpg",
  },
  {
    id: 2,
    name: "베이직 시그니처 화이트 셔츠",
    price: 64000,
    category: "top",
    imgSrc: "images/modalgrid_3.jpg",
  },
  {
    id: 3,
    name: "릴랙스드 핏 니트 풀오버",
    price: 82000,
    category: "top",
    imgSrc: "images/pashion_3.jpg",
  },
  {
    id: 4,
    name: "스트라이프 코튼 롱슬리브",
    price: 55000,
    category: "top",
    imgSrc: "images/modalgrid_1.jpg",
  },

  // --- 아우터 (Outer) ---
  {
    id: 5,
    name: "클래식 울 블렌드 오버사이즈 자켓",
    price: 189000,
    category: "outer",
    imgSrc: "images/modalgrid_2.jpg",
  },
  {
    id: 6,
    name: "빈티지 워시드 데님 자켓",
    price: 135000,
    category: "outer",
    imgSrc: "images/modalgrid_5.jpg",
  },
  {
    id: 7,
    name: "미니멀 하프 트렌치 코트",
    price: 210000,
    category: "outer",
    imgSrc: "images/modalgrid_2.jpg",
    isLarge: true,
  },
  {
    id: 8,
    name: "모던 싱글 체스터필드 코트",
    price: 260000,
    category: "outer",
    imgSrc: "images/modalgrid_5.jpg",
  },

  // --- 바지 (Pants) ---
  {
    id: 9,
    name: "와이드 핏 베이지 슬랙스",
    price: 79000,
    category: "pants",
    imgSrc: "images/modalgrid_4.jpg",
    isLarge: true,
  },
  {
    id: 10,
    name: "센스 투턱 스트레이트 팬츠",
    price: 68000,
    category: "pants",
    imgSrc: "images/modalgrid_4.jpg",
  },
  {
    id: 11,
    name: "캐주얼 코튼 데님 팬츠",
    price: 72000,
    category: "pants",
    imgSrc: "images/modalgrid_4.jpg",
  },
  {
    id: 12,
    name: "이지 드로우스트링 조거 팬츠",
    price: 59000,
    category: "pants",
    imgSrc: "images/modalgrid_4.jpg",
  },

  // --- 신발 (Shoes) ---
  {
    id: 13,
    name: "미니멀 가죽 레더 스니커즈",
    price: 143000,
    category: "shoes",
    imgSrc: "images/modalgrid_6.jpg",
  },
  {
    id: 14,
    name: "클래식 스웨이드 로퍼",
    price: 165000,
    category: "shoes",
    imgSrc: "images/modalgrid_6.jpg",
  },
  {
    id: 15,
    name: "어반 컴포트 첼시 부츠",
    price: 198000,
    category: "shoes",
    imgSrc: "images/modalgrid_6.jpg",
  },
  {
    id: 16,
    name: "데일리 캔버스 슬립온",
    price: 49000,
    category: "shoes",
    imgSrc: "images/modalgrid_6.jpg",
  },
];
