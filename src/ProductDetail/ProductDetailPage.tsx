import React, { useState } from "react";
import { useParams } from "react-router-dom";
import CartSidebar from "./CartSidebar";
import SizeGuideSidebar from "./SizeGuideSidebar";
import SimilarProducts from "./SimilarProducts";
import { PRODUCTS } from "../ProductList/ProductsData";
import { useCart } from "../context/CartContext";
export function ProductDetailPage() {
  const { id } = useParams();
  const { addItem } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState("M");

  const product = PRODUCTS.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <div className="bg-navy-950 min-h-screen text-white flex items-center justify-center">
        <p>존재하지 않는 상품입니다.</p>
      </div>
    );
  }

  const handleAddToCart = (e: React.FormEvent) => {
    e.preventDefault();

    // 3. 실제 장바구니 상태에 상품 추가
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      imgSrc: product.imgSrc,
      color: "기본",
      size: selectedSize,
      qty: 1,
    });

    setIsCartOpen(true);
  };

  return (
    <div className="bg-navy-950 min-h-screen text-white pb-20">
      <main className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* 상품 이미지 영역 */}
          <div className="space-y-4">
            <div className="aspect-square w-full bg-neutral-800 rounded-lg overflow-hidden">
              {product.imgSrc ? (
                <img
                  src={`/${product.imgSrc}`}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-neutral-800" />
              )}
            </div>
          </div>

          {/* 상품 정보 및 구매 폼 영역 */}
          <form
            onSubmit={handleAddToCart}
            className="flex flex-col justify-between"
          >
            <div className="space-y-6">
              <h1 className="text-2xl sm:text-3xl font-bold">{product.name}</h1>
              <p className="text-xl text-neutral-300 font-semibold">
                {product.price.toLocaleString()}원
              </p>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-neutral-400">
                    사이즈 선택
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="text-xs text-indigo-400 underline"
                  >
                    사이즈 가이드
                  </button>
                </div>
                <div className="flex gap-2">
                  {["S", "M", "L", "XL"].map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-md text-sm font-medium ${
                        selectedSize === size
                          ? "border-white bg-white text-black"
                          : "border-neutral-700 text-neutral-300"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button
                type="submit"
                className="w-full py-4 bg-white text-black font-bold rounded-lg hover:bg-neutral-200 transition-colors"
              >
                장바구니 담기
              </button>
            </div>
          </form>
        </section>

        <section className="mt-16">
          <SimilarProducts />
        </section>
      </main>

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={() => alert("결제 페이지로 이동")}
      />
      <SizeGuideSidebar
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />
    </div>
  );
}
