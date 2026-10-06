// src/pages/Main/components/BestReview.tsx
// 브랜드 커뮤니티 섹션 (라이프스타일 사진 그리드)

interface FeedPhoto {
  id: number;
  img: string;
  alt: string;
  tag: string; // 호버 시 "@태그"로 표시
}

const FEED_PHOTOS: FeedPhoto[] = [
  {
    id: 1,
    img: "/images/card_1.svg",
    alt: "Objet & B 데일리룩",
    tag: "베이직 시그니처 화이트 셔츠",
  },
  {
    id: 2,
    img: "/images/card_2.svg",
    alt: "Objet & B 스트리트 무드",
    tag: "릴랙스드 핏 니트 풀오버",
  },
  {
    id: 3,
    img: "/images/card_3.svg",
    alt: "Objet & B 캐주얼 룩",
    tag: "미니멀 가죽 레더 스니커즈",
  },
  {
    id: 4,
    img: "/images/card_4.svg",
    alt: "Objet & B 시티 무드",
    tag: "모던 싱글 체스터필드 코트",
  },
  {
    id: 5,
    img: "/images/daily-canvas-model.jpg",
    alt: "Objet & B 데일리 스냅",
    tag: "데일리 캔버스 슬립온",
  },
  {
    id: 6,
    img: "/images/premium-cotton-oversized-white-tshirt-model.jpg",
    alt: "Objet & B 오버사이즈 룩",
    tag: "프리미엄 코튼 오버사이즈 화이트 티셔츠",
  },
];

export default function BestReview() {
  return (
    <section className="bg-navy-950 px-[20px] py-[60px]">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-[30px] text-center">
          <span className="mb-[8px] block text-[11px] font-light tracking-[0.3em] text-cream/40 uppercase">
            Objet & B Community
          </span>
          <h2 className="text-[1.8rem] font-bold text-cream sm:text-[2.2rem]">
            @objetandb <span className="text-cream/40">· Instagram</span>
          </h2>
        </div>

        {/* 3열 고정 그리드 */}
        <div className="grid grid-cols-3 gap-[4px] sm:gap-[8px]">
          {FEED_PHOTOS.map((photo) => (
            <div
              key={photo.id}
              className="group relative aspect-square overflow-hidden bg-navy-800"
            >
              <img
                src={photo.img}
                alt={photo.alt}
                className="product-photo h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
              />
              {/* 호버 시 "@상품명" 라벨만 살짝 - 이미지 전체는 어둡게 안 깔고 라벨 자체에만 배경 */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-[10px] text-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="border border-cream/50 bg-navy-950/70 px-[12px] py-[7px] text-[11px] tracking-[0.05em] text-cream">
                  @{photo.tag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
