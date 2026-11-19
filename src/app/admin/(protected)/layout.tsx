import * as React from "react";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/supabase/admin-auth";
import { AdminShell } from "@/components/admin/admin-shell";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: "Admin Dashboard",
    template: "%s | Toko Briyani Admin",
  },
  robots: { index: false, follow: false },
};

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();

  return (
    <AdminShell admin={session.user} mode={session.mode}>
      {children}
    </AdminShell>
  );
}
