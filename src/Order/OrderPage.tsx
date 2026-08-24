import { useState } from "react";
import { useNavigate } from "react-router-dom";

const pmMethods = [
  { id: "pm-toss", value: "toss", label: "토스페이" },
  { id: "pm-kakao", value: "kakao", label: "카카오페이" },
  { id: "pm-naver", value: "naver", label: "네이버페이" },
  { id: "pm-order", value: "order", label: "기타결제" },
];

export default function OrderPage() {
  const [selectedpm, setSelectedpm] = useState("toss");
  const navigate = useNavigate();

  const handleSubmitOrder = () => {
    navigate("/ordersuccess");
  };

  return (
    <main className="mx-auto flex w-full max-w-[1200px] gap-[40px] bg-navy-950 px-[20px] py-[40px]">
      <div className="flex flex-1 flex-col gap-[40px]">
        {/* 배송 정보 */}
        <section className="border-b border-navy-700 pb-[30px]">
          <h2 className="mb-[20px] text-cream">배송 정보</h2>
          <div className="mb-[10px] flex items-center gap-[20px]">
            <strong className="text-cream">홍길동</strong>
            <span className="rounded-[4px] bg-navy-800 px-[4px] py-[2px] text-[14px] text-cream/70">
              기본 배송지
            </span>
            <button
              type="button"
              className="ml-auto cursor-pointer border border-navy-600 bg-transparent px-[12px] py-[6px] text-cream/80 transition-colors hover:border-terracotta-400 hover:text-terracotta-400"
            >
              배송지 변경
            </button>
          </div>
          <address className="not-italic leading-[1.7] text-cream/70">
            <p>경기도 수원시 팔달구 123</p>
            <p>010-1234-1234</p>
          </address>
          <div className="mt-[14px]">
            <label htmlFor="dev-message" className="sr-only">
              배송 메시지 입력
            </label>
            <input
              type="text"
              id="dev-message"
              name="message"
              placeholder="배송 메시지를 입력해주세요."
              className="w-full border border-navy-600 bg-navy-900 p-[6px] text-cream placeholder:text-cream/40"
            />
            <div className="mt-[10px] flex items-center gap-[8px]">
              <input
                type="checkbox"
                id="email-alert"
                name="alert"
                value="email"
                className="accent-terracotta-500"
              />
              <label htmlFor="email-alert" className="text-cream/80">
                배송 알림, 이벤트 소식 이메일로 받기
              </label>
            </div>
          </div>
        </section>

        {/* 주문 상품 */}
        <section className="border-b border-navy-700 pb-[30px]">
          <h2 className="mb-[20px]" text-cream>
            주문 상품
          </h2>
          <div className="flex justify-start gap-[20px]">
            <div>
              <img
                src="/images/modalgrid_1.jpg"
                alt="블랙 데님 와이드 스트레이트 진"
                className="mb-[10px] h-[150px] w-[150px] bg-navy-800 object-cover"
              />
            </div>
            <div className="flex flex-col gap-[20px]">
              <h3 className="text-cream">블랙 데님 와이드 스트레이트 진</h3>
              <ul className="m-0 p-0 text-[14px] text-cream/60">
                <li className="inline-block after:mx-[6px] after:text-navy-600 after:content-['|'] last:after:content-none">
                  색상: Black
                </li>
                <li className="inline-block after:mx-[6px] after:text-navy-600 after:content-['|'] last:after:content-none">
                  사이즈: M
                </li>
                <li className="inline-block after:mx-[6px] after:text-navy-600 after:content-['|'] last:after:content-none">
                  수량: 1개
                </li>
              </ul>
              <strong className="text-cream">129,000원</strong>
              <div>
                <button
                  type="button"
                  className="cursor-pointer border border-navy-600 bg-transparent px-[12px] py-[6px] text-cream/80 transition-colors hover:border-terracotta-400 hover:text-terracotta-400"
                >
                  쿠폰 사용
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 결제 수단 */}
        <section className="border-b border-navy-700 pb-[30px]">
          <h2 className="mb-[20px] text-cream">결제 수단</h2>
          <div>
            <ul className="mb-[16px] flex gap-[20px]">
              {pmMethods.map((method) => (
                <li key={method.id} className="flex items-center gap-[10px]">
                  <input
                    type="radio"
                    id={method.id}
                    name="pm-method"
                    value={method.value}
                    checked={selectedpm === method.value}
                    onChange={() => setSelectedpm(method.value)}
                    className="accent-terracotta-500"
                  />
                  <label htmlFor={method.id} className="text-cream/60">
                    {method.label}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      {/* 결제 금액 패널 */}
      <aside className="flex w-[360px] flex-col gap-[20px] border border-navy-700 bg-navy-900 p-[20px]">
        <h2>결제 금액</h2>
        <div className="bg-navy-800 p-[14px]">
          <ul className="m-0 flex flex-col gap-[16px] p-0">
            <li className="flex justify-between text-cream/80">
              <span>상품 금액</span>
              <strong className="text-cream">129,000원</strong>
            </li>
            <li className="flex justify-between text-cream/80">
              <span>할인 금액</span>
              <strong className="text-danger">-111,111원</strong>
            </li>
            <li className="flex justify-between text-cream/80">
              <span>배송비</span>
              <strong className="text-cream">무료 배송</strong>
            </li>
            <li className="mt-[10px] flex items-end justify-between border-t border-dashed border-navy-600 pt-[16px]">
              <span className="text-[16px] font-bold text-cream">
                총 결제 금액
              </span>
              <strong className="text-[24px] font-bold text-cream">
                17,889원
              </strong>
            </li>
          </ul>
        </div>

        <button
          type="button"
          className="mt-[14px] cursor-pointer border-none bg-terracotta-500 py-[16px] text-[16px] font-bold text-navy-950 transition-colors duration-200 hover:bg-terracotta-600"
          onClick={handleSubmitOrder}
        >
          <strong>17,889원</strong> 결제하기
        </button>
      </aside>
    </main>
  );
}
