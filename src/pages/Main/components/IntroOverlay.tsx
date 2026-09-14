// src/pages/Main/components/IntroOverlay.tsx
// 첫 진입시 뜨는 풀 스크린 인트로
import { useEffect, useRef } from "react";
import gsap from "gsap";

interface IntroOverlayProps {
  onComplete: () => void; // 인트로 끝났을 때 부모(MainPage)한테 알리는 콜백
}

export default function IntroOverlay({ onComplete }: IntroOverlayProps) {
  const introRef = useRef<HTMLDivElement>(null); // 전체 오버레이 (검은 배경 전체)
  const textRef = useRef<HTMLDivElement>(null); // 그 안의 텍스트 블록만 (따로 애니메이션)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        // timeline : 애니메이션들을 순서대로 이어 붙이는 "타임라인" 하나 생성
        // onComplete : 이 타입라인 전체(모든 단계)가 다 끝났을 때 실행 되는 콜백
        onComplete: () => {
          onComplete(); // GSAP 타임라인의 onComplete안에서 -> 우리 컴포넌트가 받은 onComplete prop 호출
        },
      });

      // .set()과 .to()를 체이닝(.)으로 계속 이어 붙이면, 순서대로 하나씩 실행됨
      tl.set(introRef.current, { opacity: 1 }) // .set = 애니메이션 없이 즉시 그 상태로 (시작점 세팅)
        .set(textRef.current, { opacity: 0, y: 30 }) // 텍스틑 투명 + 30px 아래에서 시작

        // 1단계: 텍스트가 서서히 부드럽게 떠오름 (Fade In)
        .to(textRef.current, {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
        })

        // 2단계: 잠시 머무름 (opacity를 그대로 1로 시선 집중, 3초 유지)
        .to(textRef.current, {
          opacity: 1,
          duration: 3,
        })

        // 3단계: 전체 화면 오버레이가 서서히 어두워지며 사라짐 -> 이게 끝나면 위 onComplete 실행 됨(Fade Out)
        .to(introRef.current, {
          opacity: 0,
          duration: 1,
          ease: "power2.inOut",
        });
    }, introRef);

    // onComplete가 dependency 배열에 없다고 ESLint가 경고하는데, 의도적으로 무시함
    // 이 state는 "마운트 시 딱 한 번만" 실행하고 싶어서 빈 배열을 []을 씀
    // esLint-disable-next-line rect-hooks/exhaustive-deps
  }, []); // 빈 배열: 컴포넌트가 처음 나타날 때 딱 한 번만 실행

  return (
    <div
      ref={introRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-navy-950 text-cream"
    >
      <div
        ref={textRef}
        className="flex flex-col items-center px-[20px] text-center"
      >
        {/* 상단 에디토리얼 태그 */}
        <span className="mb-[16px] text-[10px] font-light tracking-[0.25em] text-cream/40 uppercase sm:text-[12px] sm:tracking-[0.4em]">
          Objet & B Editorial Opening
        </span>

        {/* 메인 브랜드 타이틀 (이탈릭 세리프 무드) */}
        <h1 className="font-serif text-[2.2rem] font-light italic tracking-tight text-cream sm:text-[2.8rem] md:text-[5rem]">
          OBJET & B
        </h1>

        <p className="mt-[16px] text-[12px] font-light tracking-[0.15em] text-cream/60 sm:text-[13px] sm:tracking-[0.2em] md:text-[15px]">
          Quiet luxury in every stitch and seam
        </p>
      </div>
    </div>
  );
}
