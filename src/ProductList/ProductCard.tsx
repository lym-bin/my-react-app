// src/pages/ProductList/components/ProductCard.tsx
interface ProductCardProps {
  isLarge?: boolean;
  href?: string;
  imgSrc?: string;
  imgPosition?: string;
  imgFit?: "cover" | "contain";
  name?: string;
  price?: string;
}

export default function ProductCard({
  isLarge = false,
  href = "#",
  imgSrc = "",
  imgPosition,
  imgFit = "cover",
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
            style={imgPosition ? { objectPosition: imgPosition } : undefined}
            className={`h-full w-full transition-transform duration-500 ease-in-out group-hover:scale-105 ${
              imgFit === "contain" ? "object-contain" : "object-cover"
            }`}
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
