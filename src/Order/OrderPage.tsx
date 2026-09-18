// src/Order/OrderPage.tsx
// 로그인 안 됐거나 로딩중이거나 장바구니 비었으면 그에 맞는 화면을 보여줌
// 다 통과하면 배송지/결제수단 골라서 Firestore에 주문 저장하는 페이지
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { collection, addDoc } from "firebase/firestore"; // Firestore(DB) 관련 함수들
import { db } from "../firebase"; // firebase.ts에서 만든 Firestore 접속 통로
import AddressModal from "./AddressModal";

// 정적 데이터
interface Address {
  id: string;
  title: string;
  recipient: string;
  address: string;
  phone: string;
}

// 배송지 기본값(localStorage에 저장된 게 없을 때 씀)
const initialAddresses: Address[] = [
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

// 결제수단 4개
const pmMethods = [
  { id: "pm-toss", value: "toss", label: "토스페이" },
  { id: "pm-kakao", value: "kakao", label: "카카오페이" },
  { id: "pm-naver", value: "naver", label: "네이버페이" },
  { id: "pm-order", value: "order", label: "기타결제" },
];

const ADDRESS_STORAGE_KEY = "objet-b-addresses";

// localStorage에서 저장된 배송지 목록 불러오기 (CartContext의 loadinitiallItems랑 똑같은 패턴)
function loadInitalAddresses(): Address[] {
  try {
    const raw = localStorage.getItem(ADDRESS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Address[];
      if (parsed.length > 0) return parsed;
    }
  } catch {
    // ignore
  }
  return initialAddresses; // 저장된 게 없거나 실패하면 기본 배송지2개
}

export default function OrderPage() {
  const navigate = useNavigate();
  const { user, isLoading, nickname } = useAuth(); // 로그인 정보

  const { items, totalPrice, clearCart } = useCart(); // 장바구니 정보
  const [selectedpm, setSelectedpm] = useState("toss"); // 선택된 결제수단
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  // (A) 함수 자체를 넘김 (괄호 없음) -> "lazy 초기화" : 첫 렌더링 때만 딱 한 번 실행 됨
  const [addresses, setAddresses] = useState<Address[]>(loadInitalAddresses);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // (B) 함수를 호출해서 (괄호 있음) 그 결과를 넘김 -> 매 렌더링마다 다시 실행됨 (비효율)
  // [0]! : "!" = TS한테 "이 배열의 0번째, null/undefined 아닌 거 내가 보장해"
  const [currentAddress, setCurrentAddress] = useState<Address>(
    // 함수 참조만 넘기고, 결과에서 [0] 꺼내는 건 함수 안으로 옮김 (lazy 초기화)
    () => loadInitalAddresses()[0]!,
  );

  // addresses가 바뀔 때마다 localStorage에 저장
  useEffect(() => {
    try {
      localStorage.setItem(ADDRESS_STORAGE_KEY, JSON.stringify(addresses));
    } catch {
      // ignore
    }
  }, [addresses]);

  // 1. 비회원 접근 차단

  // useEffect는 렌더링이 끝난 뒤이므로 로그인 안된 사람이 페이지 접근 시
  // 한 번 렌더링 해야하는 순간 !user가 실행 -> (navigate("/login")) 발동
  // !user인 상태로 배송지/결제 로직이 실행되면 에러 날 수 있으니
  // if (!user) return null; 아무것도 그리지마라는 안전한 빈 화면 보여줌
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
    // 이미 제출 중이면 무시 (중복 클릭 방지)
    if (isSubmitting) return;
    if (items.length === 0) return;
    setIsSubmitting(true);

    const orderData = {
      userId: user.uid,
      nickname: nickname ?? "회원",
      items,
      totalPrice,
      address: currentAddress,
      paymentMethod: selectedpm,
      orderId: `ORD-${Date.now().toString().slice(-8)}`,
      createdAt: new Date().toISOString(),
    };

    // collection(db, "orders") : Firebase DB 안의 orders라는 테이블
    // addDoc(그 컬렉션, orderData): 그 안에 새 문서(레코드) 하나를 추가
    // CartContext가 localStorage에 저장했던 것과 달리 진짜 서버(firebase)DB에
    // 저장 해야 하므로 비동기(await) 사용하고 try/catch로 예외처리
    // finally : 성공하든 실패하든 무조건 실행
    // setIsSybmitting(false): 성공 시엔 어차피 다른 페이지로 이동, 실패 했을 때도 "처리중"
    // 버튼이 계속 멈춰있지 않고 다시 누를 수 있는 상태로 돌아오게 하려면 반드시 실행해야하므로
    // navigate("/ordersuccess", { state: orderData }) : useNavigate에
    // 두 번째 인자로 객체를 넘기면 데이터가 URL에 안 보이지만 OrderSuccessPage로 그대로 전달
    try {
      await addDoc(collection(db, "orders"), orderData);
      navigate("/ordersuccess", { state: orderData });
      clearCart();
    } catch (error) {
      console.error("주문 저장 중 오류가 발생했습니다.", error);
      alert("결제 처리에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
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
    <main className="relative mx-auto flex w-full max-w-[1200px] flex-col gap-[30px] bg-navy-950 px-[16px] py-[30px] sm:px-[20px] md:flex-row md:gap-[40px] md:py-[40px]">
      <div className="flex flex-1 flex-col gap-[40px]">
        {/* 배송 정보 */}
        <section className="border-b border-navy-700 pb-[30px]">
          <h2 className="mb-[20px] text-cream">배송 정보</h2>
          <div className="mb-[10px] flex flex-wrap items-center gap-[12px] sm:gap-[20px]">
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
          {/* <address>는 "연락처 정보 전용 시맨틱 태그, non-italic으로 기본 기울임체 해제*/}
          <address className="not-italic leading-[1.7] text-cream/70">
            <p>{currentAddress.address}</p>
            <p>{currentAddress.phone}</p>
          </address>
        </section>

        {/* 주문 상품 목록*/}
        <section className="border-b border-navy-700 pb-[30px]">
          <h2 className="mb-[20px] text-cream">주문 상품 ({items.length})</h2>
          <ul className="flex flex-col gap-[24px]">
            {/* 이미지 있으면 img, 없으면 빈 색상 박스 (ProductDetailPage 패턴 재사용 ) */}
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-center gap-[20px] sm:gap-[20px]"
              >
                {item.imgSrc ? (
                  <img
                    src={item.imgSrc}
                    alt={item.name}
                    className="h-[90px] w-[90px] flex-shrink-0 bg-navy-800 object-cover sm:h-[150px] sm:w-[150px]"
                  />
                ) : (
                  <div className="h-[90px] w-[90px] flex-shrink-0 bg-navy-800 sm:h-[150px] sm:w-[150px]"></div>
                )}
                <div className="flex flex-col gap-[8px] sm:gap-[10px]">
                  <h3 className="text-cream">{item.name}</h3>
                  <div className="flex flex-wrap items-center gap-[6px] text-[13px] text-cream/60 sm:text-[14px]">
                    <span>색상: {item.color}</span>
                    <span className="text-navy-600">|</span>
                    {/* 구분선 역할하는 텍스트 파이프*/}
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

        {/* 결제 수단: ProductDatailPage 색상/사이즈 라디오랑 다른 방식 */}
        <section className="border-b border-navy-700 pb-[30px]">
          <h2 className="mb-[20px] text-cream">결제 수단</h2>
          <ul className="mb-[16px] flex flex-wrap gap-[14px] sm:gap-[20px]">
            {/* 네이티브 라디오 그대로 노출 (hidden 안 씀). accent-*로 체크 색상*/}
            {pmMethods.map((method) => (
              <li key={method.id} className="flex items-center gap-[10px]">
                <input
                  type="radio"
                  id={method.id} // <- 이 id를
                  name="pm-method"
                  value={method.value}
                  checked={selectedpm === method.value}
                  onChange={() => setSelectedpm(method.value)}
                  className="accent-terracotta-500" // 네이티브 라디오 체크 색상 커스텀 (Tailwind 유틸)
                />
                {/* label과 input이 형제 관계 htmlFor={method.id)로 id랑 "이름으로" 연결*/}
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
      <aside className="flex w-full flex-col gap-[20px] border border-navy-700 bg-navy-900 p-[20px] md:h-fit md:w-[360px]">
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
              <strong className="text-[24px] font-bold text-terracotta-400 sm:text-[24px]">
                {totalPrice.toLocaleString()}원
              </strong>
            </li>
          </ul>
        </div>

        <button
          type="button"
          disabled={isSubmitting}
          className="mt-[14px] cursor-pointer border-none bg-terracotta-500 py-[16px] text-[16px] font-bold text-navy-950 transition-colors duration-200 hover:bg-terracotta-600 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={handleSubmitOrder}
        >
          {/* inSubmitting이면 "처리 중..." 버튼 텍스트로. 아니면 실제 결제 금액 표시*/}
          {isSubmitting
            ? "처리 중...."
            : `${totalPrice.toLocaleString()}원 결제하기`}
        </button>
      </aside>

      {/* 배송지 선택/추가 모델*/}
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        addresses={addresses}
        selectedId={currentAddress.id}
        onSelect={(addr) => setCurrentAddress(addr)}
        onAdd={(newAddress) => setAddresses((prev) => [...prev, newAddress])} // 함수형 업데이트로 배열에 새 배송치 추가
      />
    </main>
  );
}
