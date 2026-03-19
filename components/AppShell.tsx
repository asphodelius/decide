import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AnimatedBackground } from "@/components/AnimatedBackground";

interface AppShellProps {
  children: ReactNode;
  scroll?: boolean;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export function AppShell({ children, scroll, contentContainerStyle }: AppShellProps) {
  return (
    <View style={styles.flex}>
      <AnimatedBackground />
      <SafeAreaView style={styles.flex} edges={["top", "left", "right", "bottom"]}>
        {scroll ? (
          <ScrollView
            style={styles.flex}
            contentContainerStyle={[
              {
                paddingHorizontal: 16,
                paddingTop: 8,
                paddingBottom: 128,
              },
              contentContainerStyle,
            ]}
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        ) : (
          <View style={styles.content}>{children}</View>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
});
