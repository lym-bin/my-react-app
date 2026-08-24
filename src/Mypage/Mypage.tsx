import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

// TODO: 각 메뉴에 대응하는 실제 페이지가 생기면 버튼을 Link로 바꾸고 경로를 연결하세요.
const benefits = [
  { id: 1, label: "적립금", value: "111원" },
  { id: 2, label: "쿠폰", value: "2장" },
  { id: 3, label: "후기", value: "0개" },
];

const mainNav = [
  "주문 내역",
  "취소/반품/교환 내역",
  "최근 본 상품",
  "페이 관리",
];
const subNavComingSoon = ["공지사항", "고객센터", "이벤트"];

export default function MyPage() {
  const navigate = useNavigate();
  const { isLoggedIn, isLoading, nickname, logout } = useAuth();

  // 로그인 안 한 상태로 마이페이지에 들어오면 로그인 페이지로 보냅니다.
  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      navigate("/login");
    }
  }, [isLoading, isLoggedIn, navigate]);

  const handleComingSoon = () => {
    alert("아직 준비 중인 페이지입니다.");
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (isLoading || !isLoggedIn) {
    return (
      <main className="mx-auto w-full max-w-[1200px] bg-navy-950 px-[16px] py-[80px] text-center text-cream/50">
        로딩 중...
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-[1200px] bg-navy-950 px-[16px] py-[20px]">
      <section>
        <div className="flex items-center gap-[20px]">
          <strong className="text-[18px] font-bold text-cream">
            {nickname}
          </strong>
          <button
            type="button"
            onClick={handleComingSoon}
            className="rounded-[4px] border border-navy-600 bg-transparent px-[8px] py-[4px] text-[12px] text-cream/80 transition-colors hover:border-terracotta-400 hover:text-terracotta-400"
          >
            회원 정보 수정
          </button>
        </div>

        <div className="mt-[20px] border-b border-navy-700">
          <ul className="grid grid-cols-3 bg-navy-800 py-[20px] text-center">
            {benefits.map((b) => (
              <li key={b.id}>
                <button
                  type="button"
                  onClick={handleComingSoon}
                  className="flex w-full items-center justify-center gap-[8px] text-cream/80 transition-colors hover:text-terracotta-400"
                >
                  <span className="text-[14px]">{b.label} &gt;</span>
                  <strong className="text-[14px] font-bold text-cream">
                    {b.value}
                  </strong>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-[40px]">
        <div className="flex flex-col gap-[30px]">
          <nav>
            <ul className="flex flex-col gap-[16px] p-0">
              {mainNav.map((item) => (
                <li key={item}>
                  <button
                    type="button"
                    onClick={handleComingSoon}
                    className="text-[14px] text-cream/80 hover:text-terracotta-400 hover:underline"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <aside className="h-[200px] w-full overflow-hidden bg-navy-800">
            <Link to="/" className="block h-full w-full">
              <img
                src=""
                alt="광고 배너 이벤트 안내"
                className="h-full w-full object-cover"
              />
            </Link>
          </aside>

          <nav className="mb-[40px]">
            <ul className="flex flex-col gap-[16px] p-0">
              {subNavComingSoon.map((item) => (
                <li key={item}>
                  <button
                    type="button"
                    onClick={handleComingSoon}
                    className="text-[14px] text-cream/80 hover:text-terracotta-400 hover:underline"
                  >
                    {item}
                  </button>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-[14px] text-cream/80 hover:text-terracotta-400 hover:underline"
                >
                  로그아웃
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </section>
    </main>
  );
}
