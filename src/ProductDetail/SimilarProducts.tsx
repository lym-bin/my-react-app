import { Link } from "react-router-dom";
import { Product, PRODUCTS } from "../ProductList/ProductsData";

interface SimilarProductsProps {
  title?: string;
  count?: number;
  products?: Product[];
}

export default function SimilarProducts({
  title = "비슷한 상품",
  products = PRODUCTS.slice(1, 3), // 기본 값
}: SimilarProductsProps) {
  return (
    <section className="mx-auto w-full max-w-[1200px] bg-navy-950 px-[20px] pt-[80px] pb-[40px]">
      <h2 className="mb-[20px] text-center text-[16px] font-semibold text-cream">
        {title}
      </h2>
      <div className="grid grid-cols-2 gap-[20px]">
        {products.map((product) => (
          <Link
            to={`/products/${product.id}`}
            key={product.id}
            className="group block"
            aria-label={`${product.name}상세 보기`}
          >
            <div className="overflow-hidden bg-navy-800 h-[400px]">
              <img
                src={
                  product.imgSrc.startsWith("/")
                    ? product.imgSrc
                    : `/${product.imgSrc}`
                }
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
              />
            </div>
            <span className="mt-[10px] block text-center text-[14px] font-normal text-cream/70">
              {product.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
