// src/hooks/useDisclosure.ts

import { useEffect, useState } from "react";

// initial 초기값
export default function useDisclosure(initial = false) {
  const [isOpen, setIsOpen] = useState(initial);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  // 열려있는 동안 ESC 키로 닫기
  useEffect(() => {
    if (!isOpen) return;
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen]);

  return { isOpen, open, close };
}
