import { Link } from "react-router-dom";

const ftNav = [
  { id: 1, label: "COMPANY" },
  { id: 2, label: "AGREE MENT" },
  { id: 3, label: "PRIVACY POLICY" },
  { id: 4, label: "GUIDE" },
];

export default function Footer() {
  const handleComingSoon = () => {
    alert("아직 준비 중인 페이지 입니다.");
  };

  return (
    <footer className="w-full border-t border-navy-700 bg-navy-950 px-[20px] py-[40px] md:px-[50px]">
      <div className="mx-auto flex max-w-[1400px] flex-col items-center gap-[32px] text-center md:flex-row md:items-center md:justify-between md:gap-0 md:text-left">
        {/* 1. 왼쪽 구역 */}
        <div className="footer-left flex flex-col items-center md:items-start">
          <Link to="/" aria-label="홈으로 이동하기">
            <img
              src="/images/Logo_1.svg"
              alt="Objet & B 로고"
              width={100}
              height={100}
              className="h-[70px] w-[70px] brightness-90 invert md:h-[100px] md:w-[100px]"
            />
          </Link>
          <p className="my-[5px] text-[12px] text-cream/70">
            대표 : 임상빈 | persie24@naver.com
          </p>
          <p className="my-[5px] text-[12px] text-cream/70">
            연락처 : 010-5150-5589
          </p>
          <div className="my-[5px]">
            <a
              href="https://app.notion.com/p/Lym-Sang-Bin-Web-Portfolio-b43e7e42ec0882f4951d818987cefb4d"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="노션 포트폴리오로 이동"
              className="inline-flex"
            >
              <img
                src="/images/notion-icon.svg"
                alt="노션 아이콘"
                width={20}
                height={20}
                className="invert"
              />
            </a>
          </div>
        </div>

        {/* 2. 가운데 구역 */}
        <nav className="text-center" aria-label="푸터 메뉴">
          <h2 className="mb-[8px] text-center text-cream">Minimalist</h2>
          <ul className="mb-[8px] text-center">
            {ftNav.map((item) => (
              <li className="mb-[7px]" key={item.id}>
                <button
                  type="button"
                  onClick={handleComingSoon}
                  className="text-[12px] text-cream/70 transition-colors hover:text-terracotta-400"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
          <span className="block text-[12px] font-bold text-cream">
            High-and Minimalist object shop
          </span>
        </nav>

        {/* 3. 오른쪽 구역 */}
        <div className="text-center text-[12px] whitespace-nowrap text-cream/50 md:text-right">
          &copy;2026 Objet - B. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
