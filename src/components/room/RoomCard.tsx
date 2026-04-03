import { AppButton } from "@/components/AppButton";
import { RoomOccupancyBar } from "@/components/room/RoomOccupancyBar";
import { RoomStatusBadge } from "@/components/room/RoomStatusBadge";
import { Colors } from "@/constants/colors";
import { RoomItem } from "@/services/room.api";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

type Props = {
  item: RoomItem;
  onPressDetails: () => void;
  onPressChangeStatus: () => void;
};

export function RoomCard({ item, onPressDetails, onPressChangeStatus }: Props) {
  return (
    <View
      className="rounded-[24px] px-5 py-5"
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
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-3">
          <Text
            className="text-[18px] font-bold"
            style={{ color: Colors.textPrimary }}
          >
            Phòng {item.name}
          </Text>

          <View className="mt-2 flex-row items-center">
            <Ionicons
              name="business-outline"
              size={16}
              color={Colors.textSecondary}
            />
            <Text
              className="ml-2 text-[14px]"
              style={{ color: Colors.textSecondary }}
            >
              {item.buildingName} • Tầng {item.floor}
            </Text>
          </View>
        </View>

        <RoomStatusBadge status={item.roomStatus} />
      </View>

      <View className="mt-5 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <View
            className="mr-3 rounded-2xl px-3 py-2"
            style={{ backgroundColor: "#F1F5F9" }}
          >
            <Ionicons
              name="people-outline"
              size={18}
              color={Colors.textSecondary}
            />
          </View>

          <Text
            className="text-[15px] font-medium"
            style={{ color: Colors.textSecondary }}
          >
            {item.occupiedCount} / {item.capacity} đã ở
          </Text>
        </View>

        <Text
          className="text-[15px] font-bold"
          style={{ color: Colors.textPrimary }}
        >
          {item.occupancyPercent}%
        </Text>
      </View>

      <View className="mt-4">
        <RoomOccupancyBar percent={item.occupancyPercent} />
      </View>

      <View
        className="my-5 h-[1px]"
        style={{ backgroundColor: Colors.border }}
      />

      <View className="flex-row gap-3">
        <Pressable
          onPress={onPressChangeStatus}
          className="flex-1 h-[48px] items-center justify-center rounded-2xl"
          style={{
            backgroundColor: Colors.surface,
            borderWidth: 1,
            borderColor: Colors.border,
          }}
        >
          <Text
            className="text-[15px] font-bold"
            style={{ color: Colors.textSecondary }}
          >
            Đổi trạng thái
          </Text>
        </Pressable>

        <View className="flex-1">
          <AppButton title="Xem chi tiết" onPress={onPressDetails} />
        </View>
      </View>
    </View>
  );
}
