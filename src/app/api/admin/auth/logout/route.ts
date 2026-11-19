import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { DEMO_ADMIN_COOKIE, isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST() {
  if (isSupabaseConfigured()) {
    const supabase = createSupabaseServerClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
  }

  cookies().set(DEMO_ADMIN_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return NextResponse.json({ ok: true });
}
