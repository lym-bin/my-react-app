// src/components/layout/Logo.tsx
interface LogoProps {
  size?: "sm" | "lg";
  className?: string;
}

export default function Logo({ size = "sm", className = "" }: LogoProps) {
  const circle =
    size === "lg"
      ? "h-[60px] w-[60px] md:h-[80px] md:w-[80px]"
      : "h-[34px] w-[34px] sm:h-[44px] sm:w-[44px] md:h-[52px] md:w-[52px]";
  const letter =
    size === "lg"
      ? "text-[26px] md:text-[34px]"
      : "text-[14px] sm:text-[18px] md:text-[21px]";
  const word =
    size === "lg"
      ? "text-[11px] md:text-[13px]"
      : "text-[7px] sm:text-[8px] md:text-[9px]";
  const sub =
    size === "lg"
      ? "text-[9px] md:text-[10px]"
      : "text-[6px] sm:text-[7px] md:text-[8px]";

  return (
    <span className={`flex flex-col items-center ${className}`}>
      <span
        className={`flex items-center justify-center rounded-full border border-cream/80 ${circle}`}
      >
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
