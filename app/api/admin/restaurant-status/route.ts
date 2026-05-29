import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { restaurantStatusSchema } from "@/lib/validations/admin";

export async function PATCH(request: Request) {
  const { admin, error } = await requireAdmin();

  if (error) {
    return error;
  }

  const body = await request.json();
  const parsed = restaurantStatusSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid restaurant status." }, { status: 400 });
  }

  const supabase = await createServerSupabaseClient();
  const { data, error: updateError } = await supabase
    .from("restaurant_status")
    .update({
      status: parsed.data.status,
      updated_by_admin: admin.adminId,
      updated_at: new Date().toISOString()
    })
    .eq("id", 1)
    .select("*")
    .single();

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 400 });
  }

  return NextResponse.json({ restaurantStatus: data });
}
