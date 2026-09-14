// src/pages/Main/MainPage.tsx
// 메인 화면 섹션 컴포넌트들을 순서대로 조립하고,
// 인트로 끝나면 GSAP으로 스크롤 리빌 애니메이션 거는 조립 파일
import { useEffect, useRef, useState } from "react";
import gsap from "gsap"; // 애니메이션 전문 라이브러리 (CSS transition 보다 복잡한 걸 코드로 제어)
import { ScrollTrigger } from "gsap/ScrollTrigger"; // GSAP의 "스크롤 위치에 따라 애니메이션 발동 플러그인"
import BestReview from "./components/BestReview";
import CustomerBanner from "./components/CustomerBanner";
import IntroOverlay from "./components/IntroOverlay";
import MainBanner from "./components/MainBanner";
import ProductList from "./components/ProductList";
import QuickNav from "./components/QuickNav";

// 플러그인 등록 : 파일이 처음 로드 일 때 딱 한번 실행 됨 (컴포넌트 박, import 직후)
// 컴포넌트 함수 안에 넣으면 렌더링마다 반복 등록 되니까 밖에 둠
gsap.registerPlugin(ScrollTrigger);

export default function MainPage() {
  const [showIntro, setShowIntro] = useState(true); // 인트로 애니메이션 보여줄지 여부
  const containerRef = useRef<HTMLDivElement>(null); // <main> 태그를 직접 갈리킴 ref

  useEffect(() => {
    if (showIntro) return; // 인트로가 아직 안 끝났으면 스크롤 애니메이션 설정 안함(조기 종료)

    // gsap.context: 이 안에서 만든 스크롤 애니메이션을 하나의 그룹으로 설정
    // containerRef를 두 번째 인자로 주면, 이 컨테이나 안에서만 셀렉터를 찾음 (범위 제한)
    const ctx = gsap.context(() => {
      // 모든 하위 섹션들에 스크롤 트리거 적용 (부드럽게 밀려 올라오며 등장)
      // .gsap-reveal-section 클래스 붙은 요소들을 전부 찾아서 진짜 배열로 변환
      // <HTMLElement> = 제네릭으로 "이 배열 안에 뭐가 들었는지" 타입 지정
      const sections = gsap.utils.toArray<HTMLElement>(".gsap-reveal-section");

      sections.forEach((section) => {
        // fromTo(대상, 시작상태, 끝상태): "이 상태에서 저 상태로 애니메이션 시켜라"
        gsap.fromTo(
          section,
          { opacity: 0, y: 50 }, // 시작: 투명하고 50px 아래에 있음
          {
            opacity: 1,
            y: 0, // 끝: 완전히 보이고 원래 위치
            duration: 1.1, // 1.1초 동안
            ease: "power3.out", // 감속 곡선(처음 빠르다가 느려짐)
            scrollTrigger: {
              trigger: section, // 이 요소를 기준으로 스크롤 감지
              start: "top 85%", // section의 top이 화면(뷰포트) 85% 지점에 닿으면 시작
              toggleActions: "play none none none", // 한 번 재생하고 끝(스크롤 되돌려도 리셋 안 함)
            },
          },
        );
      });
    }, containerRef); // gsap.context의 두 번째 인자: 이 ref 안에서만 셀렉터 검색

    // cleanup: 컴포넌트 사라지거나 showIntro 바뀔 때, 여기서 만든 애니메이션/트리거들 싹 되돌림
    // (안 하면 이전 애니메이션들이 안 지워지고 중복 쌓임)
    return () => ctx.revert();
  }, [showIntro]); // showIntro가 바뀔 떄(인트로 끝날 떄) 실행

  {
    /* ref로 이 <main> 요소를 위 gsap.context가 가리킬 수 있게 연결*/
  }
  return (
    <main
      ref={containerRef}
      className="relative bg-navy-950 text-cream min-h-screen overflow-hidden"
    >
      {/* 1. 첫 진입 시 풀스크린 오프닝 인트로 */}
      {/* showIntro가 true일 때만 인트로 화면 표시*/}
      {showIntro && <IntroOverlay onComplete={() => setShowIntro(false)} />}

      {/* 2. 에디토리얼 모션이 적용된 메인 섹션들 */}
      {/* gsap-reveal-section : Tailwind 클래스 아니라 순수하게 "GSAP이 찾을 표식으로 쓰는 클래스*/}
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
