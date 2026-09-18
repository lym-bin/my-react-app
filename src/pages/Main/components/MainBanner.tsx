// src/pages/Main/componets/MainBanner.tsx
// 상단 큰 배너
// 마운트 시 타이틀 줄들을 STAGGER로 순차 등장 -> 배경 이미지에 스크롤 연동 패럴렉스 설정
// 별도 effect로 마우스 움직이에 반응하는 뱃지 추적 -> 언마운트시 각각 정리
import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

//
export default function MainBanner() {
  const bannerRef = useRef<HTMLDivElement>(null); // 섹션 전체 (scrollTrigger 범위+trigger)
  const imgRef = useRef<HTMLImageElement>(null); // 이미지 (로드 완료 감지용)
  const imageLinkRef = useRef<HTMLAnchorElement>(null); // Link(마우스 이벤트 리스너 달 대상)
  const viewBadgeRef = useRef<HTMLDivElement>(null); // VIEW 뱃지(직접 움직일 대상)

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

  // 3. 커서를 따라다니는 "VIEW" 라벨 (데스크톱 전용, GSAP quickTo로 부드럽게 추적)
  useEffect(() => {
    const link = imageLinkRef.current;
    const badge = viewBadgeRef.current;
    if (!link || !badge) return;

    // 커서를 따라다니느 VIEW 뱃지
    const xTo = gsap.quickTo(badge, "x", { duration: 0.35, ease: "power3" });
    const yTo = gsap.quickTo(badge, "y", { duration: 0.35, ease: "power3" });

    function handleMove(e: MouseEvent) {
      const rect = link!.getBoundingClientRect();
      xTo(e.clientX - rect.left);
      yTo(e.clientY - rect.top);
    }

    function handleEnter() {
      gsap.to(badge, { opacity: 1, scale: 1, duration: 0.25 });
    }

    function handleLeave() {
      gsap.to(badge, { opacity: 0, scale: 0.7, duration: 0.25 });
    }

    link.addEventListener("mousemove", handleMove);
    link.addEventListener("mouseenter", handleEnter);
    link.addEventListener("mouseleave", handleLeave);

    return () => {
      link.removeEventListener("mousemove", handleMove);
      link.removeEventListener("mouseenter", handleEnter);
      link.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <section
      ref={bannerRef}
      className="relative w-full overflow-hidden bg-navy-950 md:min-h-[640px]"
      aria-label="메인 프로모션 배너"
    >
      {/* 배경 이미지: 데스크톱 전용, 섹션 전체(위아래양옆)를 여백 없이 꽉 채움 */}
      <Link
        ref={imageLinkRef}
        to="/products"
        aria-label="미니멀리스트 컬렉션 룸 뷰 상품 리스트로 이동하기"
        className="group absolute inset-0 hidden md:block"
      >
        <img
          ref={imgRef}
          src="/images/main-banner.svg"
          alt="Minimalist Collection Room View"
          className="banner-image absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        {/* 왼쪽 텍스트 가독성을 위한 그라데이션 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/90 via-navy-950/50 to-navy-950/10" />

        {/* 커서를 따라다니는 VIEW 라벨 */}
        <div
          ref={viewBadgeRef}
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-0 flex h-[64px] w-[64px] -translate-x-1/2 -translate-y-1/2 scale-75 items-center justify-center rounded-full bg-terracotta-500 text-[11px] font-bold tracking-[0.15em] text-navy-950 uppercase opacity-0"
        >
          View
        </div>
      </Link>

      {/* 모바일 전용 배경 워터마크 (이미지가 없을 때 장식용) */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 z-0 -translate-x-1/2 -translate-y-1/2 text-[7rem] font-black tracking-tighter whitespace-nowrap text-cream/[0.04] select-none md:hidden"
      >
        OBJET
      </span>

      {/* 텍스트 뒤 은은한 테라코타 글로우*/}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[5]"
        style={{
          background:
            "radial-gradient(55% 45% at 25% 45%, rgba(193,80,46,0.16), transparent 70%)",
        }}
      />

      {/* 텍스트 영역: 이미지 위에 오버레이 (데스크톱) / 단독 표시 (모바일) */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-col items-center gap-[20px] overflow-hidden px-[20px] py-[50px] text-center md:min-h-[640px] md:items-start md:justify-center md:px-[80px] md:py-0 md:text-left">
        <div className="overflow-hidden">
          <span className="gsap-title-line inline-block text-[12px] font-light tracking-[0.3em] text-cream/50 uppercase">
            Objet & B Editorial
          </span>
        </div>

        <h2 className="font-serif text-[1.9rem] font-light leading-[1.1] tracking-tight text-cream sm:text-[2.2rem] md:text-[3.4rem]">
          <div className="overflow-hidden pb-1">
            <span className="gsap-title-line inline-block">정교함의</span>
          </div>
          <div className="overflow-hidden pb-1">
            <span className="gsap-title-line inline-block">여백</span>
          </div>
        </h2>

        <div className="overflow-hidden">
          <p className="gsap-title-line mx-auto max-w-[340px] text-[0.95rem] leading-[1.6] font-light tracking-wide text-cream/70 [word-break:keep-all] md:mx-0">
            Objet & B가 제안하는 미니멀 컬렉션. 절제된 실루엣과 정교한 디테일로
            완성한, 오브제처럼 오래 곁에 두고 싶은 옷을 만나보세요.
          </p>
        </div>

        <div className="overflow-hidden pt-[10px]">
          <div className="gsap-title-line">
            <Link
              to="/products"
              className="md:hidden group relative inline-flex items-center justify-center border border-cream/30 bg-transparent px-[32px] py-[13px] text-[13px] tracking-[0.2em] text-cream uppercase transition-all duration-300 hover:border-cream hover:bg-cream hover:text-navy-950"
            >
              <span>BUY $115</span>
            </Link>
          </div>
        </div>
      </div>
      {/* 스크롤 유도 (데스크톱 전용)*/}
      <div
        aria-hidden="true"
        className="gsap-title-line pointer-events-none absolute inset-x-0 bottom-[10px] z-10 mx-auto hidden w-fit flex-col items-center gap-[10px] text-[10px] font-light tracking-[0.28em] text-cream/40 uppercase md:flex"
      >
        <span className="h-[30px] w-px animate-pulse bg-gradient-to-b from-terracotta-400 to-transparent" />
        Scroll
      </div>
    </section>
  );
}
