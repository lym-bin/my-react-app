import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, signup } = useAuth();

  // 로그인/회원가입 폼에서 토글
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (mode === "signup") {
        await signup(email, password);
      } else {
        await login(email, password);
      }
      navigate("/");
    } catch {
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

  return (
    <main className="mx-auto my-[90px] w-full max-w-[500px] rounded-[12px] border border-navy-700 bg-navy-900 px-[35px] py-[45px] shadow-sm">
      <Link
        to="/"
        className="mb-[40px] block text-center"
        aria-label="홈으로 이동"
      >
        <img
          src="/images/Logo_1.svg"
          alt="ObjetB 로고"
          className="mx-auto h-[65px] object-contain brigtness-90 invert"
        />
      </Link>

      <form onSubmit={handleSubmit} className="flex flex-col">
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

        {error && <p className="mb-[16px] text-[13px] text-danger">{error}</p>}

        <div className="mb-[20px] flex items-center justify-between text-[13px] text-cream/60">
          <div className="flex items-center gap-[6px]">
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
              onClick={handleComingSoon}
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
            setMode((prev) => (prev === "login" ? "signup" : "login"));
            setError("");
          }}
          className="mb-[20px] w-full cursor-pointer text-[13px] text-cream/60 hover-text-terracotta-400"
        >
          {mode === "signup"
            ? "이미 계정이 있으신가요? 로그인"
            : "계정이 없으신가요? 회원가입"}
        </button>
      </form>

      <section className="flex flex-col gap-[10px] border-t border-navy-700 pt-[20px]">
        <a
          href="https://nid.naver.com/nidlogin.login"
          className="flex items-center justify-center rounded-[8px] bg-naver py-[12px] text-[14px] font-medium text-white"
          target="_blank"
          rel="noreferrer"
        >
          네이버 로그인
        </a>
        <a
          href="https://accounts.kakao.com/login"
          className="flex items-center justify-center rounded-[8px] bg-kakao py-[12px] text-[14px] font-medium text-[#3c1e1e]"
          target="_blank"
          rel="noreferrer"
        >
          카카오 로그인
        </a>
      </section>
    </main>
  );
}
