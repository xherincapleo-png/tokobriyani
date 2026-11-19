import type { Metadata } from "next";
import { Download } from "lucide-react";
import { getProducts } from "@/lib/data/repository";
import { StorefrontShell } from "@/components/layout/storefront-shell";
import { FoodImage } from "@/components/ui/food-image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Brand & Visual System",
  description:
    "Toko Briyani logo wordmark system, color palette, typography hierarchy, and unified editorial photography guidelines.",
};

const PALETTE = [
  { name: "Primary Deep Forest Green", hex: "#173F35", role: "Brand mark, primary CTAs, hero canvas, footer" },
  { name: "Secondary Forest Green", hex: "#285747", role: "Hover states, dark surface accents" },
  { name: "Warm Cream", hex: "#F7F1E5", role: "Editorial bands, secondary cards, subtle surfaces" },
  { name: "Off-White", hex: "#FCFAF6", role: "Primary page ground, clean card canvas" },
  { name: "Spice Orange", hex: "#C96A35", role: "Used sparingly for Best Seller badges & key accents" },
  { name: "Charcoal", hex: "#272923", role: "Primary body text & dark typography" },
  { name: "Muted Gray", hex: "#7A7A70", role: "Secondary metadata & supporting captions" },
  { name: "Warm Border", hex: "#E8E3D8", role: "Hairline card, input, and section dividers" },
];

const LOGO_ASSETS = [
  {
    title: "Main Horizontal Wordmark (Cream)",
    file: "/brand/logo-wordmark-cream.svg",
    bgClass: "bg-[#FCFAF6]",
    notes: "Primary presentation lockup on warm cream with border framing.",
  },
  {
    title: "Horizontal Wordmark (Transparent)",
    file: "/brand/logo-wordmark-transparent.svg",
    bgClass: "bg-[#F7F1E5]",
    notes: "Deep forest green on transparent background for light surfaces.",
  },
  {
    title: "Inverted Light Wordmark (Transparent)",
    file: "/brand/logo-wordmark-light.svg",
    bgClass: "bg-[#173F35]",
    notes: "Warm cream wordmark for deep forest green headers, footers, and packaging.",
  },
  {
    title: "Monochrome Wordmark (Transparent)",
    file: "/brand/logo-monochrome.svg",
    bgClass: "bg-white",
    notes: "Single-ink charcoal mark for receipts, kraft paper stamps, and embossing.",
  },
];

export default async function BrandSystemPage() {
  const products = await getProducts({ includeUnavailable: true });

  return (
    <StorefrontShell>
      <section className="border-b border-[#E8E3D8] bg-[#F7F1E5] py-12 sm:py-16">
        <div className="container">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C96A35]">
            Visual Identity &amp; Asset System
          </p>
          <h1 className="mt-2 font-serif text-4xl text-[#173F35] sm:text-5xl">
            Toko Briyani Brand Kit
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#272923]/80 sm:text-base">
            Unified minimalist serif wordmarks, cardamom &amp; saffron-bud emblem,
            color tokens, negative-space editorial hero photography, and square 1:1
            product photography built for brand cohesion.
          </p>
        </div>
      </section>

      <div className="container space-y-16 py-12 sm:py-16">
        {/* 1. Logo System */}
        <section className="space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C96A35]">
              01 — Logo System
            </p>
            <h2 className="mt-1 font-serif text-3xl text-[#173F35]">
              Wordmarks &amp; Compact Icon
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {LOGO_ASSETS.map((asset) => (
              <Card key={asset.title} className="overflow-hidden">
                <div
                  className={`flex h-40 items-center justify-center border-b border-[#E8E3D8] p-6 ${asset.bgClass}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={asset.file}
                    alt={asset.title}
                    className="max-h-24 w-auto"
                  />
                </div>
                <div className="flex items-center justify-between gap-4 p-5">
                  <div>
                    <h3 className="font-serif text-lg text-[#173F35]">
                      {asset.title}
                    </h3>
                    <p className="mt-0.5 text-xs text-[#7A7A70]">{asset.notes}</p>
                  </div>
                  <Button asChild variant="secondary" size="sm">
                    <a href={asset.file} download>
                      <Download className="h-3.5 w-3.5" />
                      SVG
                    </a>
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Compact Icons / Favicon */}
          <Card className="p-6">
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex flex-col items-center gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/brand/logo-icon.svg"
                    alt="Compact favicon icon 64px"
                    className="h-16 w-16 rounded-lg shadow-soft"
                  />
                  <span className="text-[11px] text-[#7A7A70]">64px Tile</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/brand/logo-icon.svg"
                    alt="Compact favicon icon 32px"
                    className="h-8 w-8 rounded-md"
                  />
                  <span className="text-[11px] text-[#7A7A70]">32px Favicon</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/brand/logo-icon.svg"
                    alt="Compact favicon icon 16px"
                    className="h-4 w-4 rounded-sm"
                  />
                  <span className="text-[11px] text-[#7A7A70]">16px Tab</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/brand/logo-icon-transparent.svg"
                    alt="Transparent cardamom saffron emblem"
                    className="h-16 w-16"
                  />
                  <span className="text-[11px] text-[#7A7A70]">Transparent Mark</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button asChild variant="secondary" size="sm">
                  <a href="/brand/logo-icon.svg" download>
                    <Download className="h-3.5 w-3.5" />
                    Icon Tile SVG
                  </a>
                </Button>
                <Button asChild variant="secondary" size="sm">
                  <a href="/brand/logo-icon-transparent.svg" download>
                    <Download className="h-3.5 w-3.5" />
                    Transparent Mark SVG
                  </a>
                </Button>
              </div>
            </div>
          </Card>
        </section>

        {/* 2. Color & Typography Tokens */}
        <section className="space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C96A35]">
              02 — Color Palette &amp; UI Consistency
            </p>
            <h2 className="mt-1 font-serif text-3xl text-[#173F35]">
              Brand Color System
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PALETTE.map((swatch) => (
              <Card key={swatch.hex} className="overflow-hidden">
                <div
                  className="h-20 w-full border-b border-[#E8E3D8]"
                  style={{ backgroundColor: swatch.hex }}
                />
                <div className="p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-[#272923]">
                      {swatch.name}
                    </p>
                    <Badge variant="outline" className="font-mono text-[11px]">
                      {swatch.hex}
                    </Badge>
                  </div>
                  <p className="mt-1.5 text-xs text-[#7A7A70]">{swatch.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* 3. Hero Negative-Space Composition */}
        <section className="space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C96A35]">
              03 — Editorial Hero Photography
            </p>
            <h2 className="mt-1 font-serif text-3xl text-[#173F35]">
              16:9 Negative-Space Hero Banner
            </h2>
          </div>

          <Card className="overflow-hidden p-2.5">
            <FoodImage
              src="/images/hero-briyani.jpg"
              alt="Toko Briyani 16:9 negative-space editorial hero photograph"
              containerClassName="aspect-[16/9] w-full rounded-md"
            />
          </Card>
        </section>

        {/* 4. Unified 1:1 Square Product Photography System */}
        <section className="space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C96A35]">
              04 — Unified Product Photography (1:1 Square)
            </p>
            <h2 className="mt-1 font-serif text-3xl text-[#173F35]">
              Complete Menu Collection
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <FoodImage
                  src={product.image_url}
                  alt={product.name}
                  containerClassName="aspect-square w-full"
                />
                <div className="p-4">
                  <p className="font-serif text-lg text-[#173F35]">
                    {product.name}
                  </p>
                  <p className="text-xs text-[#7A7A70]">
                    960 × 960 px • 1:1 Square Card
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </StorefrontShell>
  );
}
