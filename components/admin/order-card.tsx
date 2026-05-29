"use client";

import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Order, OrderStatus } from "@/types/order";
import { formatCurrency } from "@/utils/format-currency";
import { formatOrderTime } from "@/utils/date";

const statusActions: OrderStatus[] = [
  "Accepted",
  "Out For Delivery",
  "Delivered",
  "Cancelled"
];

const badgeColor: Record<OrderStatus, string> = {
  Pending: "bg-yellow-100 text-yellow-800",
  Accepted: "bg-blue-100 text-blue-800",
  "Out For Delivery": "bg-purple-100 text-purple-800",
  Delivered: "bg-green-100 text-green-800",
  Cancelled: "bg-gray-200 text-gray-700"
};

export function OrderCard({
  order,
  updating,
  onUpdateStatus
}: {
  order: Order;
  updating: boolean;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
}) {
  return (
    <article className="rounded-lg bg-white p-4 ring-1 ring-orange-100">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-gray-500">
            #{order.order_number}
          </p>
          <h3 className="text-xl font-black text-gray-950">
            {order.customer_name}
          </h3>
        </div>
        <span
          className={`rounded-md px-2 py-1 text-xs font-black ${badgeColor[order.status]}`}
        >
          {order.status}
        </span>
      </div>

      <div className="mt-3 space-y-2 text-sm text-gray-700">
        <p>
          <strong>Phone:</strong> {order.phone}
        </p>
        <p>
          <strong>Address:</strong> {order.address}
        </p>
        {order.notes ? (
          <p>
            <strong>Notes:</strong> {order.notes}
          </p>
        ) : null}
        <p>
          <strong>Items:</strong> {order.item_name} x {order.quantity}
        </p>
        <p>
          <strong>Total:</strong> {formatCurrency(order.total_price)} COD
        </p>
        <p>
          <strong>Time:</strong> {formatOrderTime(order.created_at)}
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <a
          href={`tel:${order.phone}`}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-green-700 px-3 font-bold text-white active:bg-green-800"
        >
          <Phone size={18} aria-hidden />
          Call
        </a>
        {statusActions.map((status) => (
          <Button
            key={status}
            className="px-2 text-sm"
            variant={status === "Cancelled" ? "danger" : "secondary"}
            disabled={updating || order.status === status}
            onClick={() => onUpdateStatus(order.id, status)}
          >
            {status}
          </Button>
        ))}
      </div>
    </article>
  );
}
