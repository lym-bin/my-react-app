// src/pages/ProductList/components/ProductCard.tsx
interface ProductCardProps {
  isLarge?: boolean;
  href?: string;
  imgSrc?: string;
  name?: string;
  price?: string;
}

export default function ProductCard({
  isLarge = false,
  href = "#",
  imgSrc = "",
  name = "제품명 : *****",
  price = "$ ***",
}: ProductCardProps) {
  return (
    <li className={`w-full ${isLarge ? "col-span-2" : ""}`}>
      <a href={href} className="group block">
        {/* 이미지 영역: overflow-hidden 및 내부 이미지 스타일 보완 */}
        <div className="mb-[20px] aspect-[3/4] w-full overflow-hidden bg-navy-800">
          <img
            src={imgSrc}
            alt={isLarge ? `${name} 큰 제품 이미지` : `${name} 제품 이미지`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
          />
        </div>

        {/* 상품 정보 영역 */}
        <div className="flex justify-between text-[14px]">
          <strong className="font-medium text-cream">{name}</strong>
          <span className="font-semibold text-terracotta-400">{price}</span>
        </div>
      </a>
    </li>
  );
}
