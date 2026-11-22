import type * as React from "react";

import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "cyan" | "danger";
type Size = "sm" | "md" | "lg" | "icon";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-[#090612] shadow-[0_10px_30px_rgba(155,123,255,0.28)] hover:bg-[#b19bff]",
  secondary:
    "border border-white/12 bg-white/[0.055] text-text hover:border-white/20 hover:bg-white/[0.09]",
  ghost: "text-text-secondary hover:bg-white/[0.06] hover:text-text",
  cyan:
    "bg-cyan text-[#031014] shadow-[0_10px_30px_rgba(76,201,240,0.26)] hover:bg-[#73d8f5]",
  danger:
    "border border-danger/35 bg-danger/10 text-danger hover:bg-danger/18",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-xs",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
  icon: "size-11",
};

export function buttonStyles({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: Variant;
  size?: Size;
  className?: string;
} = {}): string {
  return cn(
    "inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold transition duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-45",
    variants[variant],
    sizes[size],
    className,
  );
}

type ButtonProps = React.ComponentProps<"button"> & {
  variant?: Variant;
  size?: Size;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  type,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type ?? "button"}
      className={buttonStyles({ variant, size, className })}
      {...props}
    />
  );
}
