// src/context/CartSidebarContext.tsx
// 열림/닫기를 필요한 곳만 다시 그릴 수 있게 해주는 context

import { createContext, useContext, type ReactNode } from "react";
import useDisclosure from "../hooks/useDisclosure";

// 관리실이 나눠 주는 것: 열림 여부 + 여는 함수 + 닫는 함수
interface CartSidebarContextValue {
  isOpen: boolean; // 열림/닫힘 boolean
  open: () => void; // 받아올 것 없는 함수 타입
  close: () => void;
}

const CartSidebarContext = createContext<CartSidebarContextValue | undefined>(
  undefined,
); // 초기 값 undefiend

export function CartSidebarProvider({ children }: { children: ReactNode }) {
  const sidebar = useDisclosure();

  return (
    <CartSidebarContext.Provider value={sidebar}>
      {children}
    </CartSidebarContext.Provider>
  );
}

export function useCartSidebar() {
  // useCart()형태
  const ctx = useContext(CartSidebarContext);
  if (!ctx) {
    throw new Error(
      "useCartSidebar는 CartSidebarProvider 안에서만 사용할 수 있습니다.",
    );
  }
  return ctx;
}
