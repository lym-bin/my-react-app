// src/ProductDetail/AiRecommendations.tsx
// 상세 페이지 하단 "AI 추천" 섹션: 서버(/api/recommend)에 상품 ID를 보내 추천 3개를 받아 그림
import { Link } from "react-router-dom";
import { PRODUCTS } from "../ProductList/ProductsData";
import type { Recommendation } from "../utils/filterRecommendations";
import { useQuery } from "@tanstack/react-query";
import { CATEGORIES } from "../ProductList/Categories";

interface AiRecommendationsProps {
  productId: number;
}
async function fetchRecommendations(
  productId: number,
): Promise<Recommendation[]> {
  const res = await fetch("/api/recommend", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId }),
  });

  // fetch는 400·429·502가 와도 실패로 치지 않음 → 직접 throw해야 React Query가 에러로 앎
  if (!res.ok) {
    throw new Error(`AI 추천 요청 실패: ${res.status}`);
  }

  const data = (await res.json()) as { recommendations: Recommendation[] };
  return data.recommendations;
}

export default function AiRecommendations({
  productId,
}: AiRecommendationsProps) {
  const { data, isPending, isError } = useQuery({
    queryKey: ["recommend", productId],
    queryFn: () => fetchRecommendations(productId),
    retry: false, // 기본값 3번 재시도 → 429에 재시도하면 한도만 깎임 → 끄기
    staleTime: Infinity, // 기본값 0 = 받자마자 "오래됨" → 탭 돌아오면 다시 호출 → 영원히 신선하게
    gcTime: Infinity, // 기본값 5분 = 화면에서 사라지고 5분 뒤 캐시 삭제 → 탭이 열린 동안 계속 기억
  });

  // ① 로딩 중
  if (isPending) {
    return (
      <section className="mx-auto w-full max-w-content bg-navy-950 px-[20px] pt-[80px] pb-[40px]">
        <h2 className="mb-[20px] text-center text-16 font-semibold text-cream">
          <span className="text-terracotta-400">✦ AI</span> 이 상품과 어울리는
        </h2>
        <p className="sr-only">AI 추천을 불러오는 중입니다.</p>
        <ul
          className="grid grid-cols-3 gap-[12px] md:gap-[20px]"
          aria-busy="true"
        >
          {[0, 1, 2].map((i) => (
            <li key={i}>
              <div className="aspect-[3/4] animate-pulse bg-navy-800" />
              <div className="mx-auto mt-[10px] h-[13px] w-3/4 animate-pulse bg-navy-800" />
              <div className="mx-auto mt-[4px] h-[13px] w-1/2 animate-pulse bg-navy-800" />
            </li>
          ))}
        </ul>
      </section>
    );
  }

  // ② 실패했거나, 검증 후 남은 추천이 0개
  if (isError || data.length === 0) {
    // 지금 상품의 카테고리를 빼고, 나머지 카테고리 목록으로 가는 링크
    const currentCategory = PRODUCTS.find((p) => p.id === productId)?.category;
    const others = CATEGORIES.filter((c) => c.id !== currentCategory);

    return (
      <section className="mx-auto w-full max-w-content bg-navy-950 px-[20px] pt-[80px] pb-[40px] text-center">
        <p className="mb-[12px] text-13 text-cream/70">
          이 상품과 함께 입을 아이템을 둘러보세요
        </p>
        <ul className="flex flex-wrap justify-center gap-[16px]">
          {others.map((c) => (
            <li key={c.id}>
              <Link
                to={`/products?category=${c.id}`}
                className="text-13 text-cream underline-offset-4 hover:underline"
              >
                {c.label} 둘러보기 →
              </Link>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  // ③ 성공: 추천 id → 실제 상품 객체로 바꾸기
  const items = data
    .map((rec) => ({ rec, product: PRODUCTS.find((p) => p.id === rec.id) }))
    .filter((item) => item.product !== undefined);

  return (
    <section className="mx-auto w-full max-w-content bg-navy-950 px-[20px] pt-[80px] pb-[40px]">
      <h2 className="mb-[20px] text-center text-16 font-semibold text-cream">
        <span className="text-terracotta-400">✦ AI</span> 이 상품과 어울리는
      </h2>
      <ul className="grid grid-cols-3 gap-[12px] md:gap-[20px]">
        {items.map(({ rec, product }) => (
          <li key={rec.id}>
            <Link
              to={`/products/${rec.id}`}
              className="group block"
              aria-label={`${product!.name} 상세 보기`}
            >
              <div className="aspect-[3/4] overflow-hidden bg-navy-800">
                <img
                  src={`/${product!.imgSrc}`}
                  alt={product!.name}
                  loading="lazy"
                  className="product-photo h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                />
              </div>
              <span className="mt-[10px] block text-center text-13 text-cream/70">
                {product!.name}
              </span>
              <p className="mt-[4px] line-clamp-1 text-center text-13 text-terracotta-400">
                {rec.reason}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
