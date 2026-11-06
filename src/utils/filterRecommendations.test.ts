// src/utils/filterRecommendations.test.ts
import { describe, test, expect } from "vitest";
import { filterRecommendations } from "./filterRecommendations";
import { PRODUCTS } from "../ProductList/ProductsData";

// 1번 티셔츠(상의)를 보고 있다고 가정 → 서버와 똑같이 상의를 뺀 12개가 후보
const candidates = PRODUCTS.filter((p) => p.category !== "top");

describe("filterRecommendations", () => {
  test("정상: 아우터, 하의, 신발 3개는 그대로 통과", () => {
    const result = filterRecommendations(
      [
        { id: 5, reason: "깔끔하게 어울림" },
        { id: 9, reason: "단정한 조화" },
        { id: 13, reason: "캐주얼한 매치" },
      ],
      candidates,
    );
    expect(result).toHaveLength(3);
  });

  test("없는 ID(999)는 버림", () => {
    const result = filterRecommendations(
      [{ id: 999, reason: "좋아요" }],
      candidates,
    );
    expect(result).toEqual([]);
  });

  test("자기 자신ID(id:1)이면 버림", () => {
    const result = filterRecommendations(
      [{ id: 1, reason: "현재 보고 있는 상품" }],
      candidates,
    );
    expect(result).toEqual([]);
  });

  test("같은 카테고리(id:2)이면 버림", () => {
    const result = filterRecommendations(
      [{ id: 2, reason: "같은 카테고리" }],
      candidates,
    );
    expect(result).toEqual([]);
  });

  test("이유가 정확히 21자이면 버림.", () => {
    const result = filterRecommendations(
      [{ id: 5, reason: "가".repeat(21) }],
      candidates,
    );
    expect(result).toEqual([]);
  });

  test("이유가 딱 20자면 통과.", () => {
    const result = filterRecommendations(
      [{ id: 5, reason: "가".repeat(20) }],
      candidates,
    );
    expect(result).toHaveLength(1);
  });

  test("이유가 string이 아님(reason: 123)", () => {
    const result = filterRecommendations([{ id: 5, reason: 123 }], candidates);
    expect(result).toEqual([]);
  });

  test("같은 하의가 두 개이면(9번과 10번 상품)", () => {
    const result = filterRecommendations(
      [
        { id: 9, reason: "어울리는 하의 1번" },
        { id: 10, reason: "어울리는 하의 2번" },
      ],
      candidates,
    );
    expect(result).toHaveLength(1);
  });

  test("4개의 상품을 줬을 때(몇 개가 남는지)", () => {
    const result = filterRecommendations(
      [
        { id: 5, reason: "아우터 추천" },
        { id: 1, reason: "상의 추천" },
        { id: 9, reason: "하의 추천" },
        { id: 999, reason: "없는 상품" },
      ],
      candidates,
    );
    expect(result).toHaveLength(2);
  });
});
