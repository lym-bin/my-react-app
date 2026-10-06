// src/pages/Main/components/ProductList.tsx
// 홈 화면용 추천 상품 목록
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { PRODUCTS } from "../../../ProductList/ProductsData";

gsap.registerPlugin(ScrollTrigger);

export default function ProductList() {
  const featured = PRODUCTS.slice(0, 6); // 전체 16개 중 앞 6개만 (0번부터 5번 인덱스)
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 카드가 하나씩 순서대로(stagger) 떠오르는 효과
      gsap.from(".product-list-card", {
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-navy-950">
      <div className="mx-auto mb-[50px] max-w-[1200px] px-[16px] py-[40px] sm:py-[40px]">
        {/* 섹션 헤드라인 */}
        <div className="mb-[30px] text-center">
          <span className="mb-[8px] block text-[11px] font-light tracking-[0.3em] text-cream/40 uppercase">
            Objet & B Selection
          </span>
          <h2 className="font-serif text-[1.8rem] font-light text-cream sm:text-[2.2rem]">
            New Arrivals
          </h2>
        </div>

        <ul className="grid w-full grid-cols-2 gap-x-[16px] gap-y-[36px] text-center sm:gap-x-[30px] sm:gap-y-[60px] md:grid-cols-3">
          {/* 모바일 2열, 데스크톱(md이상) 3열 - ProductGrid의 grid-cols-3 보다 반응형 분기가 하나 더 있음*/}
          {featured.map((product, index) => (
            <li
              key={product.id}
              // product-list-card 클래스 + stagger: 0.12로 6개 카드가 순서대로 떠오르게 //
              className={`product-list-card ${index === 0 ? "col-span-2" : ""}`}
            >
              <Link
                to={`/products/${product.id}`}
                className="group block text-center text-inherit"
              >
                {/* 이미지 영역 */}
                <div className="relative mb-[20px] aspect-[16/9] w-full overflow-hidden bg-navy-800">
                  {product.imgSrc && ( // 이미지 없으면 아예 안 그림 (ProductCard처럼 기본값 방식이 아니라, 조건부 렌더링 방식)
                    <img
                      src={product.imgSrc}
                      alt={product.name}
                      className="product-photo block h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                    />
                  )}
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="border border-cream/50 bg-navy-950/70 px-[18px] py-[9px] text-[11px] tracking-[0.2em] text-cream uppercase">
                      자세히 보기
                    </span>
                  </div>
                </div>

                {/* 텍스트 정보: 상품명 왼쪽 / 가격 오른쪽 (aviemuah.com 참고, 큰 이미지 비례상 12px로 조정) */}
                <div className="flex items-baseline justify-between gap-[8px] text-left">
                  <em className="text-[12px] font-bold text-cream not-italic">
                    {product.name}
                  </em>
                  <strong className="text-[12px] font-bold text-terracotta-400">
                    {product.price.toLocaleString()}원
                  </strong>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
