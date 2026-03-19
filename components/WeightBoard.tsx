import { Pressable, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Trash2 } from "lucide-react-native";
import { useTranslation } from "react-i18next";

import { DiscreteWeightSlider } from "@/components/DiscreteWeightSlider";
import type { DecisionFactor, EmotionTag, FactorKind } from "@/store/types";
import { GlassPanel } from "@/components/GlassPanel";
import { useTheme } from "@/theme/provider";
import { typography } from "@/theme/typography";

const EMOTION_TAGS: EmotionTag[] = ["logic", "desire", "fear", "comfort", "growth", "status"];
const EMOTION_ICONS: Record<EmotionTag, React.ComponentProps<typeof MaterialIcons>["name"]> = {
  logic: "psychology-alt",
  desire: "favorite",
  fear: "warning-amber",
  comfort: "weekend",
  growth: "trending-up",
  status: "diamond",
};

interface WeightBoardProps {
  pros: DecisionFactor[];
  cons: DecisionFactor[];
  onWeightChange: (kind: FactorKind, id: string, weight: number) => void;
  onTagChange: (kind: FactorKind, id: string, tag: EmotionTag | null) => void;
  onRemove: (kind: FactorKind, id: string) => void;
}

export function WeightBoard({ pros, cons, onWeightChange, onTagChange, onRemove }: WeightBoardProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <View style={{ gap: 16 }}>
      <Text style={{ color: theme.text, fontFamily: typography.family.bold, fontSize: 26 }}>{t("create.weightsStep")}</Text>
      <Text style={{ color: theme.textMuted, fontFamily: typography.family.body, fontSize: 14, lineHeight: 21 }}>{t("create.weightsHint")}</Text>
      {[{ kind: "pro" as const, label: t("common.pros"), items: pros }, { kind: "con" as const, label: t("common.cons"), items: cons }].map((group) => (
        <View key={group.kind} style={{ gap: 10 }}>
          <Text style={{ color: theme.textMuted, fontFamily: typography.family.bold, fontSize: 12, letterSpacing: 1.4 }}>{group.label.toUpperCase()}</Text>
          {group.items.map((item) => (
            <GlassPanel key={item.id} style={{ padding: 16, backgroundColor: theme.surfaceRaised }}>
              <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: theme.text, fontFamily: typography.family.medium, fontSize: 16 }}>{item.text}</Text>
                </View>
                <Pressable onPress={() => onRemove(group.kind, item.id)}>
                  <Trash2 color={theme.textSoft} size={16} />
                </Pressable>
              </View>
              <View style={{ marginTop: 18 }}>
                <DiscreteWeightSlider value={item.weight} onChange={(weight) => onWeightChange(group.kind, item.id, weight)} />
              </View>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
                {EMOTION_TAGS.map((tag) => {
                  const active = item.tag === tag;
                  return (
                    <Pressable key={tag} onPress={() => onTagChange(group.kind, item.id, active ? null : tag)}>
                      <View
                      style={{
                        borderRadius: 999,
                        paddingHorizontal: 12,
                        paddingVertical: 9,
                        backgroundColor: active ? theme.accent.container : theme.surfaceSunken,
                        borderWidth: 1,
                        borderColor: active ? theme.border : "transparent",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                        <MaterialIcons
                          color={active ? theme.accent.onContainer : theme.textSoft}
                          name={EMOTION_ICONS[tag]}
                          size={16}
                        />
                        <Text style={{ color: active ? theme.accent.onContainer : theme.textSoft, fontFamily: typography.family.medium, fontSize: 12 }}>{t(`emotionTags.${tag}`)}</Text>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </GlassPanel>
          ))}
        </View>
      ))}
    </View>
  );
}
