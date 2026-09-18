// src/ProductDetail/SlmilarProducts.tsx
// 상품 카드 그리드를 재 사용하는 컴포넌트 ("비슷한 제품" / "후기 컷" 둘 다 이걸 씀)
// title/products를 props로 받는 재사용 컴포넌트 -> 이미지 경로 가드 -> 2열 그리드 Link로 상세 페이지 연결
import { Link } from "react-router-dom"; // SPA 전용 링크 컴포넌트
import { PRODUCTS, type Product } from "../ProductList/ProductsData";

// 유사한 제품 props
// products만 갈아끼우면 완전히 다른 섹션(유사한 제품, 후기컷)으로 재사용할 수 있게 설계
interface SimilarProductsProps {
  title?: string;
  products?: Product[];
}

// export로 SimilarProducts 외부 활용
export default function SimilarProducts({
  title = "비슷한 상품",
  products = PRODUCTS.slice(1, 3), // props 안 넘어오면 기본으로 2~3번 상품 보여줌
}: SimilarProductsProps) {
  return (
    <section className="mx-auto w-full max-w-[1200px] bg-navy-950 px-[20px] pt-[80px] pb-[40px]">
      <h2 className="mb-[20px] text-center text-[16px] font-semibold text-cream">
        {title}
      </h2>
      <div className="grid grid-cols-2 gap-[20px]">
        {products.map((product) => (
          // <a href> 대신 <Link to> : 클릭해도 브라우저가 페이지 전체를 다시 안 불러옴
          // (SPA 방식 - 리액트 라우터가 화면만 바꿔치기, <a>는 서버에 새로 요청함)
          <Link
            to={`/products/${product.id}`}
            key={product.id}
            className="group block"
            aria-label={`${product.name}상세 보기`}
          >
            <div className="overflow-hidden bg-navy-800 h-[400px]">
              <img
                // imgSrc가 이미 "/" 로 시작하면 그대로, 아니면 앞에 "/" 붙혀서 절대 경로 통일
                // startWith("/"): 문자열이 "/"로 시작하는지 확인하는 boolean 메서드
                src={
                  product.imgSrc.startsWith("/")
                    ? product.imgSrc
                    : `/${product.imgSrc}`
                }
                alt={product.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
              />
            </div>
            <span className="mt-[10px] block text-center text-[14px] font-normal text-cream/70">
              {product.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
