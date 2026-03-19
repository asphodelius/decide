import type { PropsWithChildren } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { StyleSheet, View } from "react-native";

import { useTheme } from "@/theme/provider";

interface GlassPanelProps extends PropsWithChildren {
  style?: StyleProp<ViewStyle>;
  intensity?: number;
}

export function GlassPanel({ children, style, intensity = 26 }: GlassPanelProps) {
  const { theme } = useTheme();
  void intensity;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
          shadowColor: theme.shadow,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 28,
    overflow: "hidden",
    borderWidth: 1,
    shadowOpacity: 1,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 2,
  },
});
