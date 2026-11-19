import type { Metadata } from "next";
import { getStoreSettings } from "@/lib/data/repository";
import { StorefrontShell } from "@/components/layout/storefront-shell";
import { CheckoutForm } from "@/components/checkout/checkout-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Complete your Toko Briyani pickup or delivery order and confirm via WhatsApp.",
};

export default async function CheckoutPage() {
  const settings = await getStoreSettings();

  return (
    <StorefrontShell>
      <section className="border-b border-[#E8E3D8] bg-[#F7F1E5] py-10 sm:py-12">
        <div className="container">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C96A35]">
            Complete Your Order
          </p>
          <h1 className="mt-1 font-serif text-4xl text-[#173F35]">Checkout</h1>
          <p className="mt-2 max-w-xl text-sm text-[#7A7A70]">
            Fill in your delivery or pickup details below. After placing your order, you can confirm directly via WhatsApp in one tap.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="container">
          <CheckoutForm settings={settings} />
        </div>
      </section>
    </StorefrontShell>
  );
}
