import { Colors } from "@/constants/colors";
import { Text, View } from "react-native";

type Props = {
  description: string | null;
};

export function RoomDescriptionCard({ description }: Props) {
  return (
    <View
      className="rounded-[24px] p-5"
      style={{
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
        shadowColor: "#000",
        shadowOpacity: 0.04,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
      }}
    >
      <Text
        className="text-[18px] font-bold"
        style={{ color: Colors.textPrimary }}
      >
        Mô tả phòng
      </Text>

      <Text
        className="mt-3 text-[15px] leading-7"
        style={{ color: Colors.textSecondary }}
      >
        {description?.trim() || "Chưa có mô tả cho phòng này."}
      </Text>
    </View>
  );
}
