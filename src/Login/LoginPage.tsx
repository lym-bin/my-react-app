import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 로그인 처리 후 메인으로 이동
    navigate("/");
  };

  return (
    <main className="mx-auto my-[90px] w-full max-w-[500px] rounded-[12px] border border-[#ddd] bg-white px-[35px] py-[45px] shadow-sm">
      <Link
        to="/"
        className="mb-[40px] block text-center"
        aria-label="홈으로 이동"
      >
        <img
          src="/images/Logo_1.svg"
          alt="ObjetB 로고"
          className="mx-auto h-[65px] object-contain"
        />
      </Link>

      <form id="lg-form" onSubmit={handleSubmit} className="flex flex-col">
        <input
          type="text"
          placeholder="아이디를 입력해 주세요."
          required
          className="mb-[12px] w-full rounded-[8px] border border-[#ccc] px-[14px] py-[12px] text-[14px] outline-none focus:border-black"
        />
        <input
          type="password"
          placeholder="비밀번호를 입력해 주세요."
          required
          className="mb-[16px] w-full rounded-[8px] border border-[#ccc] px-[14px] py-[12px] text-[14px] outline-none focus:border-black"
        />

        <div className="mb-[20px] flex items-center justify-between text-[13px] text-[#666]">
          <div className="flex items-center gap-[6px]">
            <input type="checkbox" id="keep" />
            <label htmlFor="keep">자동로그인</label>
          </div>
          <div className="flex gap-[8px]">
            <Link to="/" className="hover:underline">
              아이디 찾기
            </Link>
            <span>|</span>
            <Link to="/" className="hover:underline">
              비밀번호 찾기
            </Link>
          </div>
        </div>

        <button
          type="submit"
          className="mb-[20px] w-full cursor-pointer rounded-[8px] bg-black py-[13px] text-[14px] font-medium text-white transition-colors hover:bg-neutral-800"
        >
          로그인
        </button>
      </form>

      <section className="flex flex-col gap-[10px] border-t border-[#eee] pt-[20px]">
        <a
          href="https://nid.naver.com/nidlogin.login"
          className="flex items-center justify-center rounded-[8px] bg-[#03C75A] py-[12px] text-[14px] font-medium text-white"
          target="_blank"
          rel="noreferrer"
        >
          네이버 로그인
        </a>
        <a
          href="https://accounts.kakao.com/login"
          className="flex items-center justify-center rounded-[8px] bg-[#FEE500] py-[12px] text-[14px] font-medium text-[#3c1e1e]"
          target="_blank"
          rel="noreferrer"
        >
          카카오 로그인
        </a>
      </section>
    </main>
  );
}
