"use client";

import Link from "next/link";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { formatIDR } from "@/lib/utils/format";
import { FoodImage } from "@/components/ui/food-image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface CartViewProps {
  deliveryFee: number;
  minimumOrder: number;
}

export function CartView({ deliveryFee, minimumOrder }: CartViewProps) {
  const {
    items,
    isHydrated,
    subtotal,
    incrementItem,
    decrementItem,
    removeItem,
    clearCart,
  } = useCart();

  if (!isHydrated) {
    return (
      <div className="space-y-4">
        <div className="h-32 animate-pulse rounded-lg border border-[#E8E3D8] bg-[#F7F1E5]/60" />
        <div className="h-32 animate-pulse rounded-lg border border-[#E8E3D8] bg-[#F7F1E5]/60" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <Card className="mx-auto max-w-xl border-dashed bg-[#F7F1E5]/60 px-6 py-16 text-center shadow-none">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#173F35]/10 text-[#173F35]">
          <ShoppingBag className="h-6 w-6" />
        </div>
        <h2 className="mt-5 font-serif text-3xl text-[#272923]">
          Your cart is currently empty
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-[#7A7A70]">
          Explore our aromatic Chicken Briyani, Beef Briyani, Royal Special platter, savory sides, and chilled Mango Lassi.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/menu">Explore Menu</Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </Card>
    );
  }

  const grandTotalWithDelivery = subtotal + deliveryFee;
  const belowMinOrder = minimumOrder > 0 && subtotal < minimumOrder;

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      {/* Cart Items */}
      <div className="space-y-4 lg:col-span-8">
        <div className="flex items-center justify-between border-b border-[#E8E3D8] pb-3">
          <p className="text-sm text-[#7A7A70]">
            {items.reduce((sum, i) => sum + i.quantity, 0)} item(s) in your order
          </p>
          <button
            type="button"
            onClick={clearCart}
            className="text-xs font-medium text-[#7A7A70] underline underline-offset-4 transition-colors hover:text-red-700"
          >
            Clear cart
          </button>
        </div>

        {items.map((item) => (
          <Card
            key={item.key}
            className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5"
          >
            <Link
              href={`/menu/${item.slug}`}
              className="h-24 w-full shrink-0 overflow-hidden rounded-md sm:h-24 sm:w-28"
            >
              <FoodImage
                src={item.imageUrl}
                alt={item.name}
                containerClassName="h-full w-full"
              />
            </Link>

            <div className="min-w-0 flex-1 space-y-1">
              <p className="text-[11px] uppercase tracking-[0.14em] text-[#7A7A70]">
                {item.categoryName}
              </p>
              <Link
                href={`/menu/${item.slug}`}
                className="font-serif text-xl text-[#272923] hover:text-[#173F35]"
              >
                {item.name}
              </Link>
              <p className="text-sm text-[#7A7A70]">
                {formatIDR(item.price)} each
              </p>
              {(item.spicyLevel || item.notes) && (
                <div className="flex flex-wrap gap-2 pt-1 text-xs text-[#285747]">
                  {item.spicyLevel && (
                    <span className="rounded bg-[#F7F1E5] px-2 py-0.5 border border-[#E8E3D8]">
                      Spice: {item.spicyLevel}
                    </span>
                  )}
                  {item.notes && (
                    <span className="rounded bg-[#F7F1E5] px-2 py-0.5 border border-[#E8E3D8]">
                      Note: {item.notes}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-[#E8E3D8] pt-3 sm:flex-col sm:items-end sm:border-t-0 sm:pt-0">
              <p className="text-base font-semibold text-[#173F35]">
                {formatIDR(item.price * item.quantity)}
              </p>

              <div className="flex items-center gap-2">
                <div className="flex items-center rounded-md border border-[#E8E3D8] bg-[#F7F1E5] p-0.5">
                  <button
                    type="button"
                    onClick={() => decrementItem(item.key)}
                    aria-label={`Decrease quantity of ${item.name}`}
                    className="flex h-8 w-8 items-center justify-center rounded text-[#173F35] hover:bg-[#FCFAF6]"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="min-w-[2rem] text-center text-sm font-semibold">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => incrementItem(item.key)}
                    aria-label={`Increase quantity of ${item.name}`}
                    className="flex h-8 w-8 items-center justify-center rounded text-[#173F35] hover:bg-[#FCFAF6]"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => removeItem(item.key)}
                  aria-label={`Remove ${item.name} from cart`}
                  className="flex h-9 w-9 items-center justify-center rounded-md border border-[#E8E3D8] text-[#7A7A70] transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Order Summary Sidebar */}
      <div className="lg:col-span-4">
        <Card className="sticky top-24 bg-[#F7F1E5]/70 p-6">
          <h2 className="font-serif text-2xl text-[#272923]">Order Summary</h2>

          <dl className="mt-5 space-y-3 border-b border-[#E8E3D8] pb-5 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-[#7A7A70]">Cart Subtotal</dt>
              <dd className="font-medium text-[#272923]">{formatIDR(subtotal)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-[#7A7A70]">Delivery Fee (if Delivery)</dt>
              <dd className="font-medium text-[#272923]">
                {deliveryFee > 0 ? formatIDR(deliveryFee) : "Free"}
              </dd>
            </div>
            <p className="text-xs text-[#7A7A70]">
              Choose Pickup at checkout for Rp0 delivery fee.
            </p>
          </dl>

          <div className="mt-5 flex items-baseline justify-between">
            <span className="text-sm font-medium text-[#272923]">
              Estimated Total (Delivery)
            </span>
            <span className="font-serif text-2xl text-[#173F35]">
              {formatIDR(grandTotalWithDelivery)}
            </span>
          </div>

          {belowMinOrder && (
            <p className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
              Minimum order is {formatIDR(minimumOrder)}. Add{" "}
              {formatIDR(minimumOrder - subtotal)} more to proceed.
            </p>
          )}

          <div className="mt-6 space-y-3">
            <Button
              asChild={!belowMinOrder}
              disabled={belowMinOrder}
              size="lg"
              className="w-full"
            >
              {belowMinOrder ? (
                <span>Minimum Order Not Met</span>
              ) : (
                <Link href="/checkout">
                  Proceed to Checkout
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </Button>

            <Button asChild variant="secondary" className="w-full">
              <Link href="/menu">Continue Shopping</Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
