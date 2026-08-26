import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function MainBanner() {
  const bannerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

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

  return (
    <section
      ref={bannerRef}
      className="w-full bg-navy-950 overflow-hidden"
      aria-label="메인 프로모션 배너"
    >
      <div className="mx-auto flex w-full max-w-[1400px] flex-col items-center justify-between px-[20px] md:flex-row md:px-[80px] py-[40px] md:py-[80px]">
        {/* 배너 좌측 텍스트 영역 */}
        <div className="flex w-full flex-col items-center text-center gap-[20px] py-[20px] md:w-auto md:flex-1 md:items-start md:text-left md:py-[40px] overflow-hidden">
          <div className="overflow-hidden">
            <span className="gsap-title-line inline-block text-[12px] tracking-[0.3em] text-cream/50 uppercase font-light">
              Objet & B Editorial
            </span>
          </div>

          <h2 className="font-serif text-[1.9rem] sm:text-[2.2rem] md:text-[3.4rem] font-light italic leading-[1.1] text-cream tracking-tight">
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

        {/* 우측 이미지 영역 (패럴랙스 적용) */}
        <div className="flex w-full items-center justify-center mt-[30px] md:mt-0 md:w-auto md:flex-[1.8] md:justify-end overflow-hidden">
          <Link
            to="/products"
            aria-label="미니멀리스트 컬렉션 룸 뷰 상품 리스트로 이동하기"
            className="w-full max-w-[480px] md:max-w-none group"
          >
            <img
              ref={imgRef}
              src="/images/main-banner.svg"
              alt="Minimalist Collection Room View"
              className="banner-image block h-auto max-h-[60vh] w-full object-contain transition-transform duration-700"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
