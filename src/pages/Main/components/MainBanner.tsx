import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function MainBanner() {
  const bannerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const imageLinkRef = useRef<HTMLAnchorElement>(null);
  const viewBadgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. 타이틀 텍스트 한 줄씩 위로 솟아오르는 애니메이션
      gsap.from(".gsap-title-line", {
        y: 60,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: "power3.out",
      });

      // 2. 우측 룸 뷰 이미지 스크롤 연동 패럴랙스 & 스케일 줌인
      const st = gsap.to(".banner-image", {
        scale: 1.06,
        yPercent: 5,
        ease: "none",
        scrollTrigger: {
          trigger: bannerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
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
      className="w-full bg-navy-950 overflow-hidden"
      aria-label="메인 프로모션 배너"
    >
      {/* 배경 대형 워터마크 타이포 (장식용, 스크린리더에서 옮김*/}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 z-0 -translate-x-1/2 -translate-y-1/2 text-[7rem] font-black tracking-tighter whitespace-nowrap text-cream/[0.04] select-none sm:text-[10rem] md:text-[14rem]"
      >
        OBJET
      </span>
      <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-col items-center justify-center overflow-hidden px-[20px] py-[40px] md:flex-row md:px-[80px] md:py-[80px]">
        {/* 배너 좌측 텍스트 영역 */}
        <div className="flex w-full flex-col items-center gap-[20px] overflow-hidden py-[20px] text-center md:w-auto md:flex-1 md:items-start md:py-[40px] md:text-left">
          <div className="overflow-hidden">
            <span className="gsap-title-line inline-block text-[12px] tracking-[0.3em] text-cream/50 uppercase font-light">
              Objet & B Editorial
            </span>
          </div>

          <h2 className="font-serif text-[1.9rem] font-light italic leading-[1.1] tracking-tight text-cream sm:text-[2.2rem] md:text-[3.4rem]">
            <div className="overflow-hidden pb-1">
              <span className="gsap-title-line inline-block">/ Minimalist</span>
            </div>
            <div className="overflow-hidden pb-1">
              <span className="gsap-title-line inline-block not-italic font-normal">
                COLLECTION
              </span>
            </div>
          </h2>

          <div className="overflow-hidden">
            <p className="gsap-title-line mx-auto max-w-[340px] text-[0.95rem] leading-[1.6] text-cream/70 font-light tracking-wide [word-break:keep-all] md:mx-0">
              Objet & B가 제안하는 미니멀 컬렉션. 절제된 실루엣과 정교한
              디테일로 완성한, 오브제처럼 오래 곁에 두고 싶은 옷을 만나보세요.
            </p>
          </div>

          <div className="overflow-hidden pt-[10px]">
            <div className="gsap-title-line">
              <Link
                to="/products/1"
                className="group relative inline-flex items-center justify-center border border-cream/30 bg-transparent px-[32px] py-[13px] text-[13px] tracking-[0.2em] text-cream uppercase transition-all duration-300 hover:border-cream hover:bg-cream hover:text-navy-950"
              >
                <span>BUY $115</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 우측 이미지 영역 (패럴랙스 + 호버 확대 + 커서 추적 VIEW 라벨) */}
        <div className="mt-[30px] flex w-full items-center justify-center overflow-hidden md:mt-0 md:w-auto md:flex[1.8] md:justify-end">
          <Link
            to="/products"
            aria-label="미니멀리스트 컬렉션 룸 뷰 상품 리스트로 이동하기"
            className="group relative w-full max-w[480px] md:max-w-none"
          >
            <img
              ref={imgRef}
              src="/images/main-banner.svg"
              alt="Minimalist Collection Room View"
              className="banner-image block h-auto max-h-[60vh] w-full object-contain transition-transform duration-700 group-hover:scale-[1.04]"
            />

            {/* 커서를 따라다니는 VIEW 라벨 (데스크톱 전용)*/}
            <div
              ref={viewBadgeRef}
              aria-hidden="true"
              className="pointer-events-none absolute top-0 left-0 hidden h-[64px] w-[64px] -translate-x-1/2 -translate-y-1/2 scale-75 items-center justify-center rounded-full bg-terracotta-500 text-[11px] font-bold tracking-[0.15em] text-navy-950 uppercase opacity-0 md:flex"
            ></div>
          </Link>
        </div>
      </div>
    </section>
  );
}
