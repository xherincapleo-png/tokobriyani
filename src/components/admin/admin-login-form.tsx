"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, Loader2, Lock, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BrandEmblem } from "@/components/brand/brand-logo";

interface AdminLoginFormProps {
  supabaseConfigured: boolean;
  redirectTo: string;
}

export function AdminLoginForm({
  supabaseConfigured,
  redirectTo,
}: AdminLoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [demoLoading, setDemoLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Sign in failed.");
        setLoading(false);
        return;
      }

      toast.success("Welcome back to Toko Briyani Admin.");
      router.push(redirectTo);
      router.refresh();
    } catch {
      setError("Network error while signing in.");
      setLoading(false);
    }
  };

  const handleDemoPreview = async () => {
    setDemoLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ demo: true }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "Unable to launch demo preview.");
        setDemoLoading(false);
        return;
      }
      toast.info("Entered Demo Admin Preview.");
      router.push(redirectTo);
      router.refresh();
    } catch {
      setError("Network error.");
      setDemoLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <div className="mx-auto inline-flex">
          <BrandEmblem className="h-14 w-14" />
        </div>
        <h1 className="mt-4 font-serif text-3xl uppercase tracking-[0.08em] text-[#173F35]">
          Toko Briyani
        </h1>
        <p className="mt-1 text-sm text-[#7A7A70]">
          Sign in to manage menu items, categories, orders, and store settings.
        </p>
      </div>

      <Card className="p-6 sm:p-8">
        {error && (
          <div
            role="alert"
            className="mb-5 flex items-start gap-2.5 rounded-md border border-red-200 bg-red-50 p-3.5 text-xs text-red-800"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {supabaseConfigured ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="admin-email">Admin Email</Label>
              <Input
                id="admin-email"
                type="email"
                required
                autoComplete="email"
                placeholder="owner@tokobriyani.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="admin-password">Password</Label>
              <Input
                id="admin-password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button type="submit" size="lg" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  Sign In with Supabase Auth
                </>
              )}
            </Button>
          </form>
        ) : (
          <div className="space-y-5">
            <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-900">
              <p className="font-semibold">Supabase Auth Not Configured Yet</p>
              <p className="mt-1">
                Set <code>NEXT_PUBLIC_SUPABASE_URL</code>,{" "}
                <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, and{" "}
                <code>SUPABASE_SERVICE_ROLE_KEY</code> in <code>.env.local</code>, run
                the SQL migrations, and add your Supabase Auth user to{" "}
                <code>public.admin_profiles</code> to enable production authentication.
              </p>
            </div>

            <Button
              type="button"
              size="lg"
              disabled={demoLoading}
              onClick={handleDemoPreview}
              className="w-full"
            >
              {demoLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Opening Preview...
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  Enter Demo Admin Preview
                </>
              )}
            </Button>
          </div>
        )}
      </Card>

      <div className="text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#173F35] hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Toko Briyani Storefront
        </Link>
      </div>
    </div>
  );
}
