import { MaterialIcons } from "@expo/vector-icons";
import { Linking, Platform, Pressable, Switch, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { AppShell } from "@/components/AppShell";
import { GlassPanel } from "@/components/GlassPanel";
import { ScreenHeader } from "@/components/ScreenHeader";
import { SegmentedControl } from "@/components/SegmentedControl";
import { setDynamicAppIconEnabled, supportsDynamicAppIconToggle } from "@/lib/app-icon";
import { useAppStore } from "@/store/useAppStore";
import type { AccentTone, AppLanguage, ThemePreference } from "@/store/types";
import { useTheme } from "@/theme/provider";
import { typography } from "@/theme/typography";

const ACCENTS: AccentTone[] = ["material_you", "asphodelius", "ice", "ember", "mint", "rose"];

export default function SettingsScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const language = useAppStore((state) => state.settings.language);
  const themePreference = useAppStore((state) => state.settings.themePreference);
  const accentTone = useAppStore((state) => state.settings.accentTone);
  const dynamicAppIcon = useAppStore((state) => state.settings.dynamicAppIcon);
  const setLanguage = useAppStore((state) => state.setLanguage);
  const setThemePreference = useAppStore((state) => state.setThemePreference);
  const setAccentTone = useAppStore((state) => state.setAccentTone);
  const setDynamicAppIcon = useAppStore((state) => state.setDynamicAppIcon);

  const canToggleDynamicIcon = supportsDynamicAppIconToggle();
  const handlePortfolioOpen = () => {
    Linking.openURL("https://asphodelius.dev").catch(() => null);
  };
  const handleRepositoryOpen = () => {
    Linking.openURL("https://github.com/asphodelius/decide").catch(() => null);
  };

  const handleDynamicIconToggle = (value: boolean) => {
    setDynamicAppIcon(value);
    setDynamicAppIconEnabled(value).catch(() => {
      setDynamicAppIcon(!value);
    });
  };

  return (
    <AppShell scroll contentContainerStyle={{ gap: 18 }}>
      <ScreenHeader title={t("settings.headline")} showBack />

      <GlassPanel style={{ padding: 18, backgroundColor: theme.surfaceRaised }}>
        <Text style={{ color: theme.text, fontFamily: typography.family.bold, fontSize: 18, marginBottom: 14 }}>{t("settings.languageTitle")}</Text>
        <SegmentedControl<AppLanguage>
          value={language}
          onChange={setLanguage}
          options={[
            { value: "en", label: t("languageOptions.en") },
            { value: "ru", label: t("languageOptions.ru") },
          ]}
        />
      </GlassPanel>

      <GlassPanel style={{ padding: 18, backgroundColor: theme.surfaceRaised }}>
        <Text style={{ color: theme.text, fontFamily: typography.family.bold, fontSize: 18, marginBottom: 14 }}>{t("settings.themeTitle")}</Text>
        <SegmentedControl<ThemePreference>
          value={themePreference}
          onChange={setThemePreference}
          options={[
            { value: "dark", label: t("common.dark") },
            { value: "light", label: t("common.light") },
            { value: "system", label: t("common.system") },
          ]}
        />
      </GlassPanel>

      <GlassPanel style={{ padding: 18, backgroundColor: theme.surfaceRaised }}>
        <Text style={{ color: theme.text, fontFamily: typography.family.bold, fontSize: 18 }}>{t("settings.accentTitle")}</Text>
        <View style={{ gap: 10, marginTop: 16 }}>
          {ACCENTS.map((accent) => {
            const active = accentTone === accent;
            const isDynamic = accent === "material_you";
            const swatchColor =
              isDynamic && Platform.OS === "android"
                ? theme.accent.base
                : accent === "asphodelius"
                  ? "#E8E3D9"
                : accent === "ice"
                  ? "#6D8CFF"
                  : accent === "ember"
                    ? "#B8682E"
                    : accent === "mint"
                      ? "#2E7D68"
                      : "#A44D72";
            return (
              <Pressable key={accent} onPress={() => setAccentTone(accent)}>
                <View
                  style={{
                    minHeight: 78,
                    borderRadius: 24,
                    backgroundColor: active ? theme.accent.container : theme.surfaceSunken,
                    borderWidth: 1,
                    borderColor: active ? theme.border : theme.borderSoft,
                    padding: 14,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                    <View style={{ width: 18, height: 18, borderRadius: 999, backgroundColor: swatchColor as never }} />
                    <View>
                      <Text style={{ color: active ? theme.accent.onContainer : theme.text, fontFamily: typography.family.bold, fontSize: 14 }}>{t(`themeOptions.${accent}`)}</Text>
                      {isDynamic ? (
                        <Text style={{ color: active ? theme.accent.onContainer : theme.textMuted, fontFamily: typography.family.body, fontSize: 12, marginTop: 2 }}>
                            {Platform.OS === "android" ? t("settings.accentDynamicAndroid") : t("settings.accentDynamicFallback")}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                    {active ? <Text style={{ color: active ? theme.accent.onContainer : theme.textMuted, fontFamily: typography.family.bold, fontSize: 12 }}>{t("common.active").toUpperCase()}</Text> : null}
                </View>
              </Pressable>
            );
          })}
        </View>
      </GlassPanel>

      {canToggleDynamicIcon ? (
        <GlassPanel style={{ padding: 18, backgroundColor: theme.surfaceRaised }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: theme.text, fontFamily: typography.family.bold, fontSize: 18 }}>{t("settings.dynamicIconTitle")}</Text>
            </View>
            <Switch
              value={dynamicAppIcon}
              onValueChange={handleDynamicIconToggle}
              trackColor={{ false: theme.surfaceSunken, true: theme.accent.container }}
              thumbColor={dynamicAppIcon ? theme.accent.base : theme.textMuted}
            />
          </View>
        </GlassPanel>
      ) : null}

      <GlassPanel style={{ padding: 18, backgroundColor: theme.surfaceRaised }}>
        <Text style={{ color: theme.text, fontFamily: typography.family.bold, fontSize: 18 }}>{t("settings.madeByTitle")}</Text>

        <Pressable onPress={handlePortfolioOpen} style={{ marginTop: 16 }}>
          <SettingsLinkCard
            title="Asphodelius"
            value="asphodelius.dev"
            icon="public"
          />
        </Pressable>

        <Pressable onPress={handleRepositoryOpen} style={{ marginTop: 12 }}>
          <SettingsLinkCard
            title={t("settings.repositoryLabel")}
            value="github.com/asphodelius/decide"
            icon="code"
          />
        </Pressable>
      </GlassPanel>

    </AppShell>
  );
}

function SettingsLinkCard({ title, value, icon }: { title: string; value: string; icon: keyof typeof MaterialIcons.glyphMap }) {
  const { theme } = useTheme();

  return (
    <View
      style={{
        minHeight: 72,
        borderRadius: 24,
        backgroundColor: theme.surfaceSunken,
        borderWidth: 1,
        borderColor: theme.borderSoft,
        paddingHorizontal: 14,
        paddingVertical: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12, flex: 1 }}>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: theme.accent.container,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MaterialIcons name={icon} size={20} color={theme.accent.onContainer} />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={{ color: theme.text, fontFamily: typography.family.bold, fontSize: 14 }}>{title}</Text>
          <Text style={{ color: theme.accent.base, fontFamily: typography.family.medium, fontSize: 13, marginTop: 3 }}>{value}</Text>
        </View>
      </View>

      <MaterialIcons name="open-in-new" size={18} color={theme.textSoft} />
    </View>
  );
}
