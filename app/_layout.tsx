import "@/lib/i18n";
import "react-native-reanimated";

import { useEffect, useRef } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { SpaceGrotesk_400Regular, SpaceGrotesk_500Medium, SpaceGrotesk_700Bold } from "@expo-google-fonts/space-grotesk";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import i18n from "@/lib/i18n";
import { setDynamicAppIconEnabled, supportsDynamicAppIconToggle } from "@/lib/app-icon";
import { ThemeProvider, useTheme } from "@/theme/provider";
import { useAppStore } from "@/store/useAppStore";

void SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({
  duration: 180,
  fade: true,
});

function Navigator() {
  const { resolvedMode } = useTheme();
  const language = useAppStore((state) => state.settings.language);
  const dynamicAppIcon = useAppStore((state) => state.settings.dynamicAppIcon);
  const didHideSplash = useRef(false);
  useFonts({
    SpaceGrotesk_400Regular,
    SpaceGrotesk_500Medium,
    SpaceGrotesk_700Bold,
  });

  useEffect(() => {
    i18n.changeLanguage(language).catch(() => null);
  }, [language]);

  useEffect(() => {
    if (!supportsDynamicAppIconToggle()) {
      return;
    }

    setDynamicAppIconEnabled(dynamicAppIcon).catch(() => null);
  }, [dynamicAppIcon]);

  useEffect(() => {
    if (didHideSplash.current) {
      return;
    }

    didHideSplash.current = true;

    const timeout = setTimeout(() => {
      void SplashScreen.hideAsync();
    }, 60);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <StatusBar style={resolvedMode === "dark" ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "fade_from_bottom",
          contentStyle: {
            backgroundColor: "transparent",
          },
        }}
      />
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <Navigator />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
