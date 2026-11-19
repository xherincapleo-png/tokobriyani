import type { Order } from "@/types/database";
import { formatIDR, normalizeWhatsAppNumber } from "./format";

export function getStoreWhatsAppNumber(settingsNumber?: string | null): string {
  const fromSettings = normalizeWhatsAppNumber(settingsNumber);
  if (fromSettings) return fromSettings;

  const fromEnv = normalizeWhatsAppNumber(process.env.NEXT_PUBLIC_STORE_WHATSAPP);
  if (fromEnv) return fromEnv;

  // Safe non-routable placeholder until the store owner configures their real WhatsApp number
  return "6280000000000";
}

export function buildWhatsAppOrderMessage(order: Order, storeName = "Toko Briyani"): string {
  const lines: string[] = [
    `Hello *${storeName}*, I would like to confirm my order:`,
    "",
    `*Order Number:* ${order.order_number}`,
    `*Customer:* ${order.customer_name}`,
    `*WhatsApp:* ${order.phone}`,
    `*Order Type:* ${order.delivery_type}`,
  ];

  if (order.delivery_type === "Delivery" && order.delivery_address) {
    lines.push(`*Delivery Address:* ${order.delivery_address}`);
  }

  lines.push(`*Payment Method:* ${order.payment_method}`);
  lines.push("");
  lines.push("*Order Items:*");

  const items = order.items ?? [];
  items.forEach((item, index) => {
    const noteSuffix = item.notes ? ` (${item.notes})` : "";
    lines.push(
      `${index + 1}. ${item.product_name}${noteSuffix} — ${item.quantity} x ${formatIDR(
        item.unit_price
      )} = ${formatIDR(item.subtotal)}`
    );
  });

  lines.push("");
  lines.push(`*Subtotal:* ${formatIDR(order.subtotal)}`);
  lines.push(
    `*Delivery Fee:* ${
      order.delivery_type === "Delivery" ? formatIDR(order.delivery_fee) : "Rp0 (Pickup)"
    }`
  );
  lines.push(`*Grand Total:* ${formatIDR(order.total)}`);

  if (order.notes && order.notes.trim().length > 0) {
    lines.push("");
    lines.push(`*Notes:* ${order.notes.trim()}`);
  }

  lines.push("");
  lines.push("Thank you!");

  return lines.join("\n");
}

export function buildWhatsAppOrderUrl(
  order: Order,
  storeWhatsAppNumber?: string | null,
  storeName = "Toko Briyani"
): string {
  const targetNumber = getStoreWhatsAppNumber(storeWhatsAppNumber);
  const message = buildWhatsAppOrderMessage(order, storeName);
  return `https://wa.me/${targetNumber}?text=${encodeURIComponent(message)}`;
}

export function buildWhatsAppChatUrl(
  storeWhatsAppNumber?: string | null,
  prefillMessage = "Hello Toko Briyani, I would like to ask about your menu and ordering."
): string {
  const targetNumber = getStoreWhatsAppNumber(storeWhatsAppNumber);
  return `https://wa.me/${targetNumber}?text=${encodeURIComponent(prefillMessage)}`;
}
