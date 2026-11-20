import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  markClassName?: string;
  showWordmark?: boolean;
  wordmarkClassName?: string;
};

export function Logo({
  className,
  markClassName,
  showWordmark = true,
  wordmarkClassName,
}: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg
        viewBox="0 0 40 40"
        aria-hidden="true"
        className={cn("size-9 shrink-0", markClassName)}
      >
        <rect
          x="1.5"
          y="1.5"
          width="37"
          height="37"
          rx="11"
          fill="#0c1120"
          stroke="#9b7bff"
          strokeOpacity="0.55"
          strokeWidth="1.5"
        />
        <rect
          x="5.5"
          y="5.5"
          width="29"
          height="29"
          rx="8"
          fill="#121a2e"
          stroke="#4cc9f0"
          strokeOpacity="0.18"
          strokeWidth="1"
        />
        <path d="M16 12.5 28.5 20 16 27.5Z" fill="#9b7bff" />
        <path
          d="M16 12.5 28.5 20 16 27.5Z"
          fill="none"
          stroke="#c9baff"
          strokeOpacity="0.35"
          strokeWidth="1"
        />
        <circle cx="11.5" cy="20" r="1.4" fill="#4cc9f0" />
      </svg>
      {showWordmark ? (
        <span
          className={cn(
            "font-display text-[0.74rem] font-semibold tracking-[0.17em] text-text",
            wordmarkClassName,
          )}
        >
          YASIR PLAYBOX
        </span>
      ) : null}
    </span>
  );
}
