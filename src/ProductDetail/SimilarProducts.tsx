import { Link } from "react-router-dom";

interface SimilarProductsProps {
  title?: string;
  count?: number;
}

const sampleImages = [
  "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800",
  "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800",
  "https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=800",
  "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800",
];

export default function SimilarProducts({
  title = "비슷한 상품",
  count = 2,
}: SimilarProductsProps) {
  return (
    <section className="mx-auto w-full max-w-[1200px] bg-navy-950 px-[20px] pt-[80px] pb-[40px]">
      <h2 className="mb-[20px] text-center text-[16px] font-semibold text-cream">
        {title}
      </h2>
      <div className="grid grid-cols-2 gap-[20px]">
        {Array.from({ length: count }).map((_, i) => {
          const imgSrc = sampleImages[i % sampleImages.length];
          // 고정된 1번 대신 2번, 3번 상품으로 동적 분기
          const targetId = i + 2;

          return (
            <Link
              to={`/products/${targetId}`}
              key={i}
              className="group block"
              aria-label={`${title} ${i + 1}번 상품 상세 보기`}
            >
              <div className="overflow-hidden bg-navy-800 h-[400px]">
                <img
                  src={imgSrc}
                  alt={`비슷한 상품 ${i + 1}`}
                  className="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                />
              </div>
              <span className="mt-[10px] block text-center text-[14px] font-normal text-cream/70">
                미니멀 오버사이즈 상품 {i + 1}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
