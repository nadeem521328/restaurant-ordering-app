import { createServiceSupabaseClient } from "@/lib/supabase/service";
import type { MenuItem } from "@/types/menu";

export async function getAvailableMenuItems(): Promise<MenuItem[]> {
  const supabase = createServiceSupabaseClient();

  const { data, error } = await supabase
    .from("menu_items")
    .select("id,name,image_url,price,availability,created_at")
    .eq("availability", true)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function getMenuItemById(id: string): Promise<MenuItem | null> {
  const supabase = createServiceSupabaseClient();

  const { data, error } = await supabase
    .from("menu_items")
    .select("id,name,image_url,price,availability,created_at")
    .eq("id", id)
    .single();

  if (error) {
    return null;
  }

  return data;
}
