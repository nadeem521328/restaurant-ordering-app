"use client";

import { useEffect } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import type { Order } from "@/types/order";

export function useRealtimeOrders({
  onInsert,
  onUpdate
}: {
  onInsert: (order: Order) => void;
  onUpdate: (order: Order) => void;
}) {
  useEffect(() => {
    const supabase = createBrowserSupabaseClient();
    const channel = supabase
      .channel("admin-orders")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        (payload) => onInsert(payload.new as Order)
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "orders" },
        (payload) => onUpdate(payload.new as Order)
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [onInsert, onUpdate]);
}
