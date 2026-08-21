import { Link } from "react-router-dom";

export default function MainBanner() {
  return (
    <section className="w-full bg-navy-950" aria-label="메인 프로모션 배너">
      {/* 반응형 패딩 적용: 모바일(20px) -> 태블릿이상(80px) */}
      <div className="mx-auto flex w-full max-w-[1400px] flex-col items-center justify-between px-[20px] md:flex-row md:px-[80px]">
        {/* 배너 좌측 텍스트 영역 */}
        <div className="flex flex-1 flex-col gap-[20px] py-[40px] md:py-[60px]">
          <h2 className="text-[1.8rem] font-bold italic leading-[1.2] text-cream md:text-[2rem]">
            / Minimalist <br />
            COLLECTION
          </h2>
          <p className="max-w-[300px] text-[0.9rem] leading-[1.6] text-cream/70">
            Objet & B가 제안하는 미니멀 컬렉션. 절제된 실루엣과 정교한 디테일로
            완성한, 오브제처럼 오래 곁에 두고 싶은 옷을 만나보세요.
          </p>
          <button
            type="button"
            className="cursor-pointer self-start border border-terracotta-500 bg-transparent px-[30px] py-[10px] font-bold text-terracotta-500 transition-colors hover:bg-terracotta-500 hover:text-navy-950"
            aria-label="미니멀리스트 컬렉션 상품 115달러에 구매하기"
          >
            BUY $115
          </button>
        </div>

        {/* 우측 이미지 영역 */}
        <div className="flex w-full flex-[2] items-center justify-center md:justify-end">
          <Link
            to="/products"
            aria-label="미니멀리스트 컬렉션 룸 뷰 상품 리스트로 이동하기"
            className="w-full"
          >
            <img
              src="/images/main-banner.svg"
              alt="Minimalist Collection Room View"
              className="block h-auto w-full object-contain"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
