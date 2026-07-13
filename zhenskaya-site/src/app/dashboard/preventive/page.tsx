"use client";

import { useState } from "react";
import {
  PREVENTIVE_CHECKLIST,
  intervalLabel,
} from "@/lib/preventive-checklist";
import { GentleReminder } from "@/components/ui/GentleReminder";

export default function PreventivePage() {
  const [done, setDone] = useState<Set<string>>(new Set());

  const overdue = PREVENTIVE_CHECKLIST.filter((item) => !done.has(item.id));

  return (
    <div>
      <h1 className="text-2xl font-medium text-ink mb-2">Профилактика</h1>
      <p className="text-sm text-ink-muted mb-6">
        Чеклисты обследований для женщин, которые не беременны
      </p>

      {overdue.length > 0 && (
        <div className="rounded-2xl border border-rose/30 bg-rose-pale/40 p-5 mb-6">
          <p className="text-sm font-medium text-ink mb-1">Рекомендуем записаться</p>
          <p className="text-xs text-ink-muted">
            {overdue.length} обследований требуют внимания
          </p>
        </div>
      )}

      <div className="space-y-3 mb-8">
        {PREVENTIVE_CHECKLIST.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-beige-dark/40 bg-white/60 p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-sm font-medium text-ink">{item.title}</h3>
                <p className="text-xs text-ink-muted mt-1">{item.description}</p>
                <p className="text-xs text-rose-muted mt-2">
                  {intervalLabel(item.intervalMonths)}
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setDone((prev) => {
                    const next = new Set(prev);
                    if (next.has(item.id)) next.delete(item.id);
                    else next.add(item.id);
                    return next;
                  })
                }
                className={`shrink-0 text-xs px-3 py-1.5 rounded-full transition ${
                  done.has(item.id)
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-beige text-ink-muted hover:bg-beige-dark"
                }`}
              >
                {done.has(item.id) ? "Сделано" : "Отметить"}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-2xl p-6 mb-6">
        <h2 className="text-sm font-medium text-ink mb-3">Куда записаться?</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <button
            type="button"
            className="rounded-xl border border-beige-dark px-4 py-3 text-sm text-left hover:bg-beige/40 transition"
          >
            <span className="font-medium block">Госполиклиника</span>
            <span className="text-xs text-ink-muted">По ОМС</span>
          </button>
          <button
            type="button"
            className="rounded-xl border border-rose/30 bg-rose-pale/30 px-4 py-3 text-sm text-left hover:bg-rose-pale/50 transition"
          >
            <span className="font-medium block">Частная клиника</span>
            <span className="text-xs text-ink-muted">Партнёрская запись</span>
          </button>
        </div>
      </div>

      <GentleReminder />
    </div>
  );
}
