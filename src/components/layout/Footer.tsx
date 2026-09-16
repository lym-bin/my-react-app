// src/componets/layout/Footer.tsx
// 사이트 최하단 고정 정보, 준비중 링크들
import { Link } from "react-router-dom";
import Logo from "./Logo";

// 컴포넌트 밖에 선언된 정적 데이터: 객체 4개가 담긴 배열
// 이 파일이 리렌더링돼도 이 배열 자체는 다시 안 만들어짐(컴포넌트 안이 아니라 밖)
const ftNav = [
  { id: 1, label: "COMPANY" }, // 각각 "id"(구분용 고유값)과 "label"(화면에 보일 글자) 두 필드를 가진 객체
  { id: 2, label: "AGREE MENT" },
  { id: 3, label: "PRIVACY POLICY" },
  { id: 4, label: "GUIDE" },
];

export default function Footer() {
  // 클릭하면 그냥 alert만 띄우는 함수, 아직 실체 페이지가 없는 링크들에 임시로 붙여줌
  const handleComingSoon = () => {
    alert("아직 준비 중인 페이지 입니다.");
  };

  return (
    <footer className="w-full border-t border-navy-700 bg-navy-950 px-[20px] py-[40px] md:px-[50px]">
      <div className="mx-auto flex max-w-[1400px] flex-col items-center gap-[32px] text-center md:flex-row md:items-center md:justify-between md:gap-0 md:text-left">
        {/* 1. 왼쪽 구역 로고 + 대표자 정보 + 노션 링크 */}
        <div className="flex flex-col items-center md:items-start">
          <Link to="/" aria-label="홈으로 이동하기">
            <Logo size="lg" />
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
              rel="noopener noreferrer" // 보안 옵션
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

        {/* 2. 가운데 구역: 사이트맵 링크 목록 */}
        <nav className="text-center" aria-label="푸터 메뉴">
          <h2 className="mb-[8px] text-center text-cream">Minimalist</h2>
          <ul className="mb-[8px] text-center">
            {/* ftNav가 map으로 배열 4개를 돌면서 각각 li 하나씩 생성*/}
            {ftNav.map((item) => (
              <li className="mb-[7px]" key={item.id}>
                <button
                  type="button"
                  onClick={handleComingSoon} // 4개 버튼 전부 같은 함수 재사용
                  className="text-[12px] text-cream/70 transition-colors hover:text-terracotta-400"
                >
                  {item.label}{" "}
                  {/* item.label을 화면에 출력: "COMPANY", "AGREE MENT" 등 */}
                </button>
              </li>
            ))}
          </ul>
          <span className="block text-[12px] font-bold text-cream">
            High-and Minimalist object shop
          </span>
        </nav>

        {/* 3. 오른쪽 구역: 저작권 문구 */}
        <div className="text-center text-[12px] whitespace-normal text-cream/50 md:text-right">
          &copy;2026 Objet - B. All rights reserved.{" "}
          {/* &copy: "@" 기호의 HTML 엔티티*/}
        </div>
      </div>
    </footer>
  );
}
