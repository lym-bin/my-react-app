// src/ProductDetail/CartSidebar.tsx
// state는 없이, CartContext에서 장바구니 내용을 꺼내와 보여주기만 하는 컴포넌트
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom"; // 코드로 페이지 이동시키는 hook(버튼 클릭등 이벤트 안에서 씀)

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { items, removeItem, updateQty, totalPrice } = useCart(); // CartContext에서 필요한 것만 꺼냄
  // useNavigate: 버튼 클릭 같은 이벤트 헨들러 안에서 코드로 페이지를 이동 시키는 HOOK
  // LINK가 클릭하면 이동하는 링크 라면 useNavigate()는 조건 판단 후 이동
  const navigate = useNavigate(); // 2. 네비게이트 훅 선언

  return (
    <aside
      // translate-x로 슬라이드 인/아웃 : 열리면 제자리(0), 닫히면 화면 오른쪽 밖으로 (full)
      // transition-transform이 있어서 순간이동이 아니라 스스륵 미끄러지는 애니메이션이 됨
      className={`fixed top-0 right-0 z-sidebar flex h-screen w-[360px] flex-col border-l border-navy-700 bg-navy-900 shadow-[-5px_0_15px_rgba(0,0,0,0.4)] transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
      aria-label="장바구니"
    >
      {/* 장바구니 사이드바 헤더 */}
      <header className="flex items-center justify-between border-b border-navy-700 p-[24px]">
        <h3 className="m-0 text-[18px] font-bold text-cream">
          {/* 아이템 있으면 "Cart (3)" 처럼 개수 표시, 없으면 그냥 "Cart"*/}
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
        <div className="flex-1 overflow-y-auto p-[24px]">
          {/* 비었으면 안내 문구, 있으면 목록 (삼항연산자로 두 UI 통째로 스위칭) */}
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
                        onClick={() => updateQty(item.id, item.qty - 1)} // 현재 수량 -1
                        disabled={item.qty <= 1} // 1개월 일 땐 더 못 줄이게 비활성화
                        className="flex h-[20px] w-[20px] cursor-pointer items-center justify-center border border-navy-600 text-cream/70 transition-colors hover:border-terracotta-400 hover:text-terracotta-400 disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        -
                      </button>
                      <span className="w-[16px] text-center text-cream">
                        {item.qty}
                      </span>
                      <button
                        type="button"
                        aria-label="수량 증가"
                        onClick={() => updateQty(item.id, item.qty + 1)} // 현재 수량 +1
                        className="flex h-[20px] w-[20px] cursur-pointer items-center justify-center border border-navy-600 text-cream/70 transition-colors hover:border-terracotta-400 hover:text-terracotta-400"
                      >
                        +
                      </button>
                    </div>

                    <div className="mt-[2px] flex items-center justify-between">
                      {/* 개별 항목 소계 = 단가 x 수량 */}
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
            {/* CartContext가 이미 계산해둔 총액 수량 바뀌면 바로바로 최신 값반영(reduce)*/}
            <strong className="text-[16px] text-cream">
              ₩ {totalPrice.toLocaleString()}
            </strong>
          </div>
          <div className="flex items-center justify-center">
            <button
              type="button"
              disabled={items.length === 0} // 빈 장바구니면 결제 버튼 비활성화
              onClick={() => {
                onClose(); // 3. 사이드바 닫기
                navigate("/order"); // 4. 주문/결제 페이지로 이동(/order 경로로 이동)
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
