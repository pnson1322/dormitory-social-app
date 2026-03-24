import { Colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, Text, View } from "react-native";

type Props = {
  onBack: () => void;
};

export function EditProfileHeader({ onBack }: Props) {
  return (
    <LinearGradient
      colors={[Colors.primary, Colors.primaryLight, Colors.accent]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{
        paddingTop: 24,
        paddingHorizontal: 20,
        paddingBottom: 28,
        borderBottomLeftRadius: 28,
        borderBottomRightRadius: 28,
      }}
    >
      <View className="flex-row items-center">
        <Pressable
          onPress={onBack}
          className="mr-4 h-12 w-12 items-center justify-center rounded-full bg-white/20"
        >
          <Ionicons name="arrow-back" size={22} color="white" />
        </Pressable>

        <View className="flex-1">
          <Text className="text-[34px] font-extrabold text-white">
            Chỉnh sửa hồ sơ
          </Text>
          <Text className="mt-1 text-[16px] font-semibold text-white/90">
            Cập nhật thông tin cá nhân
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}
