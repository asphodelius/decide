import { StyleSheet, View } from "react-native";

import { useTheme } from "@/theme/provider";

export function AnimatedBackground() {
  const { theme } = useTheme();

  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: theme.background }]}>
      <View style={[styles.orb, styles.orbTop, { backgroundColor: theme.washA }]} />
      <View style={[styles.orb, styles.orbRight, { backgroundColor: theme.washB }]} />
      <View style={[styles.orb, styles.orbBottom, { backgroundColor: theme.washC }]} />
      <View style={[styles.veil, { borderColor: theme.borderSoft, backgroundColor: theme.surfaceAccent }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  orb: {
    position: "absolute",
    borderRadius: 999,
  },
  orbTop: {
    width: 280,
    height: 280,
    top: -108,
    left: -72,
  },
  orbRight: {
    width: 320,
    height: 320,
    top: 140,
    right: -138,
  },
  orbBottom: {
    width: 340,
    height: 340,
    bottom: -160,
    left: 28,
  },
  veil: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    opacity: 0.24,
  },
});
