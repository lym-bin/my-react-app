// src/ProductDetail/ProductDetailPage.tsx
// URL에서 상품 하나를 찾아와서 색상/사이즈를 고르고 장바구니에 담는 페이지
import { useEffect, useState, type FormEvent } from "react";
// useParams는 항상 문자열로 옴 -> Number(id)
import { useParams } from "react-router-dom"; // URL 경로의 동적 부분(:id 같은)을 읽는 쪽
import useDisclosure from "../hooks/useDisclosure";
import SizeGuideSidebar from "./SizeGuideSidebar";
import CartSidebar from "./CartSidebar";
import SimilarProducts from "./SimilarProducts";
import { useCart } from "../context/CartContext";
// 상품 데이터는 ProductList 페이지와 동일한 소스를 공유.
import { PRODUCTS } from "../ProductList/ProductsData";
import { COLOR_OPTIONS, SIZE_OPTIONS } from "../ProductList/OptionsData";
import { addRecentlyViewed } from "../ProductList/recentlyViewed";
export default function ProductDetailPage() {
  // 라우터가 "/products/:id" 경로로 매칭시켜준 id를 꺼냄. 예: /products/3 -> id = "3" (항상 문자열!)
  const { id } = useParams();

  const cart = useDisclosure(); // 장바구니 사이드바 열고 닫기
  const sizeGuide = useDisclosure(); // 사이즈가이드 사이드바 열고 닫기(완전히 별개 인스턴스)
  const { addItem } = useCart(); // CartContext에서 "장바구니에 담기" 함수만 꺼냄

  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  // useParams의 id는 문자열이라서 Number()로 변환 후 비교 (product.id는 number)
  const product = PRODUCTS.find((p) => p.id === Number(id));
  useEffect(() => {
    if (product) addRecentlyViewed(product.id);
  }, [product]);

  // 이 상품에 지정된 색상/사이즈가 있으면 그걸, 없으면 전체 옵션을 보여줌
  const colors = product?.colors ?? COLOR_OPTIONS;
  const sizes = product?.sizes ?? SIZE_OPTIONS;

  // 장바구니 열 때 사이즈 가이드는 닫음 (두 사이드바가 동시에 안 열리게)
  const openCart = () => {
    sizeGuide.close();
    cart.open();
  };
  const openSizeGuide = () => {
    cart.close();
    sizeGuide.open();
  };

  // 폼 제출 이벤트의 타입(TS가 e안에 뭐가 들었는지 알도록)
  const handleAddToCart = (e: FormEvent) => {
    e.preventDefault();
    if (!product) return; // 조기 종료: 상품 없으면
    if (!selectedColor || !selectedSize) {
      alert("색상과 사이즈를 선택해주세요.");
      return; // 종료: 선택 안 했으면 여기서 끝
    }
    // 선택한 색상의 "value"(예: "white")로 lable(예: "화이트")를 찾음
    // find로 못 찾으면 (이론상 없음) selectedColor 그대로 씀(안전 장치)
    const colorLabel =
      colors.find((c) => c.value === selectedColor)?.label ?? selectedColor;
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      color: colorLabel,
      size: selectedSize,
      qty: 1,
      imgSrc: product.imgSrc,
    });
    openCart(); // 담고 나서 장바구니 사이드바 자동으로 열기
  };

  // 둘 중 하나라도 열려있으면 배경 dimmed 처리
  const isDimmedOpen = cart.isOpen || sizeGuide.isOpen;

  // 상품 못 찾았으면(잘못된 id 등) 안내 문구만 보여주고 끝
  if (!product) {
    return (
      <main className="mx-auto w-full max-w-[1200px] bg-navy-950 px-[40px] py-[80px] text-center text-cream/60">
        상품을 찾을 수 없습니다.
      </main>
    );
  }

  return (
    <div className="bg-navy-950">
      {/* 백드롭 Dimmed 레이어 (사이드바 오픈 시 배경 어둡게 처리) */}
      {isDimmedOpen && (
        <div
          className="fixed inset-0 z-[9998] bg-navy-950/70 transition-opacity"
          onClick={() => {
            cart.close();
            sizeGuide.close(); // 배경 클릭하면 둘 다 닫음 (어느 쪽이 열려있든 상관없이)
          }}
        />
      )}

      <main className="mx-auto flex w-full max-w-[1200px] flex-col justify-between gap-[30px] px-[20px] py-[30px] md:flex-row md:gap-[40px] md:px-[40px] md:py-[40px]">
        <section className="w-full md:w-[400px]">
          {/* 첫 번째 이미지 (상품 대표 이미지) images[0]이 있으면 그거, 없으면 imgSrc, 그것도 없으면 빈 박스 */}
          <div>
            {product.images?.[0] || product.imgSrc ? (
              <img
                src={`/${product.images?.[0] || product.imgSrc}`}
                alt={`${product.name} 상품 대표 이미지`}
                className="mt-[20px] h-[280px] w-full bg-navy-800 object-cover sm:h-[400px]"
              />
            ) : (
              // 이미지가 아에 없으면 빈 색상 박스만 (레이아웃 안 무너지게)
              <div className="mt-[20px] h-[280px] w-full bg-navy-800 sm:h-[400px]" />
            )}
          </div>

          {/* 두 번째 이미지 images[1]이 있을 때만 통째로 렌더링 (조건부 렌더링) */}
          {product.images?.[1] && (
            <div>
              <img
                src={`/${product.images[1]}`}
                alt={`${product.name}모델 이미지`}
                className="mt-[20px] h-[280px] w-full bg-navy-800 object-cover object-top sm:h-[400px]"
              />
            </div>
          )}
        </section>

        <section className="mt-[20px] flex-1">
          {/* 제출(submit) 시 handleAddtoCart 실행*/}
          <form onSubmit={handleAddToCart}>
            <div>
              <h1 className="mb-[20px] text-[24px] font-normal text-cream">
                {product.name}
              </h1>
              <div className="mb-[20px] border-b border-navy-700 pb-[20px] text-[18px] font-semibold text-cream">
                $ {product.price.toLocaleString()}
              </div>
            </div>

            <div className="mb-[20px]">
              <strong className="mb-[10px] block text-[18px] text-cream">
                색상 :{" "}
              </strong>
              <div className="flex flex-wrap gap-[20px]">
                {colors.map((c) => (
                  // label 안에 input(진짜 라디오, 숨김)과 span(눈에 보이는 버튼)을 같이 둠
                  // -> span 클릭해도 브라우저가 알아서 안의 input을 클릭 한걸로 처리 (label의 기본 동작)
                  <label key={c.value}>
                    <input
                      type="radio"
                      name="color" // 같은 name끼리 "하나만 선택 가능" 그룹이 됨
                      value={c.value}
                      className="hidden" // 네이티브 라디오 모양 숨김 (span으로 대신 꾸밈)
                      checked={selectedColor === c.value} // 이 옵션이 선택된 값과 같으면 체크됨
                      onChange={() => setSelectedColor(c.value)} // 선택 바뀌면 state 갱신
                    />
                    <span
                      className={`inline-block cursor-pointer border px-[16px] py-[8px] text-[14px] transition-all duration-200 ease-in-out ${
                        selectedColor === c.value
                          ? "border-terracotta-500 bg-terracotta-500 text-navy-950"
                          : "border-navy-600 text-cream/80"
                      }`}
                    >
                      {c.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* 사이즈도 색상이랑 완전히 똑같은 구조 (input hidden + span 스타일*/}
            <div className="mb-[20px]">
              <strong className="mb-[10px] block text-[18px] text-cream">
                사이즈 :{" "}
              </strong>
              <div className="flex flex-wrap gap-[20px]">
                {sizes.map((size) => (
                  <label key={size}>
                    <input
                      type="radio"
                      name="size"
                      value={size}
                      className="hidden"
                      checked={selectedSize === size}
                      onChange={() => setSelectedSize(size)}
                    />
                    <span
                      className={`inline-block cursor-pointer border px-[16px] py-[8px] text-[14px] transition-all duration-200 ease-in-out ${
                        selectedSize === size
                          ? "border-terracotta-500 bg-terracotta-500 text-navy-950"
                          : "border-navy-600 text-cream/80"
                      }`}
                    >
                      {size}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="my-[15px] mb-[25px]">
              <button
                type="button"
                className="cursor-pointer border-none bg-transparent p-0 text-[13px] text-cream/60 underline hover:text-terracotta-400"
                aria-expanded={sizeGuide.isOpen}
                onClick={openSizeGuide}
              >
                사이즈 가이드
              </button>
            </div>

            <div className="mb-[30px]">
              {/* type="submit" -> 이 버튼 누르면 <form>의 onSubmit(handleAddToCart) 실행*/}
              <button
                type="submit"
                className="w-full cursor-pointer border border-terracotta-500 bg-terracotta-500 py-[15px] text-[16px] font-medium text-navy-950 transition-colors duration-200 hover:bg-terracotta-600"
                aria-expanded={cart.isOpen}
              >
                장바구니 담기
              </button>
            </div>

            <div>
              <p className="mt-[20px] text-left text-[14px] font-light leading-[1.6] text-cream/60">
                {product.description ??
                  "풍부한 질감이 느껴지는 소재로 완성한 미니멀 실루엣. 톤온톤 디테일과 정교한 마감으로 시간이 지날수록 깊은 매력을 더합니다."}
              </p>
            </div>
          </form>

          {/* 사이드바들은 <form> 밖에! CartSidebar 안에도 <form>이 있어서, form 안에 넣으면 
            HTML에서 form이 중첩되는(위법) 구조가 됨
          */}
          <SizeGuideSidebar
            isOpen={sizeGuide.isOpen}
            onClose={sizeGuide.close}
          />
          <CartSidebar
            isOpen={cart.isOpen}
            onClose={cart.close}
          />
        </section>
      </main>

      {/* 비슷한 제품 / 후기 컷 : ID 배열 -> 실제 상품 객체 배열로 변환*/}
      <SimilarProducts
        title="비슷한 제품"
        products={product.similarProductIds
          ?.map((id) => PRODUCTS.find((p) => p.id === id)) // ID -> 찾은 상품 (없으면 undefined)
          .filter((p): p is NonNullable<typeof p> => p !== undefined)}
      />
      <SimilarProducts
        title="후기 컷"
        products={product.reviewProductIds
          ?.map((id) => PRODUCTS.find((p) => p.id === id))
          .filter((p): p is NonNullable<typeof p> => p !== undefined)}
      />
    </div>
  );
}
