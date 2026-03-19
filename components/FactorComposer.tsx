import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import * as Haptics from "expo-haptics";
import { Plus, X } from "lucide-react-native";

import type { DecisionFactor } from "@/store/types";
import { GlassPanel } from "@/components/GlassPanel";
import { useTheme } from "@/theme/provider";
import { typography } from "@/theme/typography";

interface FactorComposerProps {
  title: string;
  hint: string;
  placeholder: string;
  actionLabel: string;
  factors: DecisionFactor[];
  onAdd: (value: string) => void;
  onRemove: (id: string) => void;
}

export function FactorComposer({ title, hint, placeholder, actionLabel, factors, onAdd, onRemove }: FactorComposerProps) {
  const { theme } = useTheme();
  const [value, setValue] = useState("");

  const handleAdd = async () => {
    if (!value.trim()) {
      return;
    }

    await Haptics.selectionAsync();
    onAdd(value);
    setValue("");
  };

  return (
    <View style={{ gap: 18 }}>
      <View>
        <Text style={{ color: theme.text, fontFamily: typography.family.bold, fontSize: 26 }}>{title}</Text>
        <Text style={{ color: theme.textMuted, fontFamily: typography.family.body, fontSize: 14, marginTop: 8, lineHeight: 21 }}>{hint}</Text>
      </View>

      <GlassPanel style={{ padding: 18, backgroundColor: theme.surfaceRaised }}>
        <TextInput
          value={value}
          onChangeText={setValue}
          placeholder={placeholder}
          placeholderTextColor={theme.textSoft}
          multiline
          style={{
            minHeight: 120,
            color: theme.text,
            fontFamily: typography.family.medium,
            fontSize: 20,
            lineHeight: 28,
            textAlignVertical: "top",
          }}
        />
        <Pressable onPress={handleAdd}>
          <View
            style={{
              marginTop: 18,
              borderRadius: 20,
              paddingVertical: 14,
              paddingHorizontal: 16,
              backgroundColor: theme.accent.container,
              borderWidth: 1,
              borderColor: theme.borderSoft,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <Plus color={theme.accent.onContainer} size={16} />
            <Text style={{ color: theme.accent.onContainer, fontFamily: typography.family.bold, fontSize: 14 }}>{actionLabel}</Text>
          </View>
        </Pressable>
      </GlassPanel>

      <View style={{ gap: 10 }}>
        {factors.map((item) => (
          <GlassPanel key={item.id} style={{ padding: 16, flexDirection: "row", alignItems: "center", backgroundColor: theme.surfaceRaised }}>
            <Text style={{ color: theme.text, fontFamily: typography.family.medium, fontSize: 15, flex: 1, paddingRight: 10 }}>{item.text}</Text>
            <Pressable onPress={() => onRemove(item.id)}>
              <View style={{ width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center", backgroundColor: theme.surfaceSunken }}>
                <X color={theme.textMuted} size={16} />
              </View>
            </Pressable>
          </GlassPanel>
        ))}
      </View>
    </View>
  );
}
