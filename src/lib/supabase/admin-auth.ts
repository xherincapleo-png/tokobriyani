import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { AdminProfile } from "@/types/database";
import { DEMO_ADMIN_COOKIE, isSupabaseConfigured } from "./config";
import { createSupabaseServerClient, createSupabaseServiceClient } from "./server";

export interface AdminSession {
  user: AdminProfile;
  mode: "supabase" | "demo";
}

export async function getAdminSession(): Promise<AdminSession | null> {
  if (isSupabaseConfigured()) {
    const supabase = createSupabaseServerClient();
    if (!supabase) return null;

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    // Verify admin role in admin_profiles using service client or user client
    const db = createSupabaseServiceClient() ?? supabase;
    const { data: profile } = await db
      .from("admin_profiles")
      .select("id, email, full_name, role, is_active")
      .eq("id", user.id)
      .eq("is_active", true)
      .single();

    if (!profile || (profile.role !== "admin" && profile.role !== "staff")) {
      return null;
    }

    return {
      user: {
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name,
        role: profile.role,
        is_active: profile.is_active,
      },
      mode: "supabase",
    };
  }

  // Only active when Supabase credentials are NOT configured (local preview mode)
  const cookieStore = cookies();
  const demoCookie = cookieStore.get(DEMO_ADMIN_COOKIE)?.value;
  if (demoCookie === "active") {
    return {
      user: {
        id: "demo-admin-user",
        email: "demo-admin@tokobriyani.local",
        full_name: "Demo Store Admin",
        role: "admin",
        is_active: true,
      },
      mode: "demo",
    };
  }

  return null;
}

export async function requireAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }
  return session;
}
