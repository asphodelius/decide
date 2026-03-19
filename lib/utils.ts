import type { CurrencyCode, DecisionFactor, FactorKind } from "@/store/types";

export function uid(prefix = "id") {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function normalizeTitle(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-zа-я0-9\s]/gi, "")
    .replace(/\s+/g, " ");
}

export function parsePrice(value: string) {
  const sanitized = value.replace(",", ".").replace(/[^\d.]/g, "");
  const parsed = Number.parseFloat(sanitized);

  return Number.isFinite(parsed) ? parsed : null;
}

export function createFactor(kind: FactorKind, text: string): DecisionFactor {
  return {
    id: uid(kind),
    kind,
    text: text.trim(),
    weight: 3,
    tag: null,
  };
}

export function formatMoney(value: number | null, locale: string, currency: CurrencyCode = "USD") {
  if (value == null) {
    return null;
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDateLabel(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

export function getMinutesUntil(value: string) {
  return Math.max(Math.round((new Date(value).getTime() - Date.now()) / 60000), 0);
}
