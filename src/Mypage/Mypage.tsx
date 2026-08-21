import { Link } from "react-router-dom";

export default function MyPage() {
  const benefits = [
    { id: 1, label: "적립금", value: "111원", path: "/mypage" },
    { id: 2, label: "쿠폰", value: "2장", path: "/mypage" },
    { id: 3, label: "후기", value: "0개", path: "/mypage" },
  ];

  const mainNav = [
    "주문 내역",
    "취소/반품/교환 내역",
    "최근 본 상품",
    "페이 관리",
  ];
  const subNav = ["공지사항", "고객센터", "이벤트", "로그아웃"];

  return (
    <main className="mx-auto w-full max-w-[1200px] px-[16px] py-[20px]">
      <section>
        <div className="flex items-center gap-[20px]">
          <strong className="text-[18px] font-bold text-[#222]">
            개성있는 터키모자
          </strong>
          <Link
            to="/mypage"
            className="rounded-[4px] border border-[#ccc] bg-white px-[8px] py-[4px] text-[12px] text-[#333]"
          >
            회원 정보 수정
          </Link>
        </div>

        <div className="mt-[20px] border-b border-[#666]">
          <ul className="grid grid-cols-3 bg-[#bbb] py-[20px] text-center">
            {benefits.map((b) => (
              <li key={b.id}>
                <Link
                  to={b.path}
                  className="flex items-center justify-center gap-[8px] text-[#333]"
                >
                  <span className="text-[14px]">{b.label} &gt;</span>
                  <strong className="text-[14px] font-bold">{b.value}</strong>
                </Link>
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
                  <Link
                    to="/mypage"
                    className="text-[14px] text-[#333] hover:underline"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <aside className="h-[200px] w-full overflow-hidden bg-[#666]">
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
              {subNav.map((item) => (
                <li key={item}>
                  <Link
                    to={item === "로그아웃" ? "/login" : "/"}
                    className="text-[14px] text-[#333] hover:underline"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>
    </main>
  );
}
