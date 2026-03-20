import { Platform, PlatformColor, type ColorValue } from "react-native";

import type { AccentTone } from "@/store/types";

export type ThemeMode = "light" | "dark";
export type ThemeColor = ColorValue;

interface AccentPalette {
  base: ThemeColor;
  onBase: ThemeColor;
  container: ThemeColor;
  onContainer: ThemeColor;
  subtle: ThemeColor;
  outline: ThemeColor;
}

type SurfacePalette = {
  backdrop: string;
  background: string;
  surface: string;
  surfaceRaised: string;
  surfaceSunken: string;
  border: string;
  borderSoft: string;
  text: string;
  textMuted: string;
  textSoft: string;
  shadow: string;
  washA: string;
  washB: string;
  washC: string;
  yes: string;
  yesContainer: string;
  no: string;
  noContainer: string;
  pause: string;
  pauseContainer: string;
};

type StaticAccentTone = Exclude<AccentTone, "material_you" | "asphodelius">;

const alpha = (hex: string, value: string) => `${hex}${value}`;

const fixedAccents: Record<StaticAccentTone, AccentPalette> = {
  ice: {
    base: "#6D8CFF",
    onBase: "#FFFFFF",
    container: "#DDE5FF",
    onContainer: "#21326D",
    subtle: "#EEF2FF",
    outline: alpha("#6D8CFF", "44"),
  },
  ember: {
    base: "#B8682E",
    onBase: "#FFFFFF",
    container: "#FFDCC4",
    onContainer: "#522200",
    subtle: "#FFF1E7",
    outline: alpha("#B8682E", "44"),
  },
  mint: {
    base: "#2E7D68",
    onBase: "#FFFFFF",
    container: "#BDEDDD",
    onContainer: "#03382A",
    subtle: "#E7F7F1",
    outline: alpha("#2E7D68", "44"),
  },
  rose: {
    base: "#A44D72",
    onBase: "#FFFFFF",
    container: "#FFD8E6",
    onContainer: "#4A102B",
    subtle: "#FFF0F5",
    outline: alpha("#A44D72", "44"),
  },
};

const defaultSurfaces: Record<ThemeMode, SurfacePalette> = {
  dark: {
    backdrop: "#11131A",
    background: "#151821",
    surface: "#1B1F29",
    surfaceRaised: "#232835",
    surfaceSunken: "#161A22",
    border: "#313848",
    borderSoft: "#252B38",
    text: "#F2F3F7",
    textMuted: "#C1C7D3",
    textSoft: "#8B94A6",
    shadow: "rgba(0, 0, 0, 0.18)",
    washA: "rgba(136, 160, 255, 0.10)",
    washB: "rgba(103, 198, 170, 0.07)",
    washC: "rgba(255, 190, 132, 0.05)",
    yes: "#7BD4A8",
    yesContainer: "#14392B",
    no: "#F0A2A2",
    noContainer: "#442526",
    pause: "#F2CA72",
    pauseContainer: "#4A3914",
  },
  light: {
    backdrop: "#F7F7FB",
    background: "#FBFBFF",
    surface: "#FFFFFF",
    surfaceRaised: "#F1F3F9",
    surfaceSunken: "#ECEEF5",
    border: "#D9DDE8",
    borderSoft: "#E9ECF3",
    text: "#161C26",
    textMuted: "#5C6677",
    textSoft: "#7F8898",
    shadow: "rgba(20, 28, 46, 0.08)",
    washA: "rgba(109, 140, 255, 0.10)",
    washB: "rgba(46, 125, 104, 0.07)",
    washC: "rgba(184, 104, 46, 0.06)",
    yes: "#2A8E61",
    yesContainer: "#D9F2E7",
    no: "#B85C63",
    noContainer: "#FADDE0",
    pause: "#A87B17",
    pauseContainer: "#F5E7B8",
  },
};

const asphodeliusSurfaces: Record<ThemeMode, SurfacePalette> = {
  dark: {
    backdrop: "#050505",
    background: "#0A0A0A",
    surface: "#0D0D0F",
    surfaceRaised: "#111114",
    surfaceSunken: "#09090C",
    border: "rgba(255, 255, 255, 0.10)",
    borderSoft: "rgba(255, 255, 255, 0.06)",
    text: "#F7F2EA",
    textMuted: "#C9C0B3",
    textSoft: "#93897D",
    shadow: "rgba(0, 0, 0, 0.30)",
    washA: "rgba(243, 213, 159, 0.10)",
    washB: "rgba(245, 167, 203, 0.09)",
    washC: "rgba(141, 195, 255, 0.09)",
    yes: "#8FD7B4",
    yesContainer: "#10261D",
    no: "#FFB3C8",
    noContainer: "#34131D",
    pause: "#F3D59F",
    pauseContainer: "#3B2A12",
  },
  light: {
    backdrop: "#F5EFE7",
    background: "#FBF7F1",
    surface: "#FFFDF9",
    surfaceRaised: "#F6EFE6",
    surfaceSunken: "#EFE7DD",
    border: "#E4DACD",
    borderSoft: "#EEE6DC",
    text: "#171311",
    textMuted: "#6E6257",
    textSoft: "#8D8176",
    shadow: "rgba(34, 20, 9, 0.10)",
    washA: "rgba(243, 213, 159, 0.18)",
    washB: "rgba(245, 167, 203, 0.14)",
    washC: "rgba(141, 195, 255, 0.14)",
    yes: "#2F7A5B",
    yesContainer: "#D8EEE1",
    no: "#C56A8B",
    noContainer: "#F4DCE5",
    pause: "#A67B2D",
    pauseContainer: "#F4E6C5",
  },
};

function getMaterialYouAccent(mode: ThemeMode): AccentPalette | null {
  if (Platform.OS !== "android" || Number(Platform.Version) < 31) {
    return null;
  }

  return {
    base: PlatformColor(mode === "dark" ? "@android:color/system_accent1_300" : "@android:color/system_accent1_600"),
    onBase: mode === "dark" ? "#122019" : "#FFFFFF",
    container: PlatformColor(mode === "dark" ? "@android:color/system_accent1_800" : "@android:color/system_accent1_100"),
    onContainer: mode === "dark" ? "#EEF8F2" : "#1A1F1B",
    subtle: PlatformColor(mode === "dark" ? "@android:color/system_accent2_900" : "@android:color/system_accent2_50"),
    outline: PlatformColor(mode === "dark" ? "@android:color/system_accent2_300" : "@android:color/system_accent2_500"),
  };
}

function getAsphodeliusAccent(mode: ThemeMode): AccentPalette {
  if (mode === "dark") {
    return {
      base: "#E8E3D9",
      onBase: "#0A0A0A",
      container: "#1A1715",
      onContainer: "#F7F2EA",
      subtle: "rgba(232, 227, 217, 0.10)",
      outline: "rgba(232, 227, 217, 0.22)",
    };
  }

  return {
    base: "#171311",
    onBase: "#F8F3EC",
    container: "#E8E0D3",
    onContainer: "#171311",
    subtle: "#F4EEE5",
    outline: "rgba(23, 19, 17, 0.14)",
  };
}

function getFixedAccent(mode: ThemeMode, accentTone: AccentTone): AccentPalette {
  if (accentTone === "asphodelius") {
    return getAsphodeliusAccent(mode);
  }

  if (accentTone === "material_you") {
    return fixedAccents.ice;
  }

  return fixedAccents[accentTone];
}

function getSurfaceSet(mode: ThemeMode, accentTone: AccentTone): SurfacePalette {
  if (accentTone === "asphodelius") {
    return asphodeliusSurfaces[mode];
  }

  return defaultSurfaces[mode];
}

export interface AppTheme {
  mode: ThemeMode;
  accentTone: AccentTone;
  usesDynamicAccent: boolean;
  accent: AccentPalette;
  backdrop: string;
  background: string;
  surface: string;
  surfaceRaised: string;
  surfaceSunken: string;
  surfaceAccent: ThemeColor;
  border: string;
  borderSoft: string;
  text: string;
  textMuted: string;
  textSoft: string;
  shadow: string;
  washA: string;
  washB: string;
  washC: string;
  yes: string;
  yesContainer: string;
  no: string;
  noContainer: string;
  pause: string;
  pauseContainer: string;
}

export function buildTheme(mode: ThemeMode, accentTone: AccentTone): AppTheme {
  const surfaceSet = getSurfaceSet(mode, accentTone);
  const dynamicAccent = accentTone === "material_you" ? getMaterialYouAccent(mode) : null;
  const accent = dynamicAccent ?? getFixedAccent(mode, accentTone);

  return {
    mode,
    accentTone,
    usesDynamicAccent: Boolean(dynamicAccent),
    accent,
    ...surfaceSet,
    surfaceAccent: accent.subtle,
  };
}
