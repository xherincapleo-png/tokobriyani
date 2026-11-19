"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DashboardAnalytics } from "@/types/database";
import { formatIDR } from "@/lib/utils/format";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardChartsProps {
  salesLast7Days: DashboardAnalytics["salesLast7Days"];
  statusDistribution: DashboardAnalytics["statusDistribution"];
}

export function DashboardCharts({
  salesLast7Days,
  statusDistribution,
}: DashboardChartsProps) {
  const totalStatusCount = statusDistribution.reduce((sum, s) => sum + s.count, 0);

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      {/* 7-Day Sales Bar Chart */}
      <Card className="lg:col-span-8">
        <CardHeader>
          <CardTitle>Sales Over Last 7 Days</CardTitle>
          <CardDescription>
            Daily gross revenue (excluding cancelled orders) in IDR.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={salesLast7Days}
                margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E8E3D8"
                />
                <XAxis
                  dataKey="label"
                  tick={{ fill: "#7A7A70", fontSize: 12 }}
                  axisLine={{ stroke: "#E8E3D8" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#7A7A70", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) =>
                    v >= 1000 ? `${Math.round(v / 1000)}k` : `${v}`
                  }
                />
                <Tooltip
                  cursor={{ fill: "#F7F1E5" }}
                  contentStyle={{
                    backgroundColor: "#FCFAF6",
                    borderColor: "#E8E3D8",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  formatter={(value: number) => [formatIDR(value), "Revenue"]}
                />
                <Bar
                  dataKey="revenue"
                  fill="#173F35"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={42}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Order Status Distribution */}
      <Card className="lg:col-span-4">
        <CardHeader>
          <CardTitle>Order Status Distribution</CardTitle>
          <CardDescription>Breakdown across all recorded orders.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {statusDistribution.map((entry) => {
            const pct =
              totalStatusCount > 0
                ? Math.round((entry.count / totalStatusCount) * 100)
                : 0;
            return (
              <div key={entry.status} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[#272923]">
                    {entry.status}
                  </span>
                  <span className="text-[#7A7A70]">
                    {entry.count} ({pct}%)
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-[#F7F1E5]">
                  <div
                    className="h-full rounded-full bg-[#285747] transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
