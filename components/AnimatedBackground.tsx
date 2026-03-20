import { StyleSheet, View } from "react-native";

import { useTheme } from "@/theme/provider";

export function AnimatedBackground() {
  const { theme } = useTheme();

  return <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: theme.background }]} />;
}
