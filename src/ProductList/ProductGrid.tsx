// src/pages/ProductList/components/ProductGrid.tsx
import ProductCard from "./ProductCard";

type RowType = "3col" | "mixed";

interface Row {
  id: number;
  type: RowType;
  largeFirst?: boolean;
}

const rows: Row[] = [
  { id: 1, type: "3col" },
  { id: 2, type: "mixed", largeFirst: true },
  { id: 3, type: "3col" },
  { id: 4, type: "mixed", largeFirst: false },
];

export default function ProductGrid() {
  return (
    <section className="mx-auto w-full max-w-[1200px] px-[20px]">
      {rows.map((row) => (
        <ul className="mb-[40px] grid grid-cols-3 gap-[24px]" key={row.id}>
          {row.type === "3col" ? (
            <>
              <ProductCard href="/products/1" name="White T" price="$ 500" />
              <ProductCard name="Jacket" price="$ 800" />
              <ProductCard name="White Shirt" price="$ 400" />
            </>
          ) : row.largeFirst ? (
            <>
              <ProductCard isLarge name="Featured Denim" price="$ 950" />
              <ProductCard name="Shoes" price="$ 350" />
            </>
          ) : (
            <>
              <ProductCard name="Slim Slax" price="$ 430" />
              <ProductCard isLarge name="Special Edition" price="$ 1,100" />
            </>
          )}
        </ul>
      ))}

      {/* 더보기 버튼 영역 */}
      <div className="mt-[48px] mb-[40px] flex justify-center">
        <button
          type="button"
          className="cursor-pointer border border-[#ccc] bg-white px-[40px] py-[12px] text-[14px] font-medium transition-colors hover:border-black hover:bg-black hover:text-white"
        >
          더보기
        </button>
      </div>
    </section>
  );
}
