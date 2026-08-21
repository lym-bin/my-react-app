export default function MainBanner() {
  return (
    <section className="w-full bg-[#f5f5f5]" aria-label="메인 프로모션 배너">
      {/* 반응형 패딩 적용: 모바일(20px) -> 태블릿이상(80px) */}
      <div className="mx-auto flex w-full max-w-[1400px] flex-col items-center justify-between px-[20px] md:flex-row md:px-[80px]">
        {/* 배너 좌측 텍스트 영역 */}
        <div className="flex flex-1 flex-col gap-[20px] py-[40px] md:py-[60px]">
          <h2 className="text-[1.8rem] font-bold italic leading-[1.2] md:text-[2rem]">
            / Minimallist <br />
            COLLECTION
          </h2>
          <p className="max-w-[300px] text-[0.9rem] leading-[1.6] text-[#666]">
            뷰니크가 트렌드의 무게 제어는 현대적인 명암의 대비와 완벽한 조화를
            선사합니다. 정교한 가죽 질감과 미니멀한 실루엣의 가치를 만나보세요.
          </p>
          <button
            type="button"
            className="self-start border border-black bg-transparent px-[30px] py-[10px] font-bold cursor-pointer transition-colors hover:bg-black hover:text-white"
            aria-label="미니멀리스트 컬렉션 상품 115달러에 구매하기"
          >
            BUY $115
          </button>
        </div>

        {/* 우측 이미지 영역 */}
        <div className="flex w-full flex-[2] items-center justify-center md:justify-end">
          <a
            href="/products"
            aria-label="미니멀리스트 컬렉션 룸 뷰 상품 리스트로 이동하기"
            className="w-full"
          >
            <img
              src="/images/main-banner.svg"
              alt="Miniamlist Collection Room View"
              className="block h-auto w-full object-contain"
            />
          </a>
        </div>
      </div>
    </section>
  );
}
