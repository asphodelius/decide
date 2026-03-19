import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLocales } from "expo-localization";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type {
  AccentTone,
  AppLanguage,
  CurrencyCode,
  DecisionDraft,
  DecisionFactor,
  DecisionRecord,
  EmotionTag,
  OutcomeStatus,
  ReminderOption,
  ThemePreference,
} from "@/store/types";

interface AppState {
  settings: {
    language: AppLanguage;
    themePreference: ThemePreference;
    accentTone: AccentTone;
    dynamicAppIcon: boolean;
  };
  draft: DecisionDraft;
  decisions: DecisionRecord[];
  setLanguage: (language: AppLanguage) => void;
  setThemePreference: (preference: ThemePreference) => void;
  setAccentTone: (accentTone: AccentTone) => void;
  setDynamicAppIcon: (enabled: boolean) => void;
  updateDraftField: (field: "title" | "price" | "note", value: string) => void;
  setDraftCurrency: (currency: CurrencyCode) => void;
  addFactor: (kind: "pro" | "con", item: DecisionFactor) => void;
  removeFactor: (kind: "pro" | "con", id: string) => void;
  updateFactor: (kind: "pro" | "con", id: string, patch: Partial<Pick<DecisionFactor, "text" | "weight" | "tag">>) => void;
  setFactorTag: (kind: "pro" | "con", id: string, tag: EmotionTag | null) => void;
  setReminder: (value: ReminderOption | null) => void;
  resetDraft: () => void;
  createDecision: (decision: DecisionRecord) => void;
  setOutcome: (id: string, outcome: OutcomeStatus) => void;
}

const defaultLanguage: AppLanguage = getLocales()[0]?.languageCode === "ru" ? "ru" : "en";
const defaultCurrency: CurrencyCode = defaultLanguage === "ru" ? "RUB" : "USD";

const createEmptyDraft = (): DecisionDraft => ({
  title: "",
  price: "",
  currency: defaultCurrency,
  note: "",
  pros: [],
  cons: [],
  reminder: null,
});

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      settings: {
        language: defaultLanguage,
        themePreference: "system",
        accentTone: "material_you",
        dynamicAppIcon: true,
      },
      draft: createEmptyDraft(),
      decisions: [],
      setLanguage: (language) =>
        set((state) => ({
          settings: {
            ...state.settings,
            language,
          },
        })),
      setThemePreference: (themePreference) =>
        set((state) => ({
          settings: {
            ...state.settings,
            themePreference,
          },
        })),
      setAccentTone: (accentTone) =>
        set((state) => ({
          settings: {
            ...state.settings,
            accentTone,
          },
        })),
      setDynamicAppIcon: (dynamicAppIcon) =>
        set((state) => ({
          settings: {
            ...state.settings,
            dynamicAppIcon,
          },
        })),
      updateDraftField: (field, value) =>
        set((state) => ({
          draft: {
            ...state.draft,
            [field]: value,
          },
        })),
      setDraftCurrency: (currency) =>
        set((state) => ({
          draft: {
            ...state.draft,
            currency,
          },
        })),
      addFactor: (kind, item) =>
        set((state) => ({
          draft: {
            ...state.draft,
            [kind === "pro" ? "pros" : "cons"]: [...state.draft[kind === "pro" ? "pros" : "cons"], item],
          },
        })),
      removeFactor: (kind, id) =>
        set((state) => ({
          draft: {
            ...state.draft,
            [kind === "pro" ? "pros" : "cons"]: state.draft[kind === "pro" ? "pros" : "cons"].filter((item) => item.id !== id),
          },
        })),
      updateFactor: (kind, id, patch) =>
        set((state) => ({
          draft: {
            ...state.draft,
            [kind === "pro" ? "pros" : "cons"]: state.draft[kind === "pro" ? "pros" : "cons"].map((item) =>
              item.id === id ? { ...item, ...patch } : item,
            ),
          },
        })),
      setFactorTag: (kind, id, tag) =>
        set((state) => ({
          draft: {
            ...state.draft,
            [kind === "pro" ? "pros" : "cons"]: state.draft[kind === "pro" ? "pros" : "cons"].map((item) =>
              item.id === id ? { ...item, tag } : item,
            ),
          },
        })),
      setReminder: (value) =>
        set((state) => ({
          draft: {
            ...state.draft,
            reminder: value,
          },
        })),
      resetDraft: () =>
        set({
          draft: createEmptyDraft(),
        }),
      createDecision: (decision) =>
        set((state) => ({
          decisions: [decision, ...state.decisions],
          draft: createEmptyDraft(),
        })),
      setOutcome: (id, outcome) =>
        set((state) => ({
          decisions: state.decisions.map((item) =>
            item.id === id
              ? {
                  ...item,
                  outcome,
                  updatedAt: new Date().toISOString(),
                }
              : item,
          ),
        })),
    }),
    {
      name: "decide-store",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        settings: state.settings,
        draft: state.draft,
        decisions: state.decisions,
      }),
    },
  ),
);
