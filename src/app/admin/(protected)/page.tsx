import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  DollarSign,
  ShoppingBag,
} from "lucide-react";
import { getDashboardAnalytics } from "@/lib/data/repository";
import { formatDateTime, formatIDR } from "@/lib/utils/format";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardCharts } from "@/components/admin/dashboard-charts";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/admin/status-badges";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const analytics = await getDashboardAnalytics();

  const kpiCards = [
    {
      label: "Total Orders Today",
      value: String(analytics.ordersToday),
      icon: ShoppingBag,
      sub: "Recorded since midnight",
    },
    {
      label: "Revenue Today",
      value: formatIDR(analytics.revenueToday),
      icon: DollarSign,
      sub: "Excluding cancelled orders",
    },
    {
      label: "Pending / Active Orders",
      value: String(analytics.pendingOrders),
      icon: Clock,
      sub: "Pending, Confirmed, or Preparing",
    },
    {
      label: "Completed Orders",
      value: String(analytics.completedOrders),
      icon: CheckCircle2,
      sub: "Successfully fulfilled",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-serif text-3xl text-[#173F35]">
              Dashboard Overview
            </h1>
            {analytics.isDemoData && (
              <Badge variant="warning">Demo Data</Badge>
            )}
          </div>
          <p className="mt-1 text-sm text-[#7A7A70]">
            Real-time snapshot of Toko Briyani orders, daily sales, and menu performance.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button asChild variant="secondary" size="sm">
            <Link href="/admin/products">Manage Products</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/admin/orders">
              View All Orders
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.label} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-[#7A7A70]">
                    {kpi.label}
                  </p>
                  <p className="mt-2 font-serif text-3xl text-[#173F35]">
                    {kpi.value}
                  </p>
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#F7F1E5] text-[#173F35]">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-3 text-xs text-[#7A7A70]">{kpi.sub}</p>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <DashboardCharts
        salesLast7Days={analytics.salesLast7Days}
        statusDistribution={analytics.statusDistribution}
      />

      {/* Recent Orders & Best Selling Menu */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Recent Orders */}
        <Card className="lg:col-span-8">
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>
                Latest orders submitted through the storefront checkout.
              </CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/orders">See all</Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[540px] text-left text-sm">
                <thead className="border-y border-[#E8E3D8] bg-[#F7F1E5]/60 text-xs uppercase tracking-wider text-[#7A7A70]">
                  <tr>
                    <th className="px-6 py-3 font-medium">Order #</th>
                    <th className="px-4 py-3 font-medium">Customer</th>
                    <th className="px-4 py-3 font-medium">Total</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 text-right font-medium">Payment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E3D8]">
                  {analytics.recentOrders.length > 0 ? (
                    analytics.recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-[#F7F1E5]/30">
                        <td className="px-6 py-3">
                          <p className="font-mono text-xs font-semibold text-[#173F35]">
                            {order.order_number}
                          </p>
                          <p className="text-[11px] text-[#7A7A70]">
                            {formatDateTime(order.created_at)}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-[#272923]">
                            {order.customer_name}
                          </p>
                          <p className="text-xs text-[#7A7A70]">
                            {order.delivery_type}
                          </p>
                        </td>
                        <td className="px-4 py-3 font-semibold text-[#173F35]">
                          {formatIDR(order.total)}
                        </td>
                        <td className="px-4 py-3">
                          <OrderStatusBadge status={order.order_status} />
                        </td>
                        <td className="px-6 py-3 text-right">
                          <PaymentStatusBadge status={order.payment_status} />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-10 text-center text-sm text-[#7A7A70]"
                      >
                        No orders recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Best-Selling Menu */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Best-Selling Menu</CardTitle>
            <CardDescription>Top dishes by portions ordered.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {analytics.bestSelling.length > 0 ? (
              analytics.bestSelling.map((dish, idx) => (
                <div
                  key={dish.productName}
                  className="flex items-center justify-between gap-3 border-b border-[#E8E3D8] pb-3 last:border-b-0 last:pb-0"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#F7F1E5] font-serif text-sm text-[#173F35]">
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-[#272923]">
                        {dish.productName}
                      </p>
                      <p className="text-xs text-[#7A7A70]">
                        {dish.quantitySold} portions sold
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 text-xs font-semibold text-[#173F35]">
                    {formatIDR(dish.revenue)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-[#7A7A70]">
                No menu sales recorded yet.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
