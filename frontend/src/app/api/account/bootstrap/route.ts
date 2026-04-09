import { type NextRequest, NextResponse } from "next/server";
import { AuthRequestError, requireVerifiedUser } from "@/libs/server-auth";
import { getSupabaseServerClient } from "@/libs/supabase-server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const user = await requireVerifiedUser(req);
    const supabase = getSupabaseServerClient();

    const now = new Date().toISOString();
    const userPayload = {
      id: user.uid,
      email: user.email,
      display_name: user.name ?? user.email?.split("@")[0] ?? "Researcher",
      photo_url: user.picture,
      provider: user.provider,
      last_login_at: now,
      updated_at: now,
    };

    const { data, error } = await supabase
      .from("users")
      .upsert(userPayload, { onConflict: "id" })
      .select("id, email, display_name, photo_url, provider, last_login_at")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ user: data });
  } catch (error) {
    if (error instanceof AuthRequestError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    const message = error instanceof Error ? error.message : "Bootstrap failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
