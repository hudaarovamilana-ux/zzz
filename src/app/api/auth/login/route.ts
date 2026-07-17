import { NextResponse } from "next/server";
import { AuthError, loginUser } from "@/lib/auth";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { applySessionCookie } from "@/lib/session";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const limit = rateLimit(`login:${ip}`, 20, 60 * 60 * 1000);
    if (!limit.ok) {
      return NextResponse.json(
        { error: "Слишком много попыток входа. Попробуйте позже.", retryAfterSec: limit.retryAfterSec },
        { status: 429 }
      );
    }

    const body = (await request.json()) as { email?: string; password?: string };
    const email = body.email?.trim() ?? "";
    const password = body.password ?? "";

    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Введите корректный email" }, { status: 400 });
    }
    if (!password) {
      return NextResponse.json({ error: "Введите пароль" }, { status: 400 });
    }

    const { session, token } = await loginUser({ email, password });
    const res = NextResponse.json({
      ok: true,
      user: { email: session.email, name: session.name },
    });
    applySessionCookie(res, token);
    return res;
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("[api/auth/login]", error);
    return NextResponse.json({ error: "Не удалось войти" }, { status: 500 });
  }
}
