// src/pages/ProductList/components/ProductCard.tsx
// props로 받은 값(name, price, imgSrc)등 그대로 화면에 꽂아 넣는 표시용 컴포넌트
// ProductGrid가 이 상품이름, 가격, 몇개, 필터등 하나 뽑아줘하면 출력만 하는 컴포넌트

import { Link } from "react-router-dom";

// 상품 데이터에 이미지가 없거나 isLarge가 설정 안된 경우가 있어서 "?" 참조
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
  href = "/",
  imgSrc = "",
  imgPosition,
  imgFit = "cover",
  name = "제품명 : *****", // 데이터 누락 가드
  price = "$ ***",
}: ProductCardProps) {
  return (
    // isLarge : 크리드 칸 차지
    // group / group-hover : 부모 어디에든 마우스가 올라가면 자식이 반응하는 TailwindCSS 기능
    // loading="lazy" : 브라우저에게 이 이미지가 화면(뷰포트)에 가까워질 때까지 다운로드를 미뤄줘(스크롤 안한 아래쪽 이미지까지 받아오는거 방지)
    // Tailwind 클래스로는 표현 못하는 임의값("top", 20%, 50% 일 때 인라인 style적용)
    <li className={`w-full ${isLarge ? "col-span-2" : ""}`}>
      <Link to={href} className="group block">
        {/* 이미지 영역: overflow-hidden 및 내부 이미지 스타일 보완 */}
        <div className="mb-[20px] aspect-[3/4] w-full overflow-hidden bg-navy-800">
          <img
            src={imgSrc}
            alt={isLarge ? `${name} 큰 제품 이미지` : `${name} 제품 이미지`}
            loading="lazy"
            style={imgPosition ? { objectPosition: imgPosition } : undefined}
            className={`product-photo h-full w-full transition-transform duration-500 ease-in-out group-hover:scale-105 ${
              imgFit === "contain" ? "object-contain" : "object-cover"
            }`}
          />
        </div>

        {/* 상품 정보 영역 */}
        <div className="flex justify-between text-[14px]">
          <strong className="font-medium text-cream">{name}</strong>
          <span className="font-semibold text-terracotta-400">{price}</span>
        </div>
      </Link>
    </li>
  );
}
