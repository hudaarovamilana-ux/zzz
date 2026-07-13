import { NextResponse } from "next/server";
import { sendVerificationEmail } from "@/lib/email";
import {
  canSendCode,
  generateVerificationCode,
  saveVerificationCode,
} from "@/lib/verification-store";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; name?: string };
    const email = body.email?.trim() ?? "";
    const name = body.name?.trim() ?? "";

    if (!name) {
      return NextResponse.json({ error: "Введите имя" }, { status: 400 });
    }
    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Введите корректный email" }, { status: 400 });
    }

    const limit = canSendCode(email);
    if (!limit.ok) {
      return NextResponse.json(
        { error: limit.reason, retryAfterSec: limit.retryAfterSec },
        { status: 429 }
      );
    }

    const code = generateVerificationCode();
    saveVerificationCode(email, name, code);
    await sendVerificationEmail(email, code);

    return NextResponse.json({
      ok: true,
      message: "Код отправлен на почту",
      expiresInSec: 600,
    });
  } catch (error) {
    console.error("[api/auth/send-code]", error);
    const message =
      error instanceof Error ? error.message : "Не удалось отправить код. Попробуйте позже.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
