import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { collection, query, where, getDocs } from "firebase/firestore";
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

  // 주문 내역 상태 관리
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [isOrderLoading, setIsOrderLoading] = useState(true);

  // 로그인 상태 확인 및 주문 내역 페치
  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      navigate("/login");
      return;
    }

    let isCancelled = false;

    async function fetchOrders() {
      if (!user) return;
      try {
        // userId가 현재 로그인한 유저의 uid와 일치하는 문서 조회
        const q = query(
          collection(db, "orders"),
          where("userId", "==", user.uid),
        );
        const querySnapshot = await getDocs(q);
        const fetchedOrders: OrderData[] = [];
        querySnapshot.forEach((doc) => {
          fetchedOrders.push({ id: doc.id, ...doc.data() } as OrderData);
        });
        setOrders(fetchedOrders);
      } catch (error) {
        console.error("주문 내역을 불러오는 중 에러 발생:", error);
      } finally {
        setIsOrderLoading(false);
      }
    }

    if (isLoggedIn && user) {
      fetchOrders();
    }
  }, [isLoading, isLoggedIn, user, navigate]);

  const handleComingSoon = () => {
    alert("아직 준비 중인 페이지입니다.");
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

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
            onClick={handleComingSoon}
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
                        : handleComingSoon
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
    </main>
  );
}
