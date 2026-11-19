import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const badgeVariants = cva(
  "inline-flex items-center rounded-sm px-2.5 py-0.5 text-xs font-medium tracking-wide transition-colors",
  {
    variants: {
      variant: {
        default: "bg-[#173F35] text-[#FCFAF6]",
        spice: "bg-[#C96A35] text-[#FCFAF6]",
        cream: "bg-[#F7F1E5] text-[#173F35] border border-[#E8E3D8]",
        outline: "border border-[#E8E3D8] text-[#272923] bg-transparent",
        success: "bg-emerald-50 text-emerald-800 border border-emerald-200",
        warning: "bg-amber-50 text-amber-800 border border-amber-200",
        danger: "bg-red-50 text-red-800 border border-red-200",
        muted: "bg-[#EFECE4] text-[#7A7A70]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
