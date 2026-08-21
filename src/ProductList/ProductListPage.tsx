// src/pages/ProductList/ProductListPage.tsx
import { useState } from "react";
import useDisclosure from "../hooks/useDisclosure";
import FilterSidebar from "../ProductList/FilterSidebar";
import ProductGrid from "../ProductList/ProductGrid";

const sortOptions = ["신상품 순", "낮은 가격순", "높은 가격순", "인기순"];

export default function ProductListPage() {
  const filterSidebar = useDisclosure();
  const [activeSort, setActiveSort] = useState(sortOptions[0]);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

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

  return (
    <main className="pb-[80px]">
      {/* 필터 사이드바 오픈 시 배경 Dimmed 효과 */}
      {filterSidebar.isOpen && (
        <div
          className="fixed inset-0 z-[9990] bg-black/50 transition-opacity"
          onClick={filterSidebar.close}
        />
      )}

      <section className="mx-auto my-[40px] w-full max-w-[1200px] px-[20px]">
        {/* 상단 정렬 및 필터 버튼 영역 */}
        <div className="flex items-center justify-between border-b border-[#e5e5e5] pb-[20px]">
          <div className="text-[14px] font-medium text-[#333]">
            TOTAL <span className="font-bold">06</span> ITEMS
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
                        ? "font-bold text-black underline underline-offset-4"
                        : "text-[#888] hover:text-black"
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
              className="cursor-pointer border border-[#ccc] bg-white px-[16px] py-[8px] text-[13px] font-medium transition-colors hover:border-black hover:bg-black hover:text-white"
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
      <ProductGrid />
    </main>
  );
}
