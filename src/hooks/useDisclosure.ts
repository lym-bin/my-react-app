// src/hooks/useDisclosure.ts
// open, close에 상태를 관리하는 재사용 부품
// 장바구니 사이드바, 필터 사이드바, 사이즈가이드 등 열고 닫는 useState
// 리액트 HOOK(use접두사, useEffect:렌더링 이후 부수효과 실행, useState: 컴포넌트 상태 추가 관리)를
// 바닐라 JS로 치면 재사용 함수
import { useEffect, useState } from "react";

// initial 초기값, 기본값 false = "매개변수 안 넘기면 닫힌 상태로 시작"
// 리액트에서는 함수 이름이 use접두사로 시작하면
// 내부에서 다른 훅(useState, useEffect 등)을 쓸 수 있는 특별한 함수
// 라는 규칙이 있음 강제X 약속O
//initial은 JS로 보면 매개변수
export default function useDisclosure(initial = false) {
  const [isOpen, setIsOpen] = useState(initial); // 열림/닫힘 상태 하나만 관리
  const open = () => setIsOpen(true); // 여는 함수(밖에서 이 이름으로 씀)
  const close = () => setIsOpen(false); // 닫는 함수

  // 열려있는 동안 ESC 키로 닫기
  useEffect(() => {
    if (!isOpen) return; // 닫혀있으면 리스너 등록 자체를 안 함(불 필요한 등록방지)
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false); // ESC 누르면 닫기
    }
    document.addEventListener("keydown", handleEsc); // 진짜 이벤트 리스너 등록
    return () => document.removeEventListener("keydown", handleEsc); // cleanup: 닫히거나 언마운트 될 때 리스너 해제
  }, [isOpen]); // isOpen 바뀔 떄마다 (열릴 때/ 닫힐 때) 다시 실행

  // 쓰는 쪽에서 구조분해로 꺼내 씀: const cart = useDisclosure();
  return { isOpen, open, close };
}
