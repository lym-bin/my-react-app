// src/NotFound/NotFoundPage.tsx
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <main className="mx-auto flex w-full max-w-[600px] flex-col items-center justify-center bg-navy-950 px-[20px] py-[120px] text-center">
      <span className="mb-[16px] text-[13px] tracking-[0.3em] text-cream/40 uppercase">
        404
      </span>
      <h1 className="mb-[16px] text-[24px] font-normal text-cream">
        페이지를 찾을 수 없습니다
      </h1>
      <p className="mb-[32px] text-[14px] leading-[1.6] text-cream/60">
        주소가 잘못되었거나 삭제된 페이지일 수 있습니다.
      </p>
      <Link
        to="/"
        className="inline-flex items-center justify-center border border-terracotta-500 bg-transparent px-[32px] py-[13px] text-[13px] tracking-[0.1em] text-terracotta-500 uppercase transition-colors hover:bg-terracotta-500 hover:text-navy-950"
      >
        홈으로 가기
      </Link>
    </main>
  );
}
