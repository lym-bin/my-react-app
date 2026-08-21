import { Link } from "react-router-dom";

// TODO: 이 카테고리(FASHION/TRAVEL/EVERY DAY/MINIATURES)는 아직
// productsData.ts의 category 값(lighting/furniture/living/deco)과 매칭되지 않습니다.
// 실제 연결 전에 둘 중 하나로 카테고리 체계를 통일해주세요.
const categories: { label: string; slug: string }[] = [
  { label: "FASHION", slug: "fashion" },
  { label: "TRAVEL", slug: "travel" },
  { label: "EVERY DAY", slug: "everyday" },
  { label: "MINIATURES", slug: "miniatures" },
];

export default function QuickNav() {
  return (
    <section className="border-t border-b border-navy-700 bg-navy-950">
      <div className="mx-auto max-w-[1200px] px-[16px] py-[16px]">
        <ul className="flex justify-center gap-[40px] text-[0.85rem] italic tracking-[0.05em] text-cream/50">
          {categories.map(({ label, slug }) => (
            <li key={slug}>
              <Link
                to={`/products?category=${slug}`}
                aria-label={`퀵 메뉴 ${label} 카테고리 이동`}
                className="transition-colors hover:text-terracotta-400"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
