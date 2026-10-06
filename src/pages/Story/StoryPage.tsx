// src/pages/Story/StoryPage.tsx
// 브랜드 스토리 페이지: 히어로 타임라인 / 핀 스크롤 / 가로 스크롤 / 클로징 CTA 4가지 GSAP 기법 조립
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Layers, PenTool, BadgeCheck, Clock } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const PIN_IMAGES = [
  { src: "/images/daily-canvas-model.jpg", alt: "Objet & B 에디토리얼 무드" },
  { src: "/images/classic-suede-loafers.jpg", alt: "정교한 디테일 클로즈업" },
];
// 캡션 인덱스(0,1,2,) -> 이 캡션일 때 보여줄 이미지 인덱스
const PIN_IMAGE_FOR_CAPTION = [0, 0, 1];

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

// 상품 캐러셀 대신 브랜드 가치/제작 방식 소개 (브랜드 소개 페이지에 상품 쇼케이스는 안 맞아서 교체)
// 핀 스크롤 섹션이 이미 실루엣/컬러/디테일을 다루기 때문에, 겹치지 않게 소재·제작·검수·철학으로 구성
const VALUES = [
  {
    id: 1,
    num: "01",
    icon: Layers,
    title: "원단은 밀도부터",
    desc: "같은 두께라도 짜임이 다르면 핏이 다릅니다.",
  },
  {
    id: 2,
    num: "02",
    icon: PenTool,
    title: "샘플만 다섯 번",
    desc: "만족할 때까지 다시 그리는 패턴.",
  },
  {
    id: 3,
    num: "03",
    icon: BadgeCheck,
    title: "손으로 한 번 더",
    desc: "출고 전 모든 제품을 직접 확인합니다.",
  },
  {
    id: 4,
    num: "04",
    icon: Clock,
    title: "유행이 아닌 태도",
    desc: "계절이 지나도 변하지 않는 디자인.",
  },
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

      // 2. 핀 스크롤: 이미지는 고정, 캡션+이미지 둘 다 스크롤 진행률에 맞춰 전환
      const captions = gsap.utils.toArray<HTMLElement>(".story-pin-caption");
      const images = gsap.utils.toArray<HTMLElement>(".story-pin-image");
      gsap.set(captions, { opacity: 0 });
      gsap.set(images, { opacity: 0 });
      if (captions[0]) gsap.set(captions[0], { opacity: 1 });
      if (images[0]) gsap.set(images[0], { opacity: 1 });

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
          const imgIdx = PIN_IMAGE_FOR_CAPTION[idx];
          images.forEach((img, i) => {
            gsap.to(img, {
              opacity: i === imgIdx ? 1 : 0,
              duration: 0.5,
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
          <h1 className="story-hero-item story-hero-title mb-[22px] text-[2.6rem] leading-[1.1] font-bold sm:text-[3.4rem] md:text-[4.4rem]">
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
        <div className="relative aspect-[3/4] w-full max-w-[420px] overflow-hidden rounded-[2px] bg-navy-900">
          {PIN_IMAGES.map((img) => (
            <img
              key={img.src}
              src={img.src}
              alt={img.alt}
              className="story-pin-image product-photo absolute inset-0 h-full w-full object-cover"
            />
          ))}
          <span className="absolute bottom-[16px] left-[16px] rounded-full border border-cream/25 bg-navy-950/55 px-[10px] py-[15px] text-[10.5px] tracking-[0.2em] text-cream">
            EDITORIAL
          </span>
        </div>
        <div className="relative min-h-[180px] w-full max-w-[380px] text-center md:text-left">
          {PIN_CAPTIONS.map((c) => (
            <div key={c.num} className="story-pin-caption absolute inset-0">
              <span className="mb-[10px] block text-[12px] text-terracotta-400">
                {c.num}
              </span>
              <h2 className="mb-[14px] text-[1.6rem] leading-[1.2] font-bold sm:text-[1.9rem]">
                {c.title}
              </h2>
              <p className="mx-auto max-w-[320px] text-[14px] leading-[1.75] text-cream/65 break-keep md:mx-0">
                {c.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. 가로 스크롤: 브랜드 가치/제작 방식 */}
      <section
        ref={horizontalRef}
        className="flex min-h-screen flex-col justify-center gap-[32px] overflow-hidden border-t border-navy-800 bg-navy-900 py-[60px]"
      >
        <div className="text-center">
          <p className="mb-[8px] text-[11px] uppercase tracking-[0.3em] text-cream/45">
            Objet & B Craft
          </p>
          <h2 className="text-[1.9rem] font-bold sm:text-[2.3rem]">
            우리가 만드는 방식
          </h2>
        </div>
        <div className="overflow-hidden">
          <div ref={trackRef} className="flex gap-[22px] px-[20px]">
            {VALUES.map((value) => (
              <div
                key={value.id}
                className="w-[min(78vw,320px)] flex-shrink-0 rounded-[2px] border border-navy-700 bg-navy-950 px-[28px] py-[44px] text-center"
              >
                <span className="mb-[18px] block text-[12px] tracking-[0.2em] text-cream/40">
                  {value.num}
                </span>
                <value.icon
                  size={30}
                  strokeWidth={1.3}
                  className="mx-auto mb-[20px] text-terracotta-400"
                  aria-hidden="true"
                />
                <h3 className="mb-[10px] text-[1.15rem] font-bold text-cream">
                  {value.title}
                </h3>
                <p className="mx-auto max-w-[220px] text-[13px] leading-[1.7] text-cream/65 break-keep">
                  {value.desc}
                </p>
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
        <h2 className="story-cta-item mb-[36px] text-[2rem] leading-[1.25] font-bold sm:text-[2.6rem]">
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
