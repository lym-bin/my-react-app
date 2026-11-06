// src/ProductDetail/AiRecommendations.tsx
// 상세 페이지 하단 "AI 추천" 섹션: 서버(/api/recommend)에 상품 ID를 보내 추천 3개를 받아 그림
import { PRODUCTS } from "../ProductList/ProductsData";
import type { Recommendation } from "../utils/filterRecommendations";
import { useQuery } from "@tanstack/react-query";

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
    return <p className="text-cream">AI 추천 불러오는 중…</p>;
  }

  // ② 실패했거나, 검증 후 남은 추천이 0개
  if (isError || data.length === 0) {
    return <p className="text-cream">대체 링크 자리</p>;
  }

  // ③ 성공: 추천 id → 실제 상품 객체로 바꾸기
  const items = data
    .map((rec) => ({ rec, product: PRODUCTS.find((p) => p.id === rec.id) }))
    .filter((item) => item.product !== undefined);

  return (
    <ul className="text-cream">
      {items.map(({ rec, product }) => (
        <li key={rec.id}>
          {product!.name} · {rec.reason}
        </li>
      ))}
    </ul>
  );
}
