// src/OrderSuccess/OrderSuccessPage.tsx
// OrderPage가 navigate로 전달한 주문정보를 받아 보여주는 결제완료 페이지
// useLocation(): 현재 URL 정보 + navigate(path, { state })로 넘겨 받는 state를 읽는 훅
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { CartItem } from "../context/CartContext";

interface Address {
  id: string;
  title: string;
  recipient: string;
  address: string;
  phone: string;
}

interface OrderSuccessState {
  items: CartItem[];
  totalPrice: number;
  address?: Address;
  paymentMethod?: string;
  orderId?: string;
  createdAt?: string;
}

// Record<string, string> = "카드 문자열, 값도 문자열인 객체" 타입 (딕셔너리/매핑 테이블에 자주 씀)
const paymentLabels: Record<string, string> = {
  toss: "토스페이",
  kakao: "카카오페이",
  naver: "네이버페이",
  order: "기타결제",
};

export default function OrderSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation(); // 현재 경로 정보 + navigate로 넘겨받은 state를 읽는 훅
  const { nickname } = useAuth();

  // orderPage의 navigate("/ordersuccess", { state: orderData })로 넘어온 데이터
  // location.state는 타입이 unknown이라 as로 OrderSucccessState 맞다 선언
  // null까지 붙인 이유 : 새로고침하면 state가 통쨰로 사라져서 null이 될 수 있음
  const state = location.state as OrderSuccessState | null;
  // state가 없으면(새로고침 등)각 값마다 안전한 기본값으로 대체
  const items = state?.items ?? [];
  const totalPrice = state?.totalPrice ?? 0;
  const address = state?.address;
  const paymentMethod = state?.paymentMethod ?? "toss";

  // 실제 저장된 주문 정보(OrderPage에서 넘겨준 값)을 그대로 씀.
  // 새로고침 등으로 state가 없을 때만 "확인 불가"로 표시
  const orderId = state?.orderId ?? "확인 불가";
  const orderDate = state?.createdAt
    ? new Date(state.createdAt).toLocaleString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }) // 150 날짜 문자열 -> "2026년 0월 00일 오전 9:40" 한국어 형식으로 변환
    : "확인 불가";
  return (
    <main className="mx-auto w-full max-w-[800px] bg-navy-950 px-[20px] py-[60px] sm:px-[20px] sm:py-[60px]">
      <div className="mb-[40px] text-center">
        <h2 className="mb-[12px] text-[24px] font-bold text-cream">
          결제 완료
        </h2>
        <span className="text-[16px] text-cream/60">
          감사합니다. 결제가 완료되었습니다.
        </span>
        <div className="mt-[14px] flex justify-center gap-[16px] text-[13px] text-cream/50 sm:flex-row sm:justify-center sm:gap-[16px]">
          <span>
            주문번호: <strong className="text-cream/80">{orderId}</strong>
          </span>
          <span className="hidden sm:inline">|</span>
          {/* 모바일에선 숨기고 sm 이상에서만 구분선 표시*/}
          <span>결제일시: {orderDate}</span>
        </div>
      </div>

      {/* 배송지 및 결제 정보 요약 섹션 */}
      <section className="mb-[40px] grid grid-cols-1 gap-[20px] rounded-lg border border-navy-700 bg-navy-900 p-[20px] sm:p-[30px] md:grid-cols-2">
        <div>
          <div className="flex items-center gap-[10px] mb-[10px]">
            <strong className="text-[16px] text-cream">
              {nickname ?? "guest"}
            </strong>
            {address?.title && ( // address가 있고 title도 있을 때만 태그 표시
              <span className="rounded-[4px] bg-navy-800 px-[6px] py-[2px] text-[12px] text-terracotta-400 font-semibold">
                {address.title}
              </span>
            )}
          </div>
          <address className="not-italic">
            {/* address 없으면(주문 데이터 유실) 더마 에시 주소로 대체 표시*/}
            <p className="my-[4px] text-[14px] leading-[1.6] text-cream/70">
              {address ? address.address : "경기도 수원시 팔달구 123"}
            </p>
            <p className="my-[4px] text-[14px] leading-[1.6] text-cream/70">
              {address ? address.phone : "010-1234-1234"}
            </p>
          </address>
        </div>

        <div className="flex flex-col justify-center border-t border-navy-700 pt-[20px] md:border-t-0 md:border-1 md:pt-0 md:pl-[20px]">
          {/* 객체(동적 키)로 값 찾기: paymentMethod가 "toss"면 paymentLabels["toss"] -> 토스페이*/}
          <span className="text-[13px] text-cream/50 mb-[4px]">결제 수단</span>
          <strong className="text-[15px] text-cream">
            {paymentLabels[paymentMethod] ?? "토스페이"}
          </strong>
        </div>
      </section>

      <section>
        <h3 className="mb-[14px] border-b-2 border-navy-700 pb-[12px] font-bold text-cream">
          주문 상품 ({items.length})
        </h3>

        {items.length === 0 ? (
          <p className="py-[30px] text-center text-[14px] text-cream/50">
            주문 내역을 불러올 수 없습니다. (새로고침 시 초기화될 수 있습니다.)
          </p>
        ) : (
          <div>
            <div className="hidden border-b border-navy-700 bg-navy-800 px-[20px] py-[14px] text-center text-[14px] font-bold text-cream/80 sm:grid sm:grid-cols-[2fr,1fr]">
              <span className="text-left">상품정보</span>
              <span className="text-right">결제금액</span>
            </div>

            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-[12px] border-b border-navy-700 px-[12px] py-[14px] sm:grid sm:grid-cols-[2fr,1fr] sm:items-center sm:gap-0 sm:px-[20px] sm:text-center"
              >
                <div className="flex items-center gap-[14px] text-left sm:gap-[20px]">
                  <div className="h-[70px] w-[70px] flex-shrink-0 overflow-hidden bg-navy-800 sm:h-[90px] sm:w-[90px]">
                    {item.imgSrc && (
                      <img
                        src={item.imgSrc}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex flex-col gap-[6px]">
                    <strong className="text-cream">{item.name}</strong>
                    <span className="text-[13px] text-cream/60">
                      색상: {item.color} / 사이즈: {item.size} / 수량:{" "}
                      {item.qty}개
                    </span>
                  </div>
                </div>
                <div>
                  <strong className="block text-right text-[16px] font-bold text-terracotta-400">
                    {(item.price * item.qty).toLocaleString()}원
                  </strong>
                </div>
              </div>
            ))}

            <div className="my-[24px] flex items-center justify-end gap-[16px] bg-navy-800 px-[16px] py-[16px] text-[14px] text-cream/80 rounded sm:my-[30px] sm:gap-[20px] sm:px-[30px] sm:py-[20px]">
              <div className="text-[16px] font-bold text-cream">
                총 결제 금액 :{" "}
                <span className="text-[20px] text-terracotta-400">
                  {totalPrice.toLocaleString()}원
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-[30px] flex flex-col gap-[10px] sm:mt-[40px] sm:flex-row sm:justify-center sm:gap-[14px]">
          <button
            type="button"
            className="cursor-pointer border border-navy-600 bg-transparent px-[40px] py-[16px] text-[14px] font-bold text-cream transition-colors hover:border-terracotta-400 hover:text-terracotta-400"
            onClick={() => navigate("/products")}
          >
            쇼핑 계속하기
          </button>
          <button
            type="button"
            className="cursor-pointer border border-terracotta-500 bg-terracotta-500 px-[40px] py-[16px] text-[15px] font-bold text-navy-950 transition-colors hover:bg-terracotta-600"
            onClick={() => navigate("/mypage")}
          >
            주문내역 확인하기
          </button>
        </div>
      </section>
    </main>
  );
}
