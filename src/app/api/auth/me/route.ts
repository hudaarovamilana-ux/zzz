import { NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/session";

export const runtime = "nodejs";

export async function GET() {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({
    authenticated: true,
    user: { email: session.email, name: session.name },
  });
}
