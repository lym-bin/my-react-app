// src/hooks/useDisclosure.ts

import { useState } from "react";

// initial 초기값
export default function useDisclosure(initial = false) {
  const [isOpen, setIsOpen] = useState(initial);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  return { isOpen, open, close };
}
