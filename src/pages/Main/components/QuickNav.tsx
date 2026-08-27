import { Truck, Zap, RefreshCw, ShieldCheck } from "lucide-react";

const BENEFITS = [
  {
    id: 1,
    icon: Truck,
    label: "전 상품 무료배송",
  },
  {
    id: 2,
    icon: Zap,
    label: "당일 출고",
  },
  {
    id: 3,
    icon: RefreshCw,
    label: "이지 리턴",
  },
  {
    id: 4,
    icon: ShieldCheck,
    label: "품질 보증",
  },
];

export default function QuickNav() {
  return (
    <section className="border-t border-b border-navy-700 bg-navy-950">
      <div className="mx-auto max-w-[1200px] px-[16px] py-[16px]">
        <ul className="flex flex-wrap justify-center gap-x-[32px] gap-y-[10px] text-[0.8rem] tracking-[0.05em] text-cream/50 sm:gap-x-[40px]">
          {/* icon을 IconComponent 등 대문자로 시작하는 변수명으로 받습니다 */}
          {BENEFITS.map(({ id, icon: IconComponent, label }) => (
            <li key={id} className="flex items-center gap-[8px]">
              {/* 대문자 컴포넌트 변수로 렌더링합니다 */}
              <IconComponent size={16} strokeWidth={1.5} aria-hidden="true" />
              <span>{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
