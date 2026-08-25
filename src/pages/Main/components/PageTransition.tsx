import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useLocation } from "react-router-dom";

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // 1. 페이지 진입 시 커튼(어두운 오버레이)이 아래로 밀려나며 사라짐
      tl.set(curtainRef.current, { yPercent: 0, display: "block" })
        .fromTo(
          containerRef.current,
          { opacity: 0, scale: 0.98 },
          { opacity: 1, scale: 1, duration: 0.6, ease: "power2.out" },
        )
        .to(curtainRef.current, {
          yPercent: -100,
          duration: 0.7,
          ease: "power4.inOut",
          onComplete: () => {
            if (curtainRef.current) {
              curtainRef.current.style.display = "none";
            }
          },
        });
    }, containerRef);

    return () => ctx.revert();
  }, [location.pathname]);

  return (
    <div className="relative overflow-hidden">
      {/* 페이지 전환 시 잠시 화면을 가려주는 하이엔드 네이비 커튼 오버레이 */}
      <div
        ref={curtainRef}
        className="fixed inset-0 z-[9999] bg-[#0b0f19] pointer-events-none"
        style={{ display: "none" }}
      />
      {/* 콘텐츠 래퍼 */}
      <div ref={containerRef}>{children}</div>
    </div>
  );
}
