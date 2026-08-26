import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface CustomerSlide {
  id: number;
  img: string;
  title: string;
  desc: string;
  reverse?: boolean;
}

const SLIDES: CustomerSlide[] = [
  {
    id: 1,
    img: "/images/Model_1.jpg",
    title: "Minimalist & Sophisticated",
    desc: "Elevate your everyday, redefined by design. Timeless pieces for modern life.",
  },
  {
    id: 2,
    img: "/images/model_2.jpg",
    title: "Crafted to Last",
    desc: "Quiet luxury in every stitch and seam — objects made to be lived with.",
    reverse: true,
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
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [isPaused]);

  const goTo = (index: number) => {
    setCurrent((index + SLIDES.length) % SLIDES.length);
  };

  return (
    <section
      className="relative overflow-hidden bg-navy-900"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {SLIDES.map((slide) => (
          <div
            key={slide.id}
            className="w-full flex-shrink-0 py-[36px] sm:py-[50px]"
          >
            <div
              className={`mx-auto flex max-w-[1200px] flex-col items-center gap-[24px] px-[20px] md:flex-row md:items-center md:justify-between md:gap-0 ${
                slide.reverse ? "md:flex-row-reverse" : "md:flex-row"
              }`}
            >
              {/* 텍스트 컨텐츠 영역 */}
              <div className="flex w-full flex-col items-center gap-[14px] text-center md:w-1/2 md:items-start md:gap-[20px] md:text-left">
                <h2 className="text-[1.5rem] font-bold italic leading-[1.2] text-cream sm:text-[2rem]">
                  {slide.title}
                </h2>
                <p className="max-w-[300px] text-[0.85rem] leading-[1.6] text-cream/70 sm:text-[0.9rem]">
                  {slide.desc}
                </p>
              </div>

              {/* 이미지 영역 */}
              <div className="flex w-full justify-center md:w-1/2">
                <Link
                  to="/products"
                  className="block overflow-hidden rounded-lg"
                >
                  <img
                    src={slide.img}
                    alt={slide.title}
                    className="w-full max-w-[400px] object-cover"
                  />
                </Link>
              </div>
            </div>
          </div>
        ))}
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

      {/* 하단 점 인디케이터 */}
      <div className="absolute bottom-[14px] left-1/2 flex -translate-x-1/2 gap-[8px]">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.id}
            type="button"
            aria-label={`${i + 1}번 슬라이드로 이동`}
            onClick={() => goTo(i)}
            className={`h-[8px] w-[8px] cursor-pointer rounded-full transition-colors ${
              i === current ? "bg-terracotta-500" : "bg-cream/30"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
