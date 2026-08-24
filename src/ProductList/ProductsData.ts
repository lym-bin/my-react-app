// src/ProductList/productData.ts
// TODO: 실제 상품 데이터 연동 시 API로 고침
// category 값 header.tsx category id값과 동일해야함

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
  {
    id: 1,
    name: "White T",
    price: 500,
    category: "top",
    imgSrc: "images/modalgrid_1.jpg",
  },
  {
    id: 2,
    name: "Jacket",
    price: 800,
    category: "outer",
    imgSrc: "images/modalgrid_2.jpg",
  },
  {
    id: 3,
    name: "White Shirt",
    price: 400,
    category: "top",
    imgSrc: "images/modalgrid_3.jpg",
  },
  {
    id: 4,
    name: "beige slax",
    price: 950,
    category: "pants",
    imgSrc: "images/modalgrid_4.jpg",
    isLarge: true,
  },
  {
    id: 5,
    name: "denim jacket",
    price: 350,
    category: "outer",
    imgSrc: "images/modalgrid_5.jpg",
  },
  {
    id: 6,
    name: "shoes",
    price: 430,
    category: "shoes",
    imgSrc: "images/modalgrid_6.jpg",
  },
  {
    id: 7,
    name: "Special Edition",
    price: 1100,
    category: "outer",
    imgSrc: "images/modalgrid_5.jpg",
    isLarge: true,
  },
  {
    id: 8,
    name: "Sence pants",
    price: 620,
    category: "pants",
    imgSrc: "images/pashion_3.jpg",
  },
];
