"use client";

import { useEffect, useState } from "react";
import { GentleReminder } from "@/components/ui/GentleReminder";
import { PlanningChecklistView } from "@/components/checklist/PlanningChecklistView";
import { getUserStatus } from "@/lib/user-storage";
import type { UserStatus } from "@/lib/types";

type Status = "none" | "planned" | "done";

const PREGNANT_ITEMS = [
  { id: "obgyn", label: "Акушер-гинеколог" },
  { id: "screening", label: "Скрининг 2 триместра" },
  { id: "gtt", label: "Глюкозотолерантный тест" },
  { id: "ultrasound", label: "УЗИ 2 триместра" },
  { id: "blood", label: "Общий анализ крови" },
  { id: "urine", label: "Общий анализ мочи" },
];

const STATUS_CYCLE: Status[] = ["none", "planned", "done"];
const STATUS_LABEL: Record<Status, string> = {
  none: "Не сделано",
  planned: "Запланировано",
  done: "Пройдено",
};
const STATUS_COLOR: Record<Status, string> = {
  none: "bg-ink-muted/20",
  planned: "bg-amber-100 text-amber-800",
  done: "bg-emerald-100 text-emerald-800",
};

const PAGE_META: Record<
  UserStatus,
  { title: string; description: string } | null
> = {
  planning: {
    title: "Подготовка к беременности",
    description:
      "Врачи, обследования и витамины до зачатия. Нажмите на пункт, чтобы отметить статус.",
  },
  pregnant: {
    title: "Чеклист 2 триместра",
    description: "Нажмите на пункт, чтобы отметить статус",
  },
  not_pregnant: null,
};

function PregnantChecklist() {
  const [statuses, setStatuses] = useState<Record<string, Status>>({});

  const toggle = (id: string) => {
    setStatuses((prev) => {
      const current = prev[id] || "none";
      const idx = STATUS_CYCLE.indexOf(current);
      const next = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];
      return { ...prev, [id]: next };
    });
  };

  return (
    <div className="space-y-2 mb-8">
      {PREGNANT_ITEMS.map((item) => {
        const status = statuses[item.id] || "none";
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => toggle(item.id)}
            className="w-full flex items-center justify-between rounded-xl border border-beige-dark/40 bg-white/60 px-5 py-4 text-left hover:bg-white transition"
          >
            <span className="text-sm">{item.label}</span>
            <span className={`text-xs px-3 py-1 rounded-full ${STATUS_COLOR[status]}`}>
              {STATUS_LABEL[status]}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function BookingBlock() {
  return (
    <div className="glass-card rounded-2xl p-6 mb-6">
      <h2 className="text-sm font-medium text-ink mb-3">Записаться на обследование</h2>
      <div className="grid sm:grid-cols-2 gap-3">
        <button
          type="button"
          className="rounded-xl border border-beige-dark px-4 py-3 text-sm text-left hover:bg-beige/40 transition"
        >
          <span className="font-medium block">Государственная поликлиника</span>
          <span className="text-xs text-ink-muted">По полису ОМС</span>
        </button>
        <button
          type="button"
          className="rounded-xl border border-rose/30 bg-rose-pale/30 px-4 py-3 text-sm text-left hover:bg-rose-pale/50 transition"
        >
          <span className="font-medium block">Партнёрская клиника</span>
          <span className="text-xs text-ink-muted">Запись онлайн со скидкой</span>
        </button>
      </div>
    </div>
  );
}

export default function ChecklistPage() {
  const [status, setStatus] = useState<UserStatus>("pregnant");

  useEffect(() => {
    setStatus(getUserStatus());
  }, []);

  const meta = PAGE_META[status];

  if (!meta) {
    return (
      <div>
        <h1 className="text-2xl font-medium text-ink mb-2">Чеклисты</h1>
        <p className="text-sm text-ink-muted">
          Этот раздел доступен при статусе «Беременна» или «Планирую беременность».
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-medium text-ink mb-2">{meta.title}</h1>
      <p className="text-sm text-ink-muted mb-6">{meta.description}</p>

      {status === "planning" ? <PlanningChecklistView /> : <PregnantChecklist />}

      <BookingBlock />
      <GentleReminder />
    </div>
  );
}
