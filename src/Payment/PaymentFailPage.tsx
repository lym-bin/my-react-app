// src/Payment/PaymentFailPage.tsx
// 결제창에서 실패/취소하면 토스가 이 주소로 돌려 보냄 (?code=...&message=...&orderId=...)
// 에러 코드를 사람이 읽을 수 있는 문장으로 바꿔서 보여줌

import { Link, useSearchParams } from "react-router-dom";

// 자주 나오는 코드만 평소 message 말투로 변경. 나머지는 토스가 보내준 message를 그대로 사용
const FAIL_MESSAGES: Record<string, string> = {
  PAY_PROCESS_CANCELED: "결제창을 닫아서 결제가 진행되지 않았어요.",
  PAY_PROCESS_ABORTED: "결제가 중간에 중단됐어요. 잠시 후 다시 시도해 주세요.",
  REJECT_CARD_COMPANY:
    "카드사에서 결제를 거절했어요. 다른 카드로 시도해 주세요.",
};

export default function PaymentFailPage() {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code") ?? "";
  // 프로젝트 message -> 토스 message -> 기본 문장 순서로 사용
  const message =
    FAIL_MESSAGES[code] ??
    searchParams.get("message") ??
    "결제에 실패했어요. 다시 시도해 주세요.";
  const isCanceled = code === "PAY_PROCESS_CANCELED";

  return (
    <main className="mx-auto flex w-full max-w-[600px] flex-col items-center bg-navy-950 px-[20px] py-[120px] text-center">
      <h1 className="mb-[16px] text-24 font-normal text-cream">
        {isCanceled ? "결제가 취소됐어요" : "결제에 실패했어요"}
      </h1>
      <p className="mb-[8px] text-14 leading-[1.6] text-cream/60">{message}</p>
      <p className="mb-[32px] text-14 leading-[1.6] text-cream/60">
        장바구니는 그대로 남아 있어요.
      </p>
      {code && (
        <span className="mb-[24px] text-11 tracking-[0.1em] text-cream/40">
          {code}
        </span>
      )}
      <div className="flex flex-col gap-[10px] sm:flex-row">
        <Link
          to="/order"
          className="inline-flex items-center justify-center bg-terracotta-500 px-[32px] py-[13px] text-13 font-bold text-navy-950 transition-colors hover:bg-terracotta-600"
        >
          다시 결제하기
        </Link>
        <Link
          to="/products"
          className="inline-flex items-center justify-center border border-navy-600 px-[32px] py-[13px] text-13 text-cream/85 transition-colors hover:border-terracotta-400 hover:text-terracotta-400"
        >
          쇼핑 계속하기
        </Link>
      </div>
    </main>
  );
}
