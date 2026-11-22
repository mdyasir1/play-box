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
    >
      <rect
        x="2"
        y="2"
        width="60"
        height="60"
        rx="15"
        fill="var(--color-text)"
        stroke="var(--color-border-strong)"
        strokeWidth="1"
      />
      <text
        x="32"
        y="40"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontSize="27"
        fontWeight="600"
        letterSpacing="-2"
        fill="var(--color-bg)"
      >
        YG
      </text>
    </svg>
  );
}
