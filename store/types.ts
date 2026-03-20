export type AppLanguage = "en" | "ru";
export type ThemePreference = "dark" | "light" | "system";
export type AccentTone = "material_you" | "ice" | "ember" | "mint" | "rose" | "asphodelius";
export type FactorKind = "pro" | "con";
export type EmotionTag = "logic" | "desire" | "fear" | "comfort" | "growth" | "status";
export type ReminderOption = "24h" | "3d";
export type OutcomeStatus = "unknown" | "worth_it" | "regret" | "mixed";
export type VerdictKind = "yes" | "no" | "pause";
export type CurrencyCode = "USD" | "EUR" | "RUB";

export type RealityCheckCode =
  | "thin_evidence"
  | "price_vs_pressure"
  | "impulse_bias"
  | "history_repeat"
  | "desire_over_logic"
  | "cons_heavy"
  | "need_more_time";

export interface DecisionFactor {
  id: string;
  kind: FactorKind;
  text: string;
  weight: number;
  tag?: EmotionTag | null;
}

export interface DecisionVerdict {
  kind: VerdictKind;
  score: number;
  prosScore: number;
  consScore: number;
  headlineKey: string;
  sublineKey: string;
  narrativeKey: string;
  checks: RealityCheckCode[];
}

export interface DecisionReminder {
  option: ReminderOption;
  scheduledFor: string;
  notificationId?: string | null;
}

export interface DecisionDraft {
  title: string;
  price: string;
  currency: CurrencyCode;
  note: string;
  pros: DecisionFactor[];
  cons: DecisionFactor[];
  reminder: ReminderOption | null;
}

export interface DecisionRecord {
  id: string;
  title: string;
  price: number | null;
  currency?: CurrencyCode;
  note: string;
  pros: DecisionFactor[];
  cons: DecisionFactor[];
  reminder?: DecisionReminder | null;
  verdict: DecisionVerdict;
  outcome: OutcomeStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AppSettings {
  language: AppLanguage;
  themePreference: ThemePreference;
  accentTone: AccentTone;
  dynamicAppIcon: boolean;
}
