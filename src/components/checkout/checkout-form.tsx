"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  Banknote,
  Building2,
  Loader2,
  MapPin,
  QrCode,
  ShoppingBag,
  Store,
  Truck,
} from "lucide-react";
import { toast } from "sonner";
import type { Order, StoreSettings } from "@/types/database";
import {
  checkoutFormSchema,
  type CheckoutFormValues,
} from "@/lib/validations/schemas";
import { useCart } from "@/hooks/use-cart";
import { formatIDR } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CheckoutFormProps {
  settings: StoreSettings;
}

const PAYMENT_OPTIONS = [
  {
    value: "Cash" as const,
    label: "Cash",
    description: "Pay in cash upon pickup or delivery.",
    icon: Banknote,
  },
  {
    value: "Bank Transfer" as const,
    label: "Bank Transfer",
    description: "Transfer details will be shared via WhatsApp confirmation.",
    icon: Building2,
  },
  {
    value: "QRIS" as const,
    label: "QRIS (Manual Confirmation)",
    description: "Receive our QRIS code and send payment receipt on WhatsApp.",
    icon: QrCode,
  },
];

export function CheckoutForm({ settings }: CheckoutFormProps) {
  const router = useRouter();
  const { items, isHydrated, subtotal, clearCart } = useCart();
  const [serverError, setServerError] = React.useState<string | null>(null);
  const submittingRef = React.useRef(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      customer_name: "",
      phone: "",
      delivery_type: "Delivery",
      delivery_address: "",
      payment_method: "QRIS",
      notes: "",
    },
  });

  const deliveryType = watch("delivery_type");
  const paymentMethod = watch("payment_method");

  const deliveryFee =
    deliveryType === "Delivery" ? Number(settings.delivery_fee || 0) : 0;
  const grandTotal = subtotal + deliveryFee;
  const belowMinOrder =
    settings.minimum_order > 0 && subtotal < settings.minimum_order;

  const onSubmit = async (values: CheckoutFormValues) => {
    if (submittingRef.current || items.length === 0) return;
    submittingRef.current = true;
    setServerError(null);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: values.customer_name,
          phone: values.phone,
          delivery_type: values.delivery_type,
          delivery_address:
            values.delivery_type === "Delivery" ? values.delivery_address : null,
          payment_method: values.payment_method,
          notes: values.notes || null,
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            spicyLevel: item.spicyLevel,
            notes: item.notes,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const message = data?.error || "Could not complete your order.";
        setServerError(message);
        toast.error(message);
        submittingRef.current = false;
        return;
      }

      const createdOrder: Order = data.order;
      try {
        window.sessionStorage.setItem(
          `toko-briyani-order-${createdOrder.order_number}`,
          JSON.stringify({
            order: createdOrder,
            persistedToDatabase: Boolean(data.persistedToDatabase),
          })
        );
      } catch {
        // Ignore sessionStorage unavailability
      }

      clearCart();
      toast.success(`Order ${createdOrder.order_number} placed!`);
      router.push(
        `/checkout/success?order=${encodeURIComponent(createdOrder.order_number)}`
      );
    } catch {
      const message = "Network error while submitting your order. Please try again.";
      setServerError(message);
      toast.error(message);
      submittingRef.current = false;
    }
  };

  if (!isHydrated) {
    return (
      <div className="h-96 animate-pulse rounded-lg border border-[#E8E3D8] bg-[#F7F1E5]/60" />
    );
  }

  if (items.length === 0) {
    return (
      <Card className="mx-auto max-w-lg bg-[#F7F1E5]/60 p-10 text-center">
        <ShoppingBag className="mx-auto h-10 w-10 text-[#173F35]" />
        <h2 className="mt-4 font-serif text-2xl text-[#272923]">
          No items ready for checkout
        </h2>
        <p className="mt-2 text-sm text-[#7A7A70]">
          Add your favorite Briyani dishes to your cart before checking out.
        </p>
        <Button asChild className="mt-6">
          <Link href="/menu">Browse Menu</Link>
        </Button>
      </Card>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="grid gap-8 lg:grid-cols-12"
    >
      {/* Left: Customer & Delivery Form */}
      <div className="space-y-6 lg:col-span-7">
        {serverError && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{serverError}</p>
          </div>
        )}

        {/* Step 1: Customer Info */}
        <Card className="p-6">
          <h2 className="font-serif text-2xl text-[#272923]">
            1. Customer Details
          </h2>
          <p className="mt-1 text-sm text-[#7A7A70]">
            We use these details to confirm your order and share preparation updates.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="customer_name">Full Name *</Label>
              <Input
                id="customer_name"
                placeholder="Your full name"
                autoComplete="name"
                {...register("customer_name")}
              />
              {errors.customer_name && (
                <p className="text-xs text-red-700">
                  {errors.customer_name.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone">WhatsApp Number *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="0812xxxxxxxx"
                autoComplete="tel"
                {...register("phone")}
              />
              {errors.phone && (
                <p className="text-xs text-red-700">{errors.phone.message}</p>
              )}
            </div>
          </div>
        </Card>

        {/* Step 2: Order Type */}
        <Card className="p-6">
          <h2 className="font-serif text-2xl text-[#272923]">
            2. Pickup or Delivery
          </h2>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setValue("delivery_type", "Delivery", { shouldValidate: true })}
              className={cn(
                "flex items-start gap-3 rounded-lg border p-4 text-left transition-colors",
                deliveryType === "Delivery"
                  ? "border-[#173F35] bg-[#173F35] text-[#FCFAF6]"
                  : "border-[#E8E3D8] bg-[#F7F1E5]/60 text-[#272923] hover:border-[#173F35]/40"
              )}
            >
              <Truck className="mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <p className="font-medium">Delivery</p>
                <p
                  className={cn(
                    "mt-0.5 text-xs",
                    deliveryType === "Delivery"
                      ? "text-[#F7F1E5]/80"
                      : "text-[#7A7A70]"
                  )}
                >
                  Flat fee: {formatIDR(settings.delivery_fee)}
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setValue("delivery_type", "Pickup", { shouldValidate: true })}
              className={cn(
                "flex items-start gap-3 rounded-lg border p-4 text-left transition-colors",
                deliveryType === "Pickup"
                  ? "border-[#173F35] bg-[#173F35] text-[#FCFAF6]"
                  : "border-[#E8E3D8] bg-[#F7F1E5]/60 text-[#272923] hover:border-[#173F35]/40"
              )}
            >
              <Store className="mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <p className="font-medium">Self Pickup</p>
                <p
                  className={cn(
                    "mt-0.5 text-xs",
                    deliveryType === "Pickup"
                      ? "text-[#F7F1E5]/80"
                      : "text-[#7A7A70]"
                  )}
                >
                  Rp0 fee — collect at our kitchen
                </p>
              </div>
            </button>
          </div>

          {deliveryType === "Delivery" ? (
            <div className="mt-5 space-y-1.5">
              <Label htmlFor="delivery_address">Delivery Address *</Label>
              <Textarea
                id="delivery_address"
                placeholder="Street name, house/unit number, landmark, and area..."
                {...register("delivery_address")}
              />
              {errors.delivery_address && (
                <p className="text-xs text-red-700">
                  {errors.delivery_address.message}
                </p>
              )}
            </div>
          ) : (
            <div className="mt-5 flex items-start gap-2.5 rounded-md border border-[#E8E3D8] bg-[#F7F1E5]/70 p-4 text-sm text-[#272923]">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#C96A35]" />
              <div>
                <p className="font-medium text-[#173F35]">Pickup Location</p>
                <p className="mt-0.5 text-xs leading-relaxed text-[#7A7A70]">
                  {settings.address ||
                    "Pickup address will be confirmed on WhatsApp."}
                </p>
              </div>
            </div>
          )}
        </Card>

        {/* Step 3: Payment & Notes */}
        <Card className="p-6">
          <h2 className="font-serif text-2xl text-[#272923]">
            3. Payment Method & Notes
          </h2>

          <div className="mt-4 space-y-2.5">
            {PAYMENT_OPTIONS.map((option) => {
              const Icon = option.icon;
              const selected = paymentMethod === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    setValue("payment_method", option.value, {
                      shouldValidate: true,
                    })
                  }
                  className={cn(
                    "flex w-full items-start gap-3.5 rounded-lg border p-4 text-left transition-colors",
                    selected
                      ? "border-[#173F35] bg-[#F7F1E5]"
                      : "border-[#E8E3D8] bg-[#FCFAF6] hover:border-[#173F35]/35"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-md",
                      selected
                        ? "bg-[#173F35] text-[#FCFAF6]"
                        : "bg-[#F7F1E5] text-[#173F35]"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#272923]">
                      {option.label}
                    </p>
                    <p className="mt-0.5 text-xs text-[#7A7A70]">
                      {option.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-5 space-y-1.5">
            <Label htmlFor="notes">Order Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Preferred pickup/delivery time, cutlery request, or special dietary notes..."
              {...register("notes")}
            />
            {errors.notes && (
              <p className="text-xs text-red-700">{errors.notes.message}</p>
            )}
          </div>
        </Card>
      </div>

      {/* Right: Sticky Summary */}
      <div className="lg:col-span-5">
        <Card className="sticky top-24 bg-[#F7F1E5]/75 p-6">
          <div className="flex items-center justify-between border-b border-[#E8E3D8] pb-4">
            <h2 className="font-serif text-2xl text-[#272923]">
              Order Summary
            </h2>
            <Link
              href="/cart"
              className="text-xs font-medium text-[#173F35] underline underline-offset-4"
            >
              Edit Cart
            </Link>
          </div>

          <ul className="divide-y divide-[#E8E3D8] py-2">
            {items.map((item) => (
              <li
                key={item.key}
                className="flex items-start justify-between gap-3 py-3 text-sm"
              >
                <div className="min-w-0">
                  <p className="font-medium text-[#272923]">
                    {item.quantity} × {item.name}
                  </p>
                  {(item.spicyLevel || item.notes) && (
                    <p className="mt-0.5 text-xs text-[#7A7A70]">
                      {[
                        item.spicyLevel ? `Spice: ${item.spicyLevel}` : null,
                        item.notes || null,
                      ]
                        .filter(Boolean)
                        .join(" • ")}
                    </p>
                  )}
                </div>
                <span className="shrink-0 font-medium text-[#272923]">
                  {formatIDR(item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <dl className="space-y-2.5 border-t border-[#E8E3D8] pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-[#7A7A70]">Subtotal</dt>
              <dd className="font-medium text-[#272923]">{formatIDR(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[#7A7A70]">
                Delivery Fee ({deliveryType})
              </dt>
              <dd className="font-medium text-[#272923]">
                {deliveryType === "Delivery" ? formatIDR(deliveryFee) : "Rp0"}
              </dd>
            </div>
            <div className="flex items-baseline justify-between border-t border-[#E8E3D8] pt-3">
              <dt className="text-base font-semibold text-[#272923]">
                Grand Total
              </dt>
              <dd className="font-serif text-2xl text-[#173F35]">
                {formatIDR(grandTotal)}
              </dd>
            </div>
          </dl>

          {belowMinOrder && (
            <p className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
              Minimum order is {formatIDR(settings.minimum_order)}.
            </p>
          )}

          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting || belowMinOrder}
            className="mt-6 w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Placing Order...
              </>
            ) : (
              `Place Order — ${formatIDR(grandTotal)}`
            )}
          </Button>

          <p className="mt-3 text-center text-xs leading-relaxed text-[#7A7A70]">
            Final prices are verified securely on our server. After placing your order, you can send it straight to our WhatsApp for fast confirmation.
          </p>
        </Card>
      </div>
    </form>
  );
}
