import * as React from "react";
import { cn } from "@/lib/utils/cn";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type = "text", ...props }, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-[#E8E3D8] bg-[#FCFAF6] px-3.5 py-2 text-sm text-[#272923] placeholder:text-[#7A7A70] transition-colors focus-visible:outline-none focus-visible:border-[#173F35] focus-visible:ring-2 focus-visible:ring-[#173F35]/20 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
});
Input.displayName = "Input";
