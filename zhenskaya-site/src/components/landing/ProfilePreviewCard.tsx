"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getStatusTitle,
  getUserName,
  getUserStatus,
  isUserLoggedIn,
  loadHealthProfile,
  loadOnboardingData,
} from "@/lib/user-storage";
import { evaluateHealthProfile } from "@/lib/health-evaluation";
import { formatPregnancyTermLabel, getPregnancyTerm } from "@/lib/pregnancy-term";
import type { UserStatus } from "@/lib/types";

export function ProfilePreviewCard() {
  const [status, setStatus] = useState<UserStatus>("not_pregnant");
  const [name, setName] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [hint, setHint] = useState("");

  useEffect(() => {
    const in_ = isUserLoggedIn();
    setLoggedIn(in_);
    if (!in_) return;

    const s = getUserStatus();
    setStatus(s);
    setName(getUserName());

    const profile = loadHealthProfile();
    const onboarding = loadOnboardingData();
    const evaluation = evaluateHealthProfile(profile);

    if (s === "not_pregnant" || s === "planning") {
      const parts: string[] = [];
      if (profile.height && profile.weight) {
        parts.push(`Рост ${profile.height} см · Вес ${profile.weight} кг`);
      } else if (onboarding?.height && onboarding?.weight) {
        parts.push(`Рост ${onboarding.height} см · Вес ${onboarding.weight} кг`);
      }
      if (onboarding?.regularCycle != null) {
        parts.push(onboarding.regularCycle ? "Регулярный цикл" : "Нерегулярный цикл");
      }
      setHint(
        parts.join(" · ") ||
          (s === "planning"
            ? "Подготовка к зачатию — чеклисты и обследования"
            : evaluation.messages[0] || "Заполните профиль для персональных рекомендаций")
      );
    } else {
      const term = getPregnancyTerm(onboarding);
      if (term) {
        const parts = [formatPregnancyTermLabel(term.week, term.day)];
        if (term.dueDateLabel) {
          parts.push(`ПДР ${term.dueDateLabel}`);
        }
        setHint(parts.join(" · "));
      } else {
        setHint("Укажите срок беременности в настройках");
      }
    }
  }, []);

  if (!loggedIn) {
    return (
      <div className="relative glass-card rounded-[2rem] p-8 lg:p-10">
        <div className="flex items-center justify-between mb-8">
          <span className="text-xs uppercase tracking-[0.15em] text-ink-muted">
            Персональный кабинет
          </span>
        </div>
        <div className="space-y-4">
          <div className="rounded-2xl bg-cream/80 p-5 border border-beige-dark/30">
            <p className="text-sm text-ink-soft leading-relaxed">
              Чеклисты, напоминания, оценка здоровья и ответы на вопросы — всё в одном месте.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-white/60 p-4 border border-beige-dark/20">
              <p className="text-xs text-ink-muted mb-1">Профилактика</p>
              <p className="text-sm font-medium">По возрасту</p>
            </div>
            <div className="rounded-2xl bg-white/60 p-4 border border-beige-dark/20">
              <p className="text-xs text-ink-muted mb-1">ИИ-помощник</p>
              <p className="text-sm font-medium">24/7</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const statusTitle = getStatusTitle(status);
  const greeting = name ? `${name}` : "Ваш профиль";

  return (
    <div className="relative glass-card rounded-[2rem] p-8 lg:p-10">
      <div className="flex items-center justify-between mb-8">
        <span className="text-xs uppercase tracking-[0.15em] text-ink-muted">
          {greeting}
        </span>
        <span className="rounded-full bg-rose-pale px-3 py-1 text-xs text-rose-muted">
          {statusTitle}
        </span>
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl bg-cream/80 p-5 border border-beige-dark/30">
          <p className="text-xs text-ink-muted uppercase tracking-wider mb-1">
            {status === "pregnant" ? "Ваш кабинет" : "Сейчас для вас"}
          </p>
          <p className="text-lg font-medium text-ink leading-snug">{hint}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Link
            href="/dashboard/profile"
            className="rounded-2xl bg-white/60 p-4 border border-beige-dark/20 hover:bg-white transition"
          >
            <p className="text-xs text-ink-muted mb-1">Профиль</p>
            <p className="text-sm font-medium">Здоровье</p>
          </Link>
          <Link
            href={status === "pregnant" ? "/dashboard/pregnancy" : "/dashboard/preventive"}
            className="rounded-2xl bg-white/60 p-4 border border-beige-dark/20 hover:bg-white transition"
          >
            <p className="text-xs text-ink-muted mb-1">
              {status === "pregnant" ? "Неделя" : "Чеклист"}
            </p>
            <p className="text-sm font-medium">Открыть</p>
          </Link>
        </div>

        <Link
          href="/dashboard"
          className="block rounded-2xl bg-blush/40 p-4 border border-rose/20 text-sm text-ink-soft hover:bg-blush/60 transition"
        >
          Перейти в личный кабинет →
        </Link>
      </div>
    </div>
  );
}
