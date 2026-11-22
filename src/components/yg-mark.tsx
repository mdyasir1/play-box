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
        strokeWidth="3.2"
        strokeLinecap="square"
        strokeLinejoin="miter"
      >
        <path d="M13 17 L21 31 L29 17" />
        <path d="M21 31 V47" />
        <path d="M50 21 H39 V44 H50" />
        <path d="M50 32 H44" />
        <path d="M50 21 C54 25 55 29 55 33 C55 38 52 42 47 44" />
      </g>
    </svg>
  );
}
