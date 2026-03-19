import Slider from "@react-native-community/slider";
import { Text, View } from "react-native";

import { useTheme } from "@/theme/provider";
import { typography } from "@/theme/typography";

interface DiscreteWeightSliderProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
}

export function DiscreteWeightSlider({ value, min = 1, max = 5, onChange }: DiscreteWeightSliderProps) {
  const { theme } = useTheme();
  const steps = Array.from({ length: max - min + 1 }, (_, index) => min + index);

  return (
    <View style={{ gap: 8 }}>
      <Slider
        value={value}
        minimumValue={min}
        maximumValue={max}
        step={1}
        onValueChange={onChange}
        minimumTrackTintColor={String(theme.accent.base)}
        maximumTrackTintColor={String(theme.surfaceSunken)}
        thumbTintColor={String(theme.accent.base)}
        style={{ width: "100%", height: 34, marginHorizontal: -6 }}
      />
      <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 8 }}>
        {steps.map((step) => (
          <Text
            key={step}
            style={{
              color: step === value ? theme.text : theme.textMuted,
              fontFamily: step === value ? typography.family.bold : typography.family.medium,
              fontSize: 13,
              minWidth: 18,
              textAlign: "center",
            }}
          >
            {step}
          </Text>
        ))}
      </View>
    </View>
  );
}
