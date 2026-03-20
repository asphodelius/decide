import { Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Settings2, Sparkles } from "lucide-react-native";
import { useTranslation } from "react-i18next";

import { AppShell } from "@/components/AppShell";
import { DecisionCard } from "@/components/DecisionCard";
import { FloatingCTA } from "@/components/FloatingCTA";
import { GlassPanel } from "@/components/GlassPanel";
import { getDaysSince, getDesireVsLogicStats, getOutcomeLoopCandidate, getPatternSummary } from "@/lib/decision-engine";
import { useAppStore } from "@/store/useAppStore";
import { useTheme } from "@/theme/provider";
import { typography } from "@/theme/typography";

export default function HomeScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const decisions = useAppStore((state) => state.decisions);
  const draft = useAppStore((state) => state.draft);

  const draftSignals = draft.pros.length + draft.cons.length + (draft.title.trim() ? 1 : 0);
  const latest = decisions[0];
  const outcomeLoopDecision = getOutcomeLoopCandidate(decisions);
  const patternSummary = getPatternSummary(decisions);
  const desireVsLogic = getDesireVsLogicStats(decisions);

  return (
    <View style={{ flex: 1 }}>
      <AppShell scroll contentContainerStyle={{ gap: 18 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <View>
            <Text style={{ color: theme.textSoft, fontFamily: typography.family.bold, fontSize: 11, letterSpacing: 1.4 }}>{t("home.eyebrow").toUpperCase()}</Text>
          </View>
          <Pressable onPress={() => router.push("/settings")}>
            <GlassPanel style={{ width: 44, height: 44, borderRadius: 16, alignItems: "center", justifyContent: "center", backgroundColor: theme.surfaceRaised }}>
              <Settings2 color={theme.text} size={18} />
            </GlassPanel>
          </Pressable>
        </View>

        <GlassPanel style={{ padding: 22, backgroundColor: theme.surfaceRaised }}>
          <Text style={{ color: theme.text, fontFamily: typography.family.display, fontSize: 48, lineHeight: 52 }}>{t("home.headline")}</Text>
          <Text style={{ color: theme.textMuted, fontFamily: typography.family.medium, fontSize: 15, marginTop: 10, maxWidth: "95%", lineHeight: 22 }}>{t("home.subline")}</Text>
          <View style={{ flexDirection: "row", gap: 10, marginTop: 22 }}>
            <StatCard label={t("home.quickStatsVerdict")} value={latest ? t(`result.bias${latest.verdict.kind.charAt(0).toUpperCase()}${latest.verdict.kind.slice(1)}`) : "--"} />
            <StatCard label={t("home.quickStatsHistory")} value={String(decisions.length).padStart(2, "0")} />
            <StatCard label={t("home.quickStatsDraft")} value={String(draftSignals).padStart(2, "0")} />
          </View>
        </GlassPanel>

        {draftSignals > 0 ? (
          <Pressable onPress={() => router.push("/create")}>
            <GlassPanel style={{ padding: 20, backgroundColor: theme.surfaceRaised }}>
              <Text style={{ color: theme.text, fontFamily: typography.family.bold, fontSize: 20 }}>{t("home.resume")}</Text>
              <Text style={{ color: theme.textMuted, fontFamily: typography.family.body, fontSize: 14, marginTop: 8 }}>{t("home.resumeMeta", { count: draftSignals })}</Text>
            </GlassPanel>
          </Pressable>
        ) : null}

        {outcomeLoopDecision ? (
          <Pressable onPress={() => router.push(`/decision/${outcomeLoopDecision.id}?transitionTag=decision-card-${outcomeLoopDecision.id}`)}>
            <GlassPanel style={{ padding: 20, backgroundColor: theme.surfaceRaised }}>
              <Text style={{ color: theme.text, fontFamily: typography.family.bold, fontSize: 20 }}>{t("home.outcomeLoopTitle")}</Text>
              <Text style={{ color: theme.textMuted, fontFamily: typography.family.body, fontSize: 14, lineHeight: 22, marginTop: 8 }}>
                {t("home.outcomeLoopBody", { title: outcomeLoopDecision.title, days: getDaysSince(outcomeLoopDecision.createdAt) })}
              </Text>
              <Text style={{ color: theme.accent.base, fontFamily: typography.family.bold, fontSize: 13, marginTop: 14 }}>{t("home.outcomeLoopCta")}</Text>
            </GlassPanel>
          </Pressable>
        ) : null}

        {patternSummary ? (
          <GlassPanel style={{ padding: 20, backgroundColor: theme.surfaceRaised }}>
            <Text style={{ color: theme.text, fontFamily: typography.family.bold, fontSize: 20 }}>{t("home.patternSummaryTitle")}</Text>
            <Text style={{ color: theme.text, fontFamily: typography.family.bold, fontSize: 16, marginTop: 12 }}>{t(patternSummary.titleKey)}</Text>
            <Text style={{ color: theme.textMuted, fontFamily: typography.family.body, fontSize: 14, lineHeight: 22, marginTop: 8 }}>
              {t(patternSummary.bodyKey, patternSummary.values)}
            </Text>

            <View style={{ marginTop: 18, gap: 12 }}>
              <Text style={{ color: theme.text, fontFamily: typography.family.bold, fontSize: 16 }}>{t("home.successRateTitle")}</Text>
              {desireVsLogic.desireCount + desireVsLogic.logicCount > 0 ? (
                <View style={{ gap: 12 }}>
                  <SuccessRateBar label={t("home.successRateDesire")} value={desireVsLogic.desireRate} count={desireVsLogic.desireCount} color={theme.pause} />
                  <SuccessRateBar label={t("home.successRateLogic")} value={desireVsLogic.logicRate} count={desireVsLogic.logicCount} color={theme.yes} />
                </View>
              ) : (
                <Text style={{ color: theme.textMuted, fontFamily: typography.family.body, fontSize: 14, lineHeight: 22 }}>{t("home.successRateEmpty")}</Text>
              )}
            </View>
          </GlassPanel>
        ) : null}

        <View style={{ marginTop: 6 }}>
          <Text style={{ color: theme.text, fontFamily: typography.family.bold, fontSize: 24, marginBottom: 12 }}>{t("home.historyTitle")}</Text>
          {decisions.length ? (
            decisions.map((decision) => (
              <DecisionCard key={decision.id} decision={decision} onPress={() => router.push(`/decision/${decision.id}?transitionTag=decision-card-${decision.id}`)} />
            ))
          ) : (
            <GlassPanel style={{ padding: 24, backgroundColor: theme.surfaceRaised }}>
              <View style={{ width: 54, height: 54, borderRadius: 18, backgroundColor: theme.accent.container, alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <Sparkles color={theme.accent.onContainer} size={22} />
              </View>
              <Text style={{ color: theme.text, fontFamily: typography.family.bold, fontSize: 20 }}>{t("home.historyEmptyTitle")}</Text>
              <Text style={{ color: theme.textMuted, fontFamily: typography.family.body, fontSize: 14, marginTop: 8, lineHeight: 22 }}>{t("home.historyEmptyBody")}</Text>
            </GlassPanel>
          )}
        </View>
      </AppShell>

      <FloatingCTA key={`home-cta-${i18n.resolvedLanguage}`} label={t("home.create")} onPress={() => router.push("/create")} icon={Sparkles} />
    </View>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  const { theme } = useTheme();

  return (
    <View style={{ flex: 1, borderRadius: 20, padding: 14, backgroundColor: theme.surfaceSunken }}>
      <Text style={{ color: theme.textSoft, fontFamily: typography.family.bold, fontSize: 10, letterSpacing: 1.2 }}>{label.toUpperCase()}</Text>
      <Text style={{ color: theme.text, fontFamily: typography.family.bold, fontSize: 16, marginTop: 10 }}>{value}</Text>
    </View>
  );
}

function SuccessRateBar({ label, value, count, color }: { label: string; value: number; count: number; color: string }) {
  const { theme } = useTheme();

  return (
    <View style={{ gap: 7 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ color: theme.text, fontFamily: typography.family.medium, fontSize: 14 }}>{label}</Text>
        <Text style={{ color: theme.textMuted, fontFamily: typography.family.bold, fontSize: 13 }}>{value}% · {count}</Text>
      </View>
      <View style={{ height: 10, borderRadius: 999, backgroundColor: theme.surfaceSunken, overflow: "hidden" }}>
        <View style={{ width: `${value}%`, height: "100%", borderRadius: 999, backgroundColor: color }} />
      </View>
    </View>
  );
}
