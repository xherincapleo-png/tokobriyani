"use client";

import * as React from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Copy,
  Info,
  MessageCircle,
  ShoppingBag,
} from "lucide-react";
import { toast } from "sonner";
import type { Order, StoreSettings } from "@/types/database";
import { formatIDR, isPlaceholderWhatsApp } from "@/lib/utils/format";
import {
  buildWhatsAppOrderMessage,
  buildWhatsAppOrderUrl,
} from "@/lib/utils/whatsapp";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface OrderSuccessViewProps {
  initialOrder: Order | null;
  orderNumberParam: string;
  settings: StoreSettings;
}

export function OrderSuccessView({
  initialOrder,
  orderNumberParam,
  settings,
}: OrderSuccessViewProps) {
  const [order, setOrder] = React.useState<Order | null>(initialOrder);

  // Hydrate from sessionStorage if server memory/DB did not return it (e.g. cold serverless instance)
  React.useEffect(() => {
    if (order || !orderNumberParam) return;
    try {
      const raw = window.sessionStorage.getItem(
        `toko-briyani-order-${orderNumberParam}`
      );
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.order) {
          setOrder(parsed.order);
        }
      }
    } catch {
      // Ignore storage error
    }
  }, [order, orderNumberParam]);

  if (!order) {
    return (
      <Card className="mx-auto max-w-xl p-10 text-center">
        <ShoppingBag className="mx-auto h-10 w-10 text-[#173F35]" />
        <h1 className="mt-4 font-serif text-3xl text-[#272923]">
          Order summary not found
        </h1>
        <p className="mt-2 text-sm text-[#7A7A70]">
          We could not locate details for that order reference. If you just placed an order, please reach out to us via WhatsApp or start a new order.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button asChild>
            <Link href="/menu">Explore Menu</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/contact">Contact Store</Link>
          </Button>
        </div>
      </Card>
    );
  }

  const waUrl = buildWhatsAppOrderUrl(
    order,
    settings.whatsapp_number,
    settings.store_name
  );
  const waPreviewText = buildWhatsAppOrderMessage(order, settings.store_name);
  const usingPlaceholderWa = isPlaceholderWhatsApp(settings.whatsapp_number);

  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(waPreviewText);
      toast.success("Order summary copied to clipboard.");
    } catch {
      toast.error("Unable to copy automatically.");
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Card className="overflow-hidden border-[#173F35]/20">
        <div className="bg-[#173F35] px-6 py-8 text-center text-[#FCFAF6] sm:px-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#285747] text-[#F7F1E5]">
            <CheckCircle2 className="h-8 w-8 text-[#C96A35]" />
          </div>
          <p className="mt-4 text-xs uppercase tracking-[0.2em] text-[#F7F1E5]/75">
            Order Received
          </p>
          <h1 className="mt-1 font-serif text-3xl text-[#FCFAF6] sm:text-4xl">
            Thank you, {order.customer_name}!
          </h1>
          <div className="mt-4 inline-flex items-center gap-2 rounded-md border border-[#F7F1E5]/20 bg-[#285747] px-4 py-1.5 text-sm font-medium">
            <span>Order Number:</span>
            <span className="font-mono tracking-wider text-[#FCFAF6]">
              {order.order_number}
            </span>
          </div>
        </div>

        <div className="space-y-6 p-6 sm:p-8">
          {/* Primary WhatsApp CTA */}
          <div className="rounded-lg border border-[#173F35]/20 bg-[#F7F1E5] p-5 text-center">
            <p className="text-sm font-medium text-[#173F35]">
              Final Step: Confirm your order on WhatsApp
            </p>
            <p className="mt-1 text-xs leading-relaxed text-[#7A7A70]">
              Tap below to send your complete itemized order directly to{" "}
              {settings.store_name} for immediate kitchen confirmation and payment guidance.
            </p>

            <div className="mt-4 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
              <Button asChild size="lg" variant="spice">
                <a href={waUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-4 w-4" />
                  Confirm Order via WhatsApp
                </a>
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="lg"
                onClick={handleCopySummary}
              >
                <Copy className="h-4 w-4" />
                Copy Order Text
              </Button>
            </div>

            {usingPlaceholderWa && (
              <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-[#7A7A70]">
                <Info className="h-3.5 w-3.5 shrink-0 text-[#C96A35]" />
                Store WhatsApp number is currently using a placeholder. Owners can update it in Admin → Store Settings.
              </p>
            )}
          </div>

          {/* Customer & Fulfillment Metadata */}
          <div className="grid gap-4 rounded-lg border border-[#E8E3D8] bg-[#FCFAF6] p-4 text-sm sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-wider text-[#7A7A70]">
                Customer
              </p>
              <p className="mt-1 font-medium text-[#272923]">
                {order.customer_name}
              </p>
              <p className="text-xs text-[#7A7A70]">{order.phone}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-[#7A7A70]">
                Order Type & Payment
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-1.5">
                <Badge variant="cream">{order.delivery_type}</Badge>
                <Badge variant="outline">{order.payment_method}</Badge>
              </div>
            </div>
            {order.delivery_type === "Delivery" && order.delivery_address && (
              <div className="sm:col-span-2">
                <p className="text-xs uppercase tracking-wider text-[#7A7A70]">
                  Delivery Address
                </p>
                <p className="mt-1 text-[#272923]">{order.delivery_address}</p>
              </div>
            )}
            {order.notes && (
              <div className="sm:col-span-2">
                <p className="text-xs uppercase tracking-wider text-[#7A7A70]">
                  Order Notes
                </p>
                <p className="mt-1 text-[#272923]">{order.notes}</p>
              </div>
            )}
          </div>

          {/* Itemized Breakdown */}
          <div>
            <h2 className="font-serif text-xl text-[#272923]">Items Ordered</h2>
            <ul className="mt-3 divide-y divide-[#E8E3D8] border-y border-[#E8E3D8]">
              {(order.items ?? []).map((item) => (
                <li
                  key={item.id}
                  className="flex items-start justify-between gap-4 py-3 text-sm"
                >
                  <div>
                    <p className="font-medium text-[#272923]">
                      {item.quantity} × {item.product_name}
                    </p>
                    <p className="text-xs text-[#7A7A70]">
                      {formatIDR(item.unit_price)} each
                      {item.notes ? ` • ${item.notes}` : ""}
                    </p>
                  </div>
                  <span className="font-medium text-[#272923]">
                    {formatIDR(item.subtotal)}
                  </span>
                </li>
              ))}
            </ul>

            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between text-[#7A7A70]">
                <dt>Subtotal</dt>
                <dd>{formatIDR(order.subtotal)}</dd>
              </div>
              <div className="flex justify-between text-[#7A7A70]">
                <dt>Delivery Fee</dt>
                <dd>
                  {order.delivery_type === "Delivery"
                    ? formatIDR(order.delivery_fee)
                    : "Rp0 (Pickup)"}
                </dd>
              </div>
              <div className="flex items-baseline justify-between border-t border-[#E8E3D8] pt-3">
                <dt className="font-semibold text-[#272923]">Grand Total</dt>
                <dd className="font-serif text-2xl text-[#173F35]">
                  {formatIDR(order.total)}
                </dd>
              </div>
            </dl>
          </div>

          <div className="flex flex-wrap justify-between gap-3 pt-2">
            <Button asChild variant="secondary">
              <Link href="/menu">Order More Dishes</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">Return Home</Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
