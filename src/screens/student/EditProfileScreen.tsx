import { EditProfileForm } from "@/components/profile/EditProfileForm";
import { useToast } from "@/components/toast/ToastProvider";
import { Colors } from "@/constants/colors";
import useProfile from "@/hooks/profile/useProfile";
import { useRouter } from "expo-router";
import { ActivityIndicator, Text, View } from "react-native";

export function EditProfileScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const { profile, loading } = useProfile();

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!profile) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <Text className="text-center text-base font-semibold text-textPrimary">
          Không tải được dữ liệu hồ sơ.
        </Text>
      </View>
    );
  }

  return (
    <EditProfileForm
      profile={profile}
      onBack={() => router.back()}
      onSaved={() => {
        showToast({
          type: "success",
          title: "Cập nhật thành công",
          message: "Thông tin hồ sơ đã được lưu.",
        });
        router.back();
      }}
      onError={(message) => {
        showToast({
          type: "error",
          title: "Cập nhật thất bại",
          message,
        });
      }}
    />
  );
}
