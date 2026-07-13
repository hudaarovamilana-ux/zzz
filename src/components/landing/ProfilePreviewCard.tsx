"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Circle } from "lucide-react";
import {
  getCabinetPreview,
  getGuestCabinetPreview,
  type CabinetPreview,
} from "@/lib/cabinet-preview";
import { getStatusTitle, getUserName, getUserStatus, isUserLoggedIn } from "@/lib/user-storage";
import type { UserStatus } from "@/lib/types";

function PreviewActionList({
  actions,
  loggedIn,
}: {
  actions: CabinetPreview["actions"];
  loggedIn: boolean;
}) {
  const visible = actions.slice(0, 4);
  const rest = actions.length - visible.length;

  return (
    <ul className="space-y-2.5">
      {visible.map((action) => (
        <li key={action.label}>
          {loggedIn ? (
            <Link
              href={action.href}
              className="group flex items-start gap-2.5 text-sm text-ink-soft leading-snug transition hover:text-ink"
            >
              <Circle className="mt-1.5 h-2 w-2 shrink-0 fill-rose/40 text-rose/40" />
              <span>{action.label}</span>
            </Link>
          ) : (
            <span className="flex items-start gap-2.5 text-sm text-ink-soft leading-snug">
              <Circle className="mt-1.5 h-2 w-2 shrink-0 fill-rose/40 text-rose/40" />
              <span>{action.label}</span>
            </span>
          )}
        </li>
      ))}
      {rest > 0 && loggedIn && (
        <li>
          <Link
            href={actions[0]?.href ?? "/dashboard"}
            className="text-xs text-ink-muted underline-offset-2 hover:text-ink hover:underline"
          >
            + ещё {rest} в чеклисте
          </Link>
        </li>
      )}
    </ul>
  );
}

export function ProfilePreviewCard() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [name, setName] = useState("");
  const [status, setStatus] = useState<UserStatus>("not_pregnant");
  const [preview, setPreview] = useState<CabinetPreview>(getGuestCabinetPreview());

  useEffect(() => {
    const in_ = isUserLoggedIn();
    setLoggedIn(in_);
    if (!in_) {
      setPreview(getGuestCabinetPreview());
      return;
    }
    setStatus(getUserStatus());
    setName(getUserName());
    setPreview(getCabinetPreview());
  }, []);

  if (!loggedIn) {
    return (
      <div className="relative glass-card rounded-[2rem] p-8 lg:p-10">
        <div className="mb-6 flex items-center justify-between">
          <span className="text-xs uppercase tracking-[0.15em] text-ink-muted">
            Персональный кабинет
          </span>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-beige-dark/30 bg-cream/80 p-5">
            <p className="mb-1 text-xs uppercase tracking-wider text-ink-muted">
              {preview.headline}
            </p>
            {preview.subline && (
              <p className="mb-4 text-sm text-ink-soft leading-relaxed">{preview.subline}</p>
            )}
            <PreviewActionList actions={preview.actions} loggedIn={false} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-beige-dark/20 bg-white/60 p-4">
              <p className="mb-1 text-xs text-ink-muted">{preview.statPrimary.label}</p>
              <p className="text-sm font-medium">{preview.statPrimary.value}</p>
            </div>
            <Link
              href="/onboarding"
              className="rounded-2xl border border-beige-dark/20 bg-white/60 p-4 transition hover:bg-white"
            >
              <p className="mb-1 text-xs text-ink-muted">{preview.statSecondary.label}</p>
              <p className="text-sm font-medium">{preview.statSecondary.value}</p>
            </Link>
          </div>

          <Link
            href="/onboarding"
            className="flex items-center justify-between rounded-2xl border border-rose/20 bg-blush/40 p-4 text-sm text-ink-soft transition hover:bg-blush/60"
          >
            Выбрать статус и получить свой план
            <ArrowRight className="h-4 w-4 shrink-0" />
          </Link>
        </div>
      </div>
    );
  }

  const statusTitle = getStatusTitle(status);
  const greeting = name || "Ваш профиль";

  return (
    <div className="relative glass-card rounded-[2rem] p-8 lg:p-10">
      <div className="mb-6 flex items-center justify-between gap-3">
        <span className="text-xs uppercase tracking-[0.15em] text-ink-muted">{greeting}</span>
        <span className="shrink-0 rounded-full bg-rose-pale px-3 py-1 text-xs text-rose-muted">
          {statusTitle}
        </span>
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl border border-beige-dark/30 bg-cream/80 p-5">
          <p className="mb-1 text-xs uppercase tracking-wider text-ink-muted">
            {status === "pregnant" ? "Ваш срок" : "Рекомендуем пройти"}
          </p>
          <p className="text-lg font-medium leading-snug text-ink">{preview.headline}</p>
          {preview.subline && (
            <p className="mt-1 mb-4 text-sm text-ink-muted">{preview.subline}</p>
          )}
          {!preview.subline && <div className="mb-4" />}
          <PreviewActionList actions={preview.actions} loggedIn />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl border border-beige-dark/20 bg-white/60 p-4">
            <p className="mb-1 text-xs text-ink-muted">{preview.statPrimary.label}</p>
            <p className="text-sm font-medium">{preview.statPrimary.value}</p>
          </div>
          <Link
            href={preview.statSecondary.href}
            className="rounded-2xl border border-beige-dark/20 bg-white/60 p-4 transition hover:bg-white"
          >
            <p className="mb-1 text-xs text-ink-muted">{preview.statSecondary.label}</p>
            <p className="text-sm font-medium">{preview.statSecondary.value}</p>
          </Link>
        </div>

        <Link
          href="/dashboard"
          className="flex items-center justify-between rounded-2xl border border-rose/20 bg-blush/40 p-4 text-sm text-ink-soft transition hover:bg-blush/60"
        >
          Перейти в личный кабинет
          <ArrowRight className="h-4 w-4 shrink-0" />
        </Link>
      </div>
    </div>
  );
}
