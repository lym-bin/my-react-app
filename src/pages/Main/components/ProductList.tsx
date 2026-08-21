import { Link } from "react-router-dom";

interface Product {
  id: number;
  name: string;
  option: string;
  price: string;
  img: string;
}

export default function ProductList() {
  const products: Product[] = [
    {
      id: 1,
      name: "White T",
      option: "(White)",
      price: "$ 500",
      img: "/images/modalgrid_1.jpg",
    },
    {
      id: 2,
      name: "Jacket",
      option: "(Matte Black)",
      price: "$ 800",
      img: "/images/modalgrid_2.jpg",
    },
    {
      id: 3,
      name: "White Shirt",
      option: "(White)",
      price: "$ 400",
      img: "/images/modalgrid_3.jpg",
    },
    {
      id: 4,
      name: "jean(Slax)",
      option: "(Beige)",
      price: "$ 430",
      img: "/images/modalgrid_4.jpg",
    },
    {
      id: 5,
      name: "Denim Shirt",
      option: "(Matte Blue)",
      price: "$ 640",
      img: "/images/modalgrid_5.jpg",
    },
    {
      id: 6,
      name: "shoes",
      option: "(Matte Black)",
      price: "$ 350",
      img: "/images/modalgrid_6.jpg",
    },
  ];

  return (
    <section>
      <div className="mx-auto mb-[50px] max-w-[1200px] px-[16px] py-[40px]">
        <ul className="grid w-full grid-cols-3 gap-x-[30px] gap-y-[60px] text-center">
          {products.map((product) => (
            <li key={product.id}>
              <Link
                to={`/products/${product.id}`}
                className="block text-center text-inherit"
              >
                {/* 이미지 영역: aspect 비율 추가로 레이아웃 안정화 */}
                <div className="mb-[20px] aspect-[3/4] w-full overflow-hidden bg-[#f7f7f7]">
                  <img
                    src={product.img}
                    alt={product.name}
                    className="block h-full w-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                  />
                </div>

                {/* 텍스트 정보 영역: flex로 세로 정렬 및 간격 확보 */}
                <div className="flex flex-col gap-[4px]">
                  <em className="not-italic text-[15px] font-medium text-[#333]">
                    {product.name}
                  </em>
                  <span className="text-[14px] text-[#777]">
                    {product.option}
                  </span>
                  <strong className="text-[15px] font-bold text-black">
                    {product.price}
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
