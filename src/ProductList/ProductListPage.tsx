// src/ProductList/ProductListPage.tsx
// URL 조건(카테고리/검색어) + 사용자가 고른 정렬, 필터를 조합해서
// 조건에 맞는 상품만 걸러서 ProductGrid에 넘기는 페이지
// 옷가게 정렬대 + 펄티서랍 + 문 앞 메모
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom"; // URL의 ?category=top 같은 쿼리스트링을 state처럼 다루는 hook
import useDisclosure from "../hooks/useDisclosure";
import FilterSidebar from "../ProductList/FilterSidebar";
import ProductGrid from "../ProductList/ProductGrid";
import { PRODUCTS, type Product } from "./ProductsData";

// as count가 없으면 TS는 이 배열을 그냥 string[](아무 문자열이나 담긴 배열)로 봄
// as const: "이 배열의 값들을 문자열 리터럴 타입으로 고정" (그냥 string[])이 아니라 정확히 4개
const sortOptions = [
  "신상품 순",
  "낮은 가격순",
  "높은 가격순",
  "인기순",
] as const;
// sortOptions 배열에서 타입을 뽑아냄 -> "신상품 순" | "낮은 가격순" | "높은 가격순" | "인기 순"
type SortOption = (typeof sortOptions)[number];

// 이 함수가 컴포넌트 바깥에 있는 이유는 props나 state, 아무 컴포넌트 내부 값에도
// 의존하지 않고 "상품 배열 + 정렬 기준"만 넣으면 항상 같은 결과가 나오는 순수 함수라서
// 컴포넌트 안에 넣으면 렌더링마다 매번 새로 정의되는 낭비가 생기지만 바깥에 두면 한번만 정의되고 재사용 가능함
function sortProducts(products: Product[], sort: SortOption): Product[] {
  const sorted = [...products]; // 원본 복사 ! .sort()는 원본을 직접 바꿔버려서 (mutate) 복사본을 만듦
  // 복사본을 만드는 이유는 원본 PRODUCTS를 그대로 .sort() 해버리면 전역 데이터 자체가 영구적으로 바뀌어서
  switch (sort) {
    case "낮은 가격순":
      return sorted.sort((a, b) => a.price - b.price); // 오름차순 (음수면 a가 앞)
    case "높은 가격순":
      return sorted.sort((a, b) => b.price - a.price); // 내림차순
    case "신상품 순":
      return sorted.sort((a, b) => a.id - b.id);
    case "인기순":
    default:
      return sorted; // 인기순은 아직 기준이 없어서 그대로
  }
}

export default function ProductListPage() {
  const filterSidebar = useDisclosure(); // 필터 사이드바 열고 닫기
  const [activeSort, setActiveSort] = useState<SortOption>(sortOptions[0]); // 현재 정렬 기준 (기본: 신상품 순)
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]); // 선택된 색상/사이즈 필터값들
  const [searchParams, setSearchParams] = useSearchParams(); // URL 쿼리스트링 읽기/쓰기

  // URL에서 값 꺼내기. get()이 없으면 null 반환 -> ?? ""로 "없으면 빈 문자열"
  // 널리쉬 연산자(??): a ?? b = "a가 정확히 null 또는 undefined일 때만 b"
  // or 연산자(||): a || b  = a가 falsy면(0, "", false, null, undefined, Nan) -> b
  const activeCategory = searchParams.get("category") ?? "";
  const activeSearch = searchParams.get("search") ?? "";

  // 필터 체크박스 토글
  // 함수형 업데이트로 세 갈래 분기 이미 있으면 뺴고, 3개 다 찼으면 경고만 띄우고
  // return prev로 아무 변화 없음을 명시 없으면 추가
  const toggleFilter = (value: string) => {
    setSelectedFilters((prev) => {
      if (prev.includes(value)) {
        return prev.filter((v) => v !== value); // 이미 있으면 -> 뺌
      }
      if (prev.length >= 3) {
        alert("필터는 최대 3개까지만 선택할 수 있습니다.");
        return prev; // 3개 넘으면 -> 변화 없이 그대로 리턴
      }
      return [...prev, value]; // 없으면 -> 추가
    });
  };

  // 필터링+정렬 결과를 계산. useMemo = "의존성이 안 바뀌면 재계산 안 하고 이전 결과 재사용" (성능 최적화)
  // 펄티렁+정렬은 상품이 16개뿐이라 현재는 가벼운데 상품이 수백개 였다면 리렌더링마다
  // 매번 이 필터링+정렬을 다시 돌리는건 낭비이므로 useMemo(계산함수, 의존성배열) 사용
  const filteredProducts = useMemo(() => {
    let result = PRODUCTS; // 전체에서 시작

    if (activeCategory) {
      result = result.filter((p) => p.category === activeCategory); // 카테고리 필터
    }

    if (activeSearch) {
      const q = activeSearch.toLowerCase(); // 대소문자 무시하려고 소문자 통일
      result = result.filter((p) => p.name.toLowerCase().includes(q)); // 상품명에 검색어 포함되면 남김
    }

    // 선택된 필터(색상/사이즈) 처리
    if (selectedFilters.length > 0) {
      result = result.filter((p) =>
        // .every() = "선택된 필터를 전부 만족해야 통과"(하나라도 안 맞으면 제외)
        selectedFilters.every(
          (f) =>
            // .some() = "색상 중 하나라도" 또는 "사이즈 중 하나라도" 맞으면 true
            p.colors?.some((c) => c.value === f) ||
            p.sizes?.some((s) => s.toLowerCase() === f.toLowerCase()),
        ),
      );
    }

    return sortProducts(result, activeSort); // 마지막에 정렬해서 리턴
  }, [activeCategory, activeSearch, selectedFilters, activeSort]); // 4개중 하나라도 바뀌면 다시 계산

  // 카테고리 필터 해제 : URL에서 category만 지움
  // searchParams를 직접 수정 안 하고, const next = new URLSearchParams(searchParams)로
  // 복사본을 새로 만든 다음 그 복사에서 .delete()하고 setSearchParams()로 통쨰로 교체
  // 리액트는 state는 직접 변형(mutate)하지 않고 "새값으로 교체"하는게 원칙
  const clearCategory = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("category");
    setSearchParams(next);
  };

  // 검색어 해제
  const clearSearch = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("search");
    setSearchParams(next);
  };

  // JSX .. {filterSidebar.isOpen && (...)} : 조건부 렌더링 dimmed 배경
  // {(activeCategory || activeSearch) && (...)} : 카테고리나 검색어 둘중 하나라도 있으면 보여줌
  // {sortOptions.map((option) => ...)} : 아까 만든 4개자리 배열을 순회해서 버튼 4개 생성
  // <FilterSidebar isOpen={...} onClose={...} selected={...} onToggle={...} /> 와
  // <ProductGrid products={filteredProducts} />  부모인 {ProductsListPage}가
  // 상태와 계산을 전부 들고 있고, 자식들에게는 "보여줄 데이터", 이벤트 발생 시 부를 함수만
  // props로 내려주는 패턴
  return (
    <main className="bg-navy-950 pb-[80px]">
      {/* 필터 사이드바 오픈 시 배경 Dimmed 효과 */}
      {/* 조건부 렌더링: filterSidebar. isOpen이 true일 때만 뒤의 <div>를 그림*/}
      {/* 조건 && <JSX> = "조건이 trushy면 오른쪽을 렌더, falsy면 아무것도 안 그림*/}
      {/* falsy면 && 결과가 false가 되고, 리액트는 false/null/undefined를 화면에 안 그림*/}
      {filterSidebar.isOpen && (
        <div
          className="fixed inset-0 z-[9998] bg-navy-950/70 transition-opacity"
          onClick={filterSidebar.close} // 어두운 배경 클릭하면 사이드바 닫기 (useDisclosure(HOOK)의 close)
        />
      )}
      <section className="mx-auto my-[40px] w-full max-w-[1200px] px-[20px]">
        {/* 카테고리 또는 검색어가 있을 때만 "활성 필터 태그 줄을 표시*/}
        {(activeCategory || activeSearch) && ( // 둘 중 하나라도 값 있으면 truthy
          <div className="mb-[16px] flex flex-wrap items-center gap-[8px] text-[13px]">
            {/* 카테고리 태그: 있을 때만, 클릭하면 clearCategory로 URL에서 category제거*/}
            {activeCategory && (
              <button
                type="button"
                onClick={clearCategory}
                className="flex items-center gap-[6px] rounded-full border border-navy-600 px-[12px] py-[4px] text-cream/80 hover:border-terracotta-400 hover:text-terracotta-400"
              >
                카테고리: {activeCategory} ✕{" "}
                {/*{중괄호} 안은 JS값 -> 변수 그대로 출력*/}
              </button>
            )}
            {activeSearch && (
              <button
                type="button"
                onClick={clearSearch}
                className="flex items-center gap-[6px] rounded-full border border-navy-600 px-[12px] py-[4px] text-cream/80  hover:border-terracotta-400 hover:text-terracotta-400"
              >
                검색: "{activeSearch}" ✕
              </button>
            )}
          </div>
        )}

        {/* 상단 정렬 및 필터 버튼 영역 */}
        <div className="flex items-center justify-between border-b border-navy-700 pb-[20px]">
          <div className="text-[14px] font-medium text-cream/80">
            {/* {" "} = JSX에서 "여기 공백 한칸" 명시 (JSX는 줄바꿈 공백을 무시해서 수동으로 넣음) */}
            TOTAL{" "}
            <span className="font-bold text-cream">
              {/* String(숫자), padStart(2, "0") = 2자리로 만들되 모자라면 앞을 "0"으로 채움*/}
              {String(filteredProducts.length).padStart(2, "0")}
            </span>{" "}
            ITEMS
          </div>

          <div className="flex items-center gap-[24px]">
            {/* 정렬 옵션 리스트 */}
            <ul className="flex items-center gap-[16px]">
              {/* sortOptions 배열을 돌면서 정렬 버튼 4개 생성(.map = 배열 -> JSX 배열
              key={option} = 리액트가 각 항목 구분하는 고유 값 (문자열이 다 다르니 option 자체를 key로)*/}
              {sortOptions.map((option) => (
                <li key={option}>
                  <button
                    type="button"
                    // 템플릿 리터럴(백틱) 안에서 삼항연산자로 클래스 분기
                    // 현재 정렬 기준이면 -> 강조 스타일, 아니면 -> 흐린 스타일
                    // activeSort option이 true면 강조, false면 text-cream으로 흐리게
                    className={`cursor-pointer text-[14px] transition-colors ${
                      activeSort === option
                        ? "font-bold text-terracotta-400 underline underline-offset-4"
                        : "text-cream/50 hover:text-cream"
                    }`}
                    aria-current={activeSort === option} // 접근성: 현재 선택 항목 표시 (스크린 리더용)
                    onClick={() => setActiveSort(option)} // 클릭 -> 이 옵션으로 정렬 state 변경 -> 리렌더 -> useMemo 재 계산
                  >
                    {option}
                  </button>
                </li>
              ))}
            </ul>

            {/* 필터 사이드바 토글 버튼 */}
            <button
              type="button"
              className="cursor-pointer border border-terracotta-500 bg-transparent px-[16px] py-[8px] text-cream text-[13px] font-medium transition-colors hover:border-terracotta-500 hover:bg-terracotta-500 hover:text-navy-950"
              aria-haspopup="true" // 접근성: 이 버튼이 팝업(사이드바)를 연다.
              aria-expanded={filterSidebar.isOpen} // 접근성: 지금 열려있는지 여부
              onClick={filterSidebar.open} // 클릭 -> 사이드바 열기 (useDisclosure의 open)
            >
              Filter
            </button>
          </div>
        </div>

        {/* 자식 컴포넌트에 props로 상태와 함수를 내려줌 (부모가 상태 관리, 자식은 표시+이벤트만)*/}
        <FilterSidebar
          isOpen={filterSidebar.isOpen} // 열림 상태
          onClose={filterSidebar.close} // 닫기 함수
          selected={selectedFilters} // 현재 선택된 필터 배열
          onToggle={toggleFilter} // 체크박스 토글 함수
        />
      </section>

      {/* 필터링 + 정렬 끝난 최종 상품 배열에 ProductGrid에 넘김 */}
      <ProductGrid products={filteredProducts} />
    </main>
  );
}
