import { Pressable, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useTranslation } from "react-i18next";

import { AppShell } from "@/components/AppShell";
import { BalanceMeter } from "@/components/BalanceMeter";
import { GlassPanel } from "@/components/GlassPanel";
import { ScreenHeader } from "@/components/ScreenHeader";
import { formatDateLabel, formatMoney, getMinutesUntil } from "@/lib/utils";
import { getCostReframes, getPatternMemoryKeys, getPatternMemoryMetrics, getWorkdayEstimate } from "@/lib/decision-engine";
import { useAppStore } from "@/store/useAppStore";
import type { OutcomeStatus } from "@/store/types";
import { useTheme } from "@/theme/provider";
import { typography } from "@/theme/typography";

const OUTCOMES: OutcomeStatus[] = ["unknown", "worth_it", "mixed", "regret"];
const OUTCOME_LABEL_KEYS: Record<OutcomeStatus, string> = {
  unknown: "result.outcomeUnknown",
  worth_it: "result.outcomeWorthIt",
  mixed: "result.outcomeMixed",
  regret: "result.outcomeRegret",
};

export default function ResultScreen() {
  const router = useRouter();
  const { id, transitionTag } = useLocalSearchParams<{ id: string; transitionTag?: string }>();
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const history = useAppStore((state) => state.decisions);
  const decision = useAppStore((state) => state.decisions.find((item) => item.id === id));
  const setOutcome = useAppStore((state) => state.setOutcome);

  if (!decision) {
    return (
      <AppShell>
        <ScreenHeader title={t("common.verdict")} showBack />
      </AppShell>
    );
  }

  const verdictWord = decision.verdict.kind === "yes" ? t("result.biasYes") : decision.verdict.kind === "no" ? t("result.biasNo") : t("result.biasPause");
  const verdictColor = decision.verdict.kind === "yes" ? theme.yes : decision.verdict.kind === "no" ? theme.no : theme.pause;
  const verdictContainer = decision.verdict.kind === "yes" ? theme.yesContainer : decision.verdict.kind === "no" ? theme.noContainer : theme.pauseContainer;
  const workdays = getWorkdayEstimate(decision.price, decision.currency ?? "USD");
  const reframes = getCostReframes(decision.price, decision.currency ?? "USD");
  const patternMemory = getPatternMemoryKeys(decision, history);
  const patternMetrics = getPatternMemoryMetrics(decision, history);

  return (
    <AppShell scroll contentContainerStyle={{ gap: 18 }}>
      <ScreenHeader title={t("common.verdict")} showBack />

      <Animated.View entering={FadeInDown.duration(340)} sharedTransitionTag={transitionTag || `decision-card-${decision.id}`}>
        <GlassPanel style={{ padding: 22, backgroundColor: verdictContainer, borderColor: theme.borderSoft }}>
          <Text style={{ color: verdictColor, fontFamily: typography.family.bold, fontSize: 12, letterSpacing: 2.4 }}>{verdictWord}</Text>
          <Text style={{ color: theme.text, fontFamily: typography.family.display, fontSize: 36, lineHeight: 42, marginTop: 12 }}>{decision.title}</Text>
          <Text style={{ color: theme.text, fontFamily: typography.family.bold, fontSize: 24, marginTop: 18 }}>{t(decision.verdict.headlineKey)}</Text>
          <Text style={{ color: theme.textMuted, fontFamily: typography.family.medium, fontSize: 15, marginTop: 10, lineHeight: 22 }}>{t(decision.verdict.sublineKey)}</Text>
          <Text style={{ color: theme.textMuted, fontFamily: typography.family.body, fontSize: 15, lineHeight: 24, marginTop: 14 }}>{t(decision.verdict.narrativeKey)}</Text>

          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 22 }}>
            <MetaChip label={formatDateLabel(decision.createdAt, i18n.language)} />
            {decision.price ? <MetaChip label={t("result.pricedAt", { value: formatMoney(decision.price, i18n.language, decision.currency ?? "USD") })} /> : null}
            {workdays ? <MetaChip label={t("result.workdays", { days: workdays })} /> : null}
          </View>
        </GlassPanel>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(120).duration(360)}>
        <GlassPanel style={{ padding: 18, backgroundColor: theme.surfaceRaised }}>
          <BalanceMeter verdict={decision.verdict} />
        </GlassPanel>
      </Animated.View>

      {reframes.length ? (
        <Animated.View entering={FadeInUp.delay(150).duration(360)}>
          <View style={{ gap: 10 }}>
            <Text style={{ color: theme.text, fontFamily: typography.family.bold, fontSize: 22 }}>{t("result.costReframing")}</Text>
            {reframes.map((item) => (
              <GlassPanel key={item.key} style={{ padding: 16, backgroundColor: theme.surfaceRaised }}>
                <Text style={{ color: theme.text, fontFamily: typography.family.medium, fontSize: 15, lineHeight: 22 }}>{t(item.key, { count: item.count })}</Text>
              </GlassPanel>
            ))}
          </View>
        </Animated.View>
      ) : null}

      {patternMemory.length ? (
        <Animated.View entering={FadeInUp.delay(180).duration(360)}>
          <View style={{ gap: 10 }}>
            <Text style={{ color: theme.text, fontFamily: typography.family.bold, fontSize: 22 }}>{t("result.patternMemory")}</Text>
            {patternMemory.map((key) => (
              <GlassPanel key={key} style={{ padding: 16, backgroundColor: theme.surfaceRaised }}>
                <Text style={{ color: theme.text, fontFamily: typography.family.medium, fontSize: 15, lineHeight: 22 }}>{t(key)}</Text>
              </GlassPanel>
            ))}
            {patternMetrics.map((metric) => (
              <GlassPanel key={metric.titleKey} style={{ padding: 16, backgroundColor: theme.surfaceRaised }}>
                <Text style={{ color: theme.text, fontFamily: typography.family.bold, fontSize: 14 }}>{t(metric.titleKey)}</Text>
                <Text style={{ color: theme.textMuted, fontFamily: typography.family.medium, fontSize: 14, lineHeight: 21, marginTop: 8 }}>
                  {t(metric.bodyKey, metric.values)}
                </Text>
              </GlassPanel>
            ))}
          </View>
        </Animated.View>
      ) : null}

      {decision.reminder ? (
        <Animated.View entering={FadeInUp.delay(200).duration(360)}>
          <GlassPanel style={{ padding: 18, backgroundColor: theme.surfaceRaised }}>
            <Text style={{ color: theme.text, fontFamily: typography.family.bold, fontSize: 16 }}>
              {getMinutesUntil(decision.reminder.scheduledFor) > 0
                ? t("result.delayScheduled", { date: formatDateLabel(decision.reminder.scheduledFor, i18n.language) })
                : t("result.delayMissed")}
            </Text>
          </GlassPanel>
        </Animated.View>
      ) : null}

      <Animated.View entering={FadeInUp.delay(230).duration(360)}>
        <View style={{ gap: 10 }}>
          <Text style={{ color: theme.text, fontFamily: typography.family.bold, fontSize: 22 }}>{t("result.realityChecks")}</Text>
          {decision.verdict.checks.map((check) => (
            <GlassPanel key={check} style={{ padding: 16, backgroundColor: theme.surfaceRaised }}>
              <Text style={{ color: theme.text, fontFamily: typography.family.medium, fontSize: 15, lineHeight: 22 }}>{t(`realityChecks.${check}`)}</Text>
            </GlassPanel>
          ))}
        </View>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(300).duration(360)}>
        <GlassPanel style={{ padding: 18, backgroundColor: theme.surfaceRaised }}>
          <Text style={{ color: theme.text, fontFamily: typography.family.bold, fontSize: 20 }}>{t("result.markOutcome")}</Text>
          <View style={{ gap: 10, marginTop: 16 }}>
            {OUTCOMES.map((outcome) => {
              const active = decision.outcome === outcome;
              return (
                <Pressable key={outcome} onPress={() => setOutcome(decision.id, outcome)}>
                  <View
                    style={{
                      borderRadius: 20,
                      paddingVertical: 14,
                      paddingHorizontal: 16,
                      backgroundColor: active ? theme.accent.container : theme.surfaceSunken,
                      borderWidth: 1,
                      borderColor: active ? theme.border : "transparent",
                    }}
                  >
                    <Text style={{ color: active ? theme.accent.onContainer : theme.text, fontFamily: active ? typography.family.bold : typography.family.medium, fontSize: 15 }}>
                      {t(OUTCOME_LABEL_KEYS[outcome])}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </GlassPanel>
      </Animated.View>

      <Pressable onPress={() => router.replace("/")}>
        <GlassPanel style={{ paddingVertical: 18, alignItems: "center", justifyContent: "center", borderRadius: 22, backgroundColor: theme.surfaceRaised }}>
          <Text style={{ color: theme.text, fontFamily: typography.family.bold, fontSize: 14 }}>{t("result.backHome")}</Text>
        </GlassPanel>
      </Pressable>
    </AppShell>
  );
}

function MetaChip({ label }: { label: string }) {
  const { theme } = useTheme();

  return (
    <View style={{ borderRadius: 999, backgroundColor: theme.surfaceSunken, paddingHorizontal: 12, paddingVertical: 9 }}>
      <Text style={{ color: theme.textMuted, fontFamily: typography.family.medium, fontSize: 12 }}>{label}</Text>
    </View>
  );
}
