import { AppButton } from "@/components/AppButton";
import { Colors } from "@/constants/colors";
import { calculateAge, genderToVietnamese } from "@/utils/date";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Image, Text, View } from "react-native";

type Props = {
  fullName: string;
  gender: "male" | "female" | "other" | null;
  dateOfBirth: string | null;
  avatarUrl: string | null;
  onEditPress: () => void;
};

export function ProfileHeader({
  fullName,
  gender,
  dateOfBirth,
  avatarUrl,
  onEditPress,
}: Props) {
  const age = calculateAge(dateOfBirth);

  return (
    <View className="bg-background">
      <View className="relative">
        <LinearGradient
          colors={[Colors.primary, Colors.primaryLight, Colors.accent]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            height: 180,
            borderBottomLeftRadius: 28,
            borderBottomRightRadius: 28,
          }}
        />

        <View className="-mt-20 px-6">
          <View className="h-[132px] w-[132px] overflow-hidden rounded-full border-[6px] border-slate-950 bg-white">
            {avatarUrl ? (
              <Image
                source={{ uri: avatarUrl }}
                className="h-full w-full"
                resizeMode="cover"
              />
            ) : (
              <View className="flex-1 items-center justify-center bg-slate-200">
                <Ionicons
                  name="person"
                  size={48}
                  color={Colors.textSecondary}
                />
              </View>
            )}
          </View>

          <Text className="mt-4 text-[34px] font-extrabold text-textPrimary">
            {fullName}
          </Text>

          <Text className="mt-1 text-[17px] font-medium text-textSecondary">
            {genderToVietnamese(gender)}
            {age !== null ? ` • ${age} tuổi` : ""}
          </Text>

          <View className="mt-6">
            <AppButton title="Chỉnh sửa hồ sơ" onPress={onEditPress} />
          </View>
        </View>
      </View>
    </View>
  );
}
