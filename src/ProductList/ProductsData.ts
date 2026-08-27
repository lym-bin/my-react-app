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
  description?: string; // 상품 상세 설명 (없으면 기본 문구 노출)
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
    description:
      "고밀도 코튼 100%로 짜 늘어짐 없이 오래 입을 수 있는 오버사이즈 티셔츠. 어깨선을 살짝 내려 편안한 실루엣을 완성했습니다",
  },
  {
    id: 2,
    name: "베이직 시그니처 화이트 셔츠",
    price: 64000,
    category: "top",
    imgSrc: "images/modalgrid_3.jpg",
    colors: pickColors("white", "black", "blue"),
    sizes: ["XS", "S", "M", "L", "XL"],
    description:
      "어디에나 매치하기 좋은 클래식한 핏의 셔츠입니다. 단독으로 입거나 레이어드용으로 활용도가 높습니다.",
  },
  {
    id: 3,
    name: "릴랙스드 핏 니트 풀오버",
    price: 82000,
    category: "top",
    imgSrc: "images/relaxed-fit-knit-pullover.jpg",
    colors: pickColors("beige", "brown", "black"),
    sizes: ["S", "M", "L"],
    description:
      "부드러운 터치감과 여유로운 핏으로 포근하고 아늑한 착용감을 선사하는 니트입니다.",
  },
  {
    id: 4,
    name: "스트라이프 코튼 롱슬리브",
    price: 55000,
    category: "top",
    imgSrc: "images/stripe-cotton-long-sleeve.jpg",
    colors: pickColors("white", "blue", "black"),
    sizes: ["XS", "S", "M", "L", "XL"],
    description:
      "캐주얼한 무드의 스트라이프 패턴이 돋보이며, 간절기 단독 착용이나 레이어드에 제격인 롱슬리브입니다.",
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
    description:
      "고급스러운 울 블렌드 소재와 트렌디한 오버사이즈 핏이 어우러져 세련된 아우터 룩을 완성해 줍니다.",
  },
  {
    id: 6,
    name: "빈티지 워시드 데님 자켓",
    price: 135000,
    category: "outer",
    imgSrc: "images/modalgrid_5.jpg",
    colors: pickColors("blue", "black"),
    sizes: ["S", "M", "L"],
    description:
      "자연스러운 워싱 디테일이 매력적이며, 다양한 이너와 캐주얼하게 매치하기 좋은 데님 자켓입니다.",
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
    description:
      "간절기 시즌에 가볍게 걸치기 좋은 미니멀한 기장감과 트렌디한 실루엣의 하프 트렌치 코트입니다.",
  },
  {
    id: 8,
    name: "모던 싱글 체스터필드 코트",
    price: 260000,
    category: "outer",
    imgSrc: "images/modalgrid_5.jpg",
    colors: pickColors("black", "gray", "brown"),
    description:
      "깔끔하게 떨어지는 싱글 브레스트 라인으로 클래식하면서도 모던한 분위기를 연출하는 코트입니다.",
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
    description:
      "다리가 길어 보이는 여유로운 와이드 핏과 차분한 컬러감으로 포멀과 캐주얼을 모두 소화하는 슬랙스입니다.",
  },
  {
    id: 10,
    name: "센스 투턱 스트레이트 팬츠",
    price: 68000,
    category: "pants",
    imgSrc: "images/modalgrid_4.jpg",
    colors: pickColors("black", "gray", "brown"),
    sizes: ["S", "M", "L", "XL"],
    description:
      "프론트 투턱 디테일로 멋스러운 입체감을 살린 트렌디한 스트레이트 팬츠입니다.",
  },
  {
    id: 11,
    name: "캐주얼 코튼 데님 팬츠",
    price: 72000,
    category: "pants",
    imgSrc: "images/modalgrid_4.jpg",
    colors: pickColors("blue", "black"),
    sizes: ["XS", "S", "M", "L"],
    description:
      "탄탄한 코튼 데님 소재를 사용하여 데일리로 편안하게 입기 좋은 베이직 데님 팬츠입니다.",
  },
  {
    id: 12,
    name: "이지 드로우스트링 조거 팬츠",
    price: 59000,
    category: "pants",
    imgSrc: "images/modalgrid_4.jpg",
    colors: pickColors("black", "gray", "beige"),
    sizes: ["S", "M", "L", "XL"],
    description:
      "허리 밴딩과 드로우스트링으로 편안한 착용감을 극대화한 캐주얼 조거 팬츠입니다.",
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
    description:
      "군더더기 없는 미니멀한 디자인으로 어떤 착장에나 자연스럽게 스며드는 레더 스니커즈입니다.",
  },
  {
    id: 14,
    name: "클래식 스웨이드 로퍼",
    price: 165000,
    category: "shoes",
    imgSrc: "images/modalgrid_6.jpg",
    colors: pickColors("brown", "beige", "black"),
    sizes: ["S", "M", "L"],
    description:
      "고급스러운 스웨이드 텍스처가 돋보이며, 단정한 스타일링에 품격을 더해주는 클래식 로퍼입니다.",
  },
  {
    id: 15,
    name: "어반 컴포트 첼시 부츠",
    price: 198000,
    category: "shoes",
    imgSrc: "images/modalgrid_6.jpg",
    colors: pickColors("black", "brown"),
    sizes: ["M", "L", "XL"],
    description:
      "신축성 있는 밴딩 디테일로 신고 벗기 편하며, 시크한 무드를 연출해 주는 첼시 부츠입니다.",
  },
  {
    id: 16,
    name: "데일리 캔버스 슬립온",
    price: 49000,
    category: "shoes",
    imgSrc: "images/modalgrid_6.jpg",
    colors: pickColors("white", "black", "red"),
    sizes: ["S", "M", "L", "XL"],
    description:
      "가벼운 캔버스 소재를 적용해 언제 어디서나 편안하게 신기 좋은 데일리 슬립온입니다.",
  },
];
