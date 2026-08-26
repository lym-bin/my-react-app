// src/ProductDetail/ProductDetailPage.tsx
import { useState } from "react";
import { useParams } from "react-router-dom";
import useDisclosure from "../hooks/useDisclosure";
import SizeGuideSidebar from "./SizeGuideSidebar";
import CartSidebar from "./CartSidebar";
import SimilarProducts from "./SimilarProducts";
import { useCart } from "../context/CartContext";
// 상품 데이터는 ProductList 페이지와 동일한 소스를 공유합니다.
// (실제 경로가 다르면 프로젝트 구조에 맞게 이 경로만 조정하세요)
import { PRODUCTS } from "../ProductList/ProductsData";

const colors = [
  { value: "red", label: "레드" },
  { value: "black", label: "블랙" },
  { value: "white", label: "화이트" },
  { value: "gray", label: "그레이" },
];

const sizes = ["XXXS", "XXS", "XS", "S", "M", "L", "XL", "XXL"];

export default function ProductDetailPage() {
  const { id } = useParams();
  const cart = useDisclosure();
  const sizeGuide = useDisclosure();
  const { addItem } = useCart();

  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  const product = PRODUCTS.find((p) => p.id === Number(id));

  // 사이드바는 한 번에 하나만 열리도록 서로 닫아줍니다.
  const openCart = () => {
    sizeGuide.close();
    cart.open();
  };
  const openSizeGuide = () => {
    cart.close();
    sizeGuide.open();
  };

  const handleAddToCart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    if (!selectedColor || !selectedSize) {
      alert("색상과 사이즈를 선택해주세요.");
      return;
    }
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      color: selectedColor,
      size: selectedSize,
      qty: 1,
      imgSrc: product.imgSrc,
    });
    openCart();
  };

  const handleCheckout = () => {
    cart.close();
  };

  const isDimmedOpen = cart.isOpen || sizeGuide.isOpen;

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
            sizeGuide.close();
          }}
        />
      )}

      <main className="mx-auto flex w-full max-w-[1200px] flex-col justify-between gap-[30px] px-[20px] py-[30px] md:flex-row md:gap-[40px] md:px-[40px] md:py-[40px]">
        <section className="w-full md:w-[400px]">
          {/* 첫 번째 이미지 (상품 대표 이미지) */}
          <div>
            {product.images?.[0] || product.imgSrc ? (
              <img
                src={`/${product.images?.[0] || product.imgSrc}`}
                alt={`${product.name} 상품 대표 이미지`}
                className="mt-[20px] h-[280px] w-full bg-navy-800 object-cover sm:h-[400px]"
              />
            ) : (
              <div className="mt-[20px] h-[280px] w-full bg-navy-800 sm:h-[400px]" />
            )}
          </div>

          {/* 두 번째 이미지 (모델 이미지 또는 상세 컷)*/}
          <div>
            {product.images?.[1] ? (
              <img
                src={`/${product.images[1]}`}
                alt={`${product.name}모델 이미지`}
                className="mt-[20px] h-[280px] w-full bg-navy-800 object-cover object-top sm:h-[400px]"
              />
            ) : (
              <div className="mt-[20px] h-[280px] w-full bg-navy-800 sm:h-[400px]" />
            )}
          </div>
        </section>

        <section className="mt-[20px] flex-1">
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
                  <label key={c.value}>
                    <input
                      type="radio"
                      name="color"
                      value={c.value}
                      className="hidden"
                      checked={selectedColor === c.value}
                      onChange={() => setSelectedColor(c.value)}
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
              <button
                type="submit"
                className="w-full cursor-pointer border border-terracotta-500 bg-terracotta-500 py-[15px] text-[16px] font-medium text-navy-950 transition-colors duration-200 hover:bg-terracotta-600"
                aria-expanded={cart.isOpen}
              >
                장바구니 담기
              </button>
            </div>

            <div>
              {/* TODO: 상품 설명 필드가 아직 데이터에 없어 임시 문구를 그대로 뒀습니다. */}
              <p className="mt-[20px] text-left text-[14px] font-light leading-[1.6] text-cream/60">
                풍부한 질감이 느껴지는 블랙 데님 소재의 와이드 스트레이트 레그
                미드 라이즈 진. 톤온톤 탑스티칭 및 클래식한 파이브 포켓 디자인.
                시간이 지날수록 독특한 매력을 더하는 깊고 섬세한 색감과 의도적인
                자연스러운 질감이 특징으로 천연 면사를 방적하고 염색하여 제작한
                패브릭.
              </p>
            </div>
          </form>

          {/* 사이드바들은 <form> 안에 있으면 안 됨 (CartSidebar 내부에도 <form>이 있어서 HTML상 form 중첩이 됨) */}
          <SizeGuideSidebar
            isOpen={sizeGuide.isOpen}
            onClose={sizeGuide.close}
          />
          <CartSidebar
            isOpen={cart.isOpen}
            onClose={cart.close}
            onCheckout={handleCheckout}
          />
        </section>
      </main>

      {/* 비슷한 제품 영역: product.similarProductId에 있는 ID들로 상품을 찾아 전달*/}
      <SimilarProducts title="비슷한 제품" />
      <SimilarProducts title="후기 컷" />
    </div>
  );
}
