"use client";

import { useCallback, useState } from "react";
import { LogOut, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardStats } from "@/components/admin/dashboard-stats";
import { OrderCard } from "@/components/admin/order-card";
import { StatusControls } from "@/components/admin/status-controls";
import { useRealtimeOrders } from "@/hooks/use-realtime-orders";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import type { Order, OrderStatus } from "@/types/order";
import type { RestaurantStatus } from "@/types/restaurant";

function playNotification() {
  const legacyWindow = window as Window &
    typeof globalThis & { webkitAudioContext?: typeof AudioContext };
  const AudioContextClass =
    window.AudioContext || legacyWindow.webkitAudioContext;

  if (!AudioContextClass) {
    return;
  }

  const audioContext = new AudioContextClass();
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = "sine";
  oscillator.frequency.value = 880;
  gain.gain.value = 0.08;
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.22);
}

export function AdminDashboard({
  initialOrders,
  initialRestaurantStatus
}: {
  initialOrders: Order[];
  initialRestaurantStatus: RestaurantStatus;
}) {
  const [orders, setOrders] = useState(initialOrders);
  const [restaurantStatus, setRestaurantStatus] = useState(
    initialRestaurantStatus
  );
  const [updatingOrderId, setUpdatingOrderId] = useState("");
  const [statusLoading, setStatusLoading] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);

  const handleInsert = useCallback(
    (order: Order) => {
      setOrders((current) => [order, ...current]);
      if (soundEnabled) {
        playNotification();
      }
    },
    [soundEnabled]
  );

  const handleUpdate = useCallback((updatedOrder: Order) => {
    setOrders((current) =>
      current.map((order) =>
        order.id === updatedOrder.id ? updatedOrder : order
      )
    );
  }, []);

  useRealtimeOrders({
    onInsert: handleInsert,
    onUpdate: handleUpdate
  });

  async function updateOrderStatus(orderId: string, status: OrderStatus) {
    setUpdatingOrderId(orderId);
    const response = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });

    if (response.ok) {
      const data = (await response.json()) as { order: Order };
      handleUpdate(data.order);
    }

    setUpdatingOrderId("");
  }

  async function updateRestaurantStatus(status: RestaurantStatus) {
    setStatusLoading(true);
    const response = await fetch("/api/admin/restaurant-status", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });

    if (response.ok) {
      setRestaurantStatus(status);
    }

    setStatusLoading(false);
  }

  async function logout() {
    const supabase = createBrowserSupabaseClient();
    await supabase.auth.signOut();
    window.location.href = "/admin/login";
  }

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold uppercase text-red-700">
            Live dashboard
          </p>
          <h1 className="text-3xl font-black text-gray-950">Orders</h1>
        </div>
        <Button variant="ghost" className="px-3" onClick={logout}>
          <LogOut size={20} aria-hidden />
        </Button>
      </header>

      <Button
        className="w-full"
        variant={soundEnabled ? "secondary" : "primary"}
        onClick={() => {
          setSoundEnabled(true);
          playNotification();
        }}
      >
        <Volume2 size={20} aria-hidden />
        {soundEnabled ? "Sound On" : "Enable Order Sound"}
      </Button>

      <DashboardStats orders={orders} />

      <StatusControls
        status={restaurantStatus}
        loading={statusLoading}
        onChange={updateRestaurantStatus}
      />

      <section className="space-y-3">
        {orders.length === 0 ? (
          <div className="rounded-lg bg-white p-5 text-center font-bold text-gray-700 ring-1 ring-orange-100">
            No orders today.
          </div>
        ) : (
          orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              updating={updatingOrderId === order.id}
              onUpdateStatus={updateOrderStatus}
            />
          ))
        )}
      </section>
    </div>
  );
}
