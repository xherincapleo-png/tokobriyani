"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/brand/brand-logo";

interface NavbarProps {
  storeName: string;
  logoUrl?: string | null;
}

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar({ storeName, logoUrl }: NavbarProps) {
  const pathname = usePathname();
  const { itemCount, isHydrated } = useCart();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-[#E8E3D8] bg-[#FCFAF6]/95 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between gap-4 sm:h-20">
        {/* Brand Wordmark */}
        <Link
          href="/"
          className="group inline-flex items-center focus-visible:outline-none"
        >
          <BrandLogo storeName={storeName} logoUrl={logoUrl} />
        </Link>

        {/* Desktop Nav */}
        <nav aria-label="Primary navigation" className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative py-1 text-sm font-medium transition-colors",
                  isActive
                    ? "text-[#173F35]"
                    : "text-[#272923]/75 hover:text-[#173F35]"
                )}
              >
                {link.label}
                {isActive && (
                  <span className="absolute inset-x-0 -bottom-1 h-[2px] bg-[#C96A35]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/cart"
            aria-label={`Shopping cart with ${itemCount} items`}
            className="relative inline-flex h-10 items-center gap-2 rounded-md border border-[#E8E3D8] bg-[#F7F1E5] px-3.5 text-sm font-medium text-[#173F35] transition-colors hover:border-[#173F35]/40 hover:bg-[#EFE6D4]"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">Cart</span>
            <span
              className={cn(
                "inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[11px] font-semibold",
                isHydrated && itemCount > 0
                  ? "bg-[#C96A35] text-[#FCFAF6]"
                  : "bg-[#173F35]/10 text-[#173F35]"
              )}
            >
              {isHydrated ? itemCount : 0}
            </span>
          </Link>

          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href="/menu">Order Now</Link>
          </Button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[#E8E3D8] text-[#173F35] hover:bg-[#F7F1E5] md:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="border-t border-[#E8E3D8] bg-[#FCFAF6] md:hidden">
          <nav
            aria-label="Mobile navigation"
            className="container flex flex-col gap-1 py-4"
          >
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-md px-3 py-2.5 text-base font-medium transition-colors",
                    isActive
                      ? "bg-[#F7F1E5] text-[#173F35]"
                      : "text-[#272923] hover:bg-[#F7F1E5]/60"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="mt-3 flex gap-2 border-t border-[#E8E3D8] pt-3">
              <Button asChild className="flex-1">
                <Link href="/menu">Order Now</Link>
              </Button>
              <Button asChild variant="secondary" className="flex-1">
                <Link href="/cart">
                  Cart ({isHydrated ? itemCount : 0})
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
