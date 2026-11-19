"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronRight,
  ExternalLink,
  FolderTree,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Settings,
  ShoppingBag,
  X,
} from "lucide-react";
import { toast } from "sonner";
import type { AdminProfile } from "@/types/database";
import { cn } from "@/lib/utils/cn";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/brand/brand-logo";

interface AdminShellProps {
  admin: AdminProfile;
  mode: "supabase" | "demo";
  children: React.ReactNode;
}

const ADMIN_NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag, exact: false },
  { href: "/admin/products", label: "Products", icon: Package, exact: false },
  { href: "/admin/categories", label: "Categories", icon: FolderTree, exact: false },
  { href: "/admin/settings", label: "Store Settings", icon: Settings, exact: false },
];

const ROUTE_TITLES: Record<string, string> = {
  "/admin": "Overview",
  "/admin/orders": "Orders",
  "/admin/products": "Products",
  "/admin/categories": "Categories",
  "/admin/settings": "Store Settings",
};

export function AdminShell({ admin, mode, children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [signingOut, setSigningOut] = React.useState(false);

  React.useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const currentSection = ROUTE_TITLES[pathname] ?? "Admin";

  const handleLogout = async () => {
    setSigningOut(true);
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      toast.success("Signed out of Admin Portal.");
      router.push("/admin/login");
      router.refresh();
    } catch {
      toast.error("Failed to sign out.");
      setSigningOut(false);
    }
  };

  const sidebarContent = (
    <div className="flex h-full flex-col bg-[#173F35] text-[#F7F1E5]">
      <div className="flex h-16 items-center justify-between border-b border-[#F7F1E5]/10 px-5">
        <Link href="/admin" className="inline-flex items-center">
          <BrandLogo
            storeName="Toko Briyani"
            variant="light"
            size="sm"
            subtitle="Admin Console"
          />
        </Link>

        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
          className="rounded p-1 text-[#F7F1E5]/70 hover:bg-[#285747] lg:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav aria-label="Admin sidebar" className="flex-1 space-y-1 p-3">
        {ADMIN_NAV.map((item) => {
          const Icon = item.icon;
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3.5 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-[#F7F1E5] text-[#173F35]"
                  : "text-[#F7F1E5]/80 hover:bg-[#285747] hover:text-[#FCFAF6]"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[#F7F1E5]/10 p-4 space-y-3">
        <Link
          href="/"
          className="flex items-center justify-between rounded-md border border-[#F7F1E5]/15 bg-[#285747]/60 px-3 py-2 text-xs text-[#F7F1E5] transition-colors hover:bg-[#285747]"
        >
          <span>View Live Storefront</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>

        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-[#FCFAF6]">
              {admin.full_name}
            </p>
            <p className="truncate text-[11px] text-[#F7F1E5]/65">
              {admin.email}
            </p>
          </div>
          <button
            type="button"
            disabled={signingOut}
            onClick={handleLogout}
            title="Sign out"
            aria-label="Sign out"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[#F7F1E5]/80 hover:bg-[#285747] hover:text-[#FCFAF6]"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#F7F1E5]/60">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 shrink-0 lg:fixed lg:inset-y-0 lg:block">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-[#272923]/55"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative z-10 w-64 max-w-[82vw] shadow-xl">
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-[#E8E3D8] bg-[#FCFAF6]/95 px-4 backdrop-blur-sm sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation menu"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#E8E3D8] text-[#173F35] hover:bg-[#F7F1E5] lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-1.5 text-sm"
            >
              <Link
                href="/admin"
                className="text-[#7A7A70] transition-colors hover:text-[#173F35]"
              >
                Admin
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-[#7A7A70]" />
              <span className="font-medium text-[#173F35]">{currentSection}</span>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {mode === "demo" ? (
              <Badge variant="warning">Demo Preview Mode</Badge>
            ) : (
              <Badge variant="success">Supabase Connected</Badge>
            )}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={signingOut}
              onClick={handleLogout}
              className="hidden sm:inline-flex"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign Out
            </Button>
          </div>
        </header>

        {mode === "demo" && (
          <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-900 sm:px-6">
            <strong>Demo Mode Active:</strong> Supabase environment variables are not
            configured yet. Changes made in this session are kept in local server memory
            for preview. Add your Supabase keys to <code>.env.local</code> for persistent
            PostgreSQL storage and live authentication.
          </div>
        )}

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
