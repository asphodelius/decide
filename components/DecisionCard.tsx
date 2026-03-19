import { Pressable, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { ArrowUpRight, Clock3 } from "lucide-react-native";
import { useTranslation } from "react-i18next";

import type { DecisionRecord } from "@/store/types";
import { formatDateLabel, formatMoney } from "@/lib/utils";
import { GlassPanel } from "@/components/GlassPanel";
import { useTheme } from "@/theme/provider";
import { typography } from "@/theme/typography";

interface DecisionCardProps {
  decision: DecisionRecord;
  onPress: () => void;
}

export function DecisionCard({ decision, onPress }: DecisionCardProps) {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const verdictColor = decision.verdict.kind === "yes" ? theme.yes : decision.verdict.kind === "no" ? theme.no : theme.pause;
  const verdictContainer = decision.verdict.kind === "yes" ? theme.yesContainer : decision.verdict.kind === "no" ? theme.noContainer : theme.pauseContainer;

  return (
    <Pressable onPress={onPress}>
      <Animated.View sharedTransitionTag={`decision-card-${decision.id}`}>
        <GlassPanel style={{ padding: 18, marginBottom: 12, backgroundColor: theme.surfaceRaised }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text style={{ color: theme.text, fontFamily: typography.family.bold, fontSize: 20 }}>{decision.title}</Text>
              <Text numberOfLines={2} style={{ color: theme.textMuted, fontFamily: typography.family.body, fontSize: 13, marginTop: 6, lineHeight: 20 }}>
                {t(decision.verdict.narrativeKey)}
              </Text>
            </View>
            <View
              style={{
                minWidth: 78,
                borderRadius: 999,
                backgroundColor: verdictContainer,
                borderWidth: 1,
                borderColor: theme.borderSoft,
                paddingHorizontal: 12,
                paddingVertical: 7,
              }}
            >
              <Text style={{ color: verdictColor, textAlign: "center", fontFamily: typography.family.bold, fontSize: 12 }}>{t(`result.bias${decision.verdict.kind.charAt(0).toUpperCase()}${decision.verdict.kind.slice(1)}`)}</Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", gap: 14, marginTop: 16 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Clock3 color={theme.textSoft} size={14} />
              <Text style={{ color: theme.textSoft, fontFamily: typography.family.medium, fontSize: 12 }}>{formatDateLabel(decision.createdAt, i18n.language)}</Text>
            </View>
            {decision.price ? (
              <Text style={{ color: theme.textSoft, fontFamily: typography.family.medium, fontSize: 12 }}>
                {t("result.pricedAt", { value: formatMoney(decision.price, i18n.language, decision.currency ?? "USD") })}
              </Text>
            ) : null}
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
            <View style={{ flexDirection: "row", gap: 6, flex: 1 }}>
              <View style={{ flex: decision.verdict.prosScore || 1, height: 8, borderRadius: 999, backgroundColor: theme.yes }} />
              <View style={{ flex: decision.verdict.consScore || 1, height: 8, borderRadius: 999, backgroundColor: theme.no }} />
            </View>
            <ArrowUpRight color={theme.text} size={18} style={{ marginLeft: 16 }} />
          </View>
        </GlassPanel>
      </Animated.View>
    </Pressable>
  );
}
