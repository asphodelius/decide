import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { StyleSheet, useColorScheme } from "react-native";
import * as SystemUI from "expo-system-ui";
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import { buildTheme, type AppTheme } from "@/theme/colors";
import { useAppStore } from "@/store/useAppStore";

interface ThemeContextValue {
  theme: AppTheme;
  resolvedMode: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const preference = useAppStore((state) => state.settings.themePreference);
  const accentTone = useAppStore((state) => state.settings.accentTone);
  const systemScheme = useColorScheme();
  const resolvedMode = preference === "system" ? (systemScheme === "light" ? "light" : "dark") : preference;
  const theme = useMemo(() => buildTheme(resolvedMode, accentTone), [accentTone, resolvedMode]);
  const transition = useSharedValue(1);
  const [backdropTransition, setBackdropTransition] = useState({ from: theme.backdrop, to: theme.backdrop });
  const previousBackdrop = useRef(theme.backdrop);

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(theme.backdrop).catch(() => null);
  }, [theme.backdrop]);

  useEffect(() => {
    if (previousBackdrop.current === theme.backdrop) {
      return;
    }

    setBackdropTransition({ from: previousBackdrop.current, to: theme.backdrop });
    transition.value = 0;
    transition.value = withTiming(1, { duration: 260 });
    previousBackdrop.current = theme.backdrop;
  }, [theme.backdrop, transition]);

  const containerStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(transition.value, [0, 1], [backdropTransition.from, backdropTransition.to]),
  }));

  return (
    <ThemeContext.Provider value={{ theme, resolvedMode }}>
      <Animated.View style={[styles.container, containerStyle]}>
        {children}
      </Animated.View>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
