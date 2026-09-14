// src/components/layout/Logo.tsx
// CSS로 만든 원형 브랜드 로고, sizeprop으로 크기 조절
interface LogoProps {
  size?: "sm" | "lg"; // ? 옵셔널: "sm"또는 "lg" 둘 중 하나, 안주면 undefined
  className?: string; // 옵셔널: 부모가 추가 스타일을 얹을 수 있게
}

// 구조분해 + 기본값 (ProductCard에서 본 패턴): size 안주면 "sm", className 안 주면 빈 문자열
export default function Logo({ size = "sm", className = "" }: LogoProps) {
  // size 값에 따라 4개의 클래스 문자열을 미리 계산해둠 (JSX안에 삼항연산자 4개를 직접 박는 대신)
  // 여기서 변수로 뽑아두면 아래 return 부분이 훨씬 읽기 편해짐
  const circle =
    size === "lg"
      ? "h-[60px] w-[60px] md:h-[80px] md:w-[80px]" // lg일 때: 원 크기 60px -> 80px(md 이상)
      : "h-[34px] w-[34px] sm:h-[44px] sm:w-[44px] md:h-[52px] md:w-[52px]"; // sm일 때: 더 작은 3단계 반응형
  const letter =
    size === "lg"
      ? "text-[26px] md:text-[34px]" // 원 안의 "B" 글자 크기
      : "text-[14px] sm:text-[18px] md:text-[21px]";
  const word =
    size === "lg"
      ? "text-[11px] md:text-[13px]" // "Objet & B 글자 크기"
      : "text-[7px] sm:text-[8px] md:text-[9px]";
  const sub =
    size === "lg"
      ? "text-[9px] md:text-[10px]" // "Paris" 글자 크기
      : "text-[6px] sm:text-[7px] md:text-[8px]";

  return (
    // 바깥 span: 세로로 쌓기(원, 브랜ㄷ명, Paris) + 부모가 넘긴 className을 뒤에 이어 붙임
    // 예: <Logo className="mb-[10px] />라고 부르면 -> "flex flex-col...가 됨
    <span className={`flex flex-col items-center ${className}`}>
      <span
        className={`flex items-center justify-center rounded-full border border-cream/80 ${circle}`}
      >
        {/* 원형 테두리: 너비=높이+rounded-full 조합으로 완벽한 원 모양이 됨*/}
        <span className={`font-serif leading-none text-cream italic ${letter}`}>
          B
        </span>
      </span>
      <span
        className={`mt-[3px] font-serif tracking-[0.18em] text-cream uppercase ${word}`}
      >
        Objet & B
      </span>
      <span className={`tracking-[0.12em] text-cream/50 uppercase ${sub}`}>
        Paris
      </span>
    </span>
  );
}
