import type { Metadata } from "next";
import { getOrders } from "@/lib/data/repository";
import { OrdersManager } from "@/components/admin/orders-manager";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Orders",
};

export default async function AdminOrdersPage() {
  const orders = await getOrders();
  return <OrdersManager initialOrders={orders} />;
}
