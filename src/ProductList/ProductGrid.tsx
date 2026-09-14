// src/pages/ProductList/components/ProductGrid.tsx
// 받은 상품 목록중, 몇 개까지 보여줄지(페이지 네이션)을 관리하는 컴포넌트
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import type { Product } from "./ProductsData";

const PAGE_SIZE = 6; // 한 번에 보여주는/더 불러오는 개수

// 이 컴포넌트가 부모(ProductListPage)로부터 받는 props의 모양
// 부모가 넘긴 props 객체에서 products만 꺼내고 객체 모양은 인터페이스로정의(구조분해)
// js로치면 매개변수로 products라는 필드명을 넣고 인자값을 받는다
interface ProductGridProps {
  products: Product[]; // 필터링+정렬 끝난 상품 배열
}

// { products } = props 객체에서 products만 꺼내 쓰는 "구조 분해"
// : ProductGridProps = 그 props의 타입
export default function ProductGrid({ products }: ProductGridProps) {
  // 지금 화면에 몇 개 보여주고 있는지 (처음엔 6개)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // products가 바뀌면(= 필터/정렬/검색어 바뀌어 목록이 새로 옴)
  // 안 하면: 30개 보던 중에 카테고리 바꿧는데 여전히 30개 보이려고 함
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [products]); // products가 바뀔 때만 실행

  // 조기 반환(early return): 상품이 없으면 빈 상태만 UI만 그리고 함수 끝
  // 아래 코드는 실행 안 됨
  if (products.length === 0) {
    return (
      <section className="mx-auto w-full max-w-[1200px] px-[20px] py-[80px] text-center text-[14px] bg-navy-950 text-cream/60">
        조건에 맞는 상품이 없습니다.
      </section>
    );
  }
  const visibleProducts = products.slice(0, visibleCount); // 앞에서 부터 visibleCount개만 잘라냄
  const hasMore = visibleCount < products.length; // 아직 안 보여진게 있는지 boolean확인

  return (
    <section className="mx-auto w-full max-w-[1200px] bg-navy-950 px-[20px]">
      <ul className="mb-[40px] grid grid-cols-3 gap-[24px]">
        {/* 보여줄 상품을들 map으로 돌면서 카드 생성*/}
        {visibleProducts.map((product) => (
          <ProductCard
            key={product.id} // 리스트 구분용 고유 값
            isLarge={product.isLarge} // 2칸 차지 여부(없으면 undefined -> 정상)
            href={`products/${product.id}`} // 상세페이지 링크 (백틱 템플릿 리터럴)
            imgSrc={product.imgSrc}
            imgPosition={product.imgPosition}
            imgFit={product.imgFit}
            name={product.name}
            price={`${product.price.toLocaleString()} $`} // 숫자 천단위 콤마: 48000 -> "48,000"
          />
        ))}
      </ul>
      {/* 더보기 버튼 영역: 더 보여줄 상품이 남아 있을 때만 노출*/}
      {hasMore && (
        <div className="mt-[48px] mb-[40px] flex justify-center">
          <button
            type="button"
            // 함수형 업데이트: setVisibleCount((v) => v + PAGE_SIZE)
            // v = "현재 최신 visibleCount", 여기에 6을 더함
            // 왜(v) => 를 쓰냐: 이전 값을 기준으로 계산할 때 안전
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
