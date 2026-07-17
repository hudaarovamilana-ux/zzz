import { NextResponse } from "next/server";
import { verifyCode } from "@/lib/verification-store";
import { AuthError, registerUser } from "@/lib/auth";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { applySessionCookie } from "@/lib/session";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const limit = rateLimit(`verify:${ip}`, 30, 60 * 60 * 1000);
    if (!limit.ok) {
      return NextResponse.json(
        { error: "Слишком много попыток. Попробуйте позже.", retryAfterSec: limit.retryAfterSec },
        { status: 429 }
      );
    }

    const body = (await request.json()) as {
      email?: string;
      code?: string;
      password?: string;
    };
    const email = body.email?.trim() ?? "";
    const code = body.code?.trim() ?? "";
    const password = body.password ?? "";

    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Некорректный email" }, { status: 400 });
    }
    if (!/^\d{6}$/.test(code)) {
      return NextResponse.json({ error: "Введите 6-значный код из письма" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Пароль должен быть не менее 6 символов" },
        { status: 400 }
      );
    }

    const result = verifyCode(email, code);
    if (!result.ok) {
      return NextResponse.json({ error: result.reason }, { status: 400 });
    }

    const { session, token } = await registerUser({
      email,
      name: result.name,
      password,
    });

    const res = NextResponse.json({
      ok: true,
      verified: true,
      name: session.name,
      email: session.email,
    });
    applySessionCookie(res, token);
    return res;
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("[api/auth/verify-code]", error);
    return NextResponse.json({ error: "Не удалось проверить код" }, { status: 500 });
  }
}
