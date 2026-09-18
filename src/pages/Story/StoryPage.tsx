// src/pages/Story/StoryPage.tsx
// 브랜드 스토리 페이지: 히어로 타임라인 / 핀 스크롤 / 가로 스크롤 / 클로징 CTA 4가지 GSAP 기법 조립
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PIN_CAPTIONS = [
  {
    num: "01",
    title: "오버사이즈 실루엣",
    desc: "몸을 편안하게 감싸는 여유, 그 안에서 완성되는 절제.",
  },
  {
    num: "02",
    title: "미니멀 컬러 팔레트",
    desc: "톤온톤으로 쌓아 올리는 차분한 균형.",
  },
  {
    num: "03",
    title: "정교한 디테일",
    desc: "바느질 한 땀까지 신경 쓴 마감.",
  },
];

const LOOKS = [
  { id: 1, num: "01", title: "오버사이즈 셋업" },
  { id: 2, num: "02", title: "슬림 데님" },
  { id: 3, num: "03", title: "미니멀 니트" },
  { id: 4, num: "04", title: "테일러드 코트" },
  { id: 5, num: "05", title: "레더 스니커즈" },
];

export default function StoryPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. 히어로 타임라인 (IntroOverlay.tsx와 같은 패턴: set으로 숨긴 뒤 to로 순서대로 등장)
      const heroTl = gsap.timeline({ delay: 0.2 });
      heroTl
        .set(".story-hero-item", { opacity: 0, y: 24 })
        .to(".story-hero-eyebrow", {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
        })
        .to(
          ".story-hero-title",
          { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" },
          "-=0.4",
        )
        .to(
          ".story-hero-sub",
          { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
          "-=0.5",
        )
        .to(".story-hero-cue", { opacity: 1, y: 0, duration: 0.6 }, "-=0.3");

      // 2. 핀 스크롤: 이미지는 고정, 카피만 스크롤 진행률에 맞춰 전환
      const captions = gsap.utils.toArray<HTMLElement>(".story-pin-caption");
      gsap.set(captions, { opacity: 0 });
      if (captions[0]) gsap.set(captions[0], { opacity: 1 });

      ScrollTrigger.create({
        trigger: pinRef.current,
        start: "top top",
        end: "+=140%",
        pin: true,
        pinSpacing: true,
        onUpdate: (self) => {
          const idx = Math.min(
            captions.length - 1,
            Math.floor(self.progress * captions.length),
          );
          captions.forEach((cap, i) => {
            gsap.to(cap, {
              opacity: i === idx ? 1 : 0,
              duration: 0.3,
              overwrite: true,
            });
          });
        },
      });

      // 3. 가로 스크롤: 세로 스크롤량을 트랙의 가로 이동으로 변환
      const track = trackRef.current;
      if (track) {
        ScrollTrigger.create({
          trigger: horizontalRef.current,
          start: "top top",
          end: () => "+=" + Math.max(0, track.scrollWidth - window.innerWidth),
          pin: true,
          scrub: true,
          animation: gsap.to(track, {
            x: () => -Math.max(0, track.scrollWidth - window.innerWidth),
            ease: "none",
          }),
        });
      }

      // 4. 클로징 CTA: 스크롤 도달하면 페이드업 (MainPage.tsx의 gsap-reveal-section과 같은 원리)
      gsap.from(".story-cta-item", {
        opacity: 0,
        y: 30,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ctaRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
    }, containerRef);

    window.addEventListener("load", () => ScrollTrigger.refresh());

    return () => ctx.revert();
  }, []);

  return (
    <main ref={containerRef} className="overflow-hidden bg-navy-950 text-cream">
      {/* 1. 히어로 */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-[20px] text-center">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 50% 0%, rgba(193,80,46,0.12), transparent 60%)",
          }}
        />
        <div className="relative z-10 max-w-[640px]">
          <p className="story-hero-item story-hero-eyebrow mb-[16px] text-[11px] font-light uppercase tracking-[0.32em] text-cream/45">
            Objet & B Editorial
          </p>
          <h1 className="story-hero-item story-hero-title mb-[22px] font-serif text-[2.6rem] italic leading-[1.1] sm:text-[3.4rem] md:text-[4.4rem]">
            정교함의
            <br />
            여백
          </h1>
          <p className="story-hero-item story-hero-sub mx-auto mb-[40px] max-w-[420px] text-[15px] leading-[1.75] text-cream/68">
            절제된 실루엣과 정교한 디테일로 완성한
            <br />
            이번 시즌의 태도를 소개합니다.
          </p>
          <div className="story-hero-item story-hero-cue inline-flex flex-col items-center gap-[10px] text-[10.5px] uppercase tracking-[0.28em] text-cream/45">
            <span className="h-[34px] w-px bg-gradient-to-b from-terracotta-400 to-transparent" />
            Scroll
          </div>
        </div>
      </section>

      {/* 2. 핀 스크롤 */}
      <section
        ref={pinRef}
        className="flex min-h-screen flex-col items-center gap-[40px] border-t border-navy-800 px-[20px] py-[80px] md:flex-row md:justify-center md:gap-[6vw] md:py-0"
      >
        <div className="relative aspect-[3/4] w-full max-w-[420px] overflow-hidden rounded-[2px] bg-gradient-to-br from-navy-700 via-navy-900 to-navy-950">
          <span className="absolute bottom-[16px] left-[16px] rounded-full border border-cream/25 bg-navy-950/55 px-[10px] py-[5px] text-[10.5px] tracking-[0.2em] text-cream">
            LOOK 01
          </span>
        </div>
        <div className="relative min-h-[180px] w-full max-w-[380px] text-center md:text-left">
          {PIN_CAPTIONS.map((c) => (
            <div key={c.num} className="story-pin-caption absolute inset-0">
              <span className="mb-[10px] block font-serif text-[13px] italic text-terracotta-400">
                {c.num}
              </span>
              <h2 className="mb-[14px] font-serif text-[1.8rem] italic leading-[1.2] sm:text-[2.1rem]">
                {c.title}
              </h2>
              <p className="mx-auto max-w-[320px] text-[14px] leading-[1.75] text-cream/65 md:mx-0">
                {c.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. 가로 스크롤 */}
      <section
        ref={horizontalRef}
        className="flex min-h-screen flex-col justify-center gap-[32px] overflow-hidden border-t border-navy-800 bg-navy-900 py-[60px]"
      >
        <div className="text-center">
          <p className="mb-[8px] text-[11px] uppercase tracking-[0.3em] text-cream/45">
            SS26 Collection
          </p>
          <h2 className="font-serif text-[1.9rem] italic sm:text-[2.3rem]">
            다섯 개의 룩
          </h2>
        </div>
        <div className="overflow-hidden">
          <div ref={trackRef} className="flex gap-[22px] px-[20px]">
            {LOOKS.map((look) => (
              <div
                key={look.id}
                className="relative flex aspect-[3/4] w-[min(72vw,360px)] flex-shrink-0 flex-col justify-end rounded-[2px] border border-navy-700 bg-gradient-to-br from-navy-700 to-navy-950 p-[20px]"
              >
                <span className="absolute top-[18px] left-[20px] font-serif text-[13px] italic text-cream/55">
                  {look.num}
                </span>
                <h3 className="font-serif text-[1.3rem] italic">
                  {look.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. 클로징 CTA */}
      <section
        ref={ctaRef}
        className="flex min-h-screen flex-col items-center justify-center border-t border-navy-800 px-[20px] text-center"
      >
        <p className="story-cta-item mb-[10px] text-[11px] uppercase tracking-[0.3em] text-cream/45">
          Objet & B
        </p>
        <h2 className="story-cta-item mb-[36px] font-serif text-[2rem] italic leading-[1.25] sm:text-[2.6rem]">
          이번 시즌,
          <br />
          오브제처럼 곁에 두세요.
        </h2>
        <Link
          to="/products"
          className="story-cta-item inline-flex items-center gap-[8px] border border-terracotta-500 px-[30px] py-[15px] text-[13px] uppercase tracking-[0.16em] text-terracotta-400 transition-colors hover:bg-terracotta-500 hover:text-navy-950"
        >
          컬렉션 보기 →
        </Link>
      </section>
    </main>
  );
}
