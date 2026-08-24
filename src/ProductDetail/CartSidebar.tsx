// src/pages/ProductDetail/components/CartSidebar.tsx
interface CartItem {
  name: string;
  price: string;
  color: string;
  size: string;
  qty: number;
}

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  item: CartItem;
  onCheckout: () => void;
}

export default function CartSidebar({
  isOpen,
  onClose,
  item,
  onCheckout,
}: CartSidebarProps) {
  const handleCancel = () => {
    onClose();
  };

  return (
    <aside
      className={`fixed top-0 right-0 z-sidebar flex h-screen w-[360px] flex-col border-1 border-navy-700 bg-navy-900 shadow-[-5px_0_15px_rgba(0,0,0,0.1)] transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
      aria-label="장바구니"
    >
      {/* 장바구니 사이드바 헤더: border -> border-b 로 수정 */}
      <header className="flex items-center justify-between border-b border-navy-700 p-[24px]">
        <h3 className="m-0 text-[18px] font-bold text-cream">Cart</h3>
        <button
          type="button"
          className="cursor-pointer border-none bg-transparent text-[14px] font-semibold text-cream/70 hover:text-cream"
          aria-label="장바구니 닫기"
          onClick={onClose}
        >
          Close
        </button>
      </header>

      {/* 원본 CSS의 .cart-form 구조 반영 */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onCheckout();
        }}
        className="flex flex-1 flex-col overflow-hidden"
      >
        {/* 스크롤 가능한 본문 영역 */}
        <div className="flex-1 overflow-y-auto p-[24px]">
          <article>
            <div className="h-[300px] w-full overflow-hidden bg-navy-800">
              <img
                src=""
                alt={`${item.name} 이미지`}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="mt-[20px]">
              <h4 className="mb-[8px] text-[20px] font-bold text-cream">
                제품명 : <span>{item.name}</span>
              </h4>
              <p className="mb-[4px] text-[14px] text-cream/60">
                가격 : <span>{item.price}</span>
              </p>
              <p className="mb-[4px] text-[14px] text-cream/60">
                색상 : <span>{item.color}</span>
              </p>
              <p className="mb-[4px] text-[14px] text-cream/60">
                사이즈 : <span>{item.size}</span>
              </p>
              <p className="mb-[4px] text-[14px] text-cream/60">
                수량 : <span>{item.qty}</span>
              </p>
            </div>
          </article>
        </div>

        {/* 하단 푸터 고정 영역: 불필요한 mx-[10px] 제거 */}
        <footer className="border-t border-navy-700 bg-navy-900 p-[24px]">
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="w-full cursor-pointer bg-terracotta-500 py-[15px] text-[14px] font-bold text-navy-950 hover:bg-terracotta-600"
            >
              결제
            </button>
          </div>
          <div className="mt-[12px] flex items-center justify-center">
            <button
              type="button"
              className="w-full cursor-pointer border border-navy-600 bg-transparent py-[15px] text-[14px] font-bold text-cream hover:bg-terracotta-400 hover:text-terracotta-400"
              onClick={handleCancel}
            >
              취소
            </button>
          </div>
        </footer>
      </form>
    </aside>
  );
}
