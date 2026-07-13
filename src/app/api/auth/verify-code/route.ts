import { NextResponse } from "next/server";
import { verifyCode } from "@/lib/verification-store";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; code?: string };
    const email = body.email?.trim() ?? "";
    const code = body.code?.trim() ?? "";

    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Некорректный email" }, { status: 400 });
    }
    if (!/^\d{6}$/.test(code)) {
      return NextResponse.json({ error: "Введите 6-значный код из письма" }, { status: 400 });
    }

    const result = verifyCode(email, code);
    if (!result.ok) {
      return NextResponse.json({ error: result.reason }, { status: 400 });
    }

    return NextResponse.json({
      ok: true,
      verified: true,
      name: result.name,
      email,
    });
  } catch (error) {
    console.error("[api/auth/verify-code]", error);
    return NextResponse.json({ error: "Не удалось проверить код" }, { status: 500 });
  }
}
