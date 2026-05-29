import { Ionicons } from "@expo/vector-icons";

export type SettingsItemBase = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  subtitle?: string;
};

export type ToggleItem = SettingsItemBase & {
  type: "toggle";
  stateKey: string;
};

export type NavigationItem = SettingsItemBase & {
  type: "nav";
  onPress?: () => void;
};

export type InfoItem = SettingsItemBase & {
  type: "info";
  value: string;
};

export type SettingsItem = ToggleItem | NavigationItem | InfoItem;

export type SettingsSection = {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  items: SettingsItem[];
};
