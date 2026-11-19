"use client";

import * as React from "react";
import { UtensilsCrossed } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface FoodImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  containerClassName?: string;
  priority?: boolean;
}

export function FoodImage({
  src,
  alt,
  className,
  containerClassName,
  priority = false,
}: FoodImageProps) {
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    setHasError(false);
  }, [src]);

  const validSrc = src && src.trim().length > 0 && !hasError ? src : null;

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-[#F7F1E5]",
        containerClassName
      )}
    >
      {validSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={validSrc}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          onError={() => setHasError(true)}
          className={cn("h-full w-full object-cover", className)}
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#F7F1E5] to-[#EAE1CF] p-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#173F35]/20 bg-[#FCFAF6] text-[#173F35]">
            <UtensilsCrossed className="h-5 w-5" />
          </div>
          <span className="font-serif text-sm text-[#173F35]">{alt}</span>
          <span className="text-[11px] uppercase tracking-[0.16em] text-[#7A7A70]">
            Toko Briyani Kitchen
          </span>
        </div>
      )}
    </div>
  );
}
