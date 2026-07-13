import { PLANNING_CHECKLIST, PREVENTIVE_CHECKLIST } from "@/lib/preventive-checklist";
import { PLANNING_CHECKLIST_SECTIONS } from "@/lib/planning-checklist";

export interface ChecklistItemDef {
  id: string;
  label: string;
  description?: string;
}

export const PREVENTIVE_ITEMS: ChecklistItemDef[] = PREVENTIVE_CHECKLIST.map((item) => ({
  id: `preventive:${item.id}`,
  label: item.title,
  description: item.description,
}));

export const PLANNING_DOCTOR_ITEMS: ChecklistItemDef[] =
  PLANNING_CHECKLIST_SECTIONS.find((s) => s.id === "doctors_required")?.items.map((item) => ({
    id: `planning:${item.id}`,
    label: item.title.split(" — ")[0] ?? item.title,
  })) ?? [];

export const PLANNING_EXAM_ITEMS: ChecklistItemDef[] = PLANNING_CHECKLIST.map((item) => ({
  id: `planning:${item.id}`,
  label: item.title,
  description: item.description,
}));

const PREGNANT_TRIMESTER_1: ChecklistItemDef[] = [
  { id: "preg:obgyn", label: "Акушер-гинеколог" },
  { id: "preg:screening_1", label: "Скрининг 1 триместра" },
  { id: "preg:blood", label: "Общий анализ крови" },
  { id: "preg:urine", label: "Общий анализ мочи" },
];

const PREGNANT_TRIMESTER_2: ChecklistItemDef[] = [
  { id: "preg:obgyn", label: "Акушер-гинеколог" },
  { id: "preg:ultrasound_2", label: "УЗИ 2 триместра" },
  { id: "preg:gtt", label: "Глюкозотолерантный тест" },
  { id: "preg:screening_2", label: "Скрининг 2 триместра" },
  { id: "preg:blood", label: "Общий анализ крови" },
  { id: "preg:urine", label: "Общий анализ мочи" },
];

const PREGNANT_TRIMESTER_3: ChecklistItemDef[] = [
  { id: "preg:obgyn", label: "Акушер-гинеколог" },
  { id: "preg:blood", label: "Контроль анализа крови" },
  { id: "preg:urine", label: "Контроль анализа мочи" },
  { id: "preg:ultrasound_3", label: "УЗИ 3 триместра" },
  { id: "preg:ctg", label: "КТГ плода" },
];

export function getPregnantChecklistItems(week: number): ChecklistItemDef[] {
  if (week <= 12) return PREGNANT_TRIMESTER_1;
  if (week <= 27) return PREGNANT_TRIMESTER_2;
  return PREGNANT_TRIMESTER_3;
}

export function trimesterTitle(week: number): string {
  if (week <= 12) return "Чеклист 1 триместра";
  if (week <= 27) return "Чеклист 2 триместра";
  return "Чеклист 3 триместра";
}
