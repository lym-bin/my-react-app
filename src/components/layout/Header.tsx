// src/components/layout/Header.tsx
// 화면구성: 왼쪽 카테고리 버튼, 클릭 드롭다운 목록
// 가운데: 로고
// 오른쪽: 검색/장바구니/로그인을
// 검색 모달 담당하는 파일
// Header.tsx: 드롭다운, 검색창 을 state 관리 하면서
// login 정보는 Context에서 빌려와서 보여주는 조합 컴포넌트 파일
// 매장 안내 데스크(스스로 새 정보를 만들지 않음) 보여주기만
// 왼쪽 카테고리: 진열대 안내판(눌러야 카테고리 목록이 펼쳐짐)
// 가운데 로고: 매장 간판
// 오른쪽 검색/장바구니/내정보 아이콘: 안내 데스크의 세 가지 서비스 버튼
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom"; // Link: <a> 대신 쓰는 라우터용 링크, useNavigate: 코드로 페이지를 이동 시키는함수
import { CATEGORIES } from "../../ProductList/Categories"; // 카테고리 단일 소스
import { useAuth } from "../../context/AuthContext"; // 로그인 정보 창구
import { useCart } from "../../context/CartContext"; // 장바구니 정보 창구
import Logo from "./Logo";
import { Search, ShoppingCart, User } from "lucide-react"; // 루시드 아이콘 라이브러리
import useDisclosure from "../../hooks/useDisclosure";

// "전체보기"는 카테고리 파라미터 없이 /productsd로 이동.
const CATEGORY_MENU = [
  { id: "all", label: "전체보기", category: "" }, // 맨 앞 "쩐체보기" 하나 고정 추가
  ...CATEGORIES.map((c) => ({ id: c.id, label: c.label, category: c.id })), // 나머지는 CATEGORIES 그대로 펼침(스프레드)
];

// useAuth와 useCart는 Header가 직접 관리하지 않음
// Context 창구에서 필요한 값만 꺼내씀 Hedaer는 구독자인 셈
export default function Header() {
  const navigate = useNavigate(); // 카테고리 클릭/검색 제출 시 페이지 이동용
  const { isLoggedIn } = useAuth(); // Context에서 로그인 여부만 꺼내 씀
  const { totalCount } = useCart(); // Context에서 장바구니 총 수량 만 꺼내씀

  // useState로 열림/상태
  const category = useDisclosure(); // 카테고리 드롭다운
  const search = useDisclosure(); // 검색 모달 열림 여부
  const [searchValue, setSearchValue] = useState(""); // 검색창 입력 값

  // useState는 TV 화면에 표시되는 채널 숫자 - 값이 바뀌면 화면(리렌더링)
  // useRef는 TV본체를 직접 가리키는 리모컨
  // 리모컨을 다른 걸로 바꿔 낀다고 해서 화면이 다시 그려지진 않음
  const categoryRef = useRef<HTMLLIElement>(null); // 카테고리 li요소를 직접 가리킬 참조
  const searchInputRef = useRef<HTMLInputElement>(null); // 검색 input 요소를 직접 가리킬 참조

  // 카테고리 드롭다운 - 바깥 클릭 시 닫기
  // 매장 경비원 문서 전체에 어디든 클릭되면 나한테 알려줘 라는 리스너를 달아줌
  // 클릭된 지점: e.target 카테고리 영역: categoryRef.current
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        // useRef: 상자(박스)를 만듬 값이 바뀌어도 재 렌더링X
        categoryRef.current && // ref가 실제 DOM을 가리키고 있고
        // cartegoryRef가 실제 요소를 가리키고 있고 클릭한 요소가 그 안에없다면
        // contains로 비교 카테고리 li에 사진이 제대로 있는지
        !categoryRef.current.contains(e.target as Node)
      ) {
        category.close();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []); // 의존성 배열이 []인 이유: isCategoryOpen이 몇 번을 열렸다 닫혔다 해도
  // 똑같은 로직이라 한 번만 등록해두고 계속 재사용 해도 됨

  // 검색 모달 - 열리면 인풋에 포커스, ESC로 닫기
  // searchInputRef.current?.focus(); => 옵셔널 체이닝은 current가 null이 아닐 때만 .focus()를 호출 해라
  useEffect(() => {
    if (search.isOpen) {
      // current는 useRef()가 만들어준 서랍: 리액트를 거치지 않고 DOM에 직접 손대야할때
      // input에 커서(포커스) 갖다놔
      searchInputRef.current?.focus();
    }
  }, [search.isOpen]); // isSearchOpen: 바뀔 때마다 재 실행(열릴 때 focus 다시 주려고)

  function handleCategoryClick(category_: string) {
    category.close(); // 드롭다운 닫고
    navigate(category_ ? `/products?category=${category_}` : "/products"); // 해당 카테고리로 이듕
  }

  function handleSearchSubmit(e: FormEvent) {
    e.preventDefault();
    const q = searchValue.trim(); // 앞뒤 공백 제거
    if (!q) return; // 빈 검색이면 종료
    search.close();
    setSearchValue("");
    navigate(`/products?search=${encodeURIComponent(q)}`); // URL에 안전하게 인코딩해서 이동
  }

  return (
    <header className="border-b border-navy-700 bg-navy-950">
      {/* relative: 안에서 absolute로 위치 잡을 자식(로고)의 기준점이 되어줌 */}
      <div className="relative mx-auto flex h-[80px] w-full max-w-[1200px] items-center justify-between px-[12px] py-[8px] sm:px-[18px]">
        {/* 좌측 카테고리 */}
        <ul className="relative flex justify-start">
          {/* ref로 이 li를 categoryRef.current에 연결 (바깥클릭 감지용)*/}
          <li ref={categoryRef} className="relative">
            <button
              type="button"
              aria-label="카테고리 메뉴 열기"
              aria-expanded={category.isOpen} // 스크린리더한테 "지금 열려있다/닫혀있다" 알려줌
              onClick={() =>
                category.isOpen ? category.close() : category.open()
              }
              className="flex cursor-pointer items-center justify-center transition hover:opacity-70"
            >
              <img
                src="/images/category_1.svg"
                alt="카테고리"
                width={20}
                height={20}
                className="invert" // 원래 어두운 색을 반전(invert) 밝게
              />
            </button>

            {/* isCategoryOpen이 true일 때만 드롭다운 자체가 렌더링용(조건부 렌더링)*/}
            {category.isOpen && (
              <ul
                role="menu" // 스크린 리더한테 "이건 메뉴다"라고 알려주는 접근성 속성
                aria-label="카테고리 목록"
                className="absolute top-[calc(100%+12px)] left-0 z-10 w-[160px] rounded-[4px] border border-navy-700 bg-navy-900 py-[8px] shadow-lg"
              >
                {/*배열을 key값을 주고 map으로 돌면서 각 항목마다 li하나씩 생성*/}
                {/* key를 명명해야 맞게 매핑 됨 */}
                {CATEGORY_MENU.map((item) => (
                  <li key={item.id} role="none">
                    {/* key: 리스트 렌더링 할 때 리액트가 각 항목을 구분하는 고유 식별자 */}
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => handleCategoryClick(item.category)} // 클릭하면 그 카테고리로 이동
                      className="block w-full px-[16px] py-[8px] text-left text-[13px] text-cream transition hover:bg-navy-800 hover:text-terracotta-400"
                    >
                      {item.label}
                      {/* "전체보기", "상의" 등 화면에 보일 텍스트 */}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>
        </ul>

        {/* 로고: 부모(relative div) 기준으로 absolute + translate로 항상 정중앙 고정*/}
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
                onClick={search.open}
                className="flex items-center justify-center text-cream/90 transition hover:text-terracotta-400"
              >
                <Search size={20} strokeWidth={1.5} />{" "}
                {/* lucide-react: 아이콘 컴포넌트*/}
              </button>
            </li>
            <li>
              <Link
                to="/order"
                // 백틱 템플릿 리터럴로 상황별 다른 문구를 스크린리더에게 제공
                aria-label={`장바구니${totalCount > 0 ? ` (${totalCount}개)` : ""}`}
                className="relative flex items-center justify-center text-cream/90 transition hover:text-terracotta-400"
              >
                <ShoppingCart size={20} strokeWidth={1.5} />
                {/* totalCount가 0보다 클 때만 빨간 뱃지 렌더링*/}
                {totalCount > 0 && (
                  <span className="absolute -top-[6px] -right-[8px] flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-terracotta-500 px-[3px] text-[10px] font-bold text-navy-950">
                    {totalCount}
                  </span>
                )}
              </Link>
            </li>
            <li>
              <Link
                // 삼항연산자로 로그인 여부에 따라 목적지가 마이페이지 or 로그인페이지로 갈림
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

      {/* 검색 모달 search.isOpen 이 모두 true일 때만 화면 전체를 덮는 오버레이 렌더링 */}
      {search.isOpen && (
        <div
          className="fixed inset-0 z-[1000] flex items-start justify-center bg-navy-950/70 px-[18px] pt-[120px]"
          onClick={search.close} // 어두운 배경(바깥) 클릭하면 닫기
        >
          <div
            className="w-full max-w-[520px] rounded-[6px] border border-navy-700 bg-navy-900 p-[24px] shadow-xl"
            onClick={(e) => e.stopPropagation()} // 모달 내부 클릭은 바깥 클릭으로 만 번지게 막음(이벤트 버블링)
          >
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center gap-[10px] border-b border-navy-600 pb-[10px]"
            >
              <Search
                size={18}
                strokeWidth={1.5}
                className="text-cream/60"
                aria-hidden="true" // 장식용 아이콘이라 스크린리더는 무시하게 함
              />

              <input
                ref={searchInputRef} // 모달 열릴 떄 여기로 focus()줌
                type="text"
                value={searchValue} // controlled input(제어 컴포넌트): 같이 항상 state와 동기화됨
                onChange={(e) => setSearchValue(e.target.value)} // 타이핑할 때마다 state 갱신
                placeholder="상품명, 브랜드로 검색해보세요"
                className="w-full bg-transparent text-[14px] text-cream outline-none placeholder:text-cream/40"
              />
              <button
                type="button"
                aria-label="검색창 닫기"
                onClick={search.close}
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
