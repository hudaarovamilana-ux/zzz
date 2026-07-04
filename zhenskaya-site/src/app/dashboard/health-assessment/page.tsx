"use client";

import Link from "next/link";
import { useState } from "react";
import { GentleReminder } from "@/components/ui/GentleReminder";
import { SoftPinkLogo } from "@/components/ui/Logo";
import { evaluateHealthProfile, HIPPOCRATES_QUOTE } from "@/lib/health-evaluation";
import { loadHealthProfile } from "@/lib/user-storage";

export default function HealthAssessmentPage() {
  const [result, setResult] = useState<ReturnType<typeof evaluateHealthProfile> | null>(
    null
  );

  const runAssessment = () => {
    setResult(evaluateHealthProfile(loadHealthProfile()));
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-medium text-ink mb-2">Оценка здоровья</h1>
      <p className="text-sm text-ink-muted mb-8">
        Рекомендации на основе вашего профиля, визитов к врачам и отмеченных анализов
      </p>

      {!result ? (
        <div className="glass-card rounded-2xl p-8 text-center">
          <SoftPinkLogo size="lg" className="mx-auto mb-6" />
          <p className="text-sm text-ink-soft mb-6">
            Заполните профиль здоровья — так рекомендации будут точнее.
          </p>
          <button
            type="button"
            onClick={runAssessment}
            className="rounded-full bg-ink px-8 py-4 text-sm font-medium text-cream hover:bg-ink/90 transition"
          >
            Получить оценку
          </button>
          <Link
            href="/dashboard/profile"
            className="block mt-4 text-sm text-ink-muted underline"
          >
            Перейти в профиль
          </Link>
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
            <SoftPinkLogo size="md" className="shrink-0" />
            <div className="flex-1 text-left">
              <h2 className="text-sm font-medium text-ink mb-2">Ваши рекомендации</h2>
              <p className="text-xs text-ink-muted italic">{HIPPOCRATES_QUOTE}</p>
            </div>
          </div>

          {result.messages.map((msg) => (
            <p
              key={msg}
              className={`text-sm leading-relaxed ${
                result.allExcellent ? "text-emerald-800" : "text-ink-soft"
              }`}
            >
              {msg}
            </p>
          ))}

          {result.recommendations.length > 0 && (
            <ul className="space-y-2">
              {result.recommendations.map((rec) => (
                <li key={rec} className="text-sm text-ink-soft flex gap-2">
                  <span className="text-rose-muted shrink-0">·</span>
                  <span className="capitalize">{rec}</span>
                </li>
              ))}
            </ul>
          )}

          <button
            type="button"
            onClick={runAssessment}
            className="text-sm text-ink-muted underline"
          >
            Обновить оценку
          </button>
        </div>
      )}

      <GentleReminder className="mt-8" />
    </div>
  );
}
