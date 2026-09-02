import { useEffect, useState } from "react";

interface Address {
  id: string;
  title: string;
  recipient: string;
  address: string;
  phone: string;
}

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  addresses: Address[];
  selectedId: string;
  onSelect: (address: Address) => void;
  onAdd: (address: Address) => void;
}

export default function AddressModal({
  isOpen,
  onClose,
  addresses,
  selectedId,
  onSelect,
  onAdd,
}: AddressModalProps) {
  const [mode, setMode] = useState<"list" | "add">("list");
  const [title, setTitle] = useState("");
  const [recipient, setRecipient] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  // 모달을 새로 열 때마다 목록 화면부터 보여줍니다.
  useEffect(() => {
    if (isOpen) {
      setMode("list");
      setTitle("");
      setRecipient("");
      setAddress("");
      setPhone("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  //ESC키로 닫기
  useEffect(() => {
    if (!isOpen) return;
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !recipient || !address || !phone) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    const newAddress: Address = {
      id: `addr-${Date.now()}`,
      title,
      recipient,
      address,
      phone,
    };
    onAdd(newAddress);
    onSelect(newAddress);
    onClose();
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
