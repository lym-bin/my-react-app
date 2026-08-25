import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

interface Address {
  id: string;
  title: string;
  recipient: string;
  address: string;
  phone: string;
}

const savedAddresses: Address[] = [
  {
    id: "1",
    title: "기본 배송지",
    recipient: "홍길동",
    address: "경기도 수원시 팔달구 123",
    phone: "010-1234-1234",
  },
  {
    id: "2",
    title: "회사",
    recipient: "홍길동",
    address: "서울특별시 강남구 테헤란로 456",
    phone: "010-1234-1234",
  },
];

const pmMethods = [
  { id: "pm-toss", value: "toss", label: "토스페이" },
  { id: "pm-kakao", value: "kakao", label: "카카오페이" },
  { id: "pm-naver", value: "naver", label: "네이버페이" },
  { id: "pm-order", value: "order", label: "기타결제" },
];

export default function OrderPage() {
  const navigate = useNavigate();
  const { user, isLoading, nickname } = useAuth();

  const { items, totalPrice, clearCart } = useCart();
  const [selectedpm, setSelectedpm] = useState("toss");
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<Address>(
    savedAddresses[0],
  );

  // 1. 비회원 접근 차단
  useEffect(() => {
    if (!isLoading && !user) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  // 로딩 중일 때는 로딩바 표시
  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-[1200px] bg-navy-950 px-[20px] py-[80px] text-center text-cream/60">
        로딩 중...
      </main>
    );
  }

  // 리다이렉트 되기 전 렌더링 방지
  if (!user) {
    return null;
  }

  const handleSubmitOrder = async () => {
    if (items.length === 0) return;

    const orderData = {
      userId: user.uid, // 이제 확실하게 실제 회원 UID가 들어갑니다
      nickname: nickname ?? "회원",
      items,
      totalPrice,
      address: currentAddress,
      paymentMethod: selectedpm,
      orderId: `ORD-${Date.now().toString().slice(-8)}`,
      createdAt: new Date().toISOString(),
    };

    try {
      await addDoc(collection(db, "orders"), orderData);
      navigate("/ordersuccess", { state: orderData });
      clearCart();
    } catch (error) {
      console.error("주문 저장 중 오류가 발생했습니다.", error);
      alert("결제 처리에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  if (items.length === 0) {
    return (
      <main className="mx-auto w-full max-w-[1200px] bg-navy-950 px-[20px] py-[80px] text-center text-cream/60">
        <p className="mb-[20px]">장바구니가 비어 있습니다.</p>
        <button
          type="button"
          onClick={() => navigate("/products")}
          className="cursor-pointer border border-terracotta-500 bg-transparent px-[24px] py-[10px] text-[14px] text-terracotta-500 transition-colors hover:bg-terracotta-500 hover:text-navy-950"
        >
          쇼핑하러 가기
        </button>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-[1200px] gap-[40px] bg-navy-950 px-[20px] py-[40px] relative">
      <div className="flex flex-1 flex-col gap-[40px]">
        {/* 배송 정보 */}
        <section className="border-b border-navy-700 pb-[30px]">
          <h2 className="mb-[20px] text-cream">배송 정보</h2>
          <div className="mb-[10px] flex items-center gap-[20px]">
            <strong className="text-cream">{nickname ?? "회원"}</strong>
            <span className="rounded-[4px] bg-navy-800 px-[4px] py-[2px] text-[14px] text-cream/70">
              {currentAddress.title}
            </span>
            <button
              type="button"
              onClick={() => setIsAddressModalOpen(true)}
              className="ml-auto cursor-pointer border border-navy-600 bg-transparent px-[12px] py-[6px] text-cream/85 transition-colors hover:border-terracotta-400 hover:text-terracotta-400"
            >
              배송지 변경
            </button>
          </div>
          <address className="not-italic leading-[1.7] text-cream/70">
            <p>{currentAddress.address}</p>
            <p>{currentAddress.phone}</p>
          </address>
        </section>

        {/* 주문 상품 */}
        <section className="border-b border-navy-700 pb-[30px]">
          <h2 className="mb-[20px] text-cream">주문 상품 ({items.length})</h2>
          <ul className="flex flex-col gap-[24px]">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-[20px]">
                <img
                  src={item.imgSrc}
                  alt={item.name}
                  className="h-[150px] w-[150px] bg-navy-800 object-cover"
                />
                <div className="flex flex-col gap-[10px]">
                  <h3 className="text-cream">{item.name}</h3>
                  <div className="text-[14px] text-cream/60 flex items-center gap-[6px]">
                    <span>색상: {item.color}</span>
                    <span className="text-navy-600">|</span>
                    <span>사이즈: {item.size}</span>
                    <span className="text-navy-600">|</span>
                    <span>수량: {item.qty}개</span>
                  </div>
                  <strong className="text-cream">
                    {(item.price * item.qty).toLocaleString()}원
                  </strong>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* 결제 수단 */}
        <section className="border-b border-navy-700 pb-[30px]">
          <h2 className="mb-[20px] text-cream">결제 수단</h2>
          <ul className="mb-[16px] flex gap-[20px]">
            {pmMethods.map((method) => (
              <li key={method.id} className="flex items-center gap-[10px]">
                <input
                  type="radio"
                  id={method.id}
                  name="pm-method"
                  value={method.value}
                  checked={selectedpm === method.value}
                  onChange={() => setSelectedpm(method.value)}
                  className="accent-terracotta-500"
                />
                <label
                  htmlFor={method.id}
                  className="text-cream/60 cursor-pointer"
                >
                  {method.label}
                </label>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* 결제 금액 패널 */}
      <aside className="flex w-[360px] flex-col gap-[20px] border border-navy-700 bg-navy-900 p-[20px] h-fit">
        <h2 className="text-cream">결제 금액</h2>
        <div className="bg-navy-800 p-[14px]">
          <ul className="m-0 flex flex-col gap-[16px] p-0">
            <li className="flex justify-between text-cream/80">
              <span>상품 금액</span>
              <strong className="text-cream">
                {totalPrice.toLocaleString()}원
              </strong>
            </li>
            <li className="flex justify-between text-cream/80">
              <span>배송비</span>
              <strong className="text-cream">무료 배송</strong>
            </li>
            <li className="mt-[10px] flex items-end justify-between border-t border-dashed border-navy-600 pt-[16px]">
              <span className="text-[16px] font-bold text-cream">
                총 결제 금액
              </span>
              <strong className="text-[24px] font-bold text-terracotta-400">
                {totalPrice.toLocaleString()}원
              </strong>
            </li>
          </ul>
        </div>

        <button
          type="button"
          className="mt-[14px] cursor-pointer border-none bg-terracotta-500 py-[16px] text-[16px] font-bold text-navy-950 transition-colors duration-200 hover:bg-terracotta-600"
          onClick={handleSubmitOrder}
        >
          {totalPrice.toLocaleString()}원 결제하기
        </button>
      </aside>

      {/* 배송지 변경 모달 생략 가능 부분 */}
    </main>
  );
}
