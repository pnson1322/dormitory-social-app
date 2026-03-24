import { ContactInfoCard } from "@/components/profile/ContactInfoCard";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileSectionCard } from "@/components/profile/ProfileSectionCard";
import { RoomInfoCard } from "@/components/profile/RoomInfoCard";
import { Colors } from "@/constants/colors";
import useProfile from "@/hooks/profile/useProfile";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";

export function ProfileScreen() {
  const router = useRouter();
  const { profile, loading, refreshing, refetch } = useProfile();

  useFocusEffect(
    useCallback(() => {
      void refetch();
    }, [refetch]),
  );

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
          Không tải được thông tin hồ sơ.
        </Text>

        <Pressable
          onPress={() => void refetch()}
          className="mt-4 h-12 items-center justify-center rounded-2xl bg-primary px-5"
        >
          <Text className="font-bold text-white">Thử lại</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ paddingBottom: 32 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => void refetch()}
        />
      }
      showsVerticalScrollIndicator={false}
    >
      <ProfileHeader
        fullName={profile.fullName}
        gender={profile.gender}
        dateOfBirth={profile.dateOfBirth}
        avatarUrl={profile.avatarUrl}
        onEditPress={() => router.push("/(student)/edit-profile")}
      />

      <View className="gap-5 px-6 pt-6">
        <ProfileSectionCard icon="chatbubble-outline" title="Giới thiệu">
          <Text className="text-[17px] leading-8 text-textPrimary">
            {profile.bio?.trim() || "Bạn chưa cập nhật phần giới thiệu."}
          </Text>
        </ProfileSectionCard>

        <RoomInfoCard room={profile.room} />

        <ContactInfoCard
          email={profile.email}
          phoneNumber={profile.phoneNumber}
          dateOfBirth={profile.dateOfBirth}
        />
      </View>
    </ScrollView>
  );
}
