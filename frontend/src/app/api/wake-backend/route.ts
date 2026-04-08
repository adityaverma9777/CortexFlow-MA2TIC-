import { NextResponse } from "next/server";

const BACKEND_URL = (process.env.BACKEND_URL ?? "http://localhost:8000").replace(/\/+$/, "");

export const runtime = "nodejs";
export const maxDuration = 15;

export async function POST() {
  try {
    await fetch(`${BACKEND_URL}/health`, {
      method: "GET",
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
    return NextResponse.json({ ok: true });
  } catch {
    // Wake pings are best-effort. The user flow should continue even if cold-start takes longer.
    return NextResponse.json({ ok: false }, { status: 202 });
  }
}
