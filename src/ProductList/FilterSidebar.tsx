// src/pages/ProductList/components/FilterSidebar.tsx
// 선택된 필터 값을 부모에게 알려주는 체크박스 목록 사이드바
import { COLOR_OPTIONS, SIZE_OPTIONS } from "./OptionsData";
// QuickNav의 icon: IconComponent처럼, 구조분해하면서 이름을 value -> val로 바꿈
// (아래서 <input value={val}을 또 쓰니까, 번수명 val과 JSX 속성명 value가 겹치지않게 구분)

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  selected: string[];
  onToggle: (value: string) => void;
}

export default function FilterSidebar({
  isOpen,
  onClose,
  selected,
  onToggle,
}: FilterSidebarProps) {
  return (
    <aside
      className={`fixed top-0 right-0 z-sidebar flex h-screen w-[360px] flex-col border-1 border-navy-700 bg-navy-900 shadow-[-5px_0_15px_rgba(0,0,0,0.1)] transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
      aria-label="상품 상세 필터"
    >
      {/* 헤더 영역 */}
      <header className="flex items-center justify-between border-b border-navy-700 p-[24px]">
        <h3 className="m-0 text-[18px] font-bold text-cream">Filter</h3>
        <button
          type="button"
          className="cursor-pointer border-none bg-transparent text-[14px] font-semibold text-cream/70 hover:text-cream"
          onClick={onClose}
          aria-label="필터 닫기"
        >
          닫기
        </button>
      </header>

      {/* 스크롤 가능한 본문 영역 */}
      <div className="flex-1 overflow-y-auto p-[24px]">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col gap-[30px]"
        >
          {/* 색상 섹션 */}
          <section>
            <h4 className="mb-[14px] text-[15px] font-bold text-cream">색상</h4>
            <div className="grid grid-cols-2 gap-[10px]">
              {COLOR_OPTIONS.map(({ value: val, label }) => {
                const isChecked = selected.includes(val); // 라디오는 같은 name을 가진 것들 끼리 딱 하나만 선택가능, 체크박스는 독립적으로 키고 끌수 있음
                return (
                  <label key={val} className="cursor-pointer">
                    <input
                      type="checkbox"
                      name="color"
                      value={val}
                      className="hidden"
                      checked={isChecked}
                      onChange={() => onToggle(val)}
                    />
                    <span
                      className={`block rounded border py-[10px] text-center text-[13px] transition-colors ${
                        isChecked
                          ? "border-terracotta-500 bg-terracotta-500 text-navy-950"
                          : "border-navy-600 bg-navy-800 text-cream/80 hover:border-terracotta-400"
                      }`}
                    >
                      {label}
                    </span>
                  </label>
                );
              })}
            </div>
          </section>

          {/* 사이즈 섹션 */}
          <section>
            <h4 className="mb-[14px] text-[15px] font-bold text-cream">
              사이즈
            </h4>
            <div className="grid grid-cols-3 gap-[10px]">
              {SIZE_OPTIONS.map((size) => {
                const val = size.toLowerCase(); // value를 미리 소문자로 만들어둬야 비교 로직이 일관됨
                const isChecked = selected.includes(val);
                return (
                  <label key={size} className="cursor-pointer">
                    <input
                      type="checkbox"
                      name="size"
                      value={val}
                      className="hidden"
                      checked={isChecked}
                      onChange={() => onToggle(val)} // 부모(ProductListPage)의 toggleFilter 호출
                    />
                    <span
                      className={`block rounded border py-[10px] text-center text-[13px] transition-colors ${
                        isChecked
                          ? "border-terracotta-500 bg-terracotta-500 text-navy-950"
                          : "border-navy-600 bg-navy-800 text-cream/80 hover:border-terracotta-400"
                      }`}
                    >
                      {size}
                    </span>
                  </label>
                );
              })}
            </div>
          </section>
        </form>
      </div>
    </aside>
  );
}
