import { Link } from "react-router-dom";

import { PRODUCTS } from "../../../ProductList/ProductsData";

export default function ProductList() {
  const featured = PRODUCTS.slice(0, 6);

  return (
    <section className="bg-navy-950">
      <div className="mx-auto mb-[50px] max-w-[1200px] px-[16px] py-[40px]">
        <ul className="grid w-full grid-cols-3 gap-x-[30px] gap-y[60px] text-center">
          {featured.map((product) => (
            <li key={product.id}>
              <Link
                to={`/products/${product.id}`}
                className="block text-center text-inherit"
              >
                {/* 이미지 영역 */}
                <div className="mb-[20px] aspect-[3/4] w-full overflow-hidden bg-navy-800">
                  <img
                    src={product.imgSrc}
                    alt={product.name}
                    className="block h-full w-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                  />
                </div>

                {/* 텍스트 정보 */}

                <div className="flex flex-col gap-[4px]">
                  <em className="text-[15px] text-[15px] font-medium text-cream">
                    {product.name}
                  </em>
                  <strong className="text-[15px] font-bold text-terracotta-400">
                    ${product.price.toLocaleString()}
                  </strong>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
