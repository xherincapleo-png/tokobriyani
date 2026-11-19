import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/supabase/admin-auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { AdminLoginForm } from "@/components/admin/admin-login-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Sign In",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: { redirect?: string };
}) {
  const session = await getAdminSession();
  if (session) {
    redirect("/admin");
  }

  const redirectTo =
    searchParams.redirect && searchParams.redirect.startsWith("/admin")
      ? searchParams.redirect
      : "/admin";

  return (
    <main className="editorial-surface flex min-h-screen items-center justify-center p-4">
      <AdminLoginForm
        supabaseConfigured={isSupabaseConfigured()}
        redirectTo={redirectTo}
      />
    </main>
  );
}
