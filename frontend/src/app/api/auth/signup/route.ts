import { type NextRequest, NextResponse } from "next/server";
import {
  createSession,
  hashPassword,
  normalizeEmail,
  providerDisplayName,
  setSessionCookie,
} from "@/libs/local-auth";
import { getSupabaseServerClient } from "@/libs/supabase-server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = String(body.name ?? "").trim();
    const email = normalizeEmail(String(body.email ?? ""));
    const password = String(body.password ?? "");

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Use at least 6 characters for your password." }, { status: 400 });
    }

    const supabase = getSupabaseServerClient();
    const { data: existingUser } = await supabase
      .from("users")
      .select("id, provider")
      .eq("email", email)
      .maybeSingle();

    if (existingUser) {
      const { data: credential } = await supabase
        .from("user_credentials")
        .select("user_id")
        .eq("user_id", existingUser.id)
        .maybeSingle();

      if (credential || existingUser.provider === "password") {
        return NextResponse.json(
          { error: "This email already has an account. Please sign in." },
          { status: 409 }
        );
      }

      if (existingUser.provider) {
        const providerName = providerDisplayName(existingUser.provider);
        return NextResponse.json(
          { error: `This email is linked to ${providerName} sign-in. Please use that method.` },
          { status: 409 }
        );
      }
    }

    const userId = crypto.randomUUID();
    const now = new Date().toISOString();

    const { error: userInsertError } = await supabase.from("users").insert({
      id: userId,
      email,
      display_name: name || email.split("@")[0] || "Researcher",
      provider: "password",
      last_login_at: now,
      updated_at: now,
    });

    if (userInsertError) {
      return NextResponse.json({ error: userInsertError.message }, { status: 500 });
    }

    const { error: credentialError } = await supabase.from("user_credentials").insert({
      user_id: userId,
      email,
      password_hash: hashPassword(password),
      updated_at: now,
    });

    if (credentialError) {
      await supabase.from("users").delete().eq("id", userId);
      return NextResponse.json({ error: credentialError.message }, { status: 500 });
    }

    const { sessionId } = await createSession(userId);

    const response = NextResponse.json({
      user: {
        uid: userId,
        email,
        name: name || email.split("@")[0] || "Researcher",
        photoUrl: "",
        providerId: "password",
      },
    });

    setSessionCookie(response, sessionId);
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Signup failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
