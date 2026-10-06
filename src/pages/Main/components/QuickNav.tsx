// src/pages/Main/components/QuickNav.tsx
// 배너 아래 혜택 스트림
import { Truck, Zap, RefreshCw, ShieldCheck } from "lucide-react";

// 리액트에서 컴포넌트는 결국 JSX를 리턴하는 함수
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
    label: "무료 반품",
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
      <div className="mx-auto max-w-[1200px] px-[16px] py-[24px]">
        <ul className="grid grid-cols-2 gap-y-[20px] sm:grid-cols-4 sm:gap-y-0">
          {/* icon을 IconComponent 등 대문자로 시작하는 변수명으로 받음 */}
          {BENEFITS.map(({ id, icon: IconComponent, label }, index) => (
            <li
              key={id}
              className={`flex flex-col items-center gap-[8px] px-[12px] text-center ${
                index !== BENEFITS.length - 1
                  ? "sm:border-r sm:border-navy-700"
                  : ""
              }`}
            >
              {/* 대문자 컴포넌트 변수로 렌더링 */}
              <IconComponent
                size={16}
                strokeWidth={1.5}
                className="text-terracotta-400"
                aria-hidden="true"
              />
              <span className="text-[12px] tracking-[0.05em] text-cream/70">
                {label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
