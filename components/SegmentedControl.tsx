import { Pressable, Text, View } from "react-native";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";

import { GlassPanel } from "@/components/GlassPanel";
import { useTheme } from "@/theme/provider";
import { typography } from "@/theme/typography";

interface SegmentedControlProps<T extends string> {
  options: Array<{ value: T; label: string }>;
  value: T;
  onChange: (value: T) => void;
}

export function SegmentedControl<T extends string>({ options, value, onChange }: SegmentedControlProps<T>) {
  const { theme } = useTheme();

  return (
    <GlassPanel style={{ padding: 4, borderRadius: 22, backgroundColor: theme.surfaceSunken }}>
      <View style={{ flexDirection: "row", gap: 6 }}>
        {options.map((option) => (
          <SegmentItem key={option.value} active={option.value === value} label={option.label} onPress={() => onChange(option.value)} />
        ))}
      </View>
    </GlassPanel>
  );
}

function SegmentItem({ active, label, onPress }: { active: boolean; label: string; onPress: () => void }) {
  const { theme } = useTheme();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(active ? 1 : 0.985, { duration: 180 }) }],
    opacity: withTiming(active ? 1 : 0.86, { duration: 180 }),
  }));

  return (
    <Pressable onPress={onPress} style={{ flex: 1 }}>
      <Animated.View
        style={[
          {
            borderRadius: 18,
            paddingVertical: 14,
            paddingHorizontal: 12,
            alignItems: "center",
            backgroundColor: active ? theme.surfaceRaised : "transparent",
            borderWidth: 1,
            borderColor: active ? theme.border : "transparent",
          },
          animatedStyle,
        ]}
      >
        <Text style={{ color: active ? theme.text : theme.textMuted, fontFamily: active ? typography.family.bold : typography.family.medium, fontSize: 13 }}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
}
