import { Link } from "react-router-dom";

export default function QuickNav() {
  const categories: string[] = ["FASHION", "TRAVEL", "EVERY DAY", "MINIATURES"];

  return (
    <section className="border-t border-b border-[#e0e0e0] bg-white">
      <div className="mx-auto max-w-[1200px] px-[16px] py-[16px]">
        <ul className="flex justify-center gap-[40px] text-[0.85rem] italic tracking-[0.05em] text-[#b0b0b0]">
          {categories.map((category) => {
            const slug = category.toLowerCase().replace(/\s+/g, "-");
            return (
              <li key={category}>
                {/* a 태그 대신 Link 컴포넌트 사용 */}
                <Link
                  to={`/category/${slug}`}
                  aria-label={`퀵 메뉴 ${category} 카테고리 이동`}
                  className="transition-colors hover:text-black"
                >
                  {category}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
