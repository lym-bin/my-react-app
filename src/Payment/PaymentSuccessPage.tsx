// src/Payment/PaymentSuccessPage.tsx
// 결제창 인증이 끝나면 토스가 이 주소로 돌려보냄 (?paymentKey=...&orderId=...&amount=...)
// 지금은 쿼리를 읽어서 보여주는 단계까지. 다음 단계에서 서버승인(/api/confirm)을 붙힘 TO-BE

import { Link, useSearchParams } from "react-router-dom";

export default function PaymentSuccessPage() {
  // useSearchParams: 주소의 ?뒤 쿼리스트링을 이름으로 꺼내 쓰는 훅(순서는 상관 없음)
  const [searchParams] = useSearchParams();
  const paymentKey = searchParams.get("paymentKey");
  const orderId = searchParams.get("orderId");
  // 쿼리 값은 항상 문자열이라 숫자로 바꿔줌 (없으면 Number(null) = 0)
  const amount = Number(searchParams.get("amount"));

  // 필수 값이 하나라도 없으면 결제창을 거쳐 정상적으로 들어온 게 아님
  if (!paymentKey || !orderId || !amount) {
    return (
      <main className="mx-auto flex w-full max-w-[600px] flex-col items-center bg-navy-950 px-[20px] py-[120px] text-center">
        <h1 className="mb-[16px] text-24 font-normal text-cream">
          결제 정보를 확인할 수 없어요
        </h1>
        <p className="mb-[32px] text-14 leading-[1.6] text-cream/60">
          결제를 다시 진행해 주세요.
        </p>
        <Link
          to="/order"
          className="inline-flex items-center justify-center border border-terracotta-500 px-[32px] py-[13px] text-13 tracking-[0.1em] text-terracotta-500 transition-colors hover:bg-terracotta-500 hover:text-navy-950"
        >
          주문 페이지로 가기
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-[600px] flex-col items-center bg-navy-950 px-[20px] py-[120px] text-center">
      <h1 className="mb-[16px] text-24 font-normal text-cream">
        결제를 확인하고 있어요
      </h1>
      <p className="mb-[32px] text-14 leading-[1.6] text-cream/60">
        창을 닫거나 새로고침하지 말아 주세요.
      </p>
      <dl className="w-full border border-navy-700 bg-navy-900 p-[20px] text-left text-14">
        <div className="flex justify-between py-[6px]">
          <dt className="text-cream/60">주문번호</dt>
          <dd className="text-cream">{orderId}</dd>
        </div>
        <div className="flex justify-between py-[6px]">
          <dt className="text-cream/60">결제 금액</dt>
          <dd className="font-bold text-terracotta-400">
            {amount.toLocaleString()}원
          </dd>
        </div>
      </dl>
    </main>
  );
}
