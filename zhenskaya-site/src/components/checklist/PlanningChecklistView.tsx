"use client";

import { useState } from "react";
import {
  PLANNING_CHECKLIST_PARTS,
  getPlanningSections,
  type PlanningChecklistPart,
  type PlanningChecklistItem,
} from "@/lib/planning-checklist";

type Status = "none" | "planned" | "done";

const STATUS_CYCLE: Status[] = ["none", "planned", "done"];
const STATUS_LABEL: Record<Status, string> = {
  none: "Не сделано",
  planned: "Запланировано",
  done: "Пройдено",
};
const STATUS_COLOR: Record<Status, string> = {
  none: "bg-ink-muted/20 text-ink-muted",
  planned: "bg-amber-100 text-amber-800",
  done: "bg-emerald-100 text-emerald-800",
};

function ChecklistItemRow({
  item,
  status,
  onToggle,
}: {
  item: PlanningChecklistItem;
  status: Status;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="w-full text-left rounded-xl border border-beige-dark/40 bg-white/60 px-5 py-4 hover:bg-white transition"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-ink">{item.title}</p>
          {item.bullets && item.bullets.length > 0 && (
            <ul className="mt-2 space-y-1">
              {item.bullets.map((b) => (
                <li key={b} className="text-xs text-ink-muted flex gap-2">
                  <span className="text-rose-muted shrink-0">·</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          )}
          {item.note && (
            <p className="text-xs text-rose-muted mt-2">{item.note}</p>
          )}
        </div>
        <span
          className={`shrink-0 text-xs px-3 py-1 rounded-full whitespace-nowrap ${STATUS_COLOR[status]}`}
        >
          {STATUS_LABEL[status]}
        </span>
      </div>
    </button>
  );
}

export function PlanningChecklistView() {
  const [activePart, setActivePart] = useState<PlanningChecklistPart>("doctors");
  const [statuses, setStatuses] = useState<Record<string, Status>>({});

  const toggle = (id: string) => {
    setStatuses((prev) => {
      const current = prev[id] || "none";
      const idx = STATUS_CYCLE.indexOf(current);
      const next = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];
      return { ...prev, [id]: next };
    });
  };

  const sections = getPlanningSections(activePart);

  return (
    <div className="mb-12">
      <div className="flex flex-wrap gap-2 mb-8">
        {PLANNING_CHECKLIST_PARTS.map((part) => (
          <button
            key={part.id}
            type="button"
            onClick={() => setActivePart(part.id)}
            className={`rounded-full px-4 py-2 text-xs font-medium transition ${
              activePart === part.id
                ? "bg-ink text-cream"
                : "bg-white/70 border border-beige-dark/50 text-ink-soft hover:bg-white"
            }`}
          >
            {part.label}
          </button>
        ))}
      </div>

      <div className="space-y-8">
        {sections.map((section) => (
          <section key={section.id}>
            {section.title && (
              <h2 className="text-base font-medium text-ink mb-1">{section.title}</h2>
            )}
            {section.subtitle && (
              <p className="text-xs text-ink-muted mb-4">{section.subtitle}</p>
            )}
            {section.items.length > 0 && (
              <div className="space-y-2">
                {section.items.map((item) => (
                  <ChecklistItemRow
                    key={item.id}
                    item={item}
                    status={statuses[item.id] || "none"}
                    onToggle={() => toggle(item.id)}
                  />
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
