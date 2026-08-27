// src/Mypage/EditProfileModal.tsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function mapAuthError(error: unknown): string {
  const code = (error as { code?: string })?.code ?? "";
  switch (code) {
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "현재 비밀번호가 일치하지 않습니다.";
    case "auth/weak-password":
      return "새 비밀번호는 6자 이상이어야 합니다.";
    case "auth/requires-recent-login":
      return "보안을 위해 다시 로그인한 뒤 시도해주세요.";
    default:
      return "회원정보 수정 중 오류가 발생했습니다. 다시 시도해주세요.";
  }
}

export default function EditProfileModal({
  isOpen,
  onClose,
}: EditProfileModalProps) {
  const { user, updateNickname, changePassword } = useAuth();

  const [nickname, setNickname] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // 열릴 때마다 현재 닉네임으로 초기화하고 비밀번호 입력은 비워둡니다.
  useEffect(() => {
    if (isOpen) {
      setNickname(user?.displayName ?? "");
      setCurrentPassword("");
      setNewPassword("");
      setNewPasswordConfirm("");
      setMessage(null);
    }
  }, [isOpen, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const wantsPasswordChange =
      currentPassword || newPassword || newPasswordConfirm;

    if (wantsPasswordChange) {
      if (!currentPassword || !newPassword || !newPasswordConfirm) {
        setMessage({
          type: "error",
          text: "비밀번호를 변경하려면 세 항목을 모두 입력해주세요.",
        });
        return;
      }
      if (newPassword !== newPasswordConfirm) {
        setMessage({
          type: "error",
          text: "새 비밀번호가 서로 일치하지 않습니다.",
        });
        return;
      }
      if (newPassword.length < 6) {
        setMessage({
          type: "error",
          text: "새 비밀번호는 6자 이상이어야 합니다.",
        });
        return;
      }
    }

    setIsSaving(true);
    try {
      if (nickname !== (user?.displayName ?? "")) {
        await updateNickname(nickname);
      }
      if (wantsPasswordChange) {
        await changePassword(currentPassword, newPassword);
      }
      setMessage({ type: "success", text: "회원정보가 수정되었습니다." });
      setCurrentPassword("");
      setNewPassword("");
      setNewPasswordConfirm("");
    } catch (error) {
      setMessage({ type: "error", text: mapAuthError(error) });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <aside
      className={`fixed top-0 right-0 z-sidebar flex h-screen w-[360px] flex-col border-1 border-navy-700 bg-navy-900 shadow-[-5px_0_15px_rgba(0,0,0,0.4)] transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
      aria-label="회원 정보 수정"
    >
      <header className="flex items-center justify-between border-b border-navy-700 p-[24px]">
        <h3 className="m-0 text-[18px] font-bold text-cream">회원 정보 수정</h3>
        <button
          type="button"
          className="cursor-pointer border-none bg-transparent text-[14px] text-cream/70 hover:text-cream"
          aria-label="회원 정보 수정 닫기"
          onClick={onClose}
        >
          닫기
        </button>
      </header>

      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-[24px]">
        <div className="mb-[24px]">
          <label
            className="mb-[8px] block text-[13px] text-cream/70"
            htmlFor="nickname"
          >
            닉네임
          </label>
          <input
            id="nickname"
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder={user?.email ?? ""}
            className="w-full border border-navy-600 bg-navy-800 px-[12px] py-[10px] text-[14px] text-cream outline-none focus:border-terracotta-400"
          />
        </div>

        <div className="mb-[16px] border-t border-navy-700 pt-[20px]">
          <p className="mb-[14px] text-[13px] font-medium text-cream/70">
            비밀번호 변경 (변경하지 않으면 비워두세요)
          </p>

          <div className="mb-[12px]">
            <label
              className="mb-[6px] block text-[12px] text-cream/50"
              htmlFor="currentPassword"
            >
              현재 비밀번호
            </label>
            <input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full border border-navy-600 bg-navy-800 px-[12px] py-[10px] text-[14px] text-cream outline-none focus:border-terracotta-400"
            />
          </div>

          <div className="mb-[12px]">
            <label
              className="mb-[6px] block text-[12px] text-cream/50"
              htmlFor="newPassword"
            >
              새 비밀번호
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border border-navy-600 bg-navy-800 px-[12px] py-[10px] text-[14px] text-cream outline-none focus:border-terracotta-400"
            />
          </div>

          <div>
            <label
              className="mb-[6px] block text-[12px] text-cream/50"
              htmlFor="newPasswordConfirm"
            >
              새 비밀번호 확인
            </label>
            <input
              id="newPasswordConfirm"
              type="password"
              value={newPasswordConfirm}
              onChange={(e) => setNewPasswordConfirm(e.target.value)}
              className="w-full border border-navy-600 bg-navy-800 px-[12px] py-[10px] text-[14px] text-cream outline-none focus:border-terracotta-400"
            />
          </div>
        </div>

        {message && (
          <p
            className={`mb-[16px] text-[13px] ${
              message.type === "success" ? "text-terracotta-400" : "text-danger"
            }`}
          >
            {message.text}
          </p>
        )}

        <button
          type="submit"
          disabled={isSaving}
          className="w-full cursor-pointer border border-terracotta-500 bg-terracotta-500 py-[13px] text-[14px] font-medium text-navy-950 transition-colors hover:bg-terracotta-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving ? "저장 중..." : "저장하기"}
        </button>
      </form>
    </aside>
  );
}
