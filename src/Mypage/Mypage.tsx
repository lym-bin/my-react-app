// src/Mypage/Mypage.tsx
// 로그인 검사 후, Firestore에서 사용자의 주문내역을 조회해서 보여주고,
// 최근 본 상품, 회원정보 수정도 같이 관리하는 마이 페이지
import useDisclosure from "../hooks/useDisclosure";
import EditProfileModal from "./EditProfileModal";
import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PRODUCTS } from "../ProductList/ProductsData";
import { getRecentlyViewed } from "../ProductList/recentlyViewed";
import { useAuth } from "../context/AuthContext";
import { collection, query, where, getDocs } from "firebase/firestore"; // Firestore 조회 관련 함수들
import { db } from "../firebase";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  color?: string;
  size?: string;
  imgSrc?: string;
}

interface OrderData {
  id: string;
  orderId: string;
  createdAt: string;
  totalPrice: number;
  items: OrderItem[];
  paymentMethod: string;
}

// 적립금/쿠폰/후기 - 아직 실제 데어터 연결 안된 더미 값
const benefits = [
  { id: 1, label: "적립금", value: "111원" },
  { id: 2, label: "쿠폰", value: "2장" },
  { id: 3, label: "후기", value: "0개" },
];

const mainNav = [
  "주문 내역",
  "취소/반품/교환 내역",
  "최근 본 상품",
  "페이 관리",
];
const subNavComingSoon = ["공지사항", "고객센터", "이벤트"];

export default function MyPage() {
  const navigate = useNavigate();
  const { isLoggedIn, isLoading, user, nickname, logout } = useAuth();
  const editProfile = useDisclosure();

  // 주문 내역 상태 관리
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [isOrderLoading, setIsOrderLoading] = useState(true);
  // 최근 본 상품: localStorage에 저장된 id들 -> 실제 상품 객체로 변환(ProductDetailPage에서 본 패턴)
  const recentlyViewedIds = getRecentlyViewed();
  const recentlyViewedProducts = recentlyViewedIds
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  // DOM 요소를 직접 가리키기 위한 ref, useState와 달리 값이 바뀌어도 리렌더링 안 일어남
  const recentlyViewedRef = useRef<HTMLDivElement>(null);

  // 로그인 상태 확인 및 주문 내역 페치
  useEffect(() => {
    // 로그인 안 됐으면(로딩 끝난 후) 로그인 페이지로
    if (!isLoading && !isLoggedIn) {
      navigate("/login");
      return; // useEffect 콜백 안의 조기 종료 (훅 규칙이랑 무관, 그냥 함수 안 return)
    }

    let isCancelled = false; // 컴포넌트가 사라지면 true로 바뀜 -> 기 뒤엔 setState 안 함

    async function fetchOrders() {
      if (!user) return;
      try {
        // userId가 현재 로그인한 유저의 uid와 일치하는 문서 조회
        // Firestore 쿼리 만들기 : "orders" 컬렉션에서 userId가 내 uid랑 같은 문서만
        const q = query(
          collection(db, "orders"),
          where("userId", "==", user.uid), // SQL의 WHERE절(데이터 조회 수정할 떄 원하는 행 조회)이랑 같은 역할
        );
        const querySnapshot = await getDocs(q); // 쿼리 실행 -> 결과 묶음(snapshot)
        const fetchedOrders: OrderData[] = [];
        // doc.data()는 문서 내용(필드들)만 줌 doc.id(문서 고유ID)는 별도로 붙혀야 함
        // (...) 스프레드로 둘을 합쳐서 하나의 객체로. as로 OrderData 타입이라고 단언
        querySnapshot.forEach((doc) => {
          fetchedOrders.push({ id: doc.id, ...doc.data() } as OrderData);
        });
        if (!isCancelled) setOrders(fetchedOrders); // 이미 떠난 뒤면 setState 스킵
      } catch (error) {
        console.error("주문 내역을 불러오는 중 에러 발생:", error);
      } finally {
        if (!isCancelled) setIsOrderLoading(false);
      }
    }

    if (isLoggedIn && user) {
      fetchOrders();
    }

    return () => {
      isCancelled = true; // cleanup: 마이페이지를 빨리 벗어나면 여기서 true로 바뀜
    };
  }, [isLoading, isLoggedIn, user, navigate]);

  const handleComingSoon = () => {
    alert("아직 준비 중인 페이지입니다.");
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // 로딩 중이거나 로그인 안 됐으면 (리다이렉트 직전) 로딩 문구만
  if (isLoading || !isLoggedIn) {
    return (
      <main className="mx-auto w-full max-w-[1200px] bg-navy-950 px-[16px] py-[80px] text-center text-cream/50">
        로딩 중...
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-[1200px] bg-navy-950 px-[16px] py-[20px]">
      <section>
        <div className="flex items-center gap-[20px]">
          <strong className="text-[18px] font-bold text-cream">
            {nickname}
          </strong>
          <button
            type="button"
            onClick={editProfile.open}
            className="rounded-[4px] border border-navy-600 bg-transparent px-[8px] py-[4px] text-[12px] text-cream/80 transition-colors hover:border-terracotta-400 hover:text-terracotta-400"
          >
            회원 정보 수정
          </button>
        </div>

        <div className="mt-[20px] border-b border-navy-700">
          <ul className="grid grid-cols-3 bg-navy-800 py-[20px] text-center">
            {benefits.map((b) => (
              <li key={b.id}>
                <button
                  type="button"
                  onClick={handleComingSoon}
                  className="flex w-full items-center justify-center gap-[8px] text-cream/80 transition-colors hover:text-terracotta-400"
                >
                  <span className="text-[14px]">{b.label} &gt;</span>
                  <strong className="text-[14px] font-bold text-cream">
                    {b.value}
                  </strong>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 실시간 주문 내역*/}
      <section className="mt-[30px]">
        <h2 className="text-[16px] font-bold text-cream mb-[14px]">
          최근 주문 내역
          {/* 3단계 상태: 로딩중/ 주문 없음/ 주문 있음 - 중첩 삼항연산자로 스위칭*/}
        </h2>
        {isOrderLoading ? (
          <p className="text-[14px] text-cream/50">
            주문 내역을 불러오는 중...
          </p>
        ) : orders.length === 0 ? (
          <div className="rounded-[8px] bg-navy-900 p-[20px] text-center text-[14px] text-cream/60">
            주문 내역이 없습니다.
          </div>
        ) : (
          <div className="flex flex-col gap-[16px]">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-[8px] bg-navy-900 p-[16px] border border-navy-800"
              >
                <div className="flex justify-between items-center border-b border-navy-800 pb-[10px] mb-[12px] text-[13px] text-cream/70">
                  <span>
                    주문번호: <strong>{order.orderId}</strong>
                  </span>
                  <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex flex-col gap-[8px]">
                  {/* 이 주문에 담긴 상품들, idx(배열 인덱스)를 key로 씀*/}
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center text-[14px] text-cream"
                    >
                      <span>
                        {item.name} ({item.color} / {item.size}) x {item.qty}개
                      </span>
                      <span className="font-medium">
                        {(item.price * item.qty).toLocaleString()}원
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-[12px] pt-[10px] border-t border-navy-800 flex justify-between items-center text-[14px]">
                  <span className="text-cream/70">총 결제금액</span>
                  <span className="font-bold text-terracotta-400">
                    {order.totalPrice.toLocaleString()}원
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ref를 감싸는 div에 연결 (scrollIntoView가 이 지점을 찾을 수 있게*/}
      <div ref={recentlyViewedRef}>
        {recentlyViewedProducts.length > 0 && (
          <h2 className="text-[16px] font-bold text-cream mb-[14px]">
            최근 본 상품
          </h2>
        )}
        <ul className="flex gap-[12px] overflow-x-auto pb-[8px]">
          {recentlyViewedProducts.map((p) => (
            <li key={p.id} className="w-[110px] flex-shrink-0">
              <Link to={`/products/${p.id}`} className="block">
                <img
                  src={`/${p.imgSrc}`}
                  alt={p.name}
                  loading="lazy"
                  className="mb-[6px] h-[110px] w-[110px] bg-navy-800 object-cover"
                />
                <span className="line-clamp-2 text-[12px] text-cream/70">
                  {p.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <section className="mt-[40px]">
        <div className="flex flex-col gap-[30px]">
          <nav>
            <ul className="flex flex-col gap-[16px] p-0">
              {mainNav.map((item) => (
                <li key={item}>
                  <button
                    type="button"
                    onClick={
                      item === "주문 내역"
                        ? () =>
                            window.scrollTo({ top: 300, behavior: "smooth" })
                        : item === "최근 본 상품" // ref가 가리키는 그 요소가 보이는 위치로
                          ? () =>
                              recentlyViewedRef.current?.scrollIntoView({
                                behavior: "smooth",
                              })
                          : handleComingSoon // ㄴ머지는 다 "준비중" 알림
                    }
                    className="text-[14px] text-cream/80 hover:text-terracotta-400 hover:underline"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="mb-[40px]">
            <ul className="flex flex-col gap-[16px] p-0">
              {subNavComingSoon.map((item) => (
                <li key={item}>
                  <button
                    type="button"
                    onClick={handleComingSoon}
                    className="text-[14px] text-cream/80 hover:text-terracotta-400 hover:underline"
                  >
                    {item}
                  </button>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-[14px] text-cream/80 hover:text-terracotta-400 hover:underline"
                >
                  로그아웃
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </section>
      {/* 회원정보 수정 사이드바 오픈 시 배경 Dimmed 효과 */}
      {editProfile.isOpen && (
        <div
          className="fixed inset-0 z-[9998] bg-navy-950/70 transition-opacity"
          onClick={editProfile.close}
        />
      )}
      <EditProfileModal
        isOpen={editProfile.isOpen}
        onClose={editProfile.close}
      />
    </main>
  );
}
