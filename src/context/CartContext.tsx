// src/context/CartContext.tsx
// 장바구니 물건들을 앱 전체가 같이 보는 창고
// 장바구니 목록(items)를 들고 있고 addItem(담기), removeItem(삭제),updateQty(수량),clearCart(비우기)
// 함수들을 만들어서 다른 화면들에 뿌려주는 역할
// localStorage로 새로고침해도 유지 됨
// 카페 주문 접수대 + 자동 장부 시스템
import {
  createContext, // Context "상자"를 만드는 함수
  useContext, // 그 상자를 열어보는 함수
  useEffect, // 렌더링 이후 부수효과(localStorage 저장)실행
  useState, // 컴포넌트가 기억하는 값(state)상태 관리
  type ReactNode, // 화면에 그릴 수 있는 모든 것을 뜻하는 타입
} from "react";

// 바닐라js로 비유 {id: "1-red-M", productId} 객체
// TS에서는 8개필드를 다 가져야한다는 규칙(Interface)
export interface CartItem {
  id: string; // productId+color+size 조합. 같은 상품이라도 옵션이 다르면 별도 항목으로 취급.
  productId: number; // 원본 상품 ID
  name: string;
  price: number;
  color: string;
  size: string;
  qty: number;
  imgSrc: string;
}

interface CartContextValue {
  items: CartItem[]; // 현재 장바구니 목록
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  totalCount: number; // 총 수량
  totalPrice: number; // 총 금액
}

// 빈 상자 생성 기본값 undefined = "Provider로 안 감싸졌을 때"를 감지함
const CartContext = createContext<CartContextValue | undefined>(undefined);

// localStorage에 저장할 떄 쓸 키 이름
const CART_STORAGE_KEY = "objet-b-cart";

// localStorage가 항상 성공한다는 보장이 없으므로 try/catch로 방어
// 에러가 나도 앱이 죽지않게 []빈 배열 리턴
function loadInitialItems(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    // 삼항연산자로 raw(장바구니 키)가 있으면 파싱 없으면 빈 배열
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return []; // localStorage 사용 불가 (시크릿 모드 등) 환경 방어
  }
}

// children: App.tsx에 컴포넌트의 여는 태그와 닫는 태그 사이의 모든 내용을
// 자식에게 전달하는 특수한 prop
// 한마디로 children을 받아서 CartContext.Provider로 감싸 다시 보여주는 컴포넌트
export function CartProvider({ children }: { children: ReactNode }) {
  // items: 현재 장바구니 값, setItems: 그 값을 바꾸는 함수
  // 함수 자체를 넘겨 최초 1회만 실행되게(loadInitialItems)
  // useState의 초기값을 설정 할때 값 대신 함수를 전달하여
  // 첫 렌더링 때만 실행되도록 최적화(Lazy Initialization) 게으른 초기화
  const [items, setItems] = useState<CartItem[]>(loadInitialItems);

  // items가 바뀔 때마다 localStorage에 저장 (시크릿 모드 등 저장 불가 환경은 무시)
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // 저장 실패해도 앱은 계속 동작하게 무시
    }
  }, [items]); // 의존성 배열: items가 바뀔 때마다 effect 재 실행

  // 장바구니에 상품 추가
  // addItem: 주문 받는 직원
  // Omit: 첫번째인자는 기존 타입, 두번째 인자는 제외할 새로운 타입을 만들어주는 내장 유틸리티
  const addItem = (item: Omit<CartItem, "id">) => {
    // 상품+옵션 조합 키
    const id = `${item.productId}-${item.color}-${item.size}`;
    // setItems((prev)): 함수형 업데이트
    setItems((prev) => {
      const existing = prev.find((i) => i.id === id); // 이미 같은 옵션있는지 찾기
      if (existing) {
        // 존재하면 : 그 항목만 수량 더해서 교체(나머지는 그대로 map으로 복사)
        return prev.map((i) =>
          i.id === id ? { ...i, qty: i.qty + item.qty } : i,
        );
      }
      // 없으면: 새 항목으로 배열 끝에 추가
      return [...prev, { ...item, id }];
    });
  };

  // id로 항목 하나 삭제 (filter로 조건을 통과 하는 것만 남기고 새 배열 생성)
  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  // 수량 변경, 0 이하로는 못 내려가게 Math.max(1, qty)로 방어
  const updateQty = (id: string, qty: number) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i)),
    );
  };

  // 장바구니 전체 비우기
  const clearCart = () => setItems([]);

  // 매 렌더링마다 Itmes 기준으로 다시 계산 ( 별도 state로 안 만들고 그때 그때 계산)
  // items: 테이블에 올라와 있는 주문 목록.
  // .reduce()로 배열 전체를 순회하면서 하나의 값으로 누적/축약
  const totalCount = items.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQty,
        clearCart,
        totalCount,
        totalPrice,
      }}
    >
      {children /* 받은 children을 상자로 감싸서 다시 렌더링 */}
    </CartContext.Provider>
  );
}

// 다른 컴포넌트들이 실제로 쓰는 창구
export function useCart() {
  const ctx = useContext(CartContext); // 상자 열어보기
  if (!ctx) {
    // Provider 밖에서 잘못 호출된 경우 바로 thorw에러 날려줌
    throw new Error("useCart는 CartProvider 내부에서만 사용할 수 있습니다.");
  }
  return ctx;
}
