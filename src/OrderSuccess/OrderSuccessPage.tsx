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
}

export default function OrderSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { nickname } = useAuth();

  const state = location.state as OrderSuccessState | null;
  const items = state?.items ?? [];
  const totalPrice = state?.totalPrice ?? 0;
  const address = state?.address;
  const paymentMethod = state?.paymentMethod ?? "toss";

  const paymentLabels: Record<string, string> = {
    toss: "토스페이",
    kakao: "카카오페이",
    naver: "네이버페이",
    order: "기타결제",
  };

  const orderId = `ORD-${Date.now().toString().slice(-8)}`;
  const orderDate = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <main className="mx-auto w-full max-w-[800px] bg-navy-950 px-[20px] py-[60px]">
      <div className="mb-[40px] text-center">
        <h2 className="mb-[12px] text-[24px] font-bold text-cream">
          결제 완료
        </h2>
        <span className="text-[16px] text-cream/60">
          감사합니다. 결제가 완료되었습니다.
        </span>
        <div className="mt-[14px] flex justify-center gap-[16px] text-[13px] text-cream/50">
          <span>
            주문번호: <strong className="text-cream/80">{orderId}</strong>
          </span>
          <span>|</span>
          <span>결제일시: {orderDate}</span>
        </div>
      </div>

      {/* 배송지 및 결제 정보 요약 섹션 */}
      <section className="mb-[40px] grid grid-cols-1 md:grid-cols-2 gap-[20px] border border-navy-700 bg-navy-900 p-[30px] rounded-lg">
        <div>
          <div className="flex items-center gap-[10px] mb-[10px]">
            <strong className="text-[16px] text-cream">
              {nickname ?? "guest"}
            </strong>
            {address?.title && (
              <span className="rounded-[4px] bg-navy-800 px-[6px] py-[2px] text-[12px] text-terracotta-400 font-semibold">
                {address.title}
              </span>
            )}
          </div>
          <address className="not-italic">
            <p className="my-[4px] text-[14px] leading-[1.6] text-cream/70">
              {address ? address.address : "경기도 수원시 팔달구 123"}
            </p>
            <p className="my-[4px] text-[14px] leading-[1.6] text-cream/70">
              {address ? address.phone : "010-1234-1234"}
            </p>
          </address>
        </div>

        <div className="border-t md:border-t-0 md:border-l border-navy-700 pt-[20px] md:pt-0 md:pl-[20px] flex flex-col justify-center">
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
            <div className="grid grid-cols-[2fr_1fr] border-b border-navy-700 bg-navy-800 px-[20px] py-[14px] text-center text-[14px] font-bold text-cream/80">
              <span className="text-left">상품정보</span>
              <span className="text-right">결제금액</span>
            </div>

            {items.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-[2fr_1fr] border-b border-navy-700 px-[20px] py-[14px] text-center items-center"
              >
                <div className="flex items-center gap-[20px] text-left">
                  <div className="h-[90px] w-[90px] flex-shrink-0 bg-navy-800 overflow-hidden">
                    <img
                      src={item.imgSrc}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
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
                    $ {(item.price * item.qty).toLocaleString()}
                  </strong>
                </div>
              </div>
            ))}

            <div className="my-[30px] flex items-center justify-end gap-[20px] bg-navy-800 px-[30px] py-[20px] text-[14px] text-cream/80 rounded">
              <div className="text-[16px] font-bold text-cream">
                총 결제 금액 :{" "}
                <span className="text-[20px] text-terracotta-400">
                  $ {totalPrice.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-center gap-[14px] mt-[40px]">
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
