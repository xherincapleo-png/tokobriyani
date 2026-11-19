import type { Metadata } from "next";
import { getCategories, getProducts } from "@/lib/data/repository";
import { StorefrontShell } from "@/components/layout/storefront-shell";
import { MenuBrowser } from "@/components/products/menu-browser";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Browse Toko Briyani's full menu: Chicken Briyani, Beef Briyani, Special Briyani, Egg Briyani, Chicken Tikka, Samosa, Garlic Naan, and Mango Lassi.",
};

export default async function MenuPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const [categories, products] = await Promise.all([
    getCategories(false),
    getProducts({ includeUnavailable: false }),
  ]);

  return (
    <StorefrontShell>
      {/* Page Header */}
      <section className="border-b border-[#E8E3D8] bg-[#F7F1E5] py-12 sm:py-16">
        <div className="container">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C96A35]">
            Freshly Steamed Daily
          </p>
          <h1 className="mt-2 font-serif text-4xl text-[#173F35] sm:text-5xl">
            Our Menu
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#272923]/80 sm:text-base">
            Choose from our signature layered Briyani bowls, savory sides, freshly
            brushed flatbreads, and cooling Mango Lassi. All prices are in Indonesian
            Rupiah (IDR).
          </p>
        </div>
      </section>

      {/* Interactive Catalog */}
      <section id="catalog" className="py-12 sm:py-16">
        <div className="container">
          <MenuBrowser
            categories={categories}
            products={products}
            initialCategory={searchParams.category || "all"}
          />
        </div>
      </section>
    </StorefrontShell>
  );
}
