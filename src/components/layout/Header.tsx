import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// TODO: 실제 카테고리 값/필터링 로직에 맞게 category 파라미터를 조정하세요.
const CATEGORIES = [
  { id: "all", label: "전체보기", category: "" },
  { id: "outer", label: "아우터", category: "outer" },
  { id: "top", label: "상의", category: "top" },
  { id: "pants", label: "바지", category: "pants" },
  { id: "shoes", label: "신발", category: "shoes" },
];

export default function Header() {
  const navigate = useNavigate();

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const categoryRef = useRef<HTMLLIElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // 카테고리 드롭다운 - 바깥 클릭 시 닫기
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        categoryRef.current &&
        !categoryRef.current.contains(e.target as Node)
      ) {
        setIsCategoryOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 검색 모달 - 열리면 인풋에 포커스, ESC로 닫기
  useEffect(() => {
    if (isSearchOpen) {
      searchInputRef.current?.focus();
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setIsSearchOpen(false);
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isSearchOpen]);

  function handleCategoryClick(category: string) {
    setIsCategoryOpen(false);
    navigate(category ? `/products?category=${category}` : "/products");
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = searchValue.trim();
    if (!q) return;
    setIsSearchOpen(false);
    setSearchValue("");
    navigate(`/products?search=${encodeURIComponent(q)}`);
  }

  return (
    <header className="border-b border-gray-400">
      <div className="mx-auto flex h-[80px] w-full max-w-[1200px] items-center justify-between px-[18px] py-[8px]">
        {/* 좌측 카테고리 */}
        <ul className="relative flex flex-1 justify-start">
          <li ref={categoryRef} className="relative">
            <button
              type="button"
              aria-label="카테고리 메뉴 열기"
              aria-expanded={isCategoryOpen}
              onClick={() => setIsCategoryOpen((prev) => !prev)}
              className="flex items-center justify-center transition hover:opacity-70"
            >
              <img
                src="/images/category_1.svg"
                alt="카테고리"
                width={20}
                height={20}
              />
            </button>

            {isCategoryOpen && (
              <ul
                role="menu"
                aria-label="카테고리 목록"
                className="absolute top-[calc(100%+12px)] left-0 z-10 w-[160px] rounded-[4px] border border-gray-300 bg-paper py-[8px] shadow-lg"
              >
                {CATEGORIES.map((item) => (
                  <li key={item.id} role="none">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => handleCategoryClick(item.category)}
                      className="block w-full px-[16px] py-[8px] text-left text-[13px] text-gray-850 transition hover:bg-gray-50"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
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
          <ul className="flex items-center gap-[30px]">
            <li>
              <button
                type="button"
                aria-label="검색창 열기"
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center justify-center transition hover:opacity-70"
              >
                <img
                  src="/images/search_1.svg"
                  alt="검색"
                  width={20}
                  height={20}
                />
              </button>
            </li>
            <li>
              <Link
                to="/order"
                aria-label="장바구니"
                className="transition hover:opacity-70"
              >
                <img
                  src="/images/cart_1.svg"
                  alt="카트"
                  width={20}
                  height={20}
                />
              </Link>
            </li>
            <li>
              <Link
                to="/login"
                aria-label="로그인"
                className="transition hover:opacity-70"
              >
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

      {/* 검색 모달 */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 z-[1000] flex items-start justify-center bg-ink/40 px-[18px] pt-[120px]"
          onClick={() => setIsSearchOpen(false)}
        >
          <div
            className="w-full max-w-[520px] rounded-[6px] bg-paper p-[24px] shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center gap-[10px] border-b border-gray-400 pb-[10px]"
            >
              <img src="/images/search_1.svg" alt="" width={18} height={18} />
              <input
                ref={searchInputRef}
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="상품명, 브랜드로 검색해보세요"
                className="w-full text-[14px] text-gray-900 outline-none placeholder:text-gray-600"
              />
              <button
                type="button"
                aria-label="검색창 닫기"
                onClick={() => setIsSearchOpen(false)}
                className="text-[13px] text-gray-700 hover:text-gray-900"
              >
                ✕
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
