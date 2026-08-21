import { Link } from "react-router-dom";

export default function Footer() {
  const ftNav = [
    { id: 1, label: "COMPANY", path: "/" },
    { id: 2, label: "AGREE MENT", path: "/" },
    { id: 3, label: "PRIVACY POLICY", path: "/" },
    { id: 4, label: "GUIDE", path: "/" },
  ];

  return (
    <footer className="w-full border-t border-[#666] bg-[#f5f5f5] px-[50px] py-[40px]">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between">
        {/* 1. 왼쪽 구역 */}
        <div className="footer-left">
          <Link to="/" aria-label="홈으로 이동하기">
            <img
              src="/images/Logo_1.svg"
              alt="Objet & B 로고"
              width={100}
              height={100}
            />
          </Link>
          <p className="my-[5px] text-[12px] text-[#333]">
            대표 : 임상빈 | persie24@naver.com
          </p>
          <p className="my-[5px] text-[12px] text-[#333]">
            연락처 : 010-5150-5589
          </p>
          <p className="my-[5px] text-[12px] text-[#333]">
            <a
              href="https://app.notion.com/p/Lym-Sang-Bin-Web-Portfolio-b43e7e42ec0882f4951d818987cefb4d"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="노션 포트폴리오로 이동"
            >
              <img
                src="/images/notion-icon.svg"
                alt="노션 아이콘"
                width={20}
                height={20}
              />
            </a>
          </p>
        </div>

        {/* 2. 가운데 구역 */}
        <nav className="text-center" aria-label="푸터 메뉴">
          <h2 className="mb-[8px] text-center">Minimalist</h2>
          <ul className="mb-[8px] text-center">
            {ftNav.map((item) => (
              <li className="mb-[7px]" key={item.id}>
                <Link to={item.path} className="text-[12px] text-[#333]">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <span className="block text-[12px] font-bold text-[#333]">
            High-and Minimalist object shop
          </span>
        </nav>

        {/* 3. 오른쪽 구역 */}
        <div className="text-right text-[12px] whitespace-nowrap text-[#666]">
          &copy;2026 Objet - B. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
