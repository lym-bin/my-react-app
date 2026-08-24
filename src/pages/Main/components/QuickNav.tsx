import { Link } from "react-router-dom";
import { CATEGORIES } from "../../../ProductList/Categories";
export default function QuickNav() {
  return (
    <section className="border-t border-b border-navy-700 bg-navy-950">
      <div className="mx-auto max-w-[1200px] px-[16px] py-[16px]">
        <ul className="flex justify-center gap-[40px] text-[0.85rem] italic tracking-[0.05em] text-cream/50">
          {CATEGORIES.map(({ id, label }) => (
            <li key={id}>
              <Link
                to={`/products?category=${id}`}
                aria-label={`퀵 메뉴 ${label} 카테고리 이동`}
                className="transition-colors hover:text-terracotta-400"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
