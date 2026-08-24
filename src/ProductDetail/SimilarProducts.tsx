import { Link } from "react-router-dom";

// src/pages/ProductDetail/components/SimilarProducts.tsx
interface SimilarProductsProps {
  title: string;
  count?: number;
}

export default function SimilarProducts({
  title,
  count = 2,
}: SimilarProductsProps) {
  return (
    <section className="mx-auto w-full max-w-[1200px] bg-navy-950 px-[20px] pt-[80px] pb-[40px]">
      <h2 className="mb-[20px] text-center text-[16px] font-semibold text-cream">
        {title}
      </h2>
      <div className="grid grid-cols-2 gap-[20px]">
        {Array.from({ length: count }).map((_, i) => (
          <Link
            to="/products/"
            key={i}
            className="group block"
            aria-label={`${title} ${i + 1}번 상품 상세 보기`}
          >
            {/* 이미지 영역: overflow-hidden 및 transition 추가 */}
            <div className="overflow-hidden bg-navy-800">
              <img
                src=""
                alt="상품 그리드 이미지"
                className="h-[400px] w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
              />
            </div>
            <span className="mt-[10px] block text-center text-[14px] font-normal text-cream/70">
              비슷한 상품 이름
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
