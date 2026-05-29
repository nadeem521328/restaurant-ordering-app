import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type AdminSession = {
  userId: string;
  adminId: string;
  name: string;
};

export async function requireAdmin(): Promise<
  | { admin: AdminSession; error: null }
  | { admin: null; error: NextResponse }
> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      admin: null,
      error: NextResponse.json({ error: "Unauthorized." }, { status: 401 })
    };
  }

  const { data: admin } = await supabase
    .from("admins")
    .select("id,name")
    .eq("user_id", user.id)
    .single();

  if (!admin) {
    return {
      admin: null,
      error: NextResponse.json({ error: "Admin access required." }, { status: 403 })
    };
  }

  return {
    admin: {
      userId: user.id,
      adminId: admin.id,
      name: admin.name
    },
    error: null
  };
}
