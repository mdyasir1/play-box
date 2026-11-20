import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[0.7rem] font-semibold leading-5",
  {
    variants: {
      variant: {
        default: "border-border bg-surface text-text-secondary",
        accent: "border-accent/30 bg-accent/10 text-[#c9baff]",
        blue: "border-accent-blue/30 bg-accent-blue/10 text-[#a4e7f9]",
        success: "border-success/30 bg-success/10 text-[#8ff0c6]",
        warning: "border-warning/30 bg-warning/10 text-[#ffe1a0]",
        danger: "border-danger/30 bg-danger/10 text-[#ffb3bf]",
        outline: "border-border-strong bg-transparent text-text-secondary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type BadgeProps = React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants>;

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
export type { BadgeProps };
