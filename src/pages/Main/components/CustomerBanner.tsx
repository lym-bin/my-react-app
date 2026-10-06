// src/pages/Main/components/CustomerBanner.tsx
// 고객/브랜드 소개 슬라이드
// current state가 "지금 몇번째 슬라이드 인지를 기억" -> setInterval로 자동 증가
// 마우스 올리면 일시정지 -> 화살표/점 클릭은 직접 인덱스 지정 ->
// translateX로 슬라이드 띠 전체를 부드럽게 이동
// 1번 슬라이드는 img가 없음 -> 텍스트 전용 레이아웃으로 렌더링
// (원래 1번 사진(Model_1.jpg)에 타 브랜드 로고(YSL)가 찍혀있는 게 발견돼서 사진만 빼고 텍스트는 유지)
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";

gsap.registerPlugin(ScrollTrigger, TextPlugin);

interface CustomerSlide {
  id: number;
  img?: string; // 없으면 텍스트 전용 슬라이드
  title: string;
  desc: string;
}

const SLIDES: CustomerSlide[] = [
  {
    id: 1,
    title: "Fewer, Better Pieces",
    desc: "많은 옷보다, 좋은 옷. 오래 입을 몇 벌이면 충분합니다.",
  },
  {
    id: 2,
    img: "/images/model_2.jpg",
    title: "The Sweater You'll Reach For",
    desc: "여러 벌보다 한 벌. 질리지 않는 니트.",
  },
];

const AUTOPLAY_MS = 5000;

export default function CustomerBanner() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // 자동 재생 (마우스 올리면 일시정지)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, AUTOPLAY_MS); // 5초마다 이 콜백을 반복 실행
    return () => clearInterval(timer);
  }, [isPaused]);

  // 화살표/점 클릭
  const goTo = (index: number) => {
    setCurrent((index + SLIDES.length) % SLIDES.length);
  };

  const sectionRef = useRef<HTMLDivElement>(null);
  const [hasEntered, setHasEntered] = useState(false);

  // 섹션이 스크롤해서 처음 보이는 순간을 한 번만 감지
  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 80%",
        once: true,
        onEnter: () => setHasEntered(true),
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // 처음 보인 이후로는, 슬라이드가 바뀔 때마다 그 슬라이드의 제목/설명이 한 글자씩 타이핑됨
  useEffect(() => {
    if (!hasEntered) return;

    const activeId = SLIDES[current]!.id;
    const lines = gsap.utils.toArray<HTMLElement>(
      `.customer-banner-line[data-slide="${activeId}"]`,
    );
    const tl = gsap.timeline();

    lines.forEach((el, i) => {
      // 원문을 data-full-text에 한 번 저장해두고, 그 다음부턴 거기서만 읽음
      const fullText = el.dataset.fullText ?? el.textContent ?? "";
      el.dataset.fullText = fullText;

      gsap.set(el, { text: "" });
      tl.to(
        el,
        {
          text: fullText,
          duration: Math.max(0.9, fullText.length * 0.065),
          ease: "none",
        },
        i === 0 ? 0 : "-=0.2",
      );
    });

    return () => {
      tl.kill();
    };
  }, [current, hasEntered]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-navy-900"
      onMouseEnter={() => setIsPaused(true)} // 미우스로 일시 정지
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {SLIDES.map((slide) =>
          slide.img ? (
            // ===== 이미지 + 텍스트 슬라이드 =====
            <div
              key={slide.id}
              className="w-full flex-shrink-0 py-[36px] sm:py-[50px]"
            >
              <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-[24px] px-[20px] md:flex-row md:items-center md:justify-between md:gap-0">
                <div className="flex w-full flex-col items-center gap-[14px] text-center md:w-1/2 md:items-start md:gap-[20px] md:text-left">
                  <h2
                    className="customer-banner-line min-h-[58px] text-[1.5rem] font-bold leading-[1.2] text-cream sm:min-h-[78px] sm:text-[2rem]"
                    data-slide={slide.id}
                  >
                    {slide.title}
                  </h2>
                  <p
                    className="customer-banner-line min-h-[44px] max-w-[300px] text-[0.85rem] leading-[1.6] text-cream/70 break-keep sm:min-h-[46px] sm:text-[0.9rem]"
                    data-slide={slide.id}
                  >
                    {slide.desc}
                  </p>
                </div>

                <div className="flex w-full justify-center md:w-1/2">
                  <Link
                    to="/story"
                    className="group relative block overflow-hidden rounded-lg"
                  >
                    <img
                      src={slide.img}
                      alt={slide.title}
                      className="w-full max-w-[400px] object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                    <span className="absolute bottom-[14px] left-[14px] flex items-center gap-[6px] rounded-full border border-cream/25 bg-navy-950/60 px-[12px] py-[6px] text-[11px] tracking-[0.12em] text-cream uppercase backdrop-blur-sm transition-colors group-hover:border-terracotta-400 group-hover:text-terracotta-400">
                      브랜드 스토리 보기 →
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            // ===== 텍스트 전용 슬라이드 (사진 없음) =====
            <div
              key={slide.id}
              className="flex h-full w-full flex-shrink-0 items-center justify-center py-[60px] sm:py-[80px]"
            >
              <Link
                to="/story"
                className="group mx-auto flex max-w-[640px] flex-col items-center gap-[18px] px-[20px] text-center"
              >
                <h2
                  className="customer-banner-line min-h-[44px] text-[1.8rem] font-bold leading-[1.2] text-cream sm:min-h-[58px] sm:text-[2.4rem]"
                  data-slide={slide.id}
                >
                  {slide.title}
                </h2>
                <p
                  className="customer-banner-line min-h-[50px] max-w-[380px] text-[0.9rem] leading-[1.7] text-cream/70 break-keep sm:text-[1rem]"
                  data-slide={slide.id}
                >
                  {slide.desc}
                </p>
                <span className="mt-[6px] inline-flex items-center gap-[6px] rounded-full border border-cream/25 px-[14px] py-[7px] text-[11px] tracking-[0.12em] text-cream/70 uppercase transition-colors group-hover:border-terracotta-400 group-hover:text-terracotta-400">
                  브랜드 스토리 보기 →
                </span>
              </Link>
            </div>
          ),
        )}
      </div>

      {/* 좌우 화살표 */}
      <button
        type="button"
        aria-label="이전 슬라이드"
        onClick={() => goTo(current - 1)}
        className="absolute top-1/2 left-[12px] -translate-y-1/2 cursor-pointer rounded-full border border-navy-600 bg-navy-950/60 px-[10px] py-[6px] text-cream/70 transition-colors hover:border-terracotta-400 hover:text-terracotta-400 sm:left-[24px]"
      >
        ‹
      </button>
      <button
        type="button"
        aria-label="다음 슬라이드"
        onClick={() => goTo(current + 1)}
        className="absolute top-1/2 right-[12px] -translate-y-1/2 cursor-pointer rounded-full border border-navy-600 bg-navy-950/60 px-[10px] py-[6px] text-cream/70 transition-colors hover:border-terracotta-400 hover:text-terracotta-400 sm:right-[24px]"
      >
        ›
      </button>

      {/* 하단 진행바 인디케이터 */}
      <div className="absolute bottom-[14px] left-1/2 flex -translate-x-1/2 gap-[6px]">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.id}
            type="button"
            aria-label={`${i + 1}번 슬라이드로 이동`}
            onClick={() => goTo(i)}
            className="h-[3px] w-[36px] cursor-pointer overflow-hidden rounded-full bg-cream/25"
          >
            {i === current && (
              <div
                key={current} // current가 바뀔 때마다 새로 마운트돼서 0%부터 다시 채워짐
                className="h-full bg-terracotta-500"
                style={{
                  animation: `customer-banner-fill ${AUTOPLAY_MS}ms linear forwards`,
                  animationPlayState: isPaused ? "paused" : "running",
                }}
              />
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
