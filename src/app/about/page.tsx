import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Flame, Leaf, ShieldCheck, Sparkles } from "lucide-react";
import { getStoreSettings } from "@/lib/data/repository";
import { StorefrontShell } from "@/components/layout/storefront-shell";
import { FoodImage } from "@/components/ui/food-image";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Discover Toko Briyani's culinary philosophy, aromatic whole spices, and commitment to freshly prepared Briyani.",
};

const SPICE_HIGHLIGHTS = [
  {
    name: "Long-Grain Basmati",
    detail:
      "Soaked and parboiled carefully so every grain stays slender, light, and distinct after slow steaming.",
  },
  {
    name: "Green Cardamom & Star Anise",
    detail:
      "Whole pods gently bloomed in warm fat to lend a floral, uplifting fragrance without harsh bitterness.",
  },
  {
    name: "Saffron Infusion",
    detail:
      "Steeped strands drizzled across the top layer of rice for golden ribbons and delicate earthy aroma.",
  },
  {
    name: "House Spice Blend & Herbs",
    detail:
      "Balanced roasted cumin, coriander, cinnamon bark, cloves, fresh mint, and crisp golden shallots.",
  },
];

export default async function AboutPage() {
  const settings = await getStoreSettings();

  return (
    <StorefrontShell>
      {/* Editorial Intro */}
      <section className="border-b border-[#E8E3D8] bg-[#F7F1E5] py-14 sm:py-20">
        <div className="container">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C96A35]">
              Our Story
            </p>
            <h1 className="mt-3 font-serif text-4xl leading-tight text-[#173F35] sm:text-5xl lg:text-6xl">
              Built around warmth, fragrance, and the joy of sharing a good pot of Briyani.
            </h1>
            <p className="mt-5 text-base leading-relaxed text-[#272923]/80 sm:text-lg">
              {settings.store_description ||
                "Toko Briyani focuses on doing one culinary tradition thoughtfully: layered aromatic rice, richly spiced meats, crisp savory sides, and refreshing drinks."}
            </p>
          </div>
        </div>
      </section>

      {/* Food Philosophy */}
      <section className="py-16 sm:py-24">
        <div className="container">
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="space-y-5 lg:col-span-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C96A35]">
                Food Philosophy
              </p>
              <h2 className="font-serif text-3xl text-[#173F35] sm:text-4xl">
                Patience in the pot, balance on the palate.
              </h2>
              <p className="text-base leading-relaxed text-[#272923]/80">
                Great Briyani relies on harmony rather than overwhelming heat. Every
                element—from yogurt-marinated chicken and slow-braised beef to
                caramelized onions and bright cucumber raita—is prepared to complement
                the next.
              </p>
              <p className="text-base leading-relaxed text-[#272923]/80">
                We cook in controlled batches rather than holding rice for hours, so the
                moment you lift the lid at home, the steam still carries the unmistakable
                scent of freshly steamed spices.
              </p>

              <div className="rounded-lg border border-dashed border-[#173F35]/25 bg-[#F7F1E5]/70 p-4 text-xs leading-relaxed text-[#7A7A70]">
                <strong className="font-semibold text-[#173F35]">
                  Kitchen Note (Editable Placeholder):
                </strong>{" "}
                Store owners can personalize the brand description, kitchen location, and
                opening hours anytime via the Admin Dashboard → Store Settings.
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="overflow-hidden rounded-lg border border-[#E8E3D8] bg-[#F7F1E5] p-2.5 shadow-editorial">
                <FoodImage
                  src="/images/hero-briyani-card.jpg"
                  alt="Steaming brass handi of aromatic Briyani"
                  containerClassName="aspect-[4/3] w-full rounded-md"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ingredients & Spices */}
      <section className="editorial-surface border-y border-[#E8E3D8] py-16 sm:py-24">
        <div className="container">
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="order-2 lg:order-1 lg:col-span-5">
              <div className="overflow-hidden rounded-lg border border-[#E8E3D8] bg-[#FCFAF6] p-2.5 shadow-editorial">
                <FoodImage
                  src="/images/story-spices.jpg"
                  alt="Whole aromatic spices and saffron threads used in Toko Briyani"
                  containerClassName="aspect-[4/5] w-full rounded-md"
                />
              </div>
            </div>

            <div className="order-1 space-y-6 lg:order-2 lg:col-span-7">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C96A35]">
                Ingredients & Spices
              </p>
              <h2 className="font-serif text-3xl text-[#173F35] sm:text-4xl">
                Whole aromatics toasted with care.
              </h2>

              <div className="grid gap-4 sm:grid-cols-2">
                {SPICE_HIGHLIGHTS.map((spice) => (
                  <div
                    key={spice.name}
                    className="rounded-lg border border-[#E8E3D8] bg-[#FCFAF6] p-5"
                  >
                    <h3 className="font-serif text-lg text-[#173F35]">
                      {spice.name}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-[#7A7A70]">
                      {spice.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quality Promise */}
      <section className="py-16 sm:py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C96A35]">
              Our Promise
            </p>
            <h2 className="mt-2 font-serif text-3xl text-[#173F35] sm:text-4xl">
              What You Can Expect Every Order
            </h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-lg border border-[#E8E3D8] bg-[#FCFAF6] p-6">
              <Flame className="h-6 w-6 text-[#C96A35]" />
              <h3 className="mt-4 font-serif text-xl text-[#173F35]">
                Cooked Fresh, Packed Warm
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#7A7A70]">
                Prepared to order with thoughtful packaging that keeps rice fluffy and accompaniments separate until you are ready to eat.
              </p>
            </div>
            <div className="rounded-lg border border-[#E8E3D8] bg-[#FCFAF6] p-6">
              <Leaf className="h-6 w-6 text-[#C96A35]" />
              <h3 className="mt-4 font-serif text-xl text-[#173F35]">
                Honest Ingredients
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#7A7A70]">
                Whole spices, fresh herbs, crisp fried shallots, and rich marinades without shortcuts.
              </p>
            </div>
            <div className="rounded-lg border border-[#E8E3D8] bg-[#FCFAF6] p-6">
              <ShieldCheck className="h-6 w-6 text-[#C96A35]" />
              <h3 className="mt-4 font-serif text-xl text-[#173F35]">
                Clear, Friendly Ordering
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#7A7A70]">
                Transparent IDR pricing, easy online cart checkout, and direct WhatsApp confirmation so you always know your order status.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Button asChild size="lg">
              <Link href="/menu">
                <Sparkles className="h-4 w-4" />
                Explore Our Menu
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </StorefrontShell>
  );
}
