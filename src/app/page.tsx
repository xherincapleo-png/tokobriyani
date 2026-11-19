import Link from "next/link";
import {
  ArrowRight,
  Flame,
  HeartHandshake,
  MessageCircle,
  Quote,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react";
import { getProducts, getStoreSettings } from "@/lib/data/repository";
import { SAMPLE_TESTIMONIALS } from "@/lib/data/demo-store";
import { buildWhatsAppChatUrl } from "@/lib/utils/whatsapp";
import { StorefrontShell } from "@/components/layout/storefront-shell";
import { ProductCard } from "@/components/products/product-card";
import { FoodImage } from "@/components/ui/food-image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

const WHY_CHOOSE_ITEMS = [
  {
    icon: Flame,
    title: "Freshly Prepared",
    description:
      "Every pot of basmati rice and spiced meat is steamed in small batches so your meal arrives warm, fluffy, and aromatic.",
  },
  {
    icon: Sparkles,
    title: "Authentic Whole Spices",
    description:
      "Green cardamom, star anise, cloves, cinnamon bark, and saffron threads are toasted gently to build deep, layered warmth.",
  },
  {
    icon: UtensilsCrossed,
    title: "Generous Portions",
    description:
      "Served with hearty cuts, fragrant long-grain rice, crispy shallots, and cooling raita crafted to satisfy real cravings.",
  },
  {
    icon: HeartHandshake,
    title: "Made With Care",
    description:
      "From thoughtful spice balance to neat, heat-retaining packaging, every order is prepared as if cooking for our own table.",
  },
];

export default async function HomePage() {
  const [featuredRaw, allProducts, settings] = await Promise.all([
    getProducts({ featuredOnly: true }),
    getProducts(),
    getStoreSettings(),
  ]);

  const featuredProducts =
    featuredRaw.length >= 4
      ? featuredRaw.slice(0, 4)
      : [
          ...featuredRaw,
          ...allProducts.filter((p) => !featuredRaw.some((f) => f.id === p.id)),
        ].slice(0, 4);

  const waPromoUrl = buildWhatsAppChatUrl(
    settings.whatsapp_number,
    `Hello ${settings.store_name}, I would like to ask about your Family Feast & Gathering Combo options.`
  );

  return (
    <StorefrontShell>
      {/* 1. HERO SECTION — Editorial Negative-Space Composition */}
      <section className="relative overflow-hidden border-b border-[#E8E3D8] bg-[#173F35] text-[#FCFAF6]">
        {/* Desktop Full-Bleed Negative-Space Hero Photograph */}
        <div className="pointer-events-none absolute inset-0 hidden lg:block">
          <FoodImage
            src="/images/hero-briyani.jpg"
            alt="Freshly served Chicken Briyani with saffron basmati rice, golden roasted chicken, caramelized onions, herbs, and subtle steam on a deep forest green table"
            priority
            containerClassName="h-full w-full"
            className="object-cover object-right"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-[#173F35] via-[#173F35]/35 via-40% to-transparent"
          />
        </div>

        <div className="container relative z-10 py-12 sm:py-16 lg:py-24 xl:py-28">
          <div className="grid items-center gap-8 lg:grid-cols-12">
            {/* Editorial Headline & CTA in Clean Left Negative Space */}
            <div className="space-y-6 lg:col-span-6">
              <div className="inline-flex items-center gap-2 rounded-sm border border-[#F7F1E5]/20 bg-[#285747]/70 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-[#F7F1E5]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#C96A35]" />
                Small-Batch Briyani Kitchen
              </div>

              <h1 className="font-serif text-4xl leading-[1.06] text-[#FCFAF6] sm:text-5xl lg:text-6xl">
                An Aroma Worth Gathering For.
              </h1>

              <p className="max-w-lg text-base leading-relaxed text-[#F7F1E5]/85 sm:text-lg">
                Discover rich spices, fragrant rice, and the comforting taste of
                authentic Briyani made for every craving.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button asChild variant="spice" size="lg">
                  <Link href="/menu">
                    Order Now
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-[#F7F1E5]/35 bg-transparent text-[#FCFAF6] hover:border-[#F7F1E5]/60 hover:bg-[#285747]/70 hover:text-[#FCFAF6]"
                >
                  <Link href="/menu#catalog">Explore Menu</Link>
                </Button>
              </div>

              <div className="grid max-w-md grid-cols-3 gap-4 border-t border-[#F7F1E5]/15 pt-6 text-xs">
                <div>
                  <p className="font-serif text-lg text-[#FCFAF6]">Basmati</p>
                  <p className="mt-0.5 text-[#F7F1E5]/70">Long-grain &amp; fluffy</p>
                </div>
                <div>
                  <p className="font-serif text-lg text-[#FCFAF6]">Whole Spice</p>
                  <p className="mt-0.5 text-[#F7F1E5]/70">Toasted in-house</p>
                </div>
                <div>
                  <p className="font-serif text-lg text-[#FCFAF6]">WhatsApp</p>
                  <p className="mt-0.5 text-[#F7F1E5]/70">Fast order confirm</p>
                </div>
              </div>
            </div>

            {/* Mobile & Tablet Clean Framed Hero Photograph (zero text overlap) */}
            <div className="lg:hidden">
              <div className="overflow-hidden rounded-lg border border-[#F7F1E5]/15 bg-[#285747]/40 p-2 shadow-editorial">
                <FoodImage
                  src="/images/hero-briyani-card.jpg"
                  alt="Freshly served Chicken Briyani with saffron basmati rice, golden roasted chicken, caramelized onions, herbs, and subtle steam"
                  priority
                  containerClassName="aspect-[4/3] w-full rounded-md"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED MENU (4 Products) */}
      <section className="py-16 sm:py-20">
        <div className="container">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C96A35]">
                From The Handi
              </p>
              <h2 className="mt-2 font-serif text-3xl text-[#173F35] sm:text-4xl">
                Featured Favorites
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[#7A7A70] sm:text-base">
                Start with our most-loved bowls and smoky accompaniments, ready to order for pickup or delivery.
              </p>
            </div>
            <Button asChild variant="outline" className="self-start sm:self-auto">
              <Link href="/menu">
                View Full Menu
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 3. BRAND STORY (Editorial Band) */}
      <section className="editorial-surface border-y border-[#E8E3D8] py-16 sm:py-24">
        <div className="container">
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-5">
              <div className="overflow-hidden rounded-lg border border-[#E8E3D8] bg-[#FCFAF6] p-2.5 shadow-editorial">
                <FoodImage
                  src="/images/story-spices.jpg"
                  alt="Whole aromatic spices including green cardamom, star anise, cinnamon, saffron threads, and basmati rice"
                  containerClassName="aspect-[4/5] w-full rounded-md"
                />
              </div>
            </div>

            <div className="space-y-6 lg:col-span-7">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C96A35]">
                Our Culinary Craft
              </p>
              <h2 className="font-serif text-3xl leading-tight text-[#173F35] sm:text-4xl lg:text-5xl">
                Slow-steamed layers, honest spices, and unhurried hospitality.
              </h2>
              <p className="text-base leading-relaxed text-[#272923]/80">
                At {settings.store_name}, Briyani is more than a quick meal—it is a
                ritual of patience and fragrance. We begin with whole green cardamom,
                cloves, cinnamon bark, and star anise gently bloomed in warm ghee, then
                layer tender marinated cuts with fluffy saffron-kissed basmati rice.
              </p>
              <p className="text-base leading-relaxed text-[#272923]/80">
                Each portion is finished with crisp golden shallots, fresh mint, and
                thoughtful sides so whether you are dining solo or laying out a weekend
                feast, every spoonful feels warm and restorative.
              </p>

              <div className="pt-2">
                <Button asChild variant="secondary" size="lg">
                  <Link href="/about">
                    Read Our Story
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE US */}
      <section className="py-16 sm:py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C96A35]">
              The Toko Briyani Standard
            </p>
            <h2 className="mt-2 font-serif text-3xl text-[#173F35] sm:text-4xl">
              Why Guests Come Back For Seconds
            </h2>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_CHOOSE_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-lg border border-[#E8E3D8] bg-[#FCFAF6] p-6 transition-colors hover:border-[#173F35]/30"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-md bg-[#F7F1E5] text-[#173F35]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 font-serif text-xl text-[#173F35]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#7A7A70]">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. SPECIAL PROMOTION SECTION */}
      <section className="py-6 sm:py-10">
        <div className="container">
          <div className="overflow-hidden rounded-lg bg-[#173F35] text-[#FCFAF6] shadow-editorial">
            <div className="grid items-center lg:grid-cols-12">
              <div className="space-y-5 p-8 sm:p-12 lg:col-span-6">
                <Badge variant="spice">Sharing & Gathering Offer</Badge>
                <h2 className="font-serif text-3xl leading-tight text-[#FCFAF6] sm:text-4xl">
                  Hosting Family Dinner or Office Lunch?
                </h2>
                <p className="text-sm leading-relaxed text-[#F7F1E5]/85 sm:text-base">
                  Build your own Briyani sharing spread—combine Chicken, Beef, or
                  Special Briyani with smoky Chicken Tikka, crisp Samosas, Garlic Naan,
                  and chilled Mango Lassi. Order online or message us for group trays.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Button asChild variant="spice" size="lg">
                    <Link href="/menu">Build Your Feast</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="border-[#F7F1E5]/30 text-[#FCFAF6] hover:bg-[#285747] hover:text-[#FCFAF6]"
                  >
                    <a href={waPromoUrl} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="h-4 w-4" />
                      Inquire for Group Orders
                    </a>
                  </Button>
                </div>
              </div>

              <div className="h-full lg:col-span-6">
                <FoodImage
                  src="/images/promo-feast.jpg"
                  alt="Toko Briyani family feast spread with Special Briyani, Chicken Tikka, Samosa, Garlic Naan, and Mango Lassi"
                  containerClassName="aspect-[4/3] h-full w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS (Clearly Labeled Sample Content) */}
      <section className="py-16 sm:py-20">
        <div className="container">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C96A35]">
                Around The Table
              </p>
              <h2 className="mt-2 font-serif text-3xl text-[#173F35] sm:text-4xl">
                Notes From Our Table
              </h2>
            </div>
            <Badge variant="cream">Sample Demo Testimonials</Badge>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {SAMPLE_TESTIMONIALS.map((review) => (
              <figure
                key={review.id}
                className="flex flex-col justify-between rounded-lg border border-[#E8E3D8] bg-[#F7F1E5]/60 p-6"
              >
                <div>
                  <Quote className="h-6 w-6 text-[#C96A35]/70" />
                  <blockquote className="mt-4 text-sm leading-relaxed text-[#272923]/90">
                    “{review.quote}”
                  </blockquote>
                </div>
                <figcaption className="mt-6 border-t border-[#E8E3D8] pt-4">
                  <p className="font-serif text-base text-[#173F35]">
                    {review.name}
                  </p>
                  <p className="text-xs text-[#7A7A70]">
                    {review.context} • {review.dish}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>

          <p className="mt-5 text-xs text-[#7A7A70]">
            * Displayed testimonials are seeded sample entries for storefront preview purposes and can be replaced with real customer feedback once orders go live.
          </p>
        </div>
      </section>
    </StorefrontShell>
  );
}
