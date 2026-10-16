// src/components/layout/Logo.tsx
// 브랜드 워드마크 ("Objet & B" + "Paris" ), sizeprop으로 크기 조절
interface LogoProps {
  size?: "sm" | "lg"; // ? 옵셔널: "sm"또는 "lg" 둘 중 하나, 안주면 undefined
  className?: string; // 옵셔널: 부모가 추가 스타일을 얹을 수 있게
}

// 구조분해 + 기본값 (ProductCard에서 본 패턴): size 안주면 "sm", className 안 주면 빈 문자열
export default function Logo({ size = "sm", className = "" }: LogoProps) {
  // 여기서 변수로 뽑아두면 아래 return 부분이 훨씬 읽기 편해짐
  const word =
    size === "lg"
      ? "text-15 md:text-18" // "Objet & B 글자 크기"
      : "text-11 sm:text-13 md:text-14";
  const sub =
    size === "lg"
      ? "text-10 md:text-11" // "Paris" 글자 크기
      : "text-[0.4375rem] sm:text-[0.5rem] md:text-9";

  return (
    // 바깥 span: 세로로 쌓기(원, 브랜드명, Paris) + 부모가 넘긴 className을 뒤에 이어 붙임
    // 예: <Logo className="mb-[10px] />라고 부르면 -> "flex flex-col...가 됨
    // Logo 컴포넌트 자체를 수정하지 않고도, 이 컴포넌트를 쓰는 쪽(부모) 위치나 여백같은 자유롭게 추가 할 수 있게 열어줌
    <span className={`flex flex-col items-center ${className}`}>
      <span
        className={`font-serif tracking-[0.18em] text-cream uppercase ${word}`}
      >
        Objet & B
      </span>
      <span className={`tracking-[0.12em] text-cream/50 uppercase ${sub}`}>
        Paris
      </span>
    </span>
  );
}
