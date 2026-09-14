// src/Login/LoginPage.tsx
// mode(login/signup) state로 폼 하나를 로그인/회원가입 겸용으로 쓰고
// useAuth의 login/signup/resetPassword를 호출하는 로그인 페이지
import React, { useState } from "react"; // React 자체 import (FormEvent 제네릭 쓰려고)
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/layout/Logo";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, signup, resetPassword } = useAuth(); // AuthContext에서 3개 함수만 꺼냄

  // 로그인/회원가입 폼에서 토글
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState(""); // 에러 아닌 "안내 메시지용" (비밀번호 재설정 메일 발송 성공 등)
  const [isSubmitting, setIsSubmitting] = useState(false);

  // <HTMLFormElement> = 제네릭. "이 FormEvent는 어떤 HTML 요소에서 발생했는지"를 구체적으로 지정
  // (FormEvent 자체는 여러요소에 두루 쓰이는 범용 타입이라 폼이란걸 명시함)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); // 이전 에러 지우고 시작
    setIsSubmitting(true);

    try {
      if (mode === "signup") {
        await signup(email, password, nickname);
      } else {
        await login(email, password);
      }
      navigate("/"); // 성공하면 홈으로
    } catch {
      // Firebase가 구체적 에러코드를 줘도, 여기선 그냥 통 메시지로(보안상 "이메일이 없습니다" 식으로 세분화 안 함)
      setError(
        mode === "signup"
          ? "회원가입에 실패 했습니다. 이메일 형식과 비밀번호(6자 이상)을 확인 해주세요."
          : "이메일 또는 비밀번호가 올바르지 않습니다.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // TODO: 아이디/비밀번호 찾기 페이지 경로
  const handleComingSoon = () => {
    alert("아직 준비중인 페이지입니다.");
  };

  const handlePasswordReset = async () => {
    setError("");
    setInfo("");
    if (!email) {
      setError("비밀번호를 재설정할 이메일을 먼저 입력해주세요.");
      return; // 조기 종료
    }
    try {
      await resetPassword(email); // AuthContext의 sendPasswordResetEmail 호출
      setInfo("비밀번호 재설정 메일을 보냈습니다. 메일함을 확인해주세요.");
    } catch {
      setError("재설정 메일 발송에 실패했습니다. 이메일을 확인해주세요.");
    }
  };

  return (
    <main className="mx-auto my-[90px] w-full max-w-[500px] rounded-[12px] border border-navy-700 bg-navy-900 px-[35px] py-[45px] shadow-sm">
      <Link
        to="/"
        className="mb-[40px] flex justify-center"
        aria-label="홈으로 이동"
      >
        <Logo size="lg" />
      </Link>

      <form onSubmit={handleSubmit} className="flex flex-col">
        {/* 회원가입 모드일 때만 닉네임 입력창 표시 */}
        {mode === "signup" && (
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임을 입력해 주세요."
            required
            className="mb-[12px] w-full rounded-[8px] border border-navy-600 bg-navy-950 px-[14px] py-[12px] text-[14px] text-cream outline-none placeholder:text-cream/40 focus:border-terracotta-400"
          />
        )}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일을 입력해 주세요."
          required
          className="mb-[12px] w-full rounded-[8px] border border-navy-600 bg-navy-950 px-[14px] py-[12px] text-[14px] text-cream outline-none placeholder:text-cream/40 focus:border-terracotta-400"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호를 입력해 주세요."
          required
          minLength={6}
          className="mb-[16px] w-full rounded-[8px] border border-navy-600 bg-navy-950 px-[14px] py-[12px] text-[14px] text-cream placeholder:text-cream/40 outline-none focus:border-terracotta-400"
        />

        {/* error/info 각각 있을 때만 표시, 동시에 둘 다 올 수도 있는 구조(서로 배타적이지 않음)*/}
        {error && <p className="mb-[16px] text-[13px] text-danger">{error}</p>}
        {info && (
          <p className="mb-[16px] text-[13px] text-terracotta-400">{info}</p>
        )}

        <div className="mb-[20px] flex items-center justify-between text-[13px] text-cream/60">
          <div className="flex items-center gap-[6px]">
            {/* checked/onChange 없는 체크박스: 브라우저가 알아서 체크 상태 관리(uncontrolled)*/}
            {/* 이 값을 읽어서 쓰는 로직이 없어서 "자동로그인" 기능 자체는 아직 안 붙음*/}
            <input
              type="checkbox"
              id="keep"
              className="accent-terracotta-500"
            />
            <label htmlFor="keep">자동로그인</label>
          </div>
          <div className="flex gap-[8px]">
            <button
              type="button"
              onClick={handleComingSoon}
              className="hover:text-terracotta-400 hover:underline"
            >
              아이디 찾기
            </button>
            <span>|</span>
            <button
              type="button"
              onClick={handlePasswordReset}
              className="hover:text-terracotta-400 hover:underline"
            >
              비밀번호 찾기
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mb-[20px] w-full cursor-pointer rounded-[8px] bg-terracotta-500 py-[13px] text-[14px] font-medium text-navy-950 transition-colors hover:bg-terracotta-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting
            ? "처리중..."
            : mode === "signup"
              ? "회원가입"
              : "로그인"}
        </button>

        <button
          type="button"
          onClick={() => {
            // 함수형 업데이트로 login <-> signup toggle
            setMode((prev) => (prev === "login" ? "signup" : "login"));
            setError(""); // 모드 바뀌면 이전 에러 지움
          }}
          className="mb-[20px] w-full cursor-pointer text-[13px] text-cream/60 hover:text-terracotta-400"
        >
          {mode === "signup"
            ? "이미 계정이 있으신가요? 로그인"
            : "계정이 없으신가요? 회원가입"}
        </button>
      </form>

      <section className="flex flex-col gap-[10px] border-t border-navy-700 pt-[20px]">
        <button
          type="button"
          className="flex items-center justify-center rounded-[8px] bg-naver py-[12px] text-[14px] font-medium text-white"
          onClick={handleComingSoon}
        >
          네이버 로그인
        </button>
        <button
          type="button"
          className="flex items-center justify-center rounded-[8px] bg-kakao py-[12px] text-[14px] font-medium text-[#3c1e1e]"
          onClick={handleComingSoon}
        >
          카카오 로그인
        </button>
      </section>
    </main>
  );
}
