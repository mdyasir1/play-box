type YgMarkProps = {
  className?: string;
};

export function YgMark({ className }: YgMarkProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-label="YG — Yasir Games"
      fill="none"
    >
      <rect width="64" height="64" rx="16" fill="currentColor" />
      <g
        stroke="var(--color-bg)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 17 L22 32 L30 17" />
        <path d="M22 32 V47" />
        <path d="M51 25 C48 21 42 20 38 23 C33 27 32 37 36 42 C40 47 48 47 52 42" />
        <path d="M52 34 H44" />
      </g>
    </svg>
  );
}
