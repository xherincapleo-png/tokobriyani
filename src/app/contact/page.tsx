import type { Metadata } from "next";
import Link from "next/link";
import {
  Clock,
  ExternalLink,
  Instagram,
  MapPin,
  MessageCircle,
  Truck,
} from "lucide-react";
import { getStoreSettings } from "@/lib/data/repository";
import { formatIDR, isPlaceholderWhatsApp } from "@/lib/utils/format";
import { buildWhatsAppChatUrl } from "@/lib/utils/whatsapp";
import { StorefrontShell } from "@/components/layout/storefront-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Reach Toko Briyani on WhatsApp, check opening hours, kitchen pickup address, and delivery information.",
};

export default async function ContactPage() {
  const settings = await getStoreSettings();
  const waUrl = buildWhatsAppChatUrl(
    settings.whatsapp_number,
    `Hello ${settings.store_name}, I have a question about your Briyani menu and ordering.`
  );
  const usingPlaceholderWa = isPlaceholderWhatsApp(settings.whatsapp_number);
  const mapsEmbedUrl = settings.social_links?.maps_embed_url?.trim();

  return (
    <StorefrontShell>
      {/* Header */}
      <section className="border-b border-[#E8E3D8] bg-[#F7F1E5] py-12 sm:py-16">
        <div className="container">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C96A35]">
            Get In Touch
          </p>
          <h1 className="mt-2 font-serif text-4xl text-[#173F35] sm:text-5xl">
            Contact {settings.store_name}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#272923]/80 sm:text-base">
            Have a question about spice levels, group orders, delivery availability, or
            an existing order? Message us directly on WhatsApp or review our kitchen
            hours below.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="container grid gap-8 lg:grid-cols-12">
          {/* Left Column: Direct Contact Cards */}
          <div className="space-y-6 lg:col-span-5">
            {/* WhatsApp CTA */}
            <Card className="border-[#173F35]/20 bg-[#173F35] p-6 text-[#FCFAF6]">
              <div className="flex h-11 w-11 items-center justify-center rounded-md bg-[#285747]">
                <MessageCircle className="h-5 w-5 text-[#C96A35]" />
              </div>
              <h2 className="mt-4 font-serif text-2xl text-[#FCFAF6]">
                WhatsApp Order Desk
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[#F7F1E5]/80">
                Fastest way to confirm orders, ask about daily availability, or arrange
                family trays and office lunches.
              </p>
              <div className="mt-5">
                <Button asChild variant="spice" size="lg" className="w-full sm:w-auto">
                  <a href={waUrl} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-4 w-4" />
                    Message Us on WhatsApp
                  </a>
                </Button>
              </div>
              {usingPlaceholderWa && (
                <p className="mt-3 text-xs text-[#F7F1E5]/70">
                  * Placeholder WhatsApp number is active. Update in Admin → Store Settings.
                </p>
              )}
            </Card>

            {/* Address & Delivery Info */}
            <Card className="space-y-5 p-6">
              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#F7F1E5] text-[#173F35]">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-serif text-xl text-[#173F35]">
                    Kitchen & Pickup Address
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-[#7A7A70]">
                    {settings.address ||
                      "Store address placeholder — editable via Admin Store Settings."}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 border-t border-[#E8E3D8] pt-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#F7F1E5] text-[#173F35]">
                  <Truck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-serif text-xl text-[#173F35]">
                    Delivery & Pickup
                  </h3>
                  <p className="mt-1 text-sm text-[#7A7A70]">
                    Standard delivery fee:{" "}
                    <strong className="text-[#272923]">
                      {formatIDR(settings.delivery_fee)}
                    </strong>
                    {settings.minimum_order > 0
                      ? ` • Minimum order: ${formatIDR(settings.minimum_order)}`
                      : " • No minimum order"}
                  </p>
                </div>
              </div>

              {/* Social Links */}
              <div className="border-t border-[#E8E3D8] pt-5">
                <h3 className="font-serif text-xl text-[#173F35]">
                  Social Channels
                </h3>
                <div className="mt-3 flex flex-wrap gap-2.5">
                  {settings.instagram_url && (
                    <Button asChild variant="secondary" size="sm">
                      <a
                        href={settings.instagram_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Instagram className="h-4 w-4" />
                        Instagram
                        <ExternalLink className="h-3 w-3 opacity-60" />
                      </a>
                    </Button>
                  )}
                  {settings.social_links?.tiktok && (
                    <Button asChild variant="secondary" size="sm">
                      <a
                        href={settings.social_links.tiktok}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        TikTok
                        <ExternalLink className="h-3 w-3 opacity-60" />
                      </a>
                    </Button>
                  )}
                  {settings.social_links?.facebook && (
                    <Button asChild variant="secondary" size="sm">
                      <a
                        href={settings.social_links.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Facebook
                        <ExternalLink className="h-3 w-3 opacity-60" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column: Operating Hours + Map Placeholder */}
          <div className="space-y-6 lg:col-span-7">
            {/* Opening Hours Table */}
            <Card className="p-6">
              <div className="flex items-center gap-2.5">
                <Clock className="h-5 w-5 text-[#C96A35]" />
                <h2 className="font-serif text-2xl text-[#173F35]">
                  Operating Hours
                </h2>
              </div>
              <p className="mt-1 text-xs text-[#7A7A70]">
                Editable anytime from Admin → Store Settings.
              </p>

              <div className="mt-5 divide-y divide-[#E8E3D8] rounded-md border border-[#E8E3D8] bg-[#F7F1E5]/40">
                {settings.opening_hours.length > 0 ? (
                  settings.opening_hours.map((row) => (
                    <div
                      key={row.day}
                      className="flex items-center justify-between px-4 py-3 text-sm"
                    >
                      <span className="font-medium text-[#272923]">{row.day}</span>
                      <span
                        className={
                          row.closed
                            ? "text-xs font-medium text-red-700"
                            : "text-[#173F35]"
                        }
                      >
                        {row.closed ? "Closed" : `${row.open} – ${row.close}`}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="p-4 text-sm text-[#7A7A70]">
                    Operating hours placeholder — configure in Store Settings.
                  </p>
                )}
              </div>
            </Card>

            {/* Configurable Map Placeholder */}
            <Card className="overflow-hidden">
              <div className="border-b border-[#E8E3D8] px-6 py-4">
                <h2 className="font-serif text-2xl text-[#173F35]">
                  Location Map
                </h2>
              </div>
              {mapsEmbedUrl && mapsEmbedUrl.startsWith("https://") ? (
                <iframe
                  title={`${settings.store_name} location map`}
                  src={mapsEmbedUrl}
                  className="h-72 w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <div className="editorial-surface flex h-72 flex-col items-center justify-center p-8 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#173F35]/20 bg-[#FCFAF6] text-[#173F35]">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-serif text-xl text-[#173F35]">
                    Map Location Placeholder
                  </h3>
                  <p className="mt-1.5 max-w-md text-xs leading-relaxed text-[#7A7A70]">
                    Paste a Google Maps embed URL inside{" "}
                    <strong className="text-[#272923]">Admin → Store Settings</strong>{" "}
                    to display your interactive kitchen pin right here.
                  </p>
                  <Button asChild variant="secondary" size="sm" className="mt-5">
                    <Link href="/menu">Ready to Order? Browse Menu</Link>
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </div>
      </section>
    </StorefrontShell>
  );
}
