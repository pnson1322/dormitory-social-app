import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value: string;
  iconBg: string;
  iconColor: string;
};

export function InfoRow({ icon, title, value, iconBg, iconColor }: Props) {
  return (
    <View className="flex-row items-center">
      <View
        className="mr-4 h-14 w-14 items-center justify-center rounded-2xl"
        style={{ backgroundColor: iconBg }}
      >
        <Ionicons name={icon} size={22} color={iconColor} />
      </View>

      <View className="flex-1">
        <Text className="text-sm font-bold uppercase text-textSecondary">
          {title}
        </Text>
        <Text className="mt-1 text-[18px] font-bold text-textPrimary">
          {value}
        </Text>
      </View>
    </View>
  );
}
