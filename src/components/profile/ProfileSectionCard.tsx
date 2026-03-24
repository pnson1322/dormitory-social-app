import { Colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { ReactNode } from "react";
import { Text, View } from "react-native";

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  children: ReactNode;
};

export function ProfileSectionCard({ icon, title, children }: Props) {
  return (
    <View
      className="rounded-[24px] bg-surface px-5 py-5"
      style={{ borderWidth: 1, borderColor: Colors.border }}
    >
      <View className="mb-4 flex-row items-center gap-2">
        <Ionicons name={icon} size={20} color={Colors.textSecondary} />
        <Text className="text-sm font-extrabold uppercase text-textSecondary">
          {title}
        </Text>
      </View>

      {children}
    </View>
  );
}
