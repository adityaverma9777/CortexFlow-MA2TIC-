import { type NextRequest, NextResponse } from "next/server";
import { normalizeEmail } from "@/libs/local-auth";
import { getSupabaseServerClient } from "@/libs/supabase-server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const emailParam = req.nextUrl.searchParams.get("email") ?? "";
    const email = normalizeEmail(emailParam);

    if (!email) {
      return NextResponse.json({ methods: [] });
    }

    const supabase = getSupabaseServerClient();
    const { data: user } = await supabase
      .from("users")
      .select("id, provider")
      .eq("email", email)
      .maybeSingle();

    if (!user) {
      return NextResponse.json({ methods: [] });
    }

    const methods: string[] = [];
    const { data: credential } = await supabase
      .from("user_credentials")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (credential || user.provider === "password") {
      methods.push("password");
    }

    if (user.provider && user.provider !== "password") {
      methods.push(user.provider);
    }

    return NextResponse.json({ methods });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to check sign-in methods";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
