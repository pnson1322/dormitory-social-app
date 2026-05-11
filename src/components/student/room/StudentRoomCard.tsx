import { RoomOccupancyBar } from "@/components/room/RoomOccupancyBar";
import { RoomStatusBadge } from "@/components/room/RoomStatusBadge";
import { Colors } from "@/constants/colors";
import { RoomItem } from "@/services/room/room.types";
import { formatCurrency } from "@/utils/room";
import { Ionicons } from "@expo/vector-icons";
import { memo, useRef } from "react";
import { Animated, Pressable, Text, View } from "react-native";

type Props = {
  item: RoomItem;
  onPress: () => void;
};

export const StudentRoomCard = memo(function StudentRoomCard({
  item,
  onPress,
}: Props) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
      speed: 20,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
    }).start();
  };

  const displayName = item.name.toLowerCase().startsWith("phòng") 
    ? item.name 
    : `Phòng ${item.name}`;

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        className="active:opacity-95"
      >
        <View
          className="rounded-[24px] px-5 py-5"
          style={{
            backgroundColor: Colors.surface,
            borderWidth: 1,
            borderColor: Colors.border,
            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 4 },
            elevation: 3,
          }}
        >
          <View className="flex-row items-start justify-between">
            <View className="flex-1 pr-3">
              <Text
                className="text-[18px] font-bold"
                style={{ color: Colors.textPrimary }}
              >
                {displayName}
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

          <View className="mt-4 flex-row items-center justify-between">
            <Text
              className="text-[16px] font-extrabold"
              style={{ color: Colors.primary }}
            >
              {formatCurrency(item.basePrice)}
              <Text className="text-[13px] font-normal" style={{ color: Colors.textSecondary }}> / tháng</Text>
            </Text>

            <View className="flex-row items-center">
              <Ionicons name="bed-outline" size={16} color={Colors.textSecondary} />
              <Text className="ml-1 text-[14px] font-medium" style={{ color: Colors.textSecondary }}>
                {item.capacity} người
              </Text>
            </View>
          </View>

          <View
            className="my-4 h-[1px]"
            style={{ backgroundColor: Colors.border }}
          />

          <View className="flex-row items-center justify-between mb-2">
            <Text
              className="text-[14px] font-medium"
              style={{ color: Colors.textSecondary }}
            >
              Tình trạng chỗ ở
            </Text>
            <Text
              className="text-[14px] font-bold"
              style={{ color: Colors.textPrimary }}
            >
              {item.occupiedCount} / {item.capacity}
            </Text>
          </View>

          <RoomOccupancyBar percent={item.occupancyPercent} />
        </View>
      </Pressable>
    </Animated.View>
  );
});

