import Link from "next/link";
import { Clock, Instagram, MapPin, MessageCircle, ShieldCheck } from "lucide-react";
import type { StoreSettings } from "@/types/database";
import { buildWhatsAppChatUrl } from "@/lib/utils/whatsapp";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/brand/brand-logo";

interface FooterProps {
  settings: StoreSettings;
}

export function Footer({ settings }: FooterProps) {
  const waUrl = buildWhatsAppChatUrl(
    settings.whatsapp_number,
    `Hello ${settings.store_name}, I would like to ask about ordering Briyani.`
  );

  const openDays = settings.opening_hours.filter((d) => !d.closed);
  const hoursSummary =
    openDays.length > 0
      ? `${openDays[0].open} – ${openDays[0].close} (see Contact for full daily schedule)`
      : "Configure opening hours in Store Settings";

  return (
    <footer className="border-t border-[#E8E3D8] bg-[#173F35] text-[#F7F1E5]">
      <div className="container py-14 sm:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="space-y-4">
            <BrandLogo
              storeName={settings.store_name}
              logoUrl={settings.logo_url}
              variant="light"
            />
            <p className="text-sm leading-relaxed text-[#F7F1E5]/80">
              {settings.store_description ||
                "Authentic, freshly steamed Briyani layered with fragrant whole spices and long-grain basmati rice."}
            </p>
            <Button
              asChild
              variant="spice"
              size="sm"
              className="mt-2"
            >
              <a href={waUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4" />
                Chat on WhatsApp
              </a>
            </Button>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-serif text-lg text-[#FCFAF6]">Explore</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-[#F7F1E5]/80">
              <li>
                <Link href="/" className="transition-colors hover:text-[#FCFAF6]">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/menu" className="transition-colors hover:text-[#FCFAF6]">
                  Full Menu
                </Link>
              </li>
              <li>
                <Link href="/about" className="transition-colors hover:text-[#FCFAF6]">
                  Our Story & Spices
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition-colors hover:text-[#FCFAF6]">
                  Contact & Location
                </Link>
              </li>
              <li>
                <Link href="/cart" className="transition-colors hover:text-[#FCFAF6]">
                  Shopping Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Kitchen & Hours */}
          <div>
            <h3 className="font-serif text-lg text-[#FCFAF6]">Kitchen & Hours</h3>
            <ul className="mt-4 space-y-3 text-sm text-[#F7F1E5]/80">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#C96A35]" />
                <span>
                  {settings.address ||
                    "Store address placeholder — editable in Admin Store Settings."}
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[#C96A35]" />
                <span>{hoursSummary}</span>
              </li>
            </ul>
          </div>

          {/* Social & Store Owner */}
          <div>
            <h3 className="font-serif text-lg text-[#FCFAF6]">Connect</h3>
            <div className="mt-4 space-y-3 text-sm text-[#F7F1E5]/80">
              {settings.instagram_url && (
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 transition-colors hover:text-[#FCFAF6]"
                >
                  <Instagram className="h-4 w-4 text-[#C96A35]" />
                  <span>Instagram</span>
                </a>
              )}
              <p className="text-xs leading-relaxed text-[#F7F1E5]/65">
                Follow our kitchen updates, seasonal platters, and family feast offers on social media.
              </p>
              <div className="flex flex-col gap-1.5 pt-2">
                <Link
                  href="/brand"
                  className="inline-flex items-center gap-1.5 text-xs text-[#F7F1E5]/60 transition-colors hover:text-[#F7F1E5]"
                >
                  Brand &amp; Visual Kit
                </Link>
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 text-xs text-[#F7F1E5]/60 transition-colors hover:text-[#F7F1E5]"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Store Owner Admin Portal
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-[#F7F1E5]/15 pt-6 text-xs text-[#F7F1E5]/65 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {settings.store_name}. All rights reserved.
          </p>
          <p>Crafted with care — Warm spices, fragrant basmati, generous portions.</p>
        </div>
      </div>
    </footer>
  );
}
