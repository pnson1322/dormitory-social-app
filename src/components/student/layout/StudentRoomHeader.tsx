import { Colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { memo } from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const StudentRoomHeader = memo(function StudentRoomHeader() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
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
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
        <Pressable
          onPress={() => router.navigate("/(student)/menu" as any)}
          style={{
            marginRight: 12,
            height: 40,
            width: 40,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 20,
            backgroundColor: "rgba(255,255,255,0.15)",
          }}
        >
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </Pressable>
        <Text className="text-[28px] font-extrabold text-white">Danh sách phòng</Text>
      </View>
      <Text className="text-[15px] text-white/90" style={{ marginLeft: 52 }}>
        Xem và chọn phòng phù hợp với bạn
      </Text>
    </LinearGradient>
  );
});
