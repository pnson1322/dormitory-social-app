import { Colors } from "@/constants/colors";
import { LinearGradient } from "expo-linear-gradient";
import { memo } from "react";
import { Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const StudentRoomHeader = memo(function StudentRoomHeader() {
  const insets = useSafeAreaInsets();
  
  return (
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
      <Text className="text-[28px] font-extrabold text-white">Danh sách phòng</Text>
      <Text className="mt-2 text-[15px] text-white/90">
        Xem và chọn phòng phù hợp với bạn
      </Text>
    </LinearGradient>
  );
});
