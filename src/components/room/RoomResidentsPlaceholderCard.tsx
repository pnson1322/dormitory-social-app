import { Colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

export function RoomResidentsPlaceholderCard() {
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
        Cư dân hiện tại
      </Text>

      <View className="mt-4 flex-row items-start">
        <View
          className="mr-3 h-10 w-10 items-center justify-center rounded-full"
          style={{ backgroundColor: "#EFF6FF" }}
        >
          <Ionicons
            name="people-outline"
            size={20}
            color={Colors.primaryLight}
          />
        </View>

        <View className="flex-1">
          <Text
            className="text-[15px] font-medium"
            style={{ color: Colors.textPrimary }}
          >
            API hiện tại chưa trả danh sách cư dân
          </Text>
          <Text
            className="mt-1 text-[14px]"
            style={{ color: Colors.textSecondary }}
          >
            Khi backend bổ sung dữ liệu này, mình sẽ nối tiếp vào màn chi tiết
            phòng.
          </Text>
        </View>
      </View>
    </View>
  );
}
