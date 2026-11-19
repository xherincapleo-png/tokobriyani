import type { OrderStatus, PaymentStatus } from "@/types/database";
import { Badge } from "@/components/ui/badge";

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  switch (status) {
    case "Completed":
      return <Badge variant="success">Completed</Badge>;
    case "Ready":
      return <Badge variant="default">Ready</Badge>;
    case "Preparing":
      return <Badge variant="spice">Preparing</Badge>;
    case "Confirmed":
      return <Badge variant="cream">Confirmed</Badge>;
    case "Cancelled":
      return <Badge variant="danger">Cancelled</Badge>;
    case "Pending":
    default:
      return <Badge variant="warning">Pending</Badge>;
  }
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  switch (status) {
    case "Paid":
      return <Badge variant="success">Paid</Badge>;
    case "Pending Verification":
      return <Badge variant="warning">Pending Verification</Badge>;
    case "Refunded":
      return <Badge variant="muted">Refunded</Badge>;
    case "Unpaid":
    default:
      return <Badge variant="outline">Unpaid</Badge>;
  }
}
