export type ChecklistItemStatus = "none" | "planned" | "done";

const STORAGE_KEY = "zk_checklist_progress";
const LEGACY_PREFIX = "zk_plan_done_";

const LEGACY_ID_MAP: Record<string, string> = {
  "prev-gynecologist": "preventive:gynecologist",
  "prev-breast_exam": "preventive:breast_exam",
  "prev-pelvic_ultrasound": "preventive:pelvic_ultrasound",
  "prev-thyroid": "preventive:thyroid",
  "prev-blood_general": "preventive:blood_general",
  "plan-doc-doc_obgyn": "planning:doc_obgyn",
  "plan-doc-doc_therapist": "planning:doc_therapist",
  "plan-doc-doc_dentist": "planning:doc_dentist",
  "plan-exam-preconception_visit": "planning:preconception_visit",
  "plan-exam-rubella_immunity": "planning:rubella_immunity",
  "plan-exam-torch": "planning:torch",
  "preg-visit-obgyn": "preg:obgyn",
  "preg-screening-1": "preg:screening_1",
  "preg-blood-urine": "preg:blood",
  "preg-us-2": "preg:ultrasound_2",
  "preg-gtt": "preg:gtt",
  "preg-screening-2": "preg:screening_2",
  "preg-labs-control": "preg:blood",
  "preg-us-3": "preg:ultrasound_3",
  "preg-ctg": "preg:ctg",
  "profile-fill": "plan:profile-fill",
  "visit-gyn": "plan:visit-gyn",
  "visit-therapist": "plan:visit-therapist",
  "labs-missing": "plan:labs-missing",
  "visit-pelvic-us": "plan:visit-pelvic-us",
  "preg-set-term": "plan:preg-set-term",
  "preg-read-week": "plan:preg-read-week",
  "preg-kicks-today": "plan:preg-kicks-today",
};

function readStore(): Record<string, ChecklistItemStatus> {
  if (typeof window === "undefined") return {};
  const raw = localStorage.getItem(STORAGE_KEY);
  let store: Record<string, ChecklistItemStatus> = {};
  if (raw) {
    try {
      store = JSON.parse(raw) as Record<string, ChecklistItemStatus>;
    } catch {
      store = {};
    }
  }

  let migrated = false;
  const legacyKeys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(LEGACY_PREFIX)) legacyKeys.push(key);
  }
  for (const key of legacyKeys) {
    const legacyId = key.slice(LEGACY_PREFIX.length);
    const canonical = LEGACY_ID_MAP[legacyId] ?? legacyId;
    if (localStorage.getItem(key) === "1" && store[canonical] !== "done") {
      store[canonical] = "done";
      migrated = true;
    }
    localStorage.removeItem(key);
  }

  if (migrated) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }

  return store;
}

function writeStore(store: Record<string, ChecklistItemStatus>): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function loadAllChecklistProgress(): Record<string, ChecklistItemStatus> {
  return readStore();
}

export function getChecklistStatus(id: string): ChecklistItemStatus {
  return readStore()[id] ?? "none";
}

export function setChecklistStatus(id: string, status: ChecklistItemStatus): void {
  const store = readStore();
  if (status === "none") {
    delete store[id];
  } else {
    store[id] = status;
  }
  writeStore(store);
}

const STATUS_CYCLE: ChecklistItemStatus[] = ["none", "planned", "done"];

export function cycleChecklistStatus(id: string): ChecklistItemStatus {
  const current = getChecklistStatus(id);
  const idx = STATUS_CYCLE.indexOf(current);
  const next = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];
  setChecklistStatus(id, next);
  return next;
}

export function isChecklistDone(id: string): boolean {
  return getChecklistStatus(id) === "done";
}

/** Переключатель для дашборда: none ↔ done */
export function toggleChecklistDone(id: string): boolean {
  const next = !isChecklistDone(id);
  setChecklistStatus(id, next ? "done" : "none");
  return next;
}

export const CHECKLIST_STATUS_LABEL: Record<ChecklistItemStatus, string> = {
  none: "Не сделано",
  planned: "Запланировано",
  done: "Пройдено",
};

export const CHECKLIST_STATUS_COLOR: Record<ChecklistItemStatus, string> = {
  none: "bg-ink-muted/20 text-ink-muted",
  planned: "bg-amber-100 text-amber-800",
  done: "bg-emerald-100 text-emerald-800",
};
