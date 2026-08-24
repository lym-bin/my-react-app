// src/pages/OrderSuccess/OrderSuccessPage.tsx
import { useNavigate } from "react-router-dom";

export default function OrderSuccessPage() {
  const navigate = useNavigate();

  return (
    <main className="mx-auto w-full max-w-[800px] bg-navy-950 px-[20px] py-[60px]">
      <div className="mb-[50px] text-center">
        <h2 className="mb-[12px] text-[24px] font-bold text-cream">
          결제 완료
        </h2>
        <span className="text-[16px] text-cream/60">
          감사합니다. 결제가 완료 되었습니다.
        </span>
      </div>

      <section className="mb-[40px] border-b border-navy-700 p-[40px]">
        <div>
          <strong className="mb-[14px] block text-[18px] text-cream">
            홍길동
          </strong>
          <address className="not-italic">
            <p className="my-[4px] text-[14px] leading-[1.6] text-cream/70">
              경기도 수원시 팔달구 어쩌구 저쩌구 303
            </p>
            <p className="my-[4px] text-[14px] leading-[1.6] text-cream/70">
              010-1234-1234
            </p>
            <p className="mt-[10px] text-[14px] leading-[1.6] text-cream/70">
              abcdefg123@naver.com
            </p>
          </address>
        </div>
      </section>

      <section>
        <h3 className="mb-[14px] border-b-2 border-navy-700 pb-[12px] font-bold text-cream">
          주문 상품
        </h3>

        <div>
          <div className="grid grid-cols-[2fr_1fr_1fr] border-b border-navy-700 bg-navy-800 px-[20px] py-[14px] text-center text-[14px] font-bold text-cream/80">
            <span className="text-left">상품정보</span>
            <span className="text-center">할인금액</span>
            <span className="text-right">결제금액</span>
          </div>

          <div className="grid grid-cols-[2fr_1fr_1fr] border-b border-navy-700 px-[20px] py-[14px] text-center">
            <div className="flex items-center gap-[20px] text-left">
              <div className="h-[100px] w-[100px] flex-shrink-0 bg-navy-800">
                <img
                  src=""
                  alt="블랙 데님 와이드 스트레이트 진"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-col gap-[6px]">
                <strong>블랙 데님 와이드 스트레이트 진</strong>
                <span className="text-[14px] text-cream/60">1개</span>
              </div>
            </div>
            <div className="mt-[30px] text-danger">
              <strong className="block text-center font-bold">
                -111,111원
              </strong>
            </div>
            <div className="mt-[30px]">
              <strong className="block text-right text-[16px] font-bold text-terracotta-400">
                17,889원
              </strong>
            </div>
          </div>
        </div>

        <div className="my-[30px] flex items-center justify-end gap-[20px] bg-navy-800 px-[30px] py-[20px] text-[14px] text-cream/80">
          <div>
            주문금액{" "}
            <span className="ml-[4px] font-bold text-cream">129,000원</span>
          </div>
          <div className="font-bold text-cream/40">-</div>
          <div>
            할인금액{" "}
            <span className="ml-[4px] font-bold text-cream">111,111원</span>
          </div>
          <div className="font-bold text-cream/40">+</div>
          <div>
            배송비 <span className="ml-[4px] font-bold text-cream">0원</span>
          </div>
          <div className="ml-[12px] text-[16px] font-bold text-cream">
            총 결제 금액 :{" "}
            <span className="text-[20px] text-black text-terracotta-400">
              17,889원
            </span>
          </div>
        </div>

        <div className="flex justify-center gap-[14px]">
          <button
            type="button"
            className="cursor-pointer border border-navy-600 bg-transparent px-[40px] py-[16px] text-[14px] font-bold text-cream transition-colors hover:border-terracotta-400 hover:text-terracotta-400"
            onClick={() => navigate("/")}
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
