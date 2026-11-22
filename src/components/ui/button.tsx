import type * as React from "react";

import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "cyan" | "danger";
type Size = "sm" | "md" | "lg" | "icon";

const variants: Record<Variant, string> = {
  primary:
    "border border-text bg-text text-bg font-semibold tracking-tight hover:bg-transparent hover:text-text",
  secondary:
    "border border-border bg-surface font-medium text-text hover:border-border-strong hover:bg-surface-hover",
  ghost: "font-medium text-text-secondary hover:bg-surface-hover hover:text-text",
  cyan: "border border-cyan bg-cyan text-bg font-semibold tracking-tight hover:bg-transparent hover:text-cyan",
  danger: "border border-danger/40 text-danger hover:bg-danger/10",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-xs",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-sm",
  icon: "size-10",
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
    "inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus disabled:pointer-events-none disabled:opacity-45",
    variants[variant],
    sizes[size],
    className,
  );
}

type ButtonProps = React.ComponentProps<"button"> & {
  variant?: Variant;
  size?: Size;
};

export function Button({ variant, size, className, type, ...props }: ButtonProps) {
  return (
    <button
      type={type ?? "button"}
      className={buttonStyles({ variant, size, className })}
      {...props}
    />
  );
}
