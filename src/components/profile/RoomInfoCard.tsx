import { ProfileSectionCard } from "@/components/profile/ProfileSectionCard";
import { Colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

type Props = {
  room: {
    id: string;
    name: string;
    building: string;
  } | null;
};

export function RoomInfoCard({ room }: Props) {
  return (
    <ProfileSectionCard icon="home-outline" title="Thông tin phòng">
      {room ? (
        <View className="flex-row items-center">
          <View className="mr-4 h-[72px] w-[72px] items-center justify-center rounded-3xl bg-primaryLight">
            <Text className="text-[24px] font-extrabold text-white">
              {room.name}
            </Text>
          </View>

          <View className="flex-1">
            <Text className="text-sm font-bold uppercase text-textSecondary">
              Phòng
            </Text>
            <Text className="text-[28px] font-extrabold text-textPrimary">
              {room.name}
            </Text>

            <View className="mt-1 flex-row items-center">
              <Ionicons
                name="location-outline"
                size={18}
                color={Colors.textSecondary}
              />
              <Text className="ml-1 text-base text-textSecondary">
                {room.building}
              </Text>
            </View>
          </View>
        </View>
      ) : (
        <Text className="text-base text-textSecondary">
          Chưa có thông tin phòng.
        </Text>
      )}
    </ProfileSectionCard>
  );
}
