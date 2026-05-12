import { RoomSearchBox } from "@/components/room/RoomSearchBox";
import { Colors } from "@/constants/colors";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  search: string;
  onSearchChange: (text: string) => void;
};

export function RoomListHeader({ search, onSearchChange }: Props) {
  const insets = useSafeAreaInsets();
  
  return (
    <View>
      <LinearGradient
        colors={[Colors.primary, Colors.primaryLight]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          paddingHorizontal: 20,
          paddingTop: insets.top + 10,
          paddingBottom: 70,
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
        }}
      >
        <Text className="text-[28px] font-extrabold text-white">Phòng</Text>
        <Text className="mt-2 text-[15px] text-white/90">
          Quản lý trạng thái và sức chứa phòng
        </Text>
      </LinearGradient>

      <View className="-mt-10 px-5">
        <RoomSearchBox value={search} onChangeText={onSearchChange} />
      </View>
    </View>
  );
}
