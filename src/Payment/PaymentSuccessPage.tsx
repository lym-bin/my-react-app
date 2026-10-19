// src/Payment/PaymentSuccessPage.tsx
// 결제창 인증이 끝나면 토스가 이 주소로 돌려보냄 (?paymentKey=...&orderId=...&amount=...)
// 지금은 쿼리를 읽어서 보여주는 단계까지. 다음 단계에서 서버승인(/api/confirm)을 붙힘 TO-BE

import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { loadPendingOrder } from "./pendingOrder";

export default function PaymentSuccessPage() {
  // useSearchParams: 주소의 ?뒤 쿼리스트링을 이름으로 꺼내 쓰는 훅(순서는 상관 없음)
  const [searchParams] = useSearchParams();
  const paymentKey = searchParams.get("paymentKey");
  const orderId = searchParams.get("orderId");
  // 쿼리 값은 항상 문자열이라 숫자로 바꿔줌 (없으면 Number(null) = 0)
  const amount = Number(searchParams.get("amount"));
  // 맡겨둔 주문 정보를 처음 렌더링 때 한 번만 꺼냄 (함수 자체를 넘기는 lazy초기화)
  const [pending] = useState(loadPendingOrder);

  // 1차 확인: 떠나기 전에 맡겨둔 주문과, 돌아온 주소의 값이 같은지
  // (주소는 사용자가 바꿀 수 있어서 진짜 검증은 다음 단계에서 서버가 다시 함)
  const isMatched =
    pending !== null &&
    pending.orderId === orderId &&
    pending.amount === amount;
  // 승인 진행 상태: 확인 중 -> 성공 / 실패
  const [status, setStatus] = useState<"confirming" | "success" | "fail">(
    "confirming",
  );
  const [errorMessage, setErrorMessage] = useState("");
  // 승인 요청을 이미 보냈는지 기억 (화면을 다시 그리지 않는 메모용 useRef)
  const requestRef = useRef(false);

  useEffect(() => {
    if (!isMatched || requestRef.current) return;
    // StrictMode에서 effect가 두 번 실행돼도 승인 요청은 딱 한 번만 보냄
    requestRef.current = true;

    async function confirmPayment() {
      try {
        const response = await fetch("/api/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentKey, orderId, amount }),
        });
        const result = (await response.json()) as { message?: string };

        // response.ok : 상태 코드가 200번대면 true
        if (!response.ok) {
          setErrorMessage(result.message ?? "결제 승인에 실패했어요.");
          setStatus("fail");
          return;
        }
        setStatus("success");
      } catch {
        setErrorMessage("서버에 연결하지 못했어요. 잠시 후 다시 시도해주세요.");
        setStatus("fail");
      }
    }

    confirmPayment();
  }, [isMatched, paymentKey, orderId, amount]);

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

  // 값은 다 있는데 맡겨둔 주문과 다르면: 주소가 바뀌었거나 다른 탭에서 열린 경우
  if (!isMatched) {
    return (
      <main className="mx-auto flex w-full max-w-[600px] flex-col items-center bg-navy-950 px-[20px] py-[120px] text-center">
        <h1 className="mb-[16px] text-24 font-normal text-cream">
          주문 정보가 맞지 않아요
        </h1>
        <p className="mb-[32px] text-14 leading-[1.6] text-cream/60">
          결제 금액이나 주문번호가 주문할 때와 달라요. 주문 페이지에서 다시
          결제해 주세요.
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

  // 승인 실패: 토스나 내 서버가 거절한 경우
  if (status === "fail") {
    return (
      <main className="mx-auto flex w-full max-w-[600px] flex-col items-center bg-navy-950 px-[20px] py-[120px] text-center">
        <h1 className="mb-[16px] text-24 font-normal text-cream">
          결제를 승인하지 못했어요
        </h1>
        <p className="mb-[32px] text-14 leading-[1.6] text-cream/60">
          {errorMessage}
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

  // 승인 성공 (주문 저장과 완료 페이지 이동은 다음 단계에서 연결)
  if (status === "success") {
    return (
      <main className="mx-auto flex w-full max-w-[600px] flex-col items-center bg-navy-950 px-[20px] py-[120px] text-center">
        <h1 className="mb-[16px] text-24 font-normal text-cream">
          결제가 승인됐어요
        </h1>
        <p className="text-14 leading-[1.6] text-cream/60">
          주문번호 {orderId} · {amount.toLocaleString()}원
        </p>
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
