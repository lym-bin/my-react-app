// src/pages/Main/components/IntroOverlay.tsx
// 첫 진입시 뜨는 풀 스크린 인트로
// 마운트 시 한 번만 timeline 실행
// -> 히어로 모델 얼굴이 짧게 플래시처럼 밝아졌다가 은은한 배경으로 가라앉고
// -> 그 위로 텍스트(에디토리얼 태그 -> 브랜드 타이틀 -> 서브카피)가 순서대로 등장
// -> 잠시 유지 -> 전체 페이드아웃 -> 부모에게 onComplete로 알림
// MainPage가 그 신호를 showIntro를 false로 바꿔 스크롤 애니메이션 단계로 넘어감
import { useEffect, useRef } from "react";
import gsap from "gsap";

interface IntroOverlayProps {
  onComplete: () => void; // 인트로 끝났을 때 부모(MainPage)한테 알리는 콜백
}

export default function IntroOverlay({ onComplete }: IntroOverlayProps) {
  const introRef = useRef<HTMLDivElement>(null); // 전체 오버레이 (검은 배경 전체)
  const imgRef = useRef<HTMLImageElement>(null); // 히어로 모델 얼굴 플래시 이미지
  const textRef = useRef<HTMLDivElement>(null); // 텍스트 블록 전체

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          onComplete(); // GSAP 타임라인 전체가 끝나면 부모 콜백 호출
        },
      });

      tl.set(introRef.current, { opacity: 1 })
        .set(imgRef.current, { opacity: 0, scale: 1.08 })
        .set(".intro-line", { opacity: 0, y: 20 })

        // 1단계: 모델 얼굴이 짧게 밝게 플래시
        .to(imgRef.current, {
          opacity: 0.85,
          scale: 1.02,
          duration: 0.65,
          ease: "power2.out",
        })
        // 2단계: 은은한 배경 톤으로 가라앉음
        .to(imgRef.current, {
          opacity: 0.22,
          scale: 1,
          duration: 1.15,
          ease: "power2.inOut",
        })

        // 3단계: 텍스트가 순서대로 떠오름 (모델이 가라앉는 타이밍과 겹치게 절대 시간으로 배치)
        .to(
          ".intro-eyebrow",
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
          0.85,
        )
        .to(
          ".intro-title",
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
          1.0,
        )
        .to(
          ".intro-sub",
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
          1.25,
        )

        // 4단계: 잠시 유지
        .to({}, { duration: 1.8 })

        // 5단계: 전체 화면 오버레이가 서서히 어두워지며 사라짐
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
      {/* 히어로 모델 얼굴 플래시 (배경) */}
      <img
        ref={imgRef}
        src="/images/intro-hero-face.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-[center_30%]"
      />

      <div
        ref={textRef}
        className="relative z-10 flex flex-col items-center px-[20px] text-center"
      >
        {/* 상단 에디토리얼 태그 */}
        <span className="intro-line intro-eyebrow mb-[16px] text-[10px] font-light tracking-[0.25em] text-cream/40 uppercase sm:text-[12px] sm:tracking-[0.4em]">
          Objet & B Editorial Opening
        </span>

        {/* 메인 브랜드 타이틀 (차분한 이탤릭 세리프, 이 화면 전용) */}
        <h1
          className="intro-line intro-title text-[2.4rem] font-semibold tracking-tight text-cream italic sm:text-[3.4rem] md:text-[5.5rem]"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          OBJET & B
        </h1>

        <p className="intro-line intro-sub mt-[16px] text-[12px] font-light tracking-[0.15em] text-cream/60 sm:text-[13px] sm:tracking-[0.2em] md:text-[15px]">
          Quiet luxury in every stitch and seam
        </p>
      </div>
    </div>
  );
}
