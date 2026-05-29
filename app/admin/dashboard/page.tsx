import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Order } from "@/types/order";
import type { RestaurantStatusRow } from "@/types/restaurant";
import { todayIsoDate } from "@/utils/date";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: admin } = await supabase
    .from("admins")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!admin) {
    redirect("/admin/login");
  }

  const startOfToday = `${todayIsoDate()}T00:00:00.000Z`;
  const [{ data: orders }, { data: restaurantStatus }] = await Promise.all([
    supabase
      .from("orders")
      .select("*")
      .gte("created_at", startOfToday)
      .order("created_at", { ascending: false }),
    supabase
      .from("restaurant_status")
      .select("id,status,message,updated_at,updated_by_admin")
      .eq("id", 1)
      .single()
  ]);

  const status = (restaurantStatus as RestaurantStatusRow | null)?.status ?? "CLOSED";

  return (
    <main className="min-h-screen px-4 py-5">
      <div className="mx-auto max-w-3xl">
        <AdminDashboard
          initialOrders={(orders ?? []) as Order[]}
          initialRestaurantStatus={status}
        />
      </div>
    </main>
  );
}
