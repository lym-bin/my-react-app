import { useEffect, useState } from "react";

interface Review {
  id: number;
  img: string;
  productName: string;
  color: string;
  size: string;
  usualSize: string;
  body: string;
  author: string;
  date: string;
}

const reviews: Review[] = [
  {
    id: 1,
    img: "/images/card_1.svg",
    productName: "Objet & B [Men] Shoes",
    color: "White & Blue",
    size: "265",
    usualSize: "270",
    body: "절제된 실루엣과 착화감이 정말 만족스럽습니다. 오브제처럼 예쁩니다.",
    author: "abcdefg123123",
    date: "2026.01.08",
  },
  {
    id: 2,
    img: "/images/card_2.svg",
    productName: "Objet & B Slim Denim Pants",
    color: "Dark Blue",
    size: "M",
    usualSize: "M (30)",
    body: "워싱감이 과하지 않고 핏이 슬림해서 데일리로 자주 입어요. 컬러도 진하고 고급스럽습니다.",
    author: "hijklnop123",
    date: "2026.02.14",
  },
  {
    id: 3,
    img: "/images/card_3.svg",
    productName: "Objet & B Minimal White Sneakers",
    color: "White",
    size: "270",
    usualSize: "270",
    body: "어디에나 잘 어울리는 화이트라 매일 신어도 안 질려요. 쿠션감도 생각보다 좋습니다.",
    author: "sssdd123",
    date: "2026.03.02",
  },
  {
    id: 4,
    img: "/images/card_4.svg",
    productName: "Objet & B Classic Black Derby",
    color: "Black",
    size: "275",
    usualSize: "275",
    body: "무광 블랙이라 캐주얼부터 세미포멀까지 다 잘 받쳐줘요. 내구성도 튼튼한 편입니다.",
    author: "ddzsd22",
    date: "2026.03.19",
  },
];

export default function BestReview() {
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  // ESC 키로 모달 닫기 (다른 모달들과 동작 통일)
  useEffect(() => {
    if (!selectedReview) return;
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setSelectedReview(null);
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [selectedReview]);

  return (
    <section className="bg-navy-950 px-[20px] py-[50px]">
      <div className="mx-auto max-w-[1200px]">
        <h2 className="mb-[30px] text-center text-[2rem] font-bold italic leading-[1.2] text-cream">
          Best Review
        </h2>

        {/* 그리드 레이아웃 (모바일 1열 -> 태블릿 2열 -> 데스크톱 4열) */}
        <div className="grid grid-cols-1 gap-[20px] sm:grid-cols-2 lg:grid-cols-4">
          {reviews.map((r) => (
            <article
              key={r.id}
              className="flex flex-col rounded-[4px] border-t-2 border-terracotta-500 bg-navy-800 p-[14px] transition-transform duration-300 ease-in-out hover:-translate-y-[10px]"
            >
              <button
                type="button"
                onClick={() => setSelectedReview(r)}
                aria-label={`${r.productName} 리뷰 상세 보기`}
                className="flex cursor-pointer flex-col text-left"
              >
                <div className="mb-[15px] h-[250px] w-full overflow-hidden bg-navy-700">
                  <img
                    src={r.img}
                    alt={r.productName}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="flex flex-col gap-[10px] px-[4px]">
                  <h3 className="text-[1rem] font-semibold text-cream">
                    {r.productName}
                  </h3>

                  <div className="flex flex-col text-[0.85rem] text-cream/60">
                    <span>색상 : {r.color}</span>
                    <span>사이즈 : {r.size}</span>
                    <span>평소 사이즈 : {r.usualSize}</span>
                  </div>

                  <p className="line-clamp-2 text-[0.9rem] leading-[1.4] text-cream/80 [word-break:keep-all]">
                    {r.body}
                  </p>

                  <div className="mt-[5px] flex justify-between text-[0.8rem] text-cream/40">
                    <span>{r.author}</span>
                    <span>{r.date}</span>
                  </div>
                </div>
              </button>
            </article>
          ))}
        </div>
      </div>

      {/* 팝업 모달 */}
      {selectedReview && (
        <div
          className="fixed inset-0 z-sidebar flex items-center justify-center bg-navy-950/70 p-[20px]"
          onClick={() => setSelectedReview(null)}
        >
          <div
            className="relative w-full max-w-[600px] rounded-lg border border-navy-700 bg-navy-900 p-6 text-cream shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedReview(null)}
              aria-label="리뷰 상세 닫기"
              className="absolute top-4 right-4 cursor-pointer text-lg text-cream/60 hover:text-cream"
            >
              ✕
            </button>

            <h3 className="mb-4 border-b border-navy-800 pb-3 text-xl font-bold">
              리뷰 상세 내용
            </h3>

            <div className="flex flex-col gap-4 md:flex-row">
              <img
                src={selectedReview.img}
                alt={selectedReview.productName}
                className="h-[200px] w-full rounded bg-navy-800 object-cover md:w-[200px]"
              />
              <div className="flex flex-1 flex-col gap-2">
                <h4 className="text-lg font-semibold">
                  {selectedReview.productName}
                </h4>
                <p className="text-sm text-cream/60">
                  색상: {selectedReview.color} | 사이즈: {selectedReview.size}{" "}
                  (평소: {selectedReview.usualSize})
                </p>
                <p className="mt-2 rounded bg-navy-800 p-3 text-sm text-cream/90">
                  {selectedReview.body}
                </p>
                <div className="mt-auto flex justify-between border-t border-navy-800 pt-2 text-xs text-cream/40">
                  <span>작성자: {selectedReview.author}</span>
                  <span>{selectedReview.date}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
