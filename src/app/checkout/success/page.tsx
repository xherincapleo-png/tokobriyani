import type { Metadata } from "next";
import { getOrderByNumber, getStoreSettings } from "@/lib/data/repository";
import { StorefrontShell } from "@/components/layout/storefront-shell";
import { OrderSuccessView } from "@/components/checkout/order-success-view";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Order Confirmed",
  description: "Your Toko Briyani order summary and WhatsApp confirmation link.",
};

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { order?: string };
}) {
  const orderNumber = searchParams.order?.trim() ?? "";
  const [order, settings] = await Promise.all([
    orderNumber ? getOrderByNumber(orderNumber) : Promise.resolve(null),
    getStoreSettings(),
  ]);

  return (
    <StorefrontShell>
      <section className="py-12 sm:py-16">
        <div className="container">
          <OrderSuccessView
            initialOrder={order}
            orderNumberParam={orderNumber}
            settings={settings}
          />
        </div>
      </section>
    </StorefrontShell>
  );
}
