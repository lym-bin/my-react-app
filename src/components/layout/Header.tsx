import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CATEGORIES } from "../../ProductList/Categories";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import Logo from "./Logo";
import { Search, ShoppingCart, User } from "lucide-react";

// "전체보기"는 카테고리 파라미터 없이 /productsd로 이동합니다.
const CATEGORY_MENU = [
  { id: "all", label: "전체보기", category: "" },
  ...CATEGORIES.map((c) => ({ id: c.id, label: c.label, category: c.id })),
];

export default function Header() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { totalCount } = useCart();

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
    <header className="border-b border-navy-700 bg-navy-950">
      <div className="relative mx-auto flex h-[80px] w-full max-w-[1200px] items-center justify-between px-[12px] py-[8px] sm:px-[18px]">
        {/* 좌측 카테고리 */}
        <ul className="relative flex justify-start">
          <li ref={categoryRef} className="relative">
            <button
              type="button"
              aria-label="카테고리 메뉴 열기"
              aria-expanded={isCategoryOpen}
              onClick={() => setIsCategoryOpen((prev) => !prev)}
              className="flex cursor-pointer items-center justify-center transition hover:opacity-70"
            >
              <img
                src="/images/category_1.svg"
                alt="카테고리"
                width={20}
                height={20}
                className="invert"
              />
            </button>

            {isCategoryOpen && (
              <ul
                role="menu"
                aria-label="카테고리 목록"
                className="absolute top-[calc(100%+12px)] left-0 z-10 w-[160px] rounded-[4px] border border-navy-700 bg-navy-900 py-[8px] shadow-lg"
              >
                {CATEGORY_MENU.map((item) => (
                  <li key={item.id} role="none">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => handleCategoryClick(item.category)}
                      className="block w-full px-[16px] py-[8px] text-left text-[13px] text-cream transition hover:bg-navy-800 hover:text-terracotta-400"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>
        </ul>

        <Link
          to="/"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          aria-label="홈으로 이동하기"
        >
          <Logo />
        </Link>

        {/* 우측 네비 */}
        <nav className="flex justify-end" aria-label="상단 유틸리티 메뉴">
          <ul className="flex items-center gap-[16px] sm:gap-[30px]">
            <li>
              <button
                type="button"
                aria-label="검색창 열기"
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center justify-center text-cream/90 transition hover:text-terracotta-400"
              >
                <Search size={20} strokeWidth={1.5} />
              </button>
            </li>
            <li>
              <Link
                to="/order"
                aria-label={`장바구니${totalCount > 0 ? ` (${totalCount}개)` : ""}`}
                className="relative flex items-center justify-center text-cream/90 transition hover:text-terracotta-400"
              >
                <ShoppingCart size={20} strokeWidth={1.5} />
                {totalCount > 0 && (
                  <span className="absolute -top-[6px] -right-[8px] flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-terracotta-500 px-[3px] text-[10px] font-bold text-navy-950">
                    {totalCount}
                  </span>
                )}
              </Link>
            </li>
            <li>
              <Link
                to={isLoggedIn ? "/mypage" : "/login"}
                aria-label={isLoggedIn ? "마이페이지" : "로그인"}
                className="relative flex items-center justify-center text-cream/90 transition hover:text-terracotta-400"
              >
                <User size={20} strokeWidth={1.5} />
                {/* 로그인 상태일 때 작은 점으로 표시 */}
                {isLoggedIn && (
                  <span className="absolute -top-[2px] -right-[2px] h-[8px] w-[8px] rounded-full bg-terracotta-500" />
                )}
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* 검색 모달 */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 z-[1000] flex items-start justify-center bg-navy-950/70 px-[18px] pt-[120px]"
          onClick={() => setIsSearchOpen(false)}
        >
          <div
            className="w-full max-w-[520px] rounded-[6px] border border-navy-700 bg-navy-900 p-[24px] shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center gap-[10px] border-b border-navy-600 pb-[10px]"
            >
              <Search
                size={18}
                strokeWidth={1.5}
                className="text-cream/60"
                aria-hidden="true"
              />

              <input
                ref={searchInputRef}
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="상품명, 브랜드로 검색해보세요"
                className="w-full bg-transparent text-[14px] text-cream outline-none placeholder:text-cream/40"
              />
              <button
                type="button"
                aria-label="검색창 닫기"
                onClick={() => setIsSearchOpen(false)}
                className="text-[13px] text-cream/60 hover:text-cream"
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
