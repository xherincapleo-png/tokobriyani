import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173F35] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[#173F35] text-[#FCFAF6] hover:bg-[#285747] active:bg-[#12322A]",
        spice: "bg-[#C96A35] text-[#FCFAF6] hover:bg-[#B45C2B] active:bg-[#9D4E23]",
        secondary: "bg-[#F7F1E5] text-[#173F35] border border-[#E8E3D8] hover:bg-[#EFE6D4]",
        outline:
          "border border-[#173F35]/25 bg-transparent text-[#173F35] hover:bg-[#F7F1E5] hover:border-[#173F35]/50",
        ghost: "text-[#272923] hover:bg-[#F7F1E5] hover:text-[#173F35]",
        destructive: "bg-red-700 text-white hover:bg-red-800",
        link: "text-[#173F35] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 px-3.5 text-xs",
        lg: "h-12 px-7 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
