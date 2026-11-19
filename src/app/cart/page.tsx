import type { Metadata } from "next";
import { getStoreSettings } from "@/lib/data/repository";
import { StorefrontShell } from "@/components/layout/storefront-shell";
import { CartView } from "@/components/cart/cart-view";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shopping Cart",
  description: "Review your selected Toko Briyani dishes and proceed to checkout.",
};

export default async function CartPage() {
  const settings = await getStoreSettings();

  return (
    <StorefrontShell>
      <section className="border-b border-[#E8E3D8] bg-[#F7F1E5] py-10 sm:py-12">
        <div className="container">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C96A35]">
            Your Order
          </p>
          <h1 className="mt-1 font-serif text-4xl text-[#173F35]">
            Shopping Cart
          </h1>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="container">
          <CartView
            deliveryFee={settings.delivery_fee}
            minimumOrder={settings.minimum_order}
          />
        </div>
      </section>
    </StorefrontShell>
  );
}
