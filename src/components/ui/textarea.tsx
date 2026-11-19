import * as React from "react";
import { cn } from "@/lib/utils/cn";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[88px] w-full rounded-md border border-[#E8E3D8] bg-[#FCFAF6] px-3.5 py-2.5 text-sm text-[#272923] placeholder:text-[#7A7A70] transition-colors focus-visible:outline-none focus-visible:border-[#173F35] focus-visible:ring-2 focus-visible:ring-[#173F35]/20 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";
