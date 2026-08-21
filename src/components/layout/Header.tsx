import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="border-b border-[#ccc]">
      <div className="mx-auto flex h-[80px] w-full max-w-[1200px] items-center justify-between px-[18px] py-[8px]">
        {/* 좌측 카테고리 */}
        <ul className="flex flex-1 justify-start">
          <li>
            <Link to="/products" aria-label="카테고리 메뉴 열기">
              <img
                src="/images/category_1.svg"
                alt="카테고리"
                width={20}
                height={20}
              />
            </Link>
          </li>
        </ul>
        {/* 중앙 로고 */}
        <Link
          to="/"
          className="flex items-center justify-center"
          aria-label="홈으로 이동하기"
        >
          <img
            src="/images/Logo_1.svg"
            alt="Objet & B 로고"
            width={80}
            height={80}
          />
        </Link>
        {/* 우측 네비 */}
        <nav
          className="flex flex-1 justify-end"
          aria-label="상단 유틸리티 메뉴"
        >
          <ul className="flex gap-[30px]">
            <li>
              <Link to="/products" aria-label="검색">
                <img
                  src="/images/search_1.svg"
                  alt="검색"
                  width={20}
                  height={20}
                />
              </Link>
            </li>
            <li>
              <Link to="/order" aria-label="장바구니">
                <img
                  src="/images/cart_1.svg"
                  alt="카트"
                  width={20}
                  height={20}
                />
              </Link>
            </li>
            <li>
              <Link to="/login" aria-label="로그인">
                <img
                  src="/images/login_1.svg"
                  alt="로그인"
                  width={20}
                  height={20}
                />
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
