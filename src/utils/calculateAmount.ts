// src/utils/calculateAmount.ts
// 서버 결제 금액 재계산 (테스트하기 쉽게 confirm.ts에서 분리)

// 예전 Node가 못읽는 js 확장자 추가
import { PRODUCTS } from "../ProductList/ProductsData.js";

// confirm.ts 최대 수량 MAX_QTY 상수
const MAX_QTY = 20;

// 상품 번호와 수량으로 서버가 직접 합계를 계산(브라우저가 보낸 가격은 믿지 않음)
// 없는 상품이거나 수량이 이상하면 null
export function calculateAmount(
  items: { productId: number; qty: number }[],
): number | null {
  let total = 0;
  for (const item of items) {
    const product = PRODUCTS.find((p) => p.id === item.productId);
    const isValidQty =
      // 정수인가? (1.5개 같은건 X), 1개 이상인가?, 20개 이하인가?(21개 안됨 명시)
      Number.isInteger(item.qty) && item.qty >= 1 && item.qty <= MAX_QTY;
    if (!product || !isValidQty) return null;
    total += product.price * item.qty;
  }
  return total;
}
