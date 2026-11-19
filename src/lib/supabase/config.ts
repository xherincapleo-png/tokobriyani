export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";

  if (!url || !anonKey) return false;
  if (url.includes("your-project-id") || anonKey.includes("your-supabase-anon-key")) {
    return false;
  }

  return url.startsWith("https://") || url.startsWith("http://");
}

export function isSupabaseServiceConfigured(): boolean {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? "";
  if (!isSupabaseConfigured() || !serviceKey) return false;
  if (serviceKey.includes("your-supabase-service-role-key")) return false;
  return true;
}

export const DEMO_ADMIN_COOKIE = "tb_demo_admin_session";
