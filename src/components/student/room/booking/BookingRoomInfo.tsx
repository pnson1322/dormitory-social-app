import { Colors } from "@/constants/colors";
import { RoomDetail } from "@/services/room/room.types";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

type Props = {
  room: RoomDetail;
};

export function BookingRoomInfo({ room }: Props) {
  return (
    <View className="mb-8">
      <Text className="text-[16px] font-bold text-slate-900 mb-4">
        Phòng đăng ký
      </Text>
      <View
        className="rounded-3xl p-5 bg-white flex-row items-center"
        style={{
          shadowColor: "#94A3B8",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 3,
        }}
      >
        <View
          className="h-16 w-16 rounded-2xl items-center justify-center mr-4"
          style={{ backgroundColor: Colors.primaryLight + "20" }} 
        >
          <Ionicons name="bed" size={32} color={Colors.primary} />
        </View>
        <View className="flex-1">
          <Text className="text-[18px] font-black text-slate-900 mb-1">
            Phòng {room.name}
          </Text>
          <Text className="text-[13px] font-medium text-slate-500 mb-2">
            {room.roomTypeName}
          </Text>
          <View className="flex-row items-center gap-3">
            <View className="flex-row items-center">
              <Ionicons name="business-outline" size={14} color="#64748B" />
              <Text className="text-[12px] font-medium text-slate-600 ml-1">
                {room.buildingName}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="layers-outline" size={14} color="#64748B" />
              <Text className="text-[12px] font-medium text-slate-600 ml-1">
                Tầng {room.floor}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
