import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BestReview from "./components/BestReview";
import CustomerBanner from "./components/CustomerBanner";
import IntroOverlay from "./components/IntroOverlay";
import MainBanner from "./components/MainBanner";
import ProductList from "./components/ProductList";
import QuickNav from "./components/QuickNav";

gsap.registerPlugin(ScrollTrigger);

export default function MainPage() {
  const [showIntro, setShowIntro] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showIntro) return;

    const ctx = gsap.context(() => {
      // 모든 하위 섹션들에 스크롤 트리거 적용 (부드럽게 밀려 올라오며 등장)
      const sections = gsap.utils.toArray<HTMLElement>(".gsap-reveal-section");

      sections.forEach((section) => {
        gsap.fromTo(
          section,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          },
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, [showIntro]);

  return (
    <main
      ref={containerRef}
      className="relative bg-navy-950 text-cream min-h-screen overflow-hidden"
    >
      {/* 1. 첫 진입 시 풀스크린 오프닝 인트로 */}
      {showIntro && <IntroOverlay onComplete={() => setShowIntro(false)} />}

      {/* 2. 에디토리얼 모션이 적용된 메인 섹션들 */}
      <div className="gsap-reveal-section">
        <MainBanner />
      </div>

      <div className="gsap-reveal-section">
        <QuickNav />
      </div>

      <div className="gsap-reveal-section">
        <ProductList />
      </div>

      <div className="gsap-reveal-section">
        <CustomerBanner />
      </div>

      <div className="gsap-reveal-section">
        <BestReview />
      </div>
    </main>
  );
}
