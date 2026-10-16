// src/pages/Main/componets/MainBanner.tsx
// 상단 큰 배너
// 마운트 시 타이틀 줄들을 STAGGER로 순차 등장 -> 배경 이미지에 스크롤 연동 패럴렉스 설정
// 별도 effect로 스크롤 위치를 감지해 "Scroll" 안내 숨김 -> 언마운트 시 정리
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

//
export default function MainBanner() {
  const bannerRef = useRef<HTMLDivElement>(null); // 섹션 전체 (scrollTrigger 범위+trigger)
  const imgRef = useRef<HTMLImageElement>(null); // 이미지 (로드 완료 감지용)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. 타이틀 텍스트 한 줄씩 위로 솟아오르는 애니메이션(stagger)
      gsap.from(".gsap-title-line", {
        y: 60,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15, // 각 요소가 0.15초씩 시간차를 두고 순서대로
        ease: "power3.out",
      });

      // 2. 배경 이미지 스크롤 연동 패럴랙스 & 스케일 줌인 (데스크톱)
      const st = gsap.to(".banner-image", {
        scale: 1.08,
        yPercent: 5,
        ease: "none",
        scrollTrigger: {
          trigger: bannerRef.current,
          start: "top bottom", // 배너의 top이 뷰포트의 bottom에 닿는 순간 = 시작
          end: "bottom top", // 배너의 bottom이 뷰포트의 top에 닿는 순간 = 끝
          scrub: true, // 애니메이션 진행도를 스크롤 위치에서 직접 연결
          invalidateOnRefresh: true, // 리사이즈/새로고침 시 값 재계산
        },
      });

      // 이미지 로드 완료 후 트리거 위치 재계산 (이미지 로드 전 높이로 잘못 계산되는 버그 방지)
      const img = imgRef.current;
      if (img && !img.complete) {
        img.addEventListener("load", () => ScrollTrigger.refresh());
      }

      return () => st.scrollTrigger?.kill();
    }, bannerRef);

    return () => ctx.revert();
  }, []);

  // 스크롤 유도 UI 숨김 여부 (일정 이상 스크롤하면 숨김)
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 80);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 스크롤 유도 버튼: 배너가 끝나는 지점까지 부드럽게 이동
  function handleScrollDown() {
    const banner = bannerRef.current;
    if (!banner) return;
    const bannerBottom = banner.getBoundingClientRect().bottom + window.scrollY;
    window.scrollTo({ top: bannerBottom, behavior: "smooth" });
  }

  return (
    <section
      ref={bannerRef}
      className="relative w-full overflow-hidden bg-navy-950 md:min-h-[640px]"
      aria-label="메인 프로모션 배너"
    >
      {/* 배경 이미지: 데스크톱 전용, 섹션 전체(위아래양옆)를 여백 없이 꽉 채움 */}
      <Link
        to="/products"
        aria-label="상품 목록으로 이동하기"
        className="group absolute inset-0 hidden md:block"
      >
        {/* 스크롤 패럴랙스(GSAP)는 바깥 div가, 호버 확대(CSS)는 img가 맡음 */}
        {/* 같은 요소의 transform을 둘이 같이 건드리면 서로 덮어써서 역할을 나눔 */}
        <div className="banner-image absolute inset-0">
          <img
            ref={imgRef}
            src="/images/main-banner.webp"
            alt="Minimalist Collection Room View"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        </div>
        {/* 상/하단에만 은은한 음영 */}
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/90 via-navy-950/50 to-navy-950/10" />
      </Link>

      {/* 모바일 전용 배경 워터마크 (이미지가 없을 때 장식용) */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 z-0 -translate-x-1/2 -translate-y-1/2 text-[7rem] font-black tracking-tighter whitespace-nowrap text-cream/[0.04] select-none md:hidden"
      >
        OBJET
      </span>

      {/* 텍스트 영역: 모바일 전용 (데스크톱은 배경 이미지 자체에 메시지가 있어서 생략) */}
      <div className="relative z-10 mx-auto flex w-full max-w-wide flex-col items-center gap-[20px] overflow-hidden px-[20px] py-[50px] text-center md:hidden">
        <div className="overflow-hidden">
          <span className="gsap-title-line inline-block text-12 font-light tracking-[0.3em] text-cream/50 uppercase">
            Objet & B Editorial
          </span>
        </div>

        <div className="overflow-hidden">
          <p className="gsap-title-line mx-auto max-w-[300px] text-[0.95rem] leading-[1.6] break-keep font-light tracking-wide text-cream/70 [word-break:keep-all] md:mx-0">
            유행이 아니라 오래 입을 옷을 만듭니다. 기본에 충실한 미니멀 컬렉션.
          </p>
        </div>

        <div className="overflow-hidden pt-[10px]">
          <div className="gsap-title-line">
            <Link
              to="/products"
              className="md:hidden group relative inline-flex items-center justify-center border border-cream/30 bg-transparent px-[32px] py-[13px] text-13 tracking-[0.2em] text-cream uppercase transition-all duration-300 hover:border-cream hover:bg-cream hover:text-navy-950"
            >
              <span>SHOP NOW</span>
            </Link>
          </div>
        </div>
      </div>
      {/* 스크롤 유도 버튼 (데스크톱 전용): 누르면 배너 바로 아래로 이동 */}
      <button
        type="button"
        onClick={handleScrollDown}
        aria-label="아래 섹션으로 스크롤"
        className={`group absolute bottom-[10px] left-1/2 z-10 hidden h-[44px] w-[44px] -translate-x-1/2 cursor-pointer place-items-center rounded-full border-[1.5px] border-terracotta-500 bg-navy-950/80 transition-[opacity,background-color] duration-300 hover:bg-terracotta-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream md:grid ${
          scrolled ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        {/* 주기적으로 퍼지는 테두리 */}
        <span
          aria-hidden="true"
          className="absolute -inset-[1.5px] rounded-full border-[1.5px] border-terracotta-500 motion-safe:animate-scroll-ripple"
        />
        {/* 마우스 모양 + 아래로 흐르는 점 */}
        <span
          aria-hidden="true"
          className="relative h-[20px] w-[12px] rounded-[9px] border-[1.5px] border-cream"
        >
          <span className="absolute top-[4px] left-1/2 -ml-[1.5px] h-[6px] w-[3px] rounded-[2px] bg-terracotta-400 group-hover:bg-cream motion-safe:animate-scroll-dot" />
        </span>
      </button>
    </section>
  );
}
