// src/pages/ProductDetail/components/SizeGuideSidebar.tsx
// 부모가 관리하는 state(isOpen)를 props로 받아서 따르는 컴포넌트 (자기 state 없음)
// 슬라이드 인/아웃 -> 카테고리에 맞는 사이즈표를 3열 그리드로 렌더링
import type { CategoryId } from "../ProductList/Categories";

interface SizeGuideSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  category?: CategoryId;
}

interface SizeRow {
  size: string;
  col2: number | string;
  col3: number | string;
}

interface SizeGuide {
  title: string;
  headers: [string, string, string];
  rows: SizeRow[];
}

// 카테고리별 사이즈표 (컴포넌트 밖 정적 데이터)
const SIZE_GUIDES: Record<CategoryId, SizeGuide> = {
  top: {
    title: "Tops Size Guide",
    headers: ["Size", "가슴단면(cm)", "총장(cm)"],
    rows: [
      { size: "S", col2: 52, col3: 68 },
      { size: "M", col2: 54, col3: 70 },
      { size: "L", col2: 56, col3: 72 },
      { size: "XL", col2: 58, col3: 74 },
    ],
  },
  outer: {
    title: "Outer Size Guide",
    headers: ["Size", "가슴단면(cm)", "총장(cm)"],
    rows: [
      { size: "S", col2: 56, col3: 70 },
      { size: "M", col2: 58, col3: 72 },
      { size: "L", col2: 60, col3: 74 },
      { size: "XL", col2: 62, col3: 76 },
    ],
  },
  pants: {
    title: "Pants Size Guide",
    headers: ["Size", "Pants", "인치(Alternative)"],
    rows: [
      { size: "XXS", col2: 34, col3: 28 },
      { size: "XXS ~ XS", col2: 36, col3: 30 },
      { size: "XS ~ S", col2: 38, col3: 32 },
      { size: "S ~ M", col2: 40, col3: 34 },
      { size: "M ~ L", col2: 42, col3: 36 },
      { size: "L ~ XL", col2: 44, col3: 38 },
      { size: "XL ~ XXL", col2: 46, col3: 40 },
    ],
  },
  shoes: {
    title: "Shoes Size Guide",
    headers: ["사이즈(mm)", "US", "UK"],
    rows: [
      { size: "230", col2: "6", col3: "5" },
      { size: "240", col2: "7", col3: "6" },
      { size: "250", col2: "8", col3: "7" },
      { size: "260", col2: "9", col3: "8" },
      { size: "270", col2: "10", col3: "9" },
      { size: "280", col2: "11", col3: "10" },
    ],
  },
};

export default function SizeGuideSidebar({
  isOpen,
  onClose,
  category,
}: SizeGuideSidebarProps) {
  // category가 없으면(방어) 바지 기준으로 폴백
  const guide = category ? SIZE_GUIDES[category] : SIZE_GUIDES.pants;

  return (
    <aside
      className={`fixed top-0 right-0 z-sidebar flex h-screen w-[360px] flex-col border-1 border-navy-700 bg-navy-900 shadow-[-5px_0_15px_rgba(0,0,0,0.1)] transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
      aria-label="사이즈 가이드"
    >
      {/* 헤더 영역 */}
      <header className="flex items-center justify-between border-b border-navy-700 p-[24px]">
        <h3 className="m-0 text-[18px] font-bold text-cream">{guide.title}</h3>
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
        {/* 3열 그리드: 카테고리별 헤더 3칸*/}
        <div className="grid grid-cols-3 border-t border-l border-navy-700">
          <div className="border-r border-b border-navy-700 bg-navy-800 px-[10px] py-[14px] text-center text-[14px] font-bold text-cream">
            {guide.headers[0]}
          </div>
          <div className="border-r border-b border-navy-700 bg-navy-800 px-[10px] py-[14px] text-center text-[14px] font-bold text-cream">
            {guide.headers[1]}
          </div>
          <div className="border-r border-b border-navy-700 bg-navy-800 px-[10px] py-[14px] text-center text-[14px] font-bold text-cream">
            {guide.headers[2]}
          </div>

          {/* guide.rows 배열을 돌면서 행마다 셀 3개씩 그림 */}
          {guide.rows.map((row) => (
            <div key={row.size} style={{ display: "contents" }}>
              <div className="border-r border-b border-navy-700 px-[10px] py-[14px] text-center text-[14px] font-medium text-cream/80">
                {row.size}
              </div>
              <div className="border-r border-b border-navy-700 px-[10px] py-[14px] text-center text-[14px] font-medium text-cream/80">
                {row.col2}
              </div>
              <div className="border-r border-b border-navy-700 px-[10px] py-[14px] text-center text-[14px] font-medium text-cream/80">
                {row.col3}
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
