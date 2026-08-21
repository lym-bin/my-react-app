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

export default function BestReview() {
  const reviews: Review[] = [
    {
      id: 1,
      img: "/images/card_1.svg",
      productName: "ObjeT & B [Men] Shoes",
      color: "White & Blue",
      size: "265",
      usualSize: "270",
      body: "Lorem ipsum dolor sit, amet consectetur adipisicing elit.",
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

  return (
    <section className="bg-navy-950 px-[20px] py-[50px]">
      <div className="mx-auto max-w-[1200px]">
        <h2 className="mb-[30px] text-center text-[2rem] font-bold italic leading-[1.2] text-cream">
          Best Review
        </h2>
        <div className="grid grid-cols-4 gap-[20px]">
          {reviews.map((r) => (
            <article
              className="flex flex-col rounded-[4px] border-t-2 border-terracotta-500 bg-navy-800 p-[14px] transition-transform duration-300 ease-in-out hover:-translate-y-[10px]"
              key={r.id}
            >
              {/* 이미지 영역: 고정 높이 추가 및 이미지 스타일 보완 */}
              <div className="mb-[15px] h-[250px] w-full overflow-hidden bg-navy-700">
                <img
                  src={r.img}
                  alt={r.productName}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* 텍스트 컨텐츠 영역 */}
              <div className="flex flex-col gap-[10px] px-[4px]">
                <h3 className="text-[1rem] font-semibold text-cream">
                  {r.productName}
                </h3>

                <div className="flex flex-col text-[0.85rem] text-cream/60">
                  <span>색상 : {r.color}</span>
                  <span>사이즈 : {r.size}</span>
                  <span>평소 사이즈 : {r.usualSize}</span>
                </div>

                <p className="text-[0.9rem] leading-[1.4] text-cream/80 [word-break:keep-all]">
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
    </section>
  );
}
