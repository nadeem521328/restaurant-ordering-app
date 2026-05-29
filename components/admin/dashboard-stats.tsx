import type { Order } from "@/types/order";

export function DashboardStats({ orders }: { orders: Order[] }) {
  const pending = orders.filter((order) => order.status === "Pending").length;
  const active = orders.filter((order) =>
    ["Pending", "Accepted", "Out For Delivery"].includes(order.status)
  ).length;

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="rounded-lg bg-white p-4 ring-1 ring-orange-100">
        <p className="text-sm font-bold text-gray-500">Today</p>
        <p className="mt-1 text-3xl font-black text-gray-950">{orders.length}</p>
      </div>
      <div className="rounded-lg bg-white p-4 ring-1 ring-orange-100">
        <p className="text-sm font-bold text-gray-500">Pending</p>
        <p className="mt-1 text-3xl font-black text-red-700">{pending}</p>
      </div>
      <div className="rounded-lg bg-white p-4 ring-1 ring-orange-100">
        <p className="text-sm font-bold text-gray-500">Active</p>
        <p className="mt-1 text-3xl font-black text-gray-950">{active}</p>
      </div>
      <div className="rounded-lg bg-white p-4 ring-1 ring-orange-100">
        <p className="text-sm font-bold text-gray-500">Done</p>
        <p className="mt-1 text-3xl font-black text-green-700">
          {orders.filter((order) => order.status === "Delivered").length}
        </p>
      </div>
    </div>
  );
}
