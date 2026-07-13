import { NextResponse } from "next/server";
import { generateAskAnswer } from "@/lib/deepseek";
import { checkAskLimit, incrementAskCount } from "@/lib/ai-limit-server";
import { AI_LIMITS, remainingFromCount } from "@/lib/ai-limits";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const limit = await checkAskLimit();
    if (!limit.ok) return limit.response;

    const body = (await request.json()) as { question?: string };
    const question = body.question?.trim();

    if (!question || question.length < 5) {
      return NextResponse.json({ error: "Введите вопрос (минимум 5 символов)" }, { status: 400 });
    }

    if (question.length > 2000) {
      return NextResponse.json({ error: "Вопрос слишком длинный" }, { status: 400 });
    }

    const answer = await generateAskAnswer(question);
    const remaining = remainingFromCount(limit.used + 1, AI_LIMITS.ask);

    const res = NextResponse.json({ answer, remaining });
    return incrementAskCount(res, limit.used);
  } catch (error) {
    console.error("[api/ask]", error);
    const message =
      error instanceof Error ? error.message : "Не удалось получить ответ. Попробуйте позже.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
