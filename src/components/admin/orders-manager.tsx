"use client";

import * as React from "react";
import { Eye, MessageCircle, Search, X } from "lucide-react";
import { toast } from "sonner";
import type { Order, OrderStatus, PaymentStatus } from "@/types/database";
import { ORDER_STATUSES, PAYMENT_STATUSES } from "@/lib/validations/schemas";
import {
  formatDateTime,
  formatIDR,
  normalizeWhatsAppNumber,
} from "@/lib/utils/format";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { OrderStatusBadge, PaymentStatusBadge } from "./status-badges";

interface OrdersManagerProps {
  initialOrders: Order[];
}

export function OrdersManager({ initialOrders }: OrdersManagerProps) {
  const [orders, setOrders] = React.useState<Order[]>(initialOrders);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("All");
  const [dateFilter, setDateFilter] = React.useState("");
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
  const [updatingId, setUpdatingId] = React.useState<string | null>(null);

  const filteredOrders = React.useMemo(() => {
    return orders.filter((o) => {
      if (statusFilter !== "All" && o.order_status !== statusFilter) {
        return false;
      }
      if (dateFilter && o.created_at.slice(0, 10) !== dateFilter) {
        return false;
      }
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        return (
          o.order_number.toLowerCase().includes(q) ||
          o.customer_name.toLowerCase().includes(q) ||
          o.phone.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [orders, search, statusFilter, dateFilter]);

  const handleStatusUpdate = async (
    orderId: string,
    payload: { order_status?: OrderStatus; payment_status?: PaymentStatus }
  ) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data?.error || "Failed to update order.");
        return;
      }

      const updated: Order = data.order;
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      setSelectedOrder((prev) => (prev?.id === orderId ? updated : prev));
      toast.success(`Order ${updated.order_number} updated.`);
    } catch {
      toast.error("Network error while updating order.");
    } finally {
      setUpdatingId(null);
    }
  };

  const buildCustomerReplyUrl = (order: Order) => {
    const phone = normalizeWhatsAppNumber(order.phone);
    const msg = `Hello ${order.customer_name}, regarding your Toko Briyani order *${order.order_number}*: current status is *${order.order_status}*.`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  };

  const hasFilters = search.trim() || statusFilter !== "All" || dateFilter;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-[#173F35]">Orders</h1>
        <p className="mt-1 text-sm text-[#7A7A70]">
          Review incoming customer orders, inspect delivery details, and update fulfillment & payment statuses.
        </p>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid gap-3 md:grid-cols-12">
          <div className="relative md:col-span-5">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7A7A70]" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search order #, customer name, or WhatsApp..."
              className="pl-9"
            />
          </div>

          <div className="md:col-span-3">
            <select
              aria-label="Filter by order status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex h-10 w-full rounded-md border border-[#E8E3D8] bg-[#FCFAF6] px-3 text-sm"
            >
              <option value="All">All Order Statuses</option>
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3">
            <Input
              type="date"
              aria-label="Filter by date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>

          <div className="md:col-span-1">
            {hasFilters && (
              <Button
                type="button"
                variant="secondary"
                className="w-full"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("All");
                  setDateFilter("");
                }}
                aria-label="Clear filters"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Orders Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="border-b border-[#E8E3D8] bg-[#F7F1E5]/70 text-xs uppercase tracking-wider text-[#7A7A70]">
              <tr>
                <th className="px-5 py-3.5 font-medium">Order</th>
                <th className="px-4 py-3.5 font-medium">Customer</th>
                <th className="px-4 py-3.5 font-medium">Type & Total</th>
                <th className="px-4 py-3.5 font-medium">Order Status</th>
                <th className="px-4 py-3.5 font-medium">Payment</th>
                <th className="px-5 py-3.5 text-right font-medium">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E3D8]">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="transition-colors hover:bg-[#F7F1E5]/35"
                  >
                    <td className="px-5 py-3.5">
                      <p className="font-mono text-xs font-semibold text-[#173F35]">
                        {order.order_number}
                      </p>
                      <p className="mt-0.5 text-xs text-[#7A7A70]">
                        {formatDateTime(order.created_at)}
                      </p>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="font-medium text-[#272923]">
                        {order.customer_name}
                      </p>
                      <p className="text-xs text-[#7A7A70]">{order.phone}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="font-semibold text-[#173F35]">
                        {formatIDR(order.total)}
                      </p>
                      <p className="text-xs text-[#7A7A70]">
                        {order.delivery_type} • {order.payment_method}
                      </p>
                    </td>
                    <td className="px-4 py-3.5">
                      <select
                        aria-label={`Order status for ${order.order_number}`}
                        value={order.order_status}
                        disabled={updatingId === order.id}
                        onChange={(e) =>
                          handleStatusUpdate(order.id, {
                            order_status: e.target.value as OrderStatus,
                          })
                        }
                        className="h-8 rounded border border-[#E8E3D8] bg-[#FCFAF6] px-2 text-xs font-medium text-[#272923]"
                      >
                        {ORDER_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3.5">
                      <select
                        aria-label={`Payment status for ${order.order_number}`}
                        value={order.payment_status}
                        disabled={updatingId === order.id}
                        onChange={(e) =>
                          handleStatusUpdate(order.id, {
                            payment_status: e.target.value as PaymentStatus,
                          })
                        }
                        className="h-8 rounded border border-[#E8E3D8] bg-[#FCFAF6] px-2 text-xs font-medium text-[#272923]"
                      >
                        {PAYMENT_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Inspect
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-12 text-center text-sm text-[#7A7A70]"
                  >
                    No orders found for the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Order Detail Inspector Modal */}
      <Modal
        open={Boolean(selectedOrder)}
        onOpenChange={(open) => !open && setSelectedOrder(null)}
        title={selectedOrder ? `Order ${selectedOrder.order_number}` : "Order"}
        description={
          selectedOrder
            ? `Placed on ${formatDateTime(selectedOrder.created_at)}`
            : undefined
        }
        maxWidthClass="max-w-2xl"
      >
        {selectedOrder && (
          <div className="space-y-6 text-sm">
            {/* Status Badges + Quick Selectors */}
            <div className="grid gap-4 rounded-lg border border-[#E8E3D8] bg-[#F7F1E5]/60 p-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Order Status</Label>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedOrder.order_status}
                    disabled={updatingId === selectedOrder.id}
                    onChange={(e) =>
                      handleStatusUpdate(selectedOrder.id, {
                        order_status: e.target.value as OrderStatus,
                      })
                    }
                    className="h-9 flex-1 rounded-md border border-[#E8E3D8] bg-[#FCFAF6] px-2.5 text-xs font-medium"
                  >
                    {ORDER_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <OrderStatusBadge status={selectedOrder.order_status} />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Payment Status</Label>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedOrder.payment_status}
                    disabled={updatingId === selectedOrder.id}
                    onChange={(e) =>
                      handleStatusUpdate(selectedOrder.id, {
                        payment_status: e.target.value as PaymentStatus,
                      })
                    }
                    className="h-9 flex-1 rounded-md border border-[#E8E3D8] bg-[#FCFAF6] px-2.5 text-xs font-medium"
                  >
                    {PAYMENT_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <PaymentStatusBadge status={selectedOrder.payment_status} />
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-md border border-[#E8E3D8] p-4">
                <p className="text-xs uppercase tracking-wider text-[#7A7A70]">
                  Customer
                </p>
                <p className="mt-1 font-semibold text-[#272923]">
                  {selectedOrder.customer_name}
                </p>
                <p className="text-xs text-[#7A7A70]">{selectedOrder.phone}</p>
                <a
                  href={buildCustomerReplyUrl(selectedOrder)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-[#173F35] hover:underline"
                >
                  <MessageCircle className="h-3.5 w-3.5 text-[#C96A35]" />
                  Message Customer on WhatsApp
                </a>
              </div>

              <div className="rounded-md border border-[#E8E3D8] p-4">
                <p className="text-xs uppercase tracking-wider text-[#7A7A70]">
                  Fulfillment & Payment
                </p>
                <p className="mt-1 font-medium text-[#272923]">
                  {selectedOrder.delivery_type} • {selectedOrder.payment_method}
                </p>
                {selectedOrder.delivery_address && (
                  <p className="mt-1 text-xs leading-relaxed text-[#7A7A70]">
                    {selectedOrder.delivery_address}
                  </p>
                )}
              </div>
            </div>

            {selectedOrder.notes && (
              <div className="rounded-md border border-[#E8E3D8] bg-[#F7F1E5]/40 p-3.5">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#7A7A70]">
                  Customer Notes
                </p>
                <p className="mt-1 text-[#272923]">{selectedOrder.notes}</p>
              </div>
            )}

            {/* Items */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#7A7A70]">
                Order Items
              </p>
              <ul className="mt-2 divide-y divide-[#E8E3D8] rounded-md border border-[#E8E3D8]">
                {(selectedOrder.items ?? []).map((item) => (
                  <li
                    key={item.id}
                    className="flex items-start justify-between gap-4 px-4 py-3"
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
                    <span className="font-semibold text-[#173F35]">
                      {formatIDR(item.subtotal)}
                    </span>
                  </li>
                ))}
              </ul>

              <dl className="mt-4 space-y-1.5 text-sm">
                <div className="flex justify-between text-[#7A7A70]">
                  <dt>Subtotal</dt>
                  <dd>{formatIDR(selectedOrder.subtotal)}</dd>
                </div>
                <div className="flex justify-between text-[#7A7A70]">
                  <dt>Delivery Fee</dt>
                  <dd>{formatIDR(selectedOrder.delivery_fee)}</dd>
                </div>
                <div className="flex items-baseline justify-between border-t border-[#E8E3D8] pt-2.5">
                  <dt className="font-semibold text-[#272923]">Grand Total</dt>
                  <dd className="font-serif text-xl text-[#173F35]">
                    {formatIDR(selectedOrder.total)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
