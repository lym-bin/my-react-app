import { useState } from "react";

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
    productName: "ObjeT & B [Men] Shoes",
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
    productName: "ObjeT & B [Men] Black jean",
    color: "Denim Black",
    size: "30",
    usualSize: "28",
    body: "Lorem ipsum dolor sit, amet consectetur adipisicing elit.",
    author: "hijklnop123",
    date: "2026.02.14",
  },
  {
    id: 3,
    img: "/images/card_3.svg",
    productName: "ObjeT & B [Men&Women] White Shoes",
    color: "White",
    size: "285",
    usualSize: "280",
    body: "Lorem ipsum dolor sit, amet consectetur adipisicing elit.",
    author: "sssdd123",
    date: "2026.03.02",
  },
  {
    id: 4,
    img: "/images/card_4.svg",
    productName: "ObjeT & B [Men] Black Shoes",
    color: "Black",
    size: "290",
    usualSize: "280",
    body: "Lorem ipsum dolor sit, amet consectetur adipisicing elit.",
    author: "ddzsd22",
    date: "2026.03.19",
  },
];

export default function BestReview() {
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  return (
    <section className="bg-navy-950 px-[20px] py-[50px]">
      <div className="mx-auto max-w-[1200px]">
        <h2 className="mb-[30px] text-center text-[2rem] font-bold italic leading-[1.2] text-cream">
          Best Review
        </h2>

        {/* 그리드 레이아웃 (모바일 1열 -> 태블릿 2열 -> 데스크톱 4열) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[20px]">
          {reviews.map((r) => (
            <article
              onClick={() => setSelectedReview(r)} // 👈 카드 클릭 시 모달 오픈
              className="flex flex-col rounded-[4px] border-t-2 border-terracotta-500 bg-navy-800 p-[14px] cursor-pointer transition-transform duration-300 ease-in-out hover:-translate-y-[10px]"
              key={r.id}
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

                <p className="text-[0.9rem] leading-[1.4] text-cream/80 line-clamp-2 [word-break:keep-all]">
                  {r.body}
                </p>

                <div className="mt-[5px] flex justify-between text-[0.8rem] text-cream/40">
                  <span>{r.author}</span>
                  <span>{r.date}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* 팝업 모달 */}
      {selectedReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-[20px]">
          <div className="relative w-full max-w-[600px] rounded-lg border border-navy-700 bg-navy-900 p-6 text-cream shadow-2xl">
            <button
              type="button"
              onClick={() => setSelectedReview(null)}
              className="absolute top-4 right-4 cursor-pointer text-lg text-cream/60 hover:text-cream"
            >
              ✕
            </button>

            <h3 className="mb-4 text-xl font-bold border-b border-navy-800 pb-3">
              리뷰 상세 내용
            </h3>

            <div className="flex flex-col md:flex-row gap-4">
              <img
                src={selectedReview.img}
                alt={selectedReview.productName}
                className="h-[200px] w-full md:w-[200px] object-cover rounded bg-navy-800"
              />
              <div className="flex flex-col gap-2 flex-1">
                <h4 className="font-semibold text-lg">
                  {selectedReview.productName}
                </h4>
                <p className="text-sm text-cream/60">
                  색상: {selectedReview.color} | 사이즈: {selectedReview.size}{" "}
                  (평소: {selectedReview.usualSize})
                </p>
                <p className="text-sm text-cream/90 mt-2 bg-navy-800 p-3 rounded">
                  {selectedReview.body}
                </p>
                <div className="mt-auto flex justify-between text-xs text-cream/40 pt-2 border-t border-navy-800">
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
