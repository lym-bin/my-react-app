// src/pages/ProductList/components/FilterSidebar.tsx
interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  selected: string[];
  onToggle: (value: string) => void;
}

const colors = [
  "블랙",
  "화이트",
  "블루",
  "그레이",
  "브라운",
  "베이지",
  "레드",
  "옐로우",
];
const colorValues = [
  "black",
  "white",
  "blue",
  "gray",
  "brown",
  "beige",
  "red",
  "yellow",
];
const sizes = ["XXXS", "XXS", "XS", "S", "M", "L", "XL", "XXL"];

export default function FilterSidebar({
  isOpen,
  onClose,
  selected,
  onToggle,
}: FilterSidebarProps) {
  return (
    <aside
      className={`fixed top-0 right-0 z-[9999] flex h-screen w-[360px] flex-col bg-white shadow-[-5px_0_15px_rgba(0,0,0,0.1)] transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
      aria-label="상품 상세 필터"
    >
      {/* 헤더 영역 */}
      <header className="flex items-center justify-between border-b border-[#eee] p-[24px]">
        <h3 className="m-0 text-[18px] font-bold">Filter</h3>
        <button
          type="button"
          className="cursor-pointer border-none bg-transparent text-[14px] font-semibold text-[#222]"
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
            <h4 className="mb-[14px] text-[15px] font-bold text-[#111]">
              색상
            </h4>
            <div className="grid grid-cols-2 gap-[10px]">
              {colors.map((label, i) => {
                const val = colorValues[i];
                const isChecked = selected.includes(val);
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
                          ? "border-black bg-black text-white"
                          : "border-[#e5e5e5] bg-white text-[#333] hover:border-[#999]"
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
            <h4 className="mb-[14px] text-[15px] font-bold text-[#111]">
              사이즈
            </h4>
            <div className="grid grid-cols-3 gap-[10px]">
              {sizes.map((size) => {
                const val = size.toLowerCase();
                const isChecked = selected.includes(val);
                return (
                  <label key={size} className="cursor-pointer">
                    <input
                      type="checkbox"
                      name="size"
                      value={val}
                      className="hidden"
                      checked={isChecked}
                      onChange={() => onToggle(val)}
                    />
                    <span
                      className={`block rounded border py-[10px] text-center text-[13px] transition-colors ${
                        isChecked
                          ? "border-black bg-black text-white"
                          : "border-[#e5e5e5] bg-white text-[#333] hover:border-[#999]"
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
