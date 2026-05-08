import { Colors } from "@/constants/colors";
import { memo } from "react";
import { Text, View } from "react-native";

export const StudentRoomEmptyState = memo(function StudentRoomEmptyState() {
  return (
    <View
      className="mt-4 items-center rounded-[24px] p-6"
      style={{
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
      }}
    >
      <Text
        className="text-center text-[15px] font-medium"
        style={{ color: Colors.textSecondary }}
      >
        Không tìm thấy phòng nào phù hợp với bộ lọc.
      </Text>
    </View>
  );
});
