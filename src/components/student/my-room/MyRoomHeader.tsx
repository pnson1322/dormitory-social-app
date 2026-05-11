import { Colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function MyRoomHeader() {
  const insets = useSafeAreaInsets();

  return (
    <View 
      className="px-6 pb-10 pt-4 rounded-b-[40px]"
      style={{ 
        backgroundColor: Colors.primary,
        paddingTop: insets.top + 10,
      }}
    >
      <View>
        <Text className="text-white/60 text-[14px] font-bold uppercase tracking-[2px]">
          Không gian của bạn
        </Text>
        <Text className="text-white text-[32px] font-black mt-1">
          Phòng của tôi
        </Text>
      </View>
    </View>
  );
}
