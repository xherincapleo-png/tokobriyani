import * as React from "react";
import { cn } from "@/lib/utils/cn";

interface BrandEmblemProps {
  variant?: "primary" | "light" | "monochrome" | "transparent";
  className?: string;
}

/**
 * Minimalist cardamom & saffron-bud spice motif — clean, geometric, and legible at any size.
 */
export function BrandEmblem({
  variant = "primary",
  className = "h-10 w-10",
}: BrandEmblemProps) {
  if (variant === "monochrome") {
    return (
      <svg
        viewBox="0 0 64 64"
        fill="none"
        aria-hidden="true"
        className={cn("shrink-0", className)}
      >
        <rect
          x="1.5"
          y="1.5"
          width="61"
          height="61"
          rx="10.5"
          stroke="currentColor"
          strokeWidth="2.5"
        />
        <path
          d="M32 13C40.5 21 42.5 33 32 50.5C21.5 33 23.5 21 32 13Z"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <path
          d="M32 49.5C22.5 44 17.5 35.5 19.5 25.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M32 49.5C41.5 44 46.5 35.5 44.5 25.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M32 27.5L35.2 31.5L32 35.5L28.8 31.5L32 27.5Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  if (variant === "transparent") {
    return (
      <svg
        viewBox="0 0 64 64"
        fill="none"
        aria-hidden="true"
        className={cn("shrink-0", className)}
      >
        <path
          d="M32 10C41.5 19 43.8 32.5 32 53C20.2 32.5 22.5 19 32 10Z"
          stroke="#173F35"
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
        <path
          d="M32 51.5C21.5 45.5 16 36 18.2 24.5"
          stroke="#173F35"
          strokeOpacity="0.75"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M32 51.5C42.5 45.5 48 36 45.8 24.5"
          stroke="#173F35"
          strokeOpacity="0.75"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M32 27L35.8 31.5L32 36L28.2 31.5L32 27Z"
          fill="#C96A35"
        />
      </svg>
    );
  }

  const isLight = variant === "light";

  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className={cn("shrink-0", className)}
    >
      <rect
        width="64"
        height="64"
        rx="12"
        fill={isLight ? "#285747" : "#173F35"}
      />
      <rect
        x="4.5"
        y="4.5"
        width="55"
        height="55"
        rx="8.5"
        stroke="#F7F1E5"
        strokeOpacity="0.22"
        strokeWidth="1.2"
      />
      <path
        d="M32 13C40.5 21 42.5 33 32 50.5C21.5 33 23.5 21 32 13Z"
        stroke="#F7F1E5"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path
        d="M32 49.5C22.5 44 17.5 35.5 19.5 25.5"
        stroke="#F7F1E5"
        strokeOpacity="0.74"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M32 49.5C41.5 44 46.5 35.5 44.5 25.5"
        stroke="#F7F1E5"
        strokeOpacity="0.74"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M32 18V46"
        stroke="#F7F1E5"
        strokeOpacity="0.35"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M32 27.5L35.2 31.5L32 35.5L28.8 31.5L32 27.5Z"
        fill="#C96A35"
      />
    </svg>
  );
}

interface BrandLogoProps {
  storeName?: string;
  logoUrl?: string | null;
  variant?: "primary" | "light" | "monochrome";
  subtitle?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function BrandLogo({
  storeName = "Toko Briyani",
  logoUrl,
  variant = "primary",
  subtitle = "Briyani Kitchen",
  size = "md",
  className,
}: BrandLogoProps) {
  const iconSize =
    size === "sm" ? "h-8 w-8" : size === "lg" ? "h-12 w-12" : "h-10 w-10";
  const wordmarkSize =
    size === "sm"
      ? "text-lg tracking-[0.1em]"
      : size === "lg"
      ? "text-2xl sm:text-3xl tracking-[0.12em]"
      : "text-xl sm:text-[22px] tracking-[0.11em]";

  const textColor =
    variant === "light"
      ? "text-[#FCFAF6]"
      : variant === "monochrome"
      ? "text-[#272923]"
      : "text-[#173F35]";

  const subColor =
    variant === "light"
      ? "text-[#F7F1E5]/70"
      : variant === "monochrome"
      ? "text-[#272923]/65"
      : "text-[#7A7A70]";

  const ruleColor =
    variant === "monochrome" ? "bg-[#272923]/60" : "bg-[#C96A35]";

  return (
    <div className={cn("inline-flex items-center gap-3", className)}>
      {logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logoUrl}
          alt={storeName}
          className={cn(
            "rounded-md border border-[#E8E3D8] object-cover",
            iconSize
          )}
        />
      ) : (
        <BrandEmblem variant={variant} className={iconSize} />
      )}

      <div className="flex flex-col">
        <span
          className={cn(
            "font-serif uppercase leading-none",
            wordmarkSize,
            textColor
          )}
        >
          {storeName}
        </span>
        {subtitle && (
          <span className="mt-1 flex items-center gap-2">
            <span className={cn("h-[1.5px] w-4 shrink-0", ruleColor)} />
            <span
              className={cn(
                "text-[9.5px] font-medium uppercase tracking-[0.22em]",
                subColor
              )}
            >
              {subtitle}
            </span>
          </span>
        )}
      </div>
    </div>
  );
}
