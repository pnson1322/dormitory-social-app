import { AppButton } from "@/components/AppButton";
import { RoomDetailOverviewCard } from "@/components/room/RoomDetailOverviewCard";

import { useToast } from "@/components/toast/ToastProvider";
import { Colors } from "@/constants/colors";
import { useStudentRoomDetails } from "@/hooks/student/useStudentRoomDetails";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { memo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const AmenityItem = memo(function AmenityItem({ name }: { name: string }) {
  return (
    <View className="flex-row items-center py-2">
      <Ionicons name="checkmark-circle" size={20} color={Colors.accent} />
      <Text className="ml-3 text-[15px] font-medium" style={{ color: Colors.textPrimary }}>
        {name}
      </Text>
    </View>
  );
});

export function StudentRoomDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  
  const { room, loading, error, refetch } = useStudentRoomDetails(id as string);
  const handleGoToBooking = () => {
    router.push(`/(student)/rooms/${id}/book`);
  };
  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !room) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
        <View
          className="px-5 pb-5"
          style={{
            paddingTop: insets.top - 10,
            backgroundColor: Colors.primary,
          }}
        >
          <View className="flex-row items-center">
            <Pressable
              onPress={() => router.navigate("/(student)/rooms")}
              className="mr-4 h-11 w-11 items-center justify-center rounded-full bg-white/15"
            >
              <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
            </Pressable>
            <Text className="text-[24px] font-extrabold text-white">
              Chi tiết phòng
            </Text>
          </View>
        </View>

        <View className="flex-1 items-center justify-center px-6">
          <Text
            className="text-center text-[18px] font-semibold mb-8"
            style={{ color: Colors.textPrimary }}
          >
            {error || "Không tải được thông tin phòng."}
          </Text>

          <AppButton 
            title="Thử lại" 
            onPress={refetch} 
            loading={loading} 
            size="compact"
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <View
        className="px-5 pb-5 z-10"
        style={{
          paddingTop: insets.top - 10,
          backgroundColor: Colors.primary,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 5,
        }}
      >
        <View className="flex-row items-center">
          <Pressable
            onPress={() => router.navigate("/(student)/rooms")}
            className="mr-4 h-11 w-11 items-center justify-center rounded-full bg-white/15"
          >
            <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
          </Pressable>
          <Text className="text-[24px] font-extrabold text-white">
            Chi tiết phòng
          </Text>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-5 pt-5"
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }
      >
        <RoomDetailOverviewCard room={room} />

        <View className="mt-5 rounded-[24px] p-5"
          style={{
            backgroundColor: Colors.surface,
            borderWidth: 1,
            borderColor: Colors.border,
          }}>
          <Text className="text-[18px] font-bold mb-3" style={{ color: Colors.textPrimary }}>
            Tiện ích đi kèm
          </Text>
          
          {room.amenities && room.amenities.length > 0 ? (
            <View>
              {room.amenities.map((amenity, index) => (
                <AmenityItem key={index} name={amenity} />
              ))}
            </View>
          ) : (
            <Text className="text-[14px]" style={{ color: Colors.textSecondary }}>
              Chưa có thông tin tiện ích.
            </Text>
          )}
        </View>
        
        <View className="mt-8">
          <AppButton 
            title={room.roomStatus === "AVAILABLE" ? "Đăng ký phòng này" : "Phòng không có sẵn"} 
            onPress={handleGoToBooking} 
            disabled={room.roomStatus !== "AVAILABLE"}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

