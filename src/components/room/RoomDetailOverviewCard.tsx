import { RoomOccupancyBar } from "@/components/room/RoomOccupancyBar";
import { RoomStatusBadge } from "@/components/room/RoomStatusBadge";
import { Colors } from "@/constants/colors";
import { RoomDetail } from "@/services/room.api";
import { formatCurrency } from "@/utils/room";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

type Props = {
  room: RoomDetail;
};

export function RoomDetailOverviewCard({ room }: Props) {
  const availableBeds = Math.max(room.capacity - room.occupiedCount, 0);

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
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-3">
          <Text
            className="text-[28px] font-extrabold"
            style={{ color: Colors.textPrimary }}
          >
            Phòng {room.name}
          </Text>

          <View className="mt-2 flex-row items-center">
            <Ionicons
              name="business-outline"
              size={16}
              color={Colors.textSecondary}
            />
            <Text
              className="ml-2 text-[15px]"
              style={{ color: Colors.textSecondary }}
            >
              {room.buildingName} • Tầng {room.floor}
            </Text>
          </View>
        </View>

        <RoomStatusBadge status={room.roomStatus} />
      </View>

      <View className="mt-6 flex-row items-center justify-between">
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

          <View>
            <Text
              className="text-[15px] font-bold"
              style={{ color: Colors.textPrimary }}
            >
              {room.occupiedCount} / {room.capacity} đã ở
            </Text>
            <Text
              className="mt-1 text-[14px]"
              style={{ color: Colors.textSecondary }}
            >
              {availableBeds} chỗ còn trống
            </Text>
          </View>
        </View>

        <Text
          className="text-[24px] font-extrabold"
          style={{ color: Colors.textPrimary }}
        >
          {room.occupancyPercent}%
        </Text>
      </View>

      <View className="mt-4">
        <RoomOccupancyBar percent={room.occupancyPercent} />
      </View>

      <View className="mt-5 gap-3">
        <View>
          <Text
            className="text-[13px] font-semibold"
            style={{ color: Colors.textSecondary }}
          >
            Loại phòng
          </Text>
          <Text
            className="mt-1 text-[16px] font-bold"
            style={{ color: Colors.textPrimary }}
          >
            {room.roomTypeName}
          </Text>
        </View>

        <View>
          <Text
            className="text-[13px] font-semibold"
            style={{ color: Colors.textSecondary }}
          >
            Giá cơ bản
          </Text>
          <Text
            className="mt-1 text-[16px] font-bold"
            style={{ color: Colors.textPrimary }}
          >
            {formatCurrency(room.basePrice)}
          </Text>
        </View>
      </View>
    </View>
  );
}
