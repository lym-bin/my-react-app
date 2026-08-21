// src/pages/ProductDetail/ProductDetailPage.tsx
import { useState } from "react";
import useDisclosure from "../hooks/useDisclosure";
import SizeGuideSidebar from "./SizeGuideSidebar";
import CartSidebar from "./CartSidebar";
import SimilarProducts from "./SimilarProducts";

const colors = [
  { value: "red", label: "레드" },
  { value: "black", label: "블랙" },
  { value: "white", label: "화이트" },
  { value: "gray", label: "그레이" },
];

const sizes = ["XXXS", "XXS", "XS", "S", "M", "L", "XL", "XXL"];

export default function ProductDetailPage() {
  const cart = useDisclosure();
  const sizeGuide = useDisclosure();

  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  const handleAddToCart = (e: React.FormEvent) => {
    e.preventDefault();
    cart.open();
  };

  const handleCheckout = () => {
    cart.close();
  };

  const isDimmedOpen = cart.isOpen || sizeGuide.isOpen;

  return (
    <div>
      {/* 백드롭 Dimmed 레이어 (사이드바 오픈 시 배경 어둡게 처리) */}
      {isDimmedOpen && (
        <div
          className="fixed inset-0 z-[9990] bg-black/50 transition-opacity"
          onClick={() => {
            cart.close();
            sizeGuide.close();
          }}
        />
      )}

      <main className="mx-auto flex w-full max-w-[1200px] justify-between gap-[40px] px-[40px] py-[40px]">
        <section className="w-[400px]">
          <div>
            <img
              src=""
              alt="블랙 데님 와이드 진 상품 대표 이미지"
              className="mt-[20px] h-[400px] w-full bg-[#f5f5f5] object-cover"
            />
          </div>
          <div>
            <img
              src=""
              alt="블랙 데님 와이드 진 모델 대표 이미지"
              className="mt-[20px] h-[400px] w-full bg-[#f5f5f5] object-cover"
            />
          </div>
        </section>

        <section className="mt-[20px] flex-1">
          <form onSubmit={handleAddToCart}>
            <div>
              <h1 className="mb-[20px] text-[24px] font-normal">
                블랙 데님 와이드 스트레이트 진
              </h1>
              {/* 가격 통일 ($ 120) */}
              <div className="mb-[20px] border-b border-[#d9d9d9] pb-[20px] text-[18px] font-semibold">
                $ 120
              </div>
            </div>

            <div className="mb-[20px]">
              <strong className="mb-[10px] block text-[18px]">색상 : </strong>
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
                          ? "border-black bg-black text-white"
                          : "border-[#d9d9d9]"
                      }`}
                    >
                      {c.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-[20px]">
              <strong className="mb-[10px] block text-[18px]">사이즈 : </strong>
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
                          ? "border-black bg-black text-white"
                          : "border-[#d9d9d9]"
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
                className="cursor-pointer border-none bg-transparent p-0 text-[13px] text-[#666] underline"
                aria-expanded={sizeGuide.isOpen}
                onClick={sizeGuide.open}
              >
                사이즈 가이드
              </button>
            </div>

            <SizeGuideSidebar
              isOpen={sizeGuide.isOpen}
              onClose={sizeGuide.close}
            />

            <div className="mb-[30px]">
              <button
                type="submit"
                className="w-full cursor-pointer border border-black bg-black py-[15px] text-[16px] font-medium text-white transition-colors duration-200 hover:bg-[#333]"
                aria-expanded={cart.isOpen}
              >
                장바구니 담기
              </button>
            </div>

            <CartSidebar
              isOpen={cart.isOpen}
              onClose={cart.close}
              onCheckout={handleCheckout}
              item={{
                name: "블랙 데님 와이드 스트레이트 진",
                price: "$ 120",
                color: selectedColor || "gray",
                size: selectedSize || "S",
                qty: 1,
              }}
            />

            <div>
              <p className="mt-[20px] text-left text-[14px] font-light leading-[1.6] text-[#444]">
                풍부한 질감이 느껴지는 블랙 데님 소재의 와이드 스트레이트 레그
                미드 라이즈 진. 톤온톤 탑스티칭 및 클래식한 파이브 포켓 디자인.
                시간이 지날수록 독특한 매력을 더하는 깊고 섬세한 색감과 의도적인
                자연스러운 질감이 특징으로 천연 면사를 방적하고 염색하여 제작한
                패브릭.
              </p>
            </div>
          </form>
        </section>
      </main>

      <SimilarProducts title="비슷한 제품" />
      <SimilarProducts title="후기 컷" />
    </div>
  );
}
