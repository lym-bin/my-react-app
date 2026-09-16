// src/Mypage/EditProfileModal.tsx
// 닉네임/비밀번호 수정 폼, Firebase 에러를 한글로 변환해서 보여줌
import { useEffect, useState, type FormEvent } from "react"; // FormEvent 없음
import { useAuth } from "../context/AuthContext";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Firebase 에러 코드를 한글 메시지로 변환하는 순수 함수 (컴포넌트 밖)
function mapAuthError(error: unknown): string {
  // catch로 잡히는 error는 타입이 unknows(뭔지 모름)이라 바로 .code 못 씀
  // (error as { code?: string})로 "code 필드가 있을 수도 있는 객체"라고 임시로 단정
  // ?.code로(옵셔널 체이닝) 안전하게 꺼내고. ?? ""로 없으면 빈 문자열
  const code = (error as { code?: string })?.code ?? "";
  switch (code) {
    case "auth/wrong-password":
    case "auth/invalid-credential": // 두 케이스가 같은 결과 (연속 case로 묶음, sortProducts에서도 봤던 패턴)
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
  // 객체 모양 state: "성공/실패 여부와 "메시지 내용"을 한 덩어리로 관리
  // type 필드는 "success" | "error"를 둘 중 하나의 객체로 묶음(항상 같이 움직이니까)
  // | null: 아직 아무 메시지도 없을 땐 통째로 null
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // 열릴 때마다 현재 닉네임으로 초기화하고 리셋 (AddressModal의 "열릴 때 초기화" 패턴 재사용).
  useEffect(() => {
    if (isOpen) {
      setNickname(user?.displayName ?? "");
      setCurrentPassword("");
      setNewPassword("");
      setNewPasswordConfirm("");
      setMessage(null);
    }
    // effect가 실행되는 조건(isOpen이 바뀌면, 열리든 닫히든)
  }, [isOpen, user]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // 셋 중 하나라도 같이 있으면 -> "비밀번호도 바꾸려는 의도로 판단"
    // 여기선 ||가 정확히 맞음 : ""(빈 문자열)은 "입력 안 함" 이니까 falsy 취급이 의도와 맞게 떨어짐
    const wantsPasswordChange =
      currentPassword || newPassword || newPasswordConfirm;

    if (wantsPasswordChange) {
      // 가드절 3연타: 하나씩 검증하고 안 맞으면 바로 종료
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
      // 닉네임이 실제로 바뀌었을 때만 API 호출 (안 바뀌었으면 불필요한 요청 안 보냄)
      if (nickname !== (user?.displayName ?? "")) {
        await updateNickname(nickname);
      }
      if (wantsPasswordChange) {
        await changePassword(currentPassword, newPassword); // AuthContex의 재인증+변경 로직
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
            placeholder={user?.email ?? ""} // 값이 아니라 "비었을 때 흐리게 보이는 힌트"로 이메일 사용
            className="w-full border border-navy-600 bg-navy-800 px-[12px] py-[10px] text-[14px] text-cream outline-none focus:border-terracotta-400"
          />
        </div>

        <div className="mb-[16px] border-t border-navy-700 pt-[20px]">
          <p className="mb-[14px] text-[13px] font-medium text-cream/70">
            비밀번호 변경 (변경하지 않으면 비워두세요)
          </p>
          {/* 세 입력창 다 같은 controlled input 패턴*/}

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

        {/* message 객체가 있을 때만 표시. type 값에 따라 색상 분기*/}
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
