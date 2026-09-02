// src/pages/ProductList/components/ProductGrid.tsx
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import type { Product } from "./ProductsData";

const PAGE_SIZE = 6;

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [products]);

  if (products.length === 0) {
    return (
      <section className="mx-auto w-full max-w-[1200px] px-[20px] py-[80px] text-center text-[14px] bg-navy-950 text-cream/60">
        조건에 맞는 상품이 없습니다.
      </section>
    );
  }
  const visibleProducts = products.slice(0, visibleCount);
  const hasMore = visibleCount < products.length;

  return (
    <section className="mx-auto w-full max-w-[1200px] bg-navy-950 px-[20px]">
      <ul className="mb-[40px] grid grid-cols-3 gap-[24px]">
        {visibleProducts.map((product) => (
          <ProductCard
            key={product.id}
            isLarge={product.isLarge}
            href={`products/${product.id}`}
            imgSrc={product.imgSrc}
            imgPosition={product.imgPosition}
            imgFit={product.imgFit}
            name={product.name}
            price={`${product.price.toLocaleString()} $`}
          />
        ))}
      </ul>
      {/* 더보기 버튼 영역: 더 보여줄 상품이 남아 있을 때만 노출*/}
      {hasMore && (
        <div className="mt-[48px] mb-[40px] flex justify-center">
          <button
            type="button"
            onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
            className="cursor-pointer border border-terracotta-500 bg-transparent px-[40px] py-[12px] text-[14px] font-medium transition-colors text-terracotta-500 hover:bg-terracotta-500 hover:text-navy-950"
          >
            더보기
          </button>
        </div>
      )}
    </section>
  );
}
