import { Link } from "react-router-dom";

interface CustomerSlide {
  id: number;
  img: string;
  title: string;
  desc: string;
  reverse?: boolean;
}

export default function CustomerBanner() {
  const slides: CustomerSlide[] = [
    {
      id: 1,
      img: "/images/Model_1.jpg",
      title: "Minimalist & Sophisticated",
      desc: "Elevate your everyday, redefined by design Timeless design for modern life.",
    },
    {
      id: 2,
      img: "/images/model_2.jpg",
      title: "Minimalist & Sophisticated", // 오타 수정
      desc: "Quiet luxury in every stitch and seam — objects made to be lived with.",
      reverse: true,
    },
  ];

  return (
    <>
      {slides.map((slide) => (
        <section key={slide.id} className="bg-navy-900 py-[50px]">
          <div
            className={`mx-auto flex max-w-[1200px] items-center justify-between px-[20px] ${
              slide.reverse ? "flex-row-reverse" : "flex-row"
            }`}
          >
            {/* 텍스트 컨텐츠 영역 */}
            <div className="flex w-1/2 flex-col gap-[20px]">
              <h2 className="text-[2rem] font-bold italic leading-[1.2] text-cream">
                {slide.title}
              </h2>
              <p className="max-w-[300px] text-[0.9rem] leading-[1.6] text-cream/70">
                {slide.desc}
              </p>
            </div>

            {/* 이미지 영역 */}
            <div className="flex w-1/2 justify-center">
              <Link
                to={"/products"}
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
        </section>
      ))}
    </>
  );
}
