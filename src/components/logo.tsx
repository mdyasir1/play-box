import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 32 32"
      className={cn("shrink-0", className)}
    >
      <defs>
        <linearGradient id="playbox-mark" x1="2" y1="2" x2="30" y2="30">
          <stop offset="0%" stopColor="#b49aff" />
          <stop offset="100%" stopColor="#4cc9f0" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="#11182b" />
      <path
        d="M8 9.5h6.2v6.2H8zM17.8 9.5H24v6.2h-6.2zM8 19.3h6.2v6.2H8z"
        fill="url(#playbox-mark)"
        opacity="0.92"
      />
      <path
        d="M19.2 22.4 22.4 19m0 0 3.2 3.4m-3.2-3.4v8"
        stroke="url(#playbox-mark)"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
