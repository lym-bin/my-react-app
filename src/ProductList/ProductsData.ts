// src/ProductList/productData.ts
// TODO: 실제 상품 데이터 연동 시 API로 고침
// category 값 header.tsx category id값과 동일해야함

export type Category = "outer" | "top" | "pants" | "shoes";

export interface Product {
  id: number;
  name: string;
  price: number;
  category: Category;
  imgSrc: string;
  isLarge?: boolean;
}

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "White T",
    price: 500,
    category: "top",
    imgSrc: "",
  },
  {
    id: 2,
    name: "Jacket",
    price: 800,
    category: "outer",
    imgSrc: "",
  },
  {
    id: 3,
    name: "White Shirt",
    price: 400,
    category: "top",
    imgSrc: "",
  },
  {
    id: 4,
    name: "Featured Denim",
    price: 950,
    category: "pants",
    imgSrc: "",
    isLarge: true,
  },
  {
    id: 5,
    name: "Shoes",
    price: 350,
    category: "shoes",
    imgSrc: "",
  },
  {
    id: 6,
    name: "Slim Slax",
    price: 430,
    category: "pants",
    imgSrc: "",
  },
  {
    id: 7,
    name: "Special Edition",
    price: 1100,
    category: "outer",
    imgSrc: "",
    isLarge: true,
  },
  {
    id: 8,
    name: "Sence pants",
    price: 620,
    category: "pants",
    imgSrc: "",
  },
];
