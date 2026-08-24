// src/pages/ProductDetail/components/SizeGuideSidebar.tsx
interface SizeGuideSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const sizeTable = [
  { size: "XXS", pants: 34, alt: 28 },
  { size: "XXS ~ XS", pants: 36, alt: 30 },
  { size: "XS ~ S", pants: 38, alt: 32 },
  { size: "S ~ M", pants: 40, alt: 34 },
  { size: "M ~ L", pants: 42, alt: 36 },
  { size: "L ~ XL", pants: 44, alt: 38 },
  { size: "XL ~ XXL", pants: 46, alt: 40 },
];

export default function SizeGuideSidebar({
  isOpen,
  onClose,
}: SizeGuideSidebarProps) {
  return (
    <aside
      className={`fixed top-0 right-0 z-sidebar flex h-screen w-[360px] flex-col border-1 border-navy-700 bg-navy-900 shadow-[-5px_0_15px_rgba(0,0,0,0.1)] transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
      aria-label="사이즈 가이드"
    >
      {/* 헤더 영역 */}
      <header className="flex items-center justify-between border-b border-navy-700 p-[24px]">
        <h3 className="m-0 text-[18px] font-bold text-cream">
          Men's Size Guide
        </h3>
        <button
          type="button"
          className="cursor-pointer border-none bg-transparent text-[14px] text-cream/70 hover:text-cream"
          aria-label="사이즈 가이드 닫기"
          onClick={onClose}
        >
          닫기
        </button>
      </header>

      {/* 스크롤 가능한 테이블 본문 영역 */}
      <div className="flex-1 overflow-y-auto p-[24px]">
        <div className="grid grid-cols-3 border-t border-l border-navy-700">
          <div className="border-r border-b border-navy-700 bg-navy-800 px-[10px] py-[14px] text-center text-[14px] font-bold text-cream">
            Size
          </div>
          <div className="border-r border-b border-navy-700 bg-navy-800 px-[10px] py-[14px] text-center text-[14px] font-bold text-cream">
            Pants
          </div>
          <div className="border-r border-b border-navy-700 bg-navy-800 px-[10px] py-[14px] text-center text-[14px] font-bold text-cream">
            인치(Alternative)
          </div>

          {sizeTable.map((row) => (
            <div key={row.size} style={{ display: "contents" }}>
              <div className="border-r border-b border-navy-700 px-[10px] py-[14px] text-center text-[14px] font-medium text-cream/80">
                {row.size}
              </div>
              <div className="border-r border-b border-navy-700 px-[10px] py-[14px] text-center text-[14px] font-medium text-cream/80">
                {row.pants}
              </div>
              <div className="border-r border-b border-navy-700 px-[10px] py-[14px] text-center text-[14px] font-medium text-cream/80">
                {row.alt}
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
