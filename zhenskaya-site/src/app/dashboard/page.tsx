"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BookOpen, MessageCircleHeart } from "lucide-react";
import { ARTICLES } from "@/lib/articles";
import { formatPregnancyTermLabel, getPregnancyTerm } from "@/lib/pregnancy-term";
import { getUserName, getUserStatus, loadOnboardingData } from "@/lib/user-storage";
import type { UserStatus } from "@/lib/types";

const QUICK_ACTIONS: Record<UserStatus, { href: string; label: string }[]> = {
  pregnant: [
    { href: "/dashboard/pregnancy", label: "Информация о текущей неделе" },
    { href: "/dashboard/checklist", label: "Чеклист анализов по триместрам" },
    { href: "/dashboard/kicks", label: "Отметить шевеление" },
    { href: "/dashboard/ask", label: "Задать вопрос" },
  ],
  not_pregnant: [
    { href: "/contraception-test", label: "Тест: подбор контрацепции" },
    { href: "/dashboard/preventive", label: "Чеклист профилактики" },
    { href: "/dashboard/profile", label: "Заполнить профиль здоровья" },
    { href: "/dashboard/health-assessment", label: "Оценка здоровья" },
    { href: "/dashboard/ask", label: "Задать вопрос" },
  ],
  planning: [
    { href: "/contraception-test", label: "Тест: подбор контрацепции" },
    { href: "/dashboard/preventive", label: "Подготовка к беременности" },
    { href: "/dashboard/checklist", label: "Обследования перед зачатием" },
    { href: "/dashboard/profile", label: "Профиль здоровья" },
    { href: "/dashboard/ask", label: "Задать вопрос" },
  ],
};

const ARTICLE_FILTER: Record<UserStatus, string[]> = {
  pregnant: ["Беременность"],
  not_pregnant: ["Здоровье", "Планирование"],
  planning: ["Планирование", "Здоровье"],
};

export default function DashboardPage() {
  const [status, setStatus] = useState<UserStatus>("not_pregnant");
  const [name, setName] = useState("");
  const [pregnancyLabel, setPregnancyLabel] = useState<string | null>(null);

  useEffect(() => {
    setStatus(getUserStatus());
    setName(getUserName());
    const term = getPregnancyTerm(loadOnboardingData());
    if (term) {
      setPregnancyLabel(formatPregnancyTermLabel(term.week, term.day));
    }
  }, []);

  const actions = QUICK_ACTIONS[status];

  const articles = useMemo(() => {
    const cats = ARTICLE_FILTER[status];
    return ARTICLES.filter((a) => cats.includes(a.category)).slice(0, 3);
  }, [status]);

  const greeting = name ? `Добро пожаловать, ${name}` : "Добро пожаловать";

  return (
    <div>
      <h1 className="text-2xl font-medium text-ink mb-2">{greeting}</h1>
      {status === "pregnant" && pregnancyLabel && (
        <p className="text-sm text-ink-muted mb-8">
          Срок беременности: <span className="text-ink font-medium">{pregnancyLabel}</span>
        </p>
      )}
      {!(status === "pregnant" && pregnancyLabel) && <div className="mb-8" />}

      <div className="space-y-3 mb-10">
        <h2 className="text-sm font-medium text-ink">Быстрые действия</h2>
        {actions.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center justify-between rounded-xl border border-beige-dark/40 bg-white/60 px-5 py-4 text-sm hover:bg-white transition"
          >
            {item.label}
            <ArrowRight className="w-4 h-4 text-ink-muted" />
          </Link>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <section className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-4 h-4 text-rose-muted" />
            <h2 className="text-sm font-medium text-ink">Статьи</h2>
          </div>
          <div className="space-y-3">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/articles/${article.id}`}
                className="block rounded-xl border border-beige-dark/30 bg-white/50 px-4 py-3 hover:bg-white transition"
              >
                <p className="text-sm font-medium text-ink leading-snug">{article.title}</p>
                <p className="text-xs text-ink-muted mt-1">{article.readMinutes} мин чтения</p>
              </Link>
            ))}
          </div>
          <Link
            href="/articles"
            className="inline-block mt-4 text-xs text-ink-muted hover:text-ink underline"
          >
            Все статьи
          </Link>
        </section>

        <Link
          href="/dashboard/trust-chat"
          className="glass-card rounded-2xl p-6 hover:bg-white/80 transition group block"
        >
          <div className="flex items-center gap-2 mb-3">
            <MessageCircleHeart className="w-4 h-4 text-rose-muted" />
            <h2 className="text-sm font-medium text-ink">Чат доверия</h2>
          </div>
          <p className="text-sm text-ink-soft leading-relaxed mb-4">
            Безопасное пространство, где можно поделиться переживаниями анонимно и получить
            поддержку.
          </p>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-ink group-hover:underline">
            Открыть чат
            <ArrowRight className="w-3 h-3" />
          </span>
        </Link>
      </div>
    </div>
  );
}
