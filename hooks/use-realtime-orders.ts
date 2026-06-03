"use client";

import { useEffect, useRef } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import type { Order } from "@/types/order";

export function useRealtimeOrders({
  onInsert,
  onUpdate
}: {
  onInsert: (order: Order) => void;
  onUpdate: (order: Order) => void;
}) {
  const onInsertRef = useRef(onInsert);
  const onUpdateRef = useRef(onUpdate);

  useEffect(() => {
    onInsertRef.current = onInsert;
    onUpdateRef.current = onUpdate;
  }, [onInsert, onUpdate]);

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();
    let isMounted = true;
    let channel: ReturnType<typeof supabase.channel> | null = null;

    const {
      data: { subscription: authSubscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.access_token) {
        supabase.realtime.setAuth(session.access_token);
      }
    });

    async function subscribeToOrders() {
      const {
        data: { session }
      } = await supabase.auth.getSession();

      if (!isMounted) {
        return;
      }

      if (session?.access_token) {
        // Realtime has its own websocket auth. Send the admin JWT before
        // subscribing so RLS-protected order changes can be delivered.
        supabase.realtime.setAuth(session.access_token);
      }

      channel = supabase
        .channel("admin-orders")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "orders" },
          (payload) => onInsertRef.current(payload.new as Order)
        )
        .on(
          "postgres_changes",
          { event: "UPDATE", schema: "public", table: "orders" },
          (payload) => onUpdateRef.current(payload.new as Order)
        )
        .subscribe((status, error) => {
          if (status === "CHANNEL_ERROR") {
            console.error("Admin orders realtime subscription failed.", error);
          }
        });
    }

    void subscribeToOrders();

    return () => {
      isMounted = false;
      authSubscription.unsubscribe();

      if (channel) {
        void supabase.removeChannel(channel);
      }
    };
  }, []);
}
