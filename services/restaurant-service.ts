import { createServiceSupabaseClient } from "@/lib/supabase/service";
import type { RestaurantStatusRow } from "@/types/restaurant";

const DEFAULT_STATUS: RestaurantStatusRow = {
  id: 1,
  status: "CLOSED",
  message: "Restaurant status is not configured.",
  updated_at: new Date().toISOString(),
  updated_by_admin: null
};

export async function getRestaurantStatus(): Promise<RestaurantStatusRow> {
  const supabase = createServiceSupabaseClient();

  const { data, error } = await supabase
    .from("restaurant_status")
    .select("id,status,message,updated_at,updated_by_admin")
    .eq("id", 1)
    .single();

  if (error || !data) {
    return DEFAULT_STATUS;
  }

  return data;
}
