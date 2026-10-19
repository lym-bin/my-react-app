// src/Payment/pendingOrder.ts
// 결제창에 다녀오는 동안(페이지 전체가 이동했다가 들어옴) 주문 정보를 잠깐 맡겨 두는곳.
// sessionStorage: 탭을 닫으면 사라지고 탭마다 따로 있음 -> 결제 한 번 동안 필요한 데이터에 맞음

import type { CartItem } from "../context/CartContext";
import type { Address } from "../types/address";

const PENDING_ORDER_KEY = "objet-b-pending-order";

export interface PendingOrder {
  orderId: string;
  amount: number;
  items: CartItem[];
  address: Address;
  nickname: string;
}

// 저장 성공 여부를 돌려줌 (저장이 안 되면 돌아와서 확인할 방법이 없으니 결제창을 열면 안 됨)
export function savePendingOrder(order: PendingOrder): boolean {
  try {
    sessionStorage.setItem(PENDING_ORDER_KEY, JSON.stringify(order));
    return true;
  } catch {
    return false;
  }
}

export function loadPendingOrder(): PendingOrder | null {
  try {
    const raw = sessionStorage.getItem(PENDING_ORDER_KEY);
    return raw ? (JSON.parse(raw) as PendingOrder) : null;
  } catch {
    return null;
  }
}

export function clearPendingOrder() {
  try {
    sessionStorage.removeItem(PENDING_ORDER_KEY);
  } catch {
    // 저장소 사용 불가 환경은 무시
  }
}
