import { evaluateHealthProfile } from "@/lib/health-evaluation";
import { PREVENTIVE_CHECKLIST, PLANNING_CHECKLIST } from "@/lib/preventive-checklist";
import { PLANNING_CHECKLIST_SECTIONS } from "@/lib/planning-checklist";
import { formatPregnancyTermLabel, getPregnancyTerm } from "@/lib/pregnancy-term";
import {
  type HealthProfile,
  type OnboardingData,
  loadHealthProfile,
  loadOnboardingData,
  getUserStatus,
} from "@/lib/user-storage";
import type { UserStatus } from "@/lib/types";

export interface CabinetPreviewAction {
  label: string;
  href: string;
}

export interface CabinetPreview {
  headline: string;
  subline?: string;
  actions: CabinetPreviewAction[];
  statPrimary: { label: string; value: string };
  statSecondary: { label: string; value: string; href: string };
}

const GUEST_PREVIEW: CabinetPreview = {
  headline: "Рекомендуем пройти",
  subline: "После регистрации список подстроится под ваш статус и данные профиля.",
  actions: [
    { label: "Акушер-гинеколог — осмотр раз в год", href: "/onboarding" },
    { label: "УЗИ органов малого таза", href: "/onboarding" },
    { label: "Общий анализ крови и мочи", href: "/onboarding" },
    { label: "ПАП-тест и скрининг ВПЧ", href: "/onboarding" },
  ],
  statPrimary: { label: "В чеклисте", value: "10+ пунктов" },
  statSecondary: { label: "Профилактика", value: "По возрасту", href: "/onboarding" },
};

function trimesterLabel(week: number): string {
  if (week <= 12) return "1 триместр";
  if (week <= 27) return "2 триместр";
  return "3 триместр";
}

function pregnantActions(week: number): string[] {
  if (week <= 12) {
    return [
      "Визит к акушеру-гинекологу",
      "Скрининг 1 триместра",
      "Общий анализ крови и мочи",
    ];
  }
  if (week <= 27) {
    return [
      "УЗИ 2 триместра",
      "Глюкозотолерантный тест",
      "Скрининг 2 триместра",
    ];
  }
  return [
    "Контроль анализов крови и мочи",
    "УЗИ 3 триместра",
    "КТГ плода по назначению врача",
  ];
}

function profileActions(profile: HealthProfile): string[] {
  const items: string[] = [];
  const evaluation = evaluateHealthProfile(profile);

  for (const message of evaluation.messages) {
    if (message.includes("гинеколог")) {
      items.push("Осмотр у акушера-гинеколога");
    }
  }

  for (const rec of evaluation.recommendations) {
    if (rec.includes("терапевт")) {
      items.push("Профилактический осмотр у терапевта");
    }
    if (rec.includes("рекомендуем проверить:")) {
      const labs = rec.replace("рекомендуем проверить: ", "");
      items.push(`Сдать анализы: ${labs}`);
    }
  }

  if (profile.neverPelvicUltrasound || !profile.lastPelvicUltrasound) {
    items.push("УЗИ органов малого таза");
  }

  return items;
}

function planningDefaultActions(): string[] {
  const required = PLANNING_CHECKLIST_SECTIONS.find((s) => s.id === "doctors_required");
  const doctors =
    required?.items.slice(0, 3).map((item) => item.title.split(" — ")[0] ?? item.title) ?? [];

  return [
    ...doctors,
    ...PLANNING_CHECKLIST.slice(0, 2).map((item) => item.title),
  ];
}

function preventiveDefaults(): string[] {
  return PREVENTIVE_CHECKLIST.slice(0, 4).map((item) => item.title);
}

function toPreviewActions(labels: string[], href: string): CabinetPreviewAction[] {
  const unique = [...new Set(labels)].slice(0, 5);
  return unique.map((label) => ({ label, href }));
}

function buildForStatus(
  status: UserStatus,
  profile: HealthProfile,
  onboarding: OnboardingData | null
): CabinetPreview {
  const profileBased = profileActions(profile);

  if (status === "pregnant") {
    const term = getPregnancyTerm(onboarding);
    if (!term) {
      return {
        headline: "Укажите срок беременности",
        subline: "Тогда покажем визиты и анализы именно для вашей недели.",
        actions: [
          { label: "Визит к акушеру-гинекологу", href: "/onboarding/pregnant" },
          { label: "Общий анализ крови", href: "/dashboard/checklist" },
          { label: "УЗИ по сроку", href: "/dashboard/checklist" },
        ],
        statPrimary: { label: "Неделя", value: "Не указана" },
        statSecondary: {
          label: "Чеклист",
          value: "По триместрам",
          href: "/dashboard/checklist",
        },
      };
    }

    const actions = [...profileBased, ...pregnantActions(term.week)];
    return {
      headline: formatPregnancyTermLabel(term.week, term.day),
      subline: term.dueDateLabel
        ? `ПДР ${term.dueDateLabel} · ${trimesterLabel(term.week)}`
        : trimesterLabel(term.week),
      actions: toPreviewActions(actions, "/dashboard/checklist"),
      statPrimary: { label: "Сейчас", value: trimesterLabel(term.week) },
      statSecondary: {
        label: "Чеклист",
        value: "Анализы и визиты",
        href: "/dashboard/checklist",
      },
    };
  }

  if (status === "planning") {
    const actions =
      profileBased.length > 0
        ? [...profileBased, ...planningDefaultActions()]
        : planningDefaultActions();

    return {
      headline: "Подготовка к беременности",
      subline:
        profileBased.length > 0
          ? "По вашему профилю — вот с чего начать"
          : "Врачи и обследования до зачатия",
      actions: toPreviewActions(actions, "/dashboard/checklist"),
      statPrimary: {
        label: "К пройдению",
        value: `${Math.min(actions.length, 5)}+ пунктов`,
      },
      statSecondary: {
        label: "Чеклист",
        value: "Врачи и анализы",
        href: "/dashboard/checklist",
      },
    };
  }

  const actions =
    profileBased.length > 0
      ? [...profileBased, ...preventiveDefaults()]
      : preventiveDefaults();

  const evaluation = evaluateHealthProfile(profile);
  const headline =
    evaluation.messages[0] ??
    (profileBased.length > 0 ? "Рекомендуем пройти" : "Профилактика по возрасту");

  return {
    headline,
    subline:
      profileBased.length > 0
        ? "На основе данных вашего профиля"
        : "Заполните профиль — список станет точнее",
    actions: toPreviewActions(actions, "/dashboard/preventive"),
    statPrimary: {
      label: "К визитам",
      value: `${Math.min(actions.length, 5)}+ пунктов`,
    },
    statSecondary: {
      label: "Чеклист",
      value: "Профилактика",
      href: "/dashboard/preventive",
    },
  };
}

export function getGuestCabinetPreview(): CabinetPreview {
  return GUEST_PREVIEW;
}

export function getCabinetPreview(): CabinetPreview {
  const status = getUserStatus();
  const profile = loadHealthProfile();
  const onboarding = loadOnboardingData();
  return buildForStatus(status, profile, onboarding);
}
