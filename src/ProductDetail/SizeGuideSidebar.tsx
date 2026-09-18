// src/pages/ProductDetail/components/SizeGuideSidebar.tsx
// 부모가 관리하는 state(isOpen)를 props로 받아서 따르는 컴포넌트 (자기 state 없음)
// 슬라이드 인/아웃 -> 고정된 정적 데이터를 3열 그리드로 렌더링

// CartSidebar랑 같은 패턴 자기 state 없이 부모(useDisclosure)가 내려준 값을 따름
// 제어형 컴포넌트
interface SizeGuideSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// 정적 데이터: 객체 배열 (사이즈표 한 행 = 객체 하나)
// 렌더링마다 새로 만들 필요 없는 데이터라 함수 밖에 둠
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
        {/* 3열 그리드: Size / Pants / 인치 헤더 3칸*/}
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

          {/* sizeTable 배열을 돌면서 행마다 셀 3개씩 그림 */}
          {/* .map()으로 리스트를 만들 땐 key를 달 wrapper 요소가 필요한데 3열 그리드 안에서 wrappper가 있으면 꺠짐 contents속성 추가*/}
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
