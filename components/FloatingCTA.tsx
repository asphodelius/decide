import { Pressable, Text, View } from "react-native";
import type { LucideIcon } from "lucide-react-native";

import { useTheme } from "@/theme/provider";
import { typography } from "@/theme/typography";

interface FloatingCTAProps {
  label: string;
  onPress: () => void;
  icon: LucideIcon;
}

export function FloatingCTA({ label, onPress, icon: Icon }: FloatingCTAProps) {
  const { theme } = useTheme();

  return (
    <View style={{ position: "absolute", bottom: 30, left: 16, right: 16 }}>
      <Pressable onPress={onPress} style={{ borderRadius: 28, overflow: "hidden" }}>
        <View
          style={{
            paddingHorizontal: 22,
            paddingVertical: 18,
            borderRadius: 28,
            backgroundColor: theme.accent.base,
            borderWidth: 1,
            borderColor: theme.accent.outline,
          }}
        >
          <View key={label} style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, minWidth: 0 }}>
            <Icon color={theme.accent.onBase} size={18} />
            <Text style={{ color: theme.accent.onBase, fontFamily: typography.family.bold, fontSize: 15, flexShrink: 1, textAlign: "center" }}>{label}</Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
}
