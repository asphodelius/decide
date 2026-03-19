import { useMemo, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { FadeInLeft, FadeInRight, FadeOutLeft, FadeOutRight } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useTranslation } from "react-i18next";

import { AppShell } from "@/components/AppShell";
import { BalanceMeter } from "@/components/BalanceMeter";
import { FactorComposer } from "@/components/FactorComposer";
import { GlassPanel } from "@/components/GlassPanel";
import { ScreenHeader } from "@/components/ScreenHeader";
import { SegmentedControl } from "@/components/SegmentedControl";
import { WeightBoard } from "@/components/WeightBoard";
import { buildDecisionRecord, evaluateDecision, getReminderSeconds, isDraftReady } from "@/lib/decision-engine";
import { scheduleReminderNotification } from "@/lib/notifications";
import { createFactor } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import type { CurrencyCode, ReminderOption } from "@/store/types";
import { useTheme } from "@/theme/provider";
import { typography } from "@/theme/typography";

const TOTAL_STEPS = 5;
const CURRENCIES: CurrencyCode[] = ["RUB", "USD", "EUR"];
const CURRENCY_META: Record<CurrencyCode, { symbol: string; label: string }> = {
  RUB: { symbol: "₽", label: "RUB" },
  USD: { symbol: "$", label: "USD" },
  EUR: { symbol: "€", label: "EUR" },
};

export default function CreateScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const draft = useAppStore((state) => state.draft);
  const decisions = useAppStore((state) => state.decisions);
  const updateDraftField = useAppStore((state) => state.updateDraftField);
  const addFactor = useAppStore((state) => state.addFactor);
  const removeFactor = useAppStore((state) => state.removeFactor);
  const updateFactor = useAppStore((state) => state.updateFactor);
  const setFactorTag = useAppStore((state) => state.setFactorTag);
  const setReminder = useAppStore((state) => state.setReminder);
  const setDraftCurrency = useAppStore((state) => state.setDraftCurrency);
  const createDecision = useAppStore((state) => state.createDecision);
  const verdictPreview = useMemo(() => evaluateDecision(draft, decisions), [decisions, draft]);
  const currency = draft.currency ?? "USD";
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);

  const stepTitle = [
    t("create.titleStep"),
    t("create.prosStep"),
    t("create.consStep"),
    t("create.weightsStep"),
    t("create.reviewStep"),
  ][step];

  const validateStep = () => {
    if (step === 0 && !draft.title.trim()) {
      return false;
    }

    if (step === 1 && draft.pros.length === 0) {
      return false;
    }

    if (step === 2 && draft.cons.length === 0) {
      return false;
    }

    return true;
  };

  const goToStep = async (nextStep: number) => {
    if (nextStep > step && !validateStep()) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      setValidationMessage(t("create.validationBody"));
      return;
    }

    if (nextStep < 0 || nextStep >= TOTAL_STEPS) {
      return;
    }

    setValidationMessage(null);
    setDirection(nextStep > step ? 1 : -1);
    setStep(nextStep);
    await Haptics.selectionAsync();
  };

  const swipe = Gesture.Pan()
    .activeOffsetX([-18, 18])
    .onEnd(async ({ translationX }) => {
      if (translationX < -70) {
        await goToStep(step + 1);
      }

      if (translationX > 70) {
        await goToStep(step - 1);
      }
    });

  const finalize = async () => {
    if (!isDraftReady(draft)) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      setValidationMessage(t("create.validationBody"));
      return;
    }

    let notificationId: string | null = null;

    if (draft.reminder) {
      notificationId = await scheduleReminderNotification(t("common.appName"), t(verdictPreview.narrativeKey), getReminderSeconds(draft.reminder));
    }

    const record = buildDecisionRecord(draft, decisions, notificationId);
    createDecision(record);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.replace(`/decision/${record.id}?transitionTag=decision-review-hero`);
  };

  return (
    <View style={{ flex: 1 }}>
      <AppShell scroll contentContainerStyle={{ paddingBottom: 176 }}>
        <ScreenHeader title={t("create.header")} subtitle={t("create.stepLabel", { current: step + 1, total: TOTAL_STEPS })} showBack />

        <View style={{ flexDirection: "row", gap: 8, marginBottom: 18 }}>
          {Array.from({ length: TOTAL_STEPS }).map((_, index) => (
            <View
              key={index}
              style={{
                flex: 1,
                height: 6,
                borderRadius: 999,
                backgroundColor: index < step ? theme.accent.base : index === step ? theme.accent.container : theme.surfaceSunken,
              }}
            />
          ))}
        </View>

        <GestureDetector gesture={swipe}>
          <Animated.View key={`${step}-${direction}`} entering={direction > 0 ? FadeInRight.duration(260) : FadeInLeft.duration(260)} exiting={direction > 0 ? FadeOutLeft.duration(220) : FadeOutRight.duration(220)}>
            {step === 0 ? (
              <View style={{ gap: 18 }}>
                <View>
                  <Text style={{ color: theme.text, fontFamily: typography.family.bold, fontSize: 28 }}>{stepTitle}</Text>
                  <Text style={{ color: theme.textMuted, fontFamily: typography.family.body, fontSize: 14, marginTop: 8, lineHeight: 21 }}>{t("create.titleHint")}</Text>
                </View>
                <GlassPanel style={{ padding: 18, backgroundColor: theme.surfaceRaised }}>
                  <TextInput
                    value={draft.title}
                    onChangeText={(value) => updateDraftField("title", value)}
                    placeholder={t("create.titlePlaceholder")}
                    placeholderTextColor={theme.textSoft}
                    style={{ color: theme.text, fontFamily: typography.family.bold, fontSize: 28, lineHeight: 34 }}
                  />
                </GlassPanel>
                <View style={{ flexDirection: "row", gap: 12 }}>
                  <GlassPanel style={{ padding: 18, flex: 1.02, backgroundColor: theme.surfaceRaised }}>
                    <Text style={{ color: theme.textSoft, fontFamily: typography.family.bold, fontSize: 12, letterSpacing: 1.2 }}>{t("common.price").toUpperCase()}</Text>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginTop: 12 }}>
                      <View
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 18,
                          backgroundColor: theme.surfaceSunken,
                          borderWidth: 1,
                          borderColor: theme.borderSoft,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text style={{ color: theme.text, fontFamily: typography.family.bold, fontSize: 24 }}>{CURRENCY_META[currency].symbol}</Text>
                      </View>
                      <TextInput
                        value={draft.price}
                        onChangeText={(value) => updateDraftField("price", value)}
                        placeholder={t("create.pricePlaceholder")}
                        placeholderTextColor={theme.textSoft}
                        keyboardType="decimal-pad"
                        style={{ flex: 1, color: theme.text, fontFamily: typography.family.bold, fontSize: 24, paddingVertical: 0 }}
                      />
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 6,
                        marginTop: 14,
                        padding: 4,
                        borderRadius: 18,
                        backgroundColor: theme.surfaceSunken,
                      }}
                    >
                      {CURRENCIES.map((option) => {
                        const active = currency === option;
                        return (
                          <Pressable key={option} onPress={() => setDraftCurrency(option)} style={{ flex: 1 }}>
                            <View
                              style={{
                                minHeight: 42,
                                borderRadius: 14,
                                backgroundColor: active ? theme.accent.container : "transparent",
                                borderWidth: 1,
                                borderColor: active ? theme.border : "transparent",
                                alignItems: "center",
                                justifyContent: "center",
                                flexDirection: "row",
                                gap: 5,
                              }}
                            >
                              <Text
                                style={{
                                  color: active ? theme.accent.onContainer : theme.textMuted,
                                  fontFamily: active ? typography.family.bold : typography.family.medium,
                                  fontSize: 14,
                                }}
                              >
                                {CURRENCY_META[option].symbol}
                              </Text>
                              <Text
                                style={{
                                  color: active ? theme.accent.onContainer : theme.textMuted,
                                  fontFamily: active ? typography.family.bold : typography.family.medium,
                                  fontSize: 11,
                                  letterSpacing: 0.6,
                                }}
                              >
                                {CURRENCY_META[option].label}
                              </Text>
                            </View>
                          </Pressable>
                        );
                      })}
                    </View>
                  </GlassPanel>
                  <GlassPanel style={{ padding: 18, flex: 1.18, backgroundColor: theme.surfaceRaised }}>
                    <Text style={{ color: theme.textSoft, fontFamily: typography.family.bold, fontSize: 12, letterSpacing: 1.2 }}>{t("common.note").toUpperCase()}</Text>
                    <TextInput
                      value={draft.note}
                      onChangeText={(value) => updateDraftField("note", value)}
                      placeholder={t("create.notePlaceholder")}
                      placeholderTextColor={theme.textSoft}
                      multiline
                      style={{ color: theme.text, fontFamily: typography.family.medium, fontSize: 15, marginTop: 10, minHeight: 90, textAlignVertical: "top" }}
                    />
                  </GlassPanel>
                </View>
              </View>
            ) : null}

            {step === 1 ? (
              <FactorComposer
                title={t("create.prosStep")}
                hint={t("create.prosHint")}
                placeholder={t("create.prosPlaceholder")}
                actionLabel={t("create.addPro")}
                factors={draft.pros}
                onAdd={(value) => addFactor("pro", createFactor("pro", value))}
                onRemove={(id) => removeFactor("pro", id)}
              />
            ) : null}

            {step === 2 ? (
              <FactorComposer
                title={t("create.consStep")}
                hint={t("create.consHint")}
                placeholder={t("create.consPlaceholder")}
                actionLabel={t("create.addCon")}
                factors={draft.cons}
                onAdd={(value) => addFactor("con", createFactor("con", value))}
                onRemove={(id) => removeFactor("con", id)}
              />
            ) : null}

            {step === 3 ? (
              <WeightBoard
                pros={draft.pros}
                cons={draft.cons}
                onWeightChange={(kind, id, weight) => updateFactor(kind, id, { weight })}
                onTagChange={(kind, id, tag) => setFactorTag(kind, id, tag)}
                onRemove={(kind, id) => removeFactor(kind, id)}
              />
            ) : null}

            {step === 4 ? (
              <View style={{ gap: 18 }}>
                <View>
                  <Text style={{ color: theme.text, fontFamily: typography.family.bold, fontSize: 28 }}>{t("create.reviewStep")}</Text>
                  <Text style={{ color: theme.textMuted, fontFamily: typography.family.body, fontSize: 14, marginTop: 8, lineHeight: 21 }}>{t("create.reviewHint")}</Text>
                </View>

                <Animated.View sharedTransitionTag="decision-review-hero">
                  <GlassPanel style={{ padding: 22, backgroundColor: theme.surfaceRaised }}>
                    <Text style={{ color: theme.textSoft, fontFamily: typography.family.bold, fontSize: 11, letterSpacing: 1.6 }}>{t("common.verdict").toUpperCase()}</Text>
                    <Text style={{ color: theme.text, fontFamily: typography.family.display, fontSize: 34, lineHeight: 40, marginTop: 12 }}>{draft.title || t("common.appName")}</Text>
                    <Text style={{ color: theme.textMuted, fontFamily: typography.family.medium, fontSize: 15, marginTop: 10, lineHeight: 22 }}>{t(verdictPreview.narrativeKey)}</Text>
                  </GlassPanel>
                </Animated.View>

                <GlassPanel style={{ padding: 18, backgroundColor: theme.surfaceRaised }}>
                  <BalanceMeter verdict={verdictPreview} />
                </GlassPanel>

                <GlassPanel style={{ padding: 18, backgroundColor: theme.surfaceRaised }}>
                  <Text style={{ color: theme.text, fontFamily: typography.family.bold, fontSize: 18, marginBottom: 14 }}>{t("create.decisionDelay")}</Text>
                  <SegmentedControl<ReminderOption | "none">
                    value={draft.reminder ?? "none"}
                    onChange={(value) => setReminder(value === "none" ? null : value)}
                    options={[
                      { value: "none", label: t("common.none") },
                      { value: "24h", label: t("common.hours24") },
                      { value: "3d", label: t("common.days3") },
                    ]}
                  />
                </GlassPanel>

                <View style={{ gap: 10 }}>
                  {verdictPreview.checks.map((check) => (
                    <GlassPanel key={check} style={{ padding: 16, backgroundColor: theme.surfaceRaised }}>
                      <Text style={{ color: theme.text, fontFamily: typography.family.medium, fontSize: 15 }}>{t(`realityChecks.${check}`)}</Text>
                    </GlassPanel>
                  ))}
                </View>
              </View>
            ) : null}
          </Animated.View>
        </GestureDetector>

        {validationMessage ? (
          <GlassPanel style={{ padding: 16, marginTop: 18, backgroundColor: theme.noContainer, borderColor: theme.borderSoft }}>
            <Text style={{ color: theme.no, fontFamily: typography.family.medium, fontSize: 14 }}>{validationMessage}</Text>
          </GlassPanel>
        ) : null}
      </AppShell>

      <View style={{ position: "absolute", bottom: 30, left: 16, right: 16, flexDirection: "row", gap: 10 }}>
        <Pressable disabled={step === 0} onPress={() => goToStep(step - 1)} style={{ flex: 0.34, opacity: step === 0 ? 0.45 : 1 }}>
          <GlassPanel style={{ paddingVertical: 18, alignItems: "center", justifyContent: "center", borderRadius: 22, backgroundColor: theme.surfaceRaised }}>
            <Text style={{ color: theme.textMuted, fontFamily: typography.family.bold, fontSize: 14 }}>{t("common.back")}</Text>
          </GlassPanel>
        </Pressable>
        <Pressable onPress={() => (step === TOTAL_STEPS - 1 ? finalize() : goToStep(step + 1))} style={{ flex: 1 }}>
          <GlassPanel style={{ paddingVertical: 18, alignItems: "center", justifyContent: "center", borderRadius: 22, backgroundColor: theme.accent.base, borderColor: theme.accent.outline }}>
            <Text style={{ color: theme.accent.onBase, fontFamily: typography.family.bold, fontSize: 14 }}>{step === TOTAL_STEPS - 1 ? t("create.finalize") : t("common.continue")}</Text>
          </GlassPanel>
        </Pressable>
      </View>
    </View>
  );
}
