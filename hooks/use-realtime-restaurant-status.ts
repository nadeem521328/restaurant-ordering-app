"use client";

import { useEffect } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import type { RestaurantStatusRow } from "@/types/restaurant";

export function useRealtimeRestaurantStatus({
  onUpdate
}: {
  onUpdate: (status: RestaurantStatusRow) => void;
}) {
  useEffect(() => {
    const supabase = createBrowserSupabaseClient();
    const channel = supabase
      .channel("restaurant-status")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "restaurant_status",
          filter: "id=eq.1"
        },
        (payload) => onUpdate(payload.new as RestaurantStatusRow)
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [onUpdate]);
}
