import { useEffect, useRef } from "react";
import gsap from "gsap";

interface IntroOverlayProps {
  onComplete: () => void; // 인트로가 끝난 뒤 메인 페이지가 보이도록 상태를 바꿔주는 함수
}

export default function IntroOverlay({ onComplete }: IntroOverlayProps) {
  const introRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          onComplete(); // 애니메이션 종료 시 실행
        },
      });

      // 초기 상태: 투명도 0, 살짝 아래에 위치
      tl.set(introRef.current, { opacity: 1 })
        .set(textRef.current, { opacity: 0, y: 30 })

        // 1단계: 텍스트가 부드럽게 떠오름 (Fade In)
        .to(textRef.current, {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
        })

        // 2단계: 잠시 머무름 (시선 집중, 3초 유지)
        .to(textRef.current, {
          opacity: 1,
          duration: 3,
        })

        // 3단계: 전체 화면 오버레이가 서서히 어두워지며 사라짐 (Fade Out)
        .to(introRef.current, {
          opacity: 0,
          duration: 1,
          ease: "power2.inOut",
        });
    }, introRef);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
