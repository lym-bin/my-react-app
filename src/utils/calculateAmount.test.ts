// src/utils/calculateAmount.test.ts

import { describe, test, expect } from "vitest";
import { calculateAmount } from "./calculateAmount";

// 묶음 이름: 무엇을 테스트할지
describe("calculateAmount", () => {
  // 1 ~ 8번 테스트
  test("1번째 상품이 2개 인 경우", () => {
    expect(calculateAmount([{ productId: 1, qty: 2 }])).toBe(96000);
  });

  test("1번째 상품이 1개 + 2번째 상품이 1개", () => {
    expect(
      calculateAmount([
        { productId: 1, qty: 1 },
        { productId: 2, qty: 1 },
      ]),
    ).toBe(112000);
  });

  test("999번째 상품이 1개", () => {
    expect(calculateAmount([{ productId: 999, qty: 1 }])).toBe(null);
  });

  test("1번째 상품이 0개", () => {
    expect(calculateAmount([{ productId: 1, qty: 0 }])).toBe(null);
  });

  test("1번째 상품이 1.5개", () => {
    expect(calculateAmount([{ productId: 1, qty: 1.5 }])).toBe(null);
  });

  test("딱 20개만 허용 -> 960,000원", () => {
    expect(calculateAmount([{ productId: 1, qty: 20 }])).toBe(960000);
  });

  test("21개면 null (최대 20개 초과)", () => {
    expect(calculateAmount([{ productId: 1, qty: 21 }])).toBe(null);
  });

  test("빈 배열이면 0 (빈 장바구니는 호출하는 쪽에서 막음", () => {
    expect(calculateAmount([])).toBe(0);
  });
});
