"use client";

import { useEffect, useState } from "react";
import {
  CHECKLIST_STATUS_COLOR,
  CHECKLIST_STATUS_LABEL,
  cycleChecklistStatus,
  loadAllChecklistProgress,
  type ChecklistItemStatus,
} from "@/lib/checklist-progress";
import type { ChecklistItemDef } from "@/lib/checklist-items";

export function ChecklistItemList({
  items,
  onChange,
}: {
  items: ChecklistItemDef[];
  onChange?: () => void;
}) {
  const [statuses, setStatuses] = useState<Record<string, ChecklistItemStatus> | null>(
    null
  );

  useEffect(() => {
    setStatuses(loadAllChecklistProgress());
  }, []);

  const toggle = (id: string) => {
    cycleChecklistStatus(id);
    const next = loadAllChecklistProgress();
    setStatuses(next);
    onChange?.();
  };

  if (!statuses) {
    return (
      <div className="space-y-2 mb-8 animate-pulse">
        {items.map((item) => (
          <div key={item.id} className="h-16 rounded-xl bg-beige/60" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2 mb-8">
      {items.map((item) => {
        const status = statuses[item.id] ?? "none";
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => toggle(item.id)}
            className="w-full flex items-center justify-between gap-4 rounded-xl border border-beige-dark/40 bg-white/60 px-5 py-4 text-left hover:bg-white transition"
          >
            <div className="min-w-0">
              <span className="text-sm font-medium text-ink">{item.label}</span>
              {item.description && (
                <p className="text-xs text-ink-muted mt-1">{item.description}</p>
              )}
            </div>
            <span
              className={`shrink-0 text-xs px-3 py-1 rounded-full whitespace-nowrap ${CHECKLIST_STATUS_COLOR[status]}`}
            >
              {CHECKLIST_STATUS_LABEL[status]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
