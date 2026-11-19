import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminLoginSchema } from "@/lib/validations/schemas";
import { DEMO_ADMIN_COOKIE, isSupabaseConfigured } from "@/lib/supabase/config";
import {
  createSupabaseServerClient,
  createSupabaseServiceClient,
} from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!isSupabaseConfigured()) {
      // Demo preview login ONLY when Supabase is not configured
      if (body?.demo === true) {
        const isHttps =
          request.url.startsWith("https://") ||
          request.headers.get("x-forwarded-proto") === "https";
        cookies().set(DEMO_ADMIN_COOKIE, "active", {
          httpOnly: true,
          sameSite: "lax",
          secure: isHttps,
          path: "/",
          maxAge: 60 * 60 * 8,
        });
        return NextResponse.json({ ok: true, mode: "demo" });
      }
      return NextResponse.json(
        {
          error:
            "Supabase is not configured yet. Configure your environment variables or use Demo Admin Preview.",
        },
        { status: 400 }
      );
    }

    const parsed = adminLoginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid credentials" },
        { status: 400 }
      );
    }

    const supabase = createSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase client unavailable." },
        { status: 500 }
      );
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    });

    if (error || !data.user) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Verify user has an active admin_profiles record
    const db = createSupabaseServiceClient() ?? supabase;
    const { data: profile } = await db
      .from("admin_profiles")
      .select("id, role, is_active")
      .eq("id", data.user.id)
      .eq("is_active", true)
      .maybeSingle();

    if (!profile || (profile.role !== "admin" && profile.role !== "staff")) {
      await supabase.auth.signOut();
      return NextResponse.json(
        {
          error:
            "This account does not have admin access. Add the user to public.admin_profiles in Supabase.",
        },
        { status: 403 }
      );
    }

    return NextResponse.json({ ok: true, mode: "supabase" });
  } catch {
    return NextResponse.json(
      { error: "Authentication request failed." },
      { status: 500 }
    );
  }
}
