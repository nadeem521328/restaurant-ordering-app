"use client";

import { useCallback, useState } from "react";
import { MenuOrderPanel } from "@/components/customer/menu-order-panel";
import { RestaurantStatusBanner } from "@/components/customer/restaurant-status-banner";
import { useRealtimeRestaurantStatus } from "@/hooks/use-realtime-restaurant-status";
import type { MenuItem } from "@/types/menu";
import type { RestaurantStatusRow } from "@/types/restaurant";

export function CustomerHome({
  restaurantName,
  initialMenuItems,
  initialRestaurant
}: {
  restaurantName: string;
  initialMenuItems: MenuItem[];
  initialRestaurant: RestaurantStatusRow;
}) {
  const [restaurant, setRestaurant] = useState(initialRestaurant);

  const handleStatusUpdate = useCallback((nextStatus: RestaurantStatusRow) => {
    setRestaurant(nextStatus);
  }, []);

  useRealtimeRestaurantStatus({
    onUpdate: handleStatusUpdate
  });

  return (
    <main className="min-h-screen px-4 py-5 pb-28">
      <div className="mx-auto max-w-xl space-y-5">
        <header className="space-y-3">
          <p className="text-sm font-bold uppercase text-red-700">
            Direct restaurant order
          </p>
          <h1 className="text-3xl font-black text-gray-950">{restaurantName}</h1>
          <RestaurantStatusBanner
            status={restaurant.status}
            message={restaurant.message}
          />
        </header>

        {initialMenuItems.length > 0 ? (
          <MenuOrderPanel
            items={initialMenuItems}
            restaurantStatus={restaurant.status}
          />
        ) : (
          <div className="rounded-lg bg-white p-5 text-center font-bold text-gray-700 ring-1 ring-orange-100">
            No items available now.
          </div>
        )}
      </div>
    </main>
  );
}
