// src/ProductDetail/CartSidebar.tsx
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout?: () => void; // 선택적 prop으로 유지
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { items, removeItem, updateQty, totalPrice } = useCart();
  const navigate = useNavigate(); // 2. 네비게이트 훅 선언

  return (
    <aside
      className={`fixed top-0 right-0 z-sidebar flex h-screen w-[360px] flex-col border-l border-navy-700 bg-navy-900 shadow-[-5px_0_15px_rgba(0,0,0,0.4)] transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
      aria-label="장바구니"
    >
      {/* 장바구니 사이드바 헤더 */}
      <header className="flex items-center justify-between border-b border-navy-700 p-[24px]">
        <h3 className="m-0 text-[18px] font-bold text-cream">
          Cart{items.length > 0 ? ` (${items.length})` : ""}
        </h3>
        <button
          type="button"
          className="cursor-pointer border-none bg-transparent text-[14px] font-semibold text-cream/70 hover:text-cream"
          aria-label="장바구니 닫기"
          onClick={onClose}
        >
          Close
        </button>
      </header>

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* 스크롤 가능한 본문 영역 */}
        <div className="flex-1 overflow-y-auto p-[24px]">
          {items.length === 0 ? (
            <p className="text-[14px] text-cream/50">
              장바구니가 비어 있습니다.
            </p>
          ) : (
            <ul className="flex flex-col gap-[20px]">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex gap-[14px] border-b border-navy-700 pb-[20px] last:border-b-0"
                >
                  <div className="h-[90px] w-[90px] flex-shrink-0 overflow-hidden bg-navy-800">
                    <img
                      src={item.imgSrc}
                      alt={item.name}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-[4px]">
                    <strong className="text-[15px] text-cream">
                      {item.name}
                    </strong>
                    <span className="text-[13px] text-cream/60">
                      색상: {item.color} / 사이즈: {item.size}
                    </span>
                    <div className="flex items-center gap-[8px] text-[13px] text-cream/60">
                      <span>수량:</span>
                      <button
                        type="button"
                        aria-label="수량 감소"
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        disabled={item.qty <= 1}
                        className="flex h-[20ox] w-[20px] cursur-pointer items-center justify-center border border-navy-600 text-cream/70 trasition-colors hover:border-terracotta-400 hover:text-terracotta-400 disabled:cursur-not-allowed disabled:opacity-30"
                      >
                        -
                      </button>
                      <span className="w-[16px] text-center text-cream">
                        {item.qty}
                      </span>
                      <button
                        type="button"
                        aria-label="수량 증가"
                        onClick={() => updateQty(item.id, item.qty + 1)}
                        className="flex h-[20px] w-[20px] cursor-pointer items-center justify-center botder border-navy-600 text-cream/70 transition-colors hover:border-terracotta-400 hover:text-terracotta-400"
                      >
                        +
                      </button>
                    </div>

                    <div className="mt-[2px] flex items-center justify-between">
                      <span className="text-[14px] font-semibold text-terracotta-400">
                        ₩ {(item.price * item.qty).toLocaleString()}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-[12px] text-cream/40 underline hover:text-terracotta-400"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 하단 푸터 고정 영역 */}
        <footer className="border-t border-navy-700 bg-navy-900 p-[24px]">
          <div className="mb-[14px] flex items-center justify-between text-[14px] text-cream/80">
            <span>총 상품 금액</span>
            <strong className="text-[16px] text-cream">
              ₩ {totalPrice.toLocaleString()}
            </strong>
          </div>
          <div className="flex items-center justify-center">
            <button
              type="button"
              disabled={items.length === 0}
              onClick={() => {
                onClose(); // 3. 사이드바 닫기
                navigate("/order"); // 4. 주문/결제 페이지로 이동
              }}
              className="w-full cursor-pointer bg-terracotta-500 py-[15px] text-[14px] font-bold text-navy-950 transition-colors hover:bg-terracotta-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              결제하기
            </button>
          </div>
          <div className="mt-[12px] flex items-center justify-center">
            <button
              type="button"
              className="w-full cursor-pointer border border-navy-600 bg-transparent py-[15px] text-[14px] font-bold text-cream transition-colors hover:border-terracotta-400 hover:text-terracotta-400"
              onClick={onClose}
            >
              닫기
            </button>
          </div>
        </footer>
      </div>
    </aside>
  );
}
