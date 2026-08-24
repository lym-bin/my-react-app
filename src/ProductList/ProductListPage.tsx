// src/ProductList/ProductListPage.tsx
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useDisclosure from "../hooks/useDisclosure";
import FilterSidebar from "../ProductList/FilterSidebar";
import ProductGrid from "../ProductList/ProductGrid";
import { Product, PRODUCTS } from "./ProductsData";
const sortOptions = ["신상품 순", "낮은 가격순", "높은 가격순", "인기순"];

function sortProducts(products: Product[], sort: string): Product[] {
  const sorted = [...products];
  switch (sort) {
    case "낮은 가격순":
      return sorted.sort((a, b) => a.price - b.price);
    case "높은 가격순":
      return sorted.sort((a, b) => b.price - a.price);
    case "신상품 순":
      return sorted.sort((a, b) => b.id - a.id);
    case "인기순":
    default:
      // TODO: 실제 인기도(조회수/판매량 등) 필드가 생기면 그 기준으로 정렬
      return sorted;
  }
}

export default function ProductListPage() {
  const filterSidebar = useDisclosure();
  const [activeSort, setActiveSort] = useState(sortOptions[0]);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const activeCategory = searchParams.get("category") ?? "";
  const activeSearch = searchParams.get("search") ?? "";

  const toggleFilter = (value: string) => {
    setSelectedFilters((prev) => {
      if (prev.includes(value)) {
        return prev.filter((v) => v !== value);
      }
      if (prev.length >= 3) {
        alert("필터는 최대 3개까지만 선택할 수 있습니다.");
        return prev;
      }
      return [...prev, value];
    });
  };

  const filteredProducts = useMemo(() => {
    let result = PRODUCTS;

    if (activeCategory) {
      result = result.filter((p) => p.category === activeCategory);
    }

    if (activeSearch) {
      const q = activeSearch.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q));
    }

    // TODO: selectedFilters(색상/사이즈)는 아직 Product 데이터에 대응 필드가 없어 미적용 상태.
    // 실제 색상/사이즈 데이터가 추가되면 여기서 같이 필터링.

    return sortProducts(result, activeSort);
  }, [activeCategory, activeSearch, activeSort]);

  const clearCategory = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("category");
    setSearchParams(next);
  };

  const clearSearch = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("search");
    setSearchParams(next);
  };

  return (
    <main className="bg-navy-950 pb-[80px]">
      {/* 필터 사이드바 오픈 시 배경 Dimmed 효과 */}
      {filterSidebar.isOpen && (
        <div
          className="fixed inset-0 z-[9998] bg-navy-950/70 transition-opacity"
          onClick={filterSidebar.close}
        />
      )}

      <section className="mx-auto my-[40px] w-full max-w-[1200px] px-[20px]">
        {/* 활성 필터(카테고리/검색어) 표시 */}
        {(activeCategory || activeSearch) && (
          <div className="mb-[16px] flex flex-wrap items-center gap-[8px] text-[13px]">
            {activeCategory && (
              <button
                type="button"
                onClick={clearCategory}
                className="flex items-center gap-[6px] rounded-full border border-navy-600 px-[12px] py-[4px] text-cream/80 hover:border-terracotta-400 hover:text-terracotta-400"
              >
                카테고리: {activeCategory} ✕
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
            TOTAL{" "}
            <span className="font-bold text-cream">
              {String(filteredProducts.length).padStart(2, "0")}
            </span>{" "}
            ITEMS
          </div>

          <div className="flex items-center gap-[24px]">
            {/* 정렬 옵션 리스트 */}
            <ul className="flex items-center gap-[16px]">
              {sortOptions.map((option) => (
                <li key={option}>
                  <button
                    type="button"
                    className={`cursor-pointer text-[14px] transition-colors ${
                      activeSort === option
                        ? "font-bold text-terracotta-400 underline underline-offset-4"
                        : "text-cream/50 hover:text-cream"
                    }`}
                    aria-current={activeSort === option}
                    onClick={() => setActiveSort(option)}
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
              aria-haspopup="true"
              aria-expanded={filterSidebar.isOpen}
              onClick={filterSidebar.open}
            >
              Filter
            </button>
          </div>
        </div>

        <FilterSidebar
          isOpen={filterSidebar.isOpen}
          onClose={filterSidebar.close}
          selected={selectedFilters}
          onToggle={toggleFilter}
        />
      </section>

      {/* 상품 그리드 영역 */}
      <ProductGrid products={filteredProducts} />
    </main>
  );
}
