// src/Order/AddressModal.tsx
// 배송지 목록 선택 + 새 배송지 추가 모달
import { useEffect, useState, type FormEvent } from "react";

interface Address {
  id: string;
  title: string;
  recipient: string;
  address: string;
  phone: string;
}

// 상태+함수 전달(실제 배송지 목록은 부모(OrderPage)가 갖고 있음)
interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  addresses: Address[];
  selectedId: string;
  onSelect: (address: Address) => void; // Address 하나를 받아서 아무것도 안 리턴하는 함수 타입
  onAdd: (address: Address) => void;
}

export default function AddressModal({
  // mode: "list"(배송지 목록 보기) | "add"(새 배송지 입력폼) 두 상태를 오가는 미니 상태머신
  isOpen,
  onClose,
  addresses,
  selectedId,
  onSelect,
  onAdd,
}: AddressModalProps) {
  // useState<SortOption> 처럼 타입을 문자열 리터럴 유니온("list" | "add")으로 좁혀둔 패턴
  // (2개 상태)의 미니 상태 머신
  const [mode, setMode] = useState<"list" | "add">("list");
  const [title, setTitle] = useState(""); // 새 배송지 입력폼의 각 필드
  const [recipient, setRecipient] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  // 모달을 새로 열 때마다 목록 화면부터 보여줌.
  // 리액트 훅(useState/useEffect)의 절대 규칙: "매 렌더링마다 정확히 같은 개수."
  // 같은 순서로 호출돼야한다
  useEffect(() => {
    if (isOpen) {
      setMode("list");
      setTitle("");
      setRecipient("");
      setAddress("");
      setPhone("");
    }
  }, [isOpen]);

  //ESC키로 닫기: document 전체에 키보드 리스너 등록
  useEffect(() => {
    if (!isOpen) return; // (이건 훅 "안"이라 괜찮음 - 콜백 함수 내부의 조기 리턴이라 규칙 위반 아님)
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null; // <- fix: 리턴 위치 옮김

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title || !recipient || !address || !phone) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    const newAddress: Address = {
      id: `addr-${Date.now()}`, // 현재 시간 타임스탬프로 고유 id 생성
      title, // 단축 속성명(shorthand property)키 이름과 변수 이름이 완전히 같을 때, 한 번만 써도 자동으로 채워짐
      recipient,
      address,
      phone, // 단축 속성명(key와 변수명 같으면 값 생략 가능)
    };
    onAdd(newAddress); // 부모의 addresses 배열에 추가
    onSelect(newAddress); // 방금 추가한 걸 바로 선택 상태로
    onClose(); // 모델 닫기
  };

  return (
    <div
      className="fixed inset-0 z-sidebar flex items-center justify-center bg-navy-950/70 px-[16px]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[420px] rounded-[8px] border border-navy-700 bg-navy-900 p-[24px] shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-[16px] flex items-center justify-between">
          <h3 className="text-[16px] font-bold text-cream">
            {mode === "list" ? "배송지 선택" : "새 배송지 추가"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="배송지 선택 닫기"
            className="cursor-pointer text-cream/60 hover:text-cream"
          >
            ✕
          </button>
        </div>

        {mode === "list" ? (
          <>
            <ul className="flex flex-col gap-[10px]">
              {/* .map() 콜백 안에서 isSelected라는 중간 변수를 먼저 계산 그 아래에서 재사용*/}
              {addresses.map((addr) => {
                const isSelected = addr.id === selectedId;
                return (
                  <li key={addr.id}>
                    <button
                      type="button"
                      onClick={() => {
                        onSelect(addr);
                        onClose();
                      }}
                      className={`w-full cursor-pointer rounded-[6px] border p-[14px] text-left transition-colors ${
                        isSelected
                          ? "border-terracotta-500 bg-navy-800"
                          : "border-navy-700 hover:border-terracotta-400"
                      }`}
                    >
                      <div className="mb-[6px] flex items-center gap-[8px]">
                        <span className="text-[13px] font-bold text-cream">
                          {addr.title}
                        </span>
                        {isSelected && (
                          <span className="rounded-full bg-terracotta-500 px-[8px] py-[2px] text-[11px] font-bold text-navy-950">
                            선택됨
                          </span>
                        )}
                      </div>
                      <p className="text-[13px] text-cream/70">
                        {addr.recipient}
                      </p>
                      <p className="text-[13px] text-cream/70">
                        {addr.address}
                      </p>
                      <p className="text-[13px] text-cream/70">{addr.phone}</p>
                    </button>
                  </li>
                );
              })}
            </ul>

            <button
              type="button"
              onClick={() => setMode("add")}
              className="mt-[14px] w-full cursor-pointer rounded-[6px] border border-dashed border-navy-600 py-[12px] text-[13px] text-cream/70 transition-colors hover:border-terracotta-400 hover:text-terracotta-400"
            >
              + 새 배송지 추가
            </button>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-[10px]">
            {/* 모든 입력창이 같은 패턴: value(state) + onChange(state 갱신) = 완전한 controlled input*/}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="배송지 이름 (예: 집, 회사)"
              required
              className="w-full rounded-[6px] border border-navy-600 bg-navy-950 px-[12px] py-[10px] text-[13px] text-cream outline-none placeholder:text-cream/40 focus:border-terracotta-400"
            />
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="받는 사람"
              required
              className="w-full rounded-[6px] border border-navy-600 bg-navy-950 px-[12px] py-[10px] text-[13px] text-cream outline-none placeholder:text-cream/40 focus:border-terracotta-400"
            />
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="주소"
              required
              className="w-full rounded-[6px] border border-navy-600 bg-navy-950 px-[12px] py-[10px] text-[13px] text-cream outline-none placeholder:text-cream/40 focus:border-terracotta-400"
            />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="연락처"
              required
              className="w-full rounded-[6px] border border-navy-600 bg-navy-950 px-[12px] py-[10px] text-[13px] text-cream outline-none placeholder:text-cream/40 focus:border-terracotta-400"
            />

            <div className="mt-[6px] flex gap-[10px]">
              <button
                type="button"
                onClick={() => setMode("list")}
                className="flex-1 cursor-pointer rounded-[6px] border border-navy-600 py-[10px] text-[13px] text-cream/80 transition-colors hover:border-terracotta-400 hover:text-terracotta-400"
              >
                뒤로
              </button>
              <button
                type="submit"
                className="flex-1 cursor-pointer rounded-[6px] bg-terracotta-500 py-[10px] text-[13px] font-bold text-navy-950 transition-colors hover:bg-terracotta-600"
              >
                저장하고 사용
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
