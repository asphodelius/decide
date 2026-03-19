import type { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";

import { GlassPanel } from "@/components/GlassPanel";
import { useTheme } from "@/theme/provider";
import { typography } from "@/theme/typography";

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  right?: ReactNode;
}

export function ScreenHeader({ title, subtitle, showBack, right }: ScreenHeaderProps) {
  const router = useRouter();
  const { theme } = useTheme();

  return (
    <View style={{ marginBottom: 18, flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" }}>
      <View style={{ flexDirection: "row", alignItems: "center", flex: 1, gap: 12 }}>
        {showBack ? (
          <Pressable onPress={() => router.back()}>
            <GlassPanel style={{ width: 44, height: 44, alignItems: "center", justifyContent: "center", borderRadius: 16, backgroundColor: theme.surfaceRaised }}>
              <ChevronLeft color={theme.text} size={20} />
            </GlassPanel>
          </Pressable>
        ) : null}
        <View style={{ flex: 1 }}>
          <Text style={{ color: theme.text, fontFamily: typography.family.bold, fontSize: 24 }}>{title}</Text>
          {subtitle ? <Text style={{ color: theme.textMuted, fontFamily: typography.family.body, fontSize: 13, marginTop: 4 }}>{subtitle}</Text> : null}
        </View>
      </View>
      {right}
    </View>
  );
}
