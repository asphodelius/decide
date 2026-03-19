import { useEffect, useState } from "react";
import { LayoutChangeEvent, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from "react-native-reanimated";
import { useTranslation } from "react-i18next";

import type { DecisionVerdict } from "@/store/types";
import { useTheme } from "@/theme/provider";
import { typography } from "@/theme/typography";

interface BalanceMeterProps {
  verdict: DecisionVerdict;
}

export function BalanceMeter({ verdict }: BalanceMeterProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const progress = useSharedValue(0);
  const [trackWidth, setTrackWidth] = useState(0);

  useEffect(() => {
    progress.value = withDelay(180, withTiming((verdict.score + 100) / 200, { duration: 800 }));
  }, [progress, verdict.score]);

  const handleTrackLayout = ({ nativeEvent }: LayoutChangeEvent) => {
    setTrackWidth(nativeEvent.layout.width);
  };

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withTiming(progress.value * Math.max(trackWidth - 18, 0), {
          duration: 800,
        }),
      },
    ],
  }));

  return (
    <View>
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 12 }}>
        <Text style={{ color: theme.yes, fontFamily: typography.family.bold, fontSize: 12, letterSpacing: 1.2 }}>{t("result.balanceYes").toUpperCase()}</Text>
        <Text style={{ color: theme.no, fontFamily: typography.family.bold, fontSize: 12, letterSpacing: 1.2 }}>{t("result.balanceNo").toUpperCase()}</Text>
      </View>
      <View
        style={{
          minHeight: 104,
          borderRadius: 28,
          overflow: "hidden",
          backgroundColor: theme.surfaceSunken,
          paddingHorizontal: 18,
          paddingVertical: 18,
        }}
      >
        <View style={{ justifyContent: "center", minHeight: 42 }}>
          <View onLayout={handleTrackLayout} style={{ flexDirection: "row", gap: 8 }}>
            <View style={{ flex: verdict.prosScore || 1, height: 12, borderRadius: 999, backgroundColor: theme.yes }} />
            <View style={{ flex: verdict.consScore || 1, height: 12, borderRadius: 999, backgroundColor: theme.no }} />
          </View>
          <Animated.View
            style={[
              {
                position: "absolute",
                left: 0,
                top: "50%",
                marginTop: -18,
                width: 18,
                height: 36,
                borderRadius: 999,
                backgroundColor: theme.surfaceRaised,
                borderWidth: 1,
                borderColor: theme.border,
              },
              indicatorStyle,
            ]}
          />
        </View>
        <View style={{ marginTop: 16, alignItems: "center" }}>
          <Text style={{ color: theme.textMuted, fontFamily: typography.family.medium, fontSize: 14 }}>
            {t("result.scoreLabel", { score: verdict.score > 0 ? `+${verdict.score}` : verdict.score })}
          </Text>
        </View>
      </View>
    </View>
  );
}
