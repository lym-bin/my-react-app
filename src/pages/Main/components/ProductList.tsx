// src/pages/Main/components/ProductList.tsx
// 홈 화면용 추천 상품 목록
import { Link } from "react-router-dom";

import { PRODUCTS } from "../../../ProductList/ProductsData";

export default function ProductList() {
  const featured = PRODUCTS.slice(0, 6); // 전체 16개 중 앞 6개만 (0번부터 5번 인덱스)

  return (
    <section className="bg-navy-950">
      <div className="mx-auto mb-[50px] max-w-[1200px] px-[16px] py-[40px] sm:py-[40px]">
        <ul className="grid w-full grid-cols-2 gap-x-[16px] gap-y[36px] text-center sm:gap-x-[30px] sm:gap-y[60px] md:grid-cols-3">
          {/* 모바일 2열, 데스크톱(md이상) 3열 - ProductGrid의 grid-cols-3 보다 반응형 분기가 하나 더 있음*/}
          {featured.map((product) => (
            <li key={product.id}>
              <Link
                to={`/products/${product.id}`}
                className="block text-center text-inherit"
              >
                {/* 이미지 영역 */}
                <div className="mb-[20px] aspect-[3/4] w-full overflow-hidden bg-navy-800">
                  {product.imgSrc && ( // 이미지 없으면 아예 안 그림 (ProductCard처럼 기본값 방식이 아니라, 조건부 렌더링 방식)
                    <img
                      src={product.imgSrc}
                      alt={product.name}
                      className="block h-full w-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                    /> // group 없이 그냥 img 자체에 hover: 검 ( 부모가 아니라 이미지 자신이 hover 대상)
                  )}
                </div>

                {/* 텍스트 정보 */}
                <div className="flex flex-col gap-[4px]">
                  <em className="text-[15px] text-[15px] font-medium text-cream">
                    {product.name}
                  </em>{" "}
                  {/* <em>: 원래 "강조"용 시맨틱 태그인데 여기선 이탤릭 스타일 목적으로 씀 */}
                  <strong className="text-[15px] font-bold text-terracotta-400">
                    $ {product.price.toLocaleString()}
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
