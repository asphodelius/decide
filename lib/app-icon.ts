import { NativeModules, Platform } from "react-native";

type IconModeModuleType = {
  setDynamicEnabled: (enabled: boolean) => Promise<void>;
};

const iconModeModule = NativeModules.IconMode as IconModeModuleType | undefined;

export async function setDynamicAppIconEnabled(enabled: boolean) {
  if (Platform.OS !== "android" || !iconModeModule?.setDynamicEnabled) {
    return;
  }

  await iconModeModule.setDynamicEnabled(enabled);
}

export function supportsDynamicAppIconToggle() {
  return Platform.OS === "android";
}
