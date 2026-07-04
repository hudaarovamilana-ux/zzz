"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const HEALTH_QUOTE =
  "Помните: не бывает глупых вопросов о здоровье. Бывают ситуации, которых можно было бы избежать, если бы вопрос был задан вовремя.";

interface AskFormProps {
  initialQuestion?: string;
}

export function AskForm({ initialQuestion = "" }: AskFormProps) {
  const [question, setQuestion] = useState(initialQuestion);
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const isPremium = false;

  useEffect(() => {
    if (initialQuestion) setQuestion(initialQuestion);
  }, [initialQuestion]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: очередь вопросов гинекологу (премиум) или шаблонный ответ
    await new Promise((r) => setTimeout(r, 800));
    setAnswer(
      isPremium
        ? "Ваш вопрос передан гинекологу. Ответ придёт в течение 24 часов (или сразу, если у вас остался приоритетный запрос)."
        : "Спасибо за ваш вопрос. Мы получили его и скоро добавим ответ от специалиста. Пока рекомендуем при любых тревожных симптомах обратиться к гинекологу очно."
    );
    setLoading(false);
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-medium text-ink mb-2">Задать вопрос</h1>
      <p className="text-sm text-ink-muted mb-6">
        {isPremium
          ? "Платный тариф: 1 ответ гинеколога сразу + неограниченная очередь"
          : "Задайте вопрос — мы ответим или направим к специалисту"}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
          rows={4}
          placeholder="Опишите ваш вопрос..."
          className="w-full rounded-xl border border-beige-dark bg-white px-4 py-3 text-sm resize-none"
        />
        <button
          type="submit"
          disabled={loading || !question.trim()}
          className="rounded-full bg-ink px-8 py-3 text-sm font-medium text-cream hover:bg-ink/90 disabled:opacity-50 transition"
        >
          {loading ? "Отправляем..." : "Отправить"}
        </button>

        {!isPremium && (
          <p className="text-sm text-ink-soft pt-2">
            Хотите ответ от врача?{" "}
            <Link href="/pricing" className="underline font-medium text-ink">
              Подключите премиум
            </Link>
          </p>
        )}
      </form>

      {answer && (
        <div className="glass-card rounded-2xl p-6 mb-6">
          <p className="text-xs uppercase tracking-wider text-ink-muted mb-2">Ответ</p>
          <p className="text-sm text-ink-soft leading-relaxed whitespace-pre-wrap">
            {answer}
          </p>
        </div>
      )}

      <blockquote className="rounded-2xl border border-rose/20 bg-rose-pale/50 px-5 py-4">
        <p className="text-sm text-ink-soft leading-relaxed italic">{HEALTH_QUOTE}</p>
      </blockquote>
    </div>
  );
}
