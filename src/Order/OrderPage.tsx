// src/Order/OrderPage.tsx
// 로그인 안 됐거나 로딩중이거나 장바구니 비었으면 그에 맞는 화면을 보여줌
// 다 통과하면 배송지를 고르고 토스 결제창을 여는 페이지 (주문 저장은 결제 승인 후 PaymentSuccessPage에서)
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import AddressModal from "./AddressModal";
import { type Address } from "../types/address";
import useAddresses from "./useAddresses";
import { clearPendingOrder, savePendingOrder } from "../Payment/pendingOrder";

// 저장된 배송지가 하나도 없을 때 보여줄 예시 배송지
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

export default function OrderPage() {
  const navigate = useNavigate();
  const { user, isLoading, nickname } = useAuth(); // 로그인 정보

  const { items, totalPrice } = useCart(); // 장바구니 정보
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCanceled, setIsCanceled] = useState(false); // 결제 창을 직접 닫았는지
  // 가리킬 요소가 없는 빈 박스는 null이지만 예/아니요로 잡아둬야 false 기본값
  const isPayingRef = useRef(false); // 지금 결제창이 떠있는지, 아닌지 빈 박스 생성

  // 배송지 목록은 Firestore에서 불러옴 (useAddresses 커스텀 훅)
  // 객체 구조분해 + 이름 바꾸기: addresses를 savedAddresses라는 이름으로 꺼냄
  const {
    addresses: savedAddresses,
    isLoading: isAddressLoading,
    addAddress,
  } = useAddresses(user?.uid);
  // 저장된 게 없으면 예시 배송지를 보여줌 (첫 배송지를 추가하면 예시는 사라짐)
  const addresses =
    savedAddresses.length > 0 ? savedAddresses : initialAddresses;
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );
  // 고른 id로 목록에서 찾아 씀 (주소 객체를 state로 따로 복사해 두지 않음 = 단일 진실 공급원)
  // [0]! : "!" = TS한테 "이 배열의 0번째, null/undefined 아닌 거 내가 보장해" (예시 배송지가 항상 있음)
  const currentAddress =
    addresses.find((a) => a.id === selectedAddressId) ?? addresses[0]!;

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

  // 결제 후 뒤로 가기 시 브라우저가 결제창이 떠 있던 /order를 bfcache에서 그대로 복원함
  // → 이미 끝난 결제창이 멈춰 있고, 닫으면 "종료된 세션" 오류가 나서 빠져나갈 수 없었음
  // → 복원(persisted)된 경우 새로 고쳐서 지금의 진짜 상태(비워진 장바구니)로 다시 그림
  useEffect(() => {
    // 핸들러 정의
    function handlePageShow(e: PageTransitionEvent) {
      if (e.persisted) {
        window.location.reload();
      }
    }
    // effect가 실행될 때 등록 (함수 바깥)
    window.addEventListener("pageshow", handlePageShow);

    // cleanup (함수 바깥)
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  // 결제창이 떠 있는 채로 SPA로 이동하면 토스 창이 남음
  // cleanup이 실행 되는 순간 current 최신 값이 들어있기 때문에 ref
  useEffect(() => {
    // 나타날 때는 할 일 없음
    return () => {
      // 사라 질 때
      if (isPayingRef.current) {
        clearPendingOrder();
        alert("결제가 취소되었습니다.");
        window.location.reload();
      }
    };
  }, []);

  // 로그인 확인 중이거나 배송지를 불러오는 중이면 로딩 표시
  if (isLoading || isAddressLoading) {
    return (
      <main className="mx-auto w-full max-w-content bg-navy-950 px-[20px] py-[80px] text-center text-cream/60">
        로딩 중...
      </main>
    );
  }

  // 리다이렉트 되기 전 렌더링 방지
  if (!user) {
    return null;
  }

  // 결제창 띄우기 -> 결제가 끝나면 성공/실패 주소로 이동, PC에서 창을 닫으면 USER_CANCEL 에러
  const handleRequestPayment = async () => {
    if (isSubmitting || items.length === 0) return;
    isPayingRef.current = true;
    setIsCanceled(false); // 다시 결제를 시작하면 지난번 취소 안내는 지움
    setIsSubmitting(true);

    const orderId = `ORD-${Date.now().toString().slice(-8)}`;
    const firstName = items[0]?.name ?? "상품";
    const orderName =
      items.length > 1 ? `${firstName} 외 ${items.length - 1}건` : firstName;

    // 결제창에 다녀오면 state가 사라지니까, 떠나기 전에 주문 정보를 맡겨둠
    const saved = savePendingOrder({
      orderId,
      amount: totalPrice,
      items,
      address: currentAddress,
      nickname: nickname ?? "회원",
    });
    if (!saved) {
      alert("주문 정보를 저장하지 못했어요. 브라우저 설정을 확인해 주세요");
      setIsSubmitting(false);
      isPayingRef.current = false;
      return;
    }
    try {
      // SDK를 불러와서 결제창 객체 만들기 (customerKey: 구매자 구분값, 추측하기 어려운 Firebase uid 사용)
      const tossPayments = await loadTossPayments(
        import.meta.env.VITE_TOSS_CLIENT_KEY,
      );
      const payment = tossPayments.payment({ customerKey: user.uid });

      // successUrl을 넘기면 "리다이렉트 방식": 결제가 끝나면 그 주소로 페이지 전체가 이동함
      await payment.requestPayment({
        method: "CARD",
        amount: { currency: "KRW", value: totalPrice },
        orderId,
        orderName,
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      });
    } catch (error) {
      setIsSubmitting(false);
      isPayingRef.current = false;
      clearPendingOrder(); // 결제를 안 했으니 맡겨둔 주문 정보도 치움

      // 사용자가 결제창을 직접 닫은 건 오류가 아니라 선택 -> 알림 없이 원래 화면 그대로
      const code = (error as { code?: string }).code;
      if (code === "USER_CANCEL") {
        setIsCanceled(true);
        return;
      }

      // 그 외: 결제창 자체를 못 띄운 경우 (키가 틀렸거나 파라미터 오류)
      console.error("결제창을 열지 못했습니다.", error);
      alert("결제창을 열지 못했습니다. 다시 시도해 주세요.");
    }
  };
  if (items.length === 0) {
    return (
      <main className="mx-auto w-full max-w-content bg-navy-950 px-[20px] py-[80px] text-center text-cream/60">
        <p className="mb-[20px]">장바구니가 비어 있습니다.</p>
        <button
          type="button"
          onClick={() => navigate("/products")}
          className="cursor-pointer border border-terracotta-500 bg-transparent px-[24px] py-[10px] text-14 text-terracotta-500 transition-colors hover:bg-terracotta-500 hover:text-navy-950"
        >
          쇼핑하러 가기
        </button>
      </main>
    );
  }

  return (
    <main className="relative mx-auto flex w-full max-w-content flex-col gap-[30px] bg-navy-950 px-[16px] py-[30px] sm:px-[20px] md:flex-row md:gap-[40px] md:py-[40px]">
      <div className="flex flex-1 flex-col gap-[40px]">
        {/* 배송 정보 */}
        <section className="border-b border-navy-700 pb-[30px]">
          <h2 className="mb-[20px] text-cream">배송 정보</h2>
          <div className="mb-[10px] flex flex-wrap items-center gap-[12px] sm:gap-[20px]">
            <strong className="text-cream">{nickname ?? "회원"}</strong>
            <span className="rounded-[4px] bg-navy-800 px-[4px] py-[2px] text-14 text-cream/70">
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
                    className="product-photo h-[90px] w-[90px] flex-shrink-0 bg-navy-800 object-cover sm:h-[150px] sm:w-[150px]"
                  />
                ) : (
                  <div className="h-[90px] w-[90px] flex-shrink-0 bg-navy-800 sm:h-[150px] sm:w-[150px]"></div>
                )}
                <div className="flex flex-col gap-[8px] sm:gap-[10px]">
                  <h3 className="text-cream">{item.name}</h3>
                  <div className="flex flex-wrap items-center gap-[6px] text-13 text-cream/60 sm:text-14">
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

        {/* 결제 수단: 실제 선택(카드, 간편결제)은 토스 결제창 안에서 하도록 함 */}
        <section className="border-b border-navy-700 pb-[30px]">
          <h2 className="mb-[20px] text-cream">결제 수단</h2>
          <p className="text-cream/85">카드 · 간편결제 (토스페이먼츠)</p>
          <p className="mt-[8px] text-13 text-terracotta-400">
            테스트 결제입니다. 실제로 돈이 나가지 않아요.
          </p>
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
              <span className="text-16 font-bold text-cream">총 결제 금액</span>
              <strong className="text-24 font-bold text-terracotta-400 sm:text-24">
                {totalPrice.toLocaleString()}원
              </strong>
            </li>
          </ul>
        </div>

        <button
          type="button"
          disabled={isSubmitting}
          className="mt-[14px] cursor-pointer border-none bg-terracotta-500 py-[16px] text-16 font-bold text-navy-950 transition-colors duration-200 hover:bg-terracotta-600 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={handleRequestPayment}
        >
          {/* inSubmitting이면 "처리 중..." 버튼 텍스트로. 아니면 실제 결제 금액 표시*/}
          {isSubmitting
            ? "처리 중...."
            : `${totalPrice.toLocaleString()}원 결제하기`}
        </button>

        {isCanceled && (
          <p className="mt-[10px] text-center text-13 text-cream/60">
            결제를 취소했어요. 장바구니와 배송지는 그대로 유지됩니다.
          </p>
        )}
      </aside>

      {/* 배송지 선택/추가 모델*/}
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        addresses={addresses}
        selectedId={currentAddress.id}
        onSelect={(addr) => setSelectedAddressId(addr.id)}
        onAdd={(newAddress) => {
          // 서버 저장이 실패하면 알려줌 (성공하면 훅이 목록에 추가해줌)
          addAddress(newAddress).catch((error) => {
            console.error("배송지 저장 중 오류가 발생했습니다.", error);
            alert("배송지 저장에 실패했습니다. 다시 시도해 주세요.");
          });
        }}
      />
    </main>
  );
}
