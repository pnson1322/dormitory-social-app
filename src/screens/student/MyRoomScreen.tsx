import { ActiveRoomCard } from "@/components/student/my-room/ActiveRoomCard";
import { ActiveRoomSkeleton } from "@/components/student/my-room/ActiveRoomSkeleton";
import { MyRoomHeader } from "@/components/student/my-room/MyRoomHeader";
import { RecentRegistrations } from "@/components/student/my-room/RecentRegistrations";
import { RoomActionButtons } from "@/components/student/my-room/RoomActionButtons";
import { Colors } from "@/constants/colors";
import { ScrollView, View, ActivityIndicator, Text, Pressable, RefreshControl } from "react-native";
import { useMyRoom } from "@/hooks/student/useMyRoom";
import { useCurrentUserRole } from "@/hooks/auth/useCurrentUserRole";
import { createDirectConversation } from "@/services/chat/chat.api";
import { chatMetadataCache } from "@/utils/chatMetadataCache";
import { getApiErrorMessage } from "@/services/apiError";
import { useRouter, useFocusEffect } from "expo-router";
import { useToast } from "@/components/toast/ToastProvider";
import { Ionicons } from "@expo/vector-icons";
import { StudentRoommate } from "@/services/booking/booking.types";
import React, { useState, useCallback } from "react";

export function MyRoomScreen() {
  const { roomInfo, loading, error, refresh } = useMyRoom();
  const { userId } = useCurrentUserRole();
  const router = useRouter();
  const { showToast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCreatingChat, setIsCreatingChat] = useState(false);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh])
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refresh();
    setIsRefreshing(false);
  };

  const handleChatWithRoommate = async (roommate: StudentRoommate) => {
    if (isCreatingChat) return;
    try {
      setIsCreatingChat(true);
      const res = await createDirectConversation({ targetUserId: roommate.studentId });
      chatMetadataCache.set(res.id, {
        name: roommate.fullName || roommate.email || "Bạn cùng phòng",
        avatarUrl: roommate.avatarUrl || null,
      });
      router.push(`/chat/${res.id}`);
    } catch (err) {
      showToast({
        type: "error",
        title: "Lỗi",
        message: getApiErrorMessage(err, "Không thể bắt đầu cuộc trò chuyện với bạn cùng phòng.")
      });
    } finally {
      setIsCreatingChat(false);
    }
  };

  const renderContent = () => {
    if (loading && !isRefreshing) {
      return (
        <View className="flex-1 px-5 mt-4">
          <ActiveRoomSkeleton />
        </View>
      );
    }

    if (error) {
      return (
        <View className="flex-1 items-center justify-center py-20 px-8">
          <Ionicons name="alert-circle-outline" size={48} color="#EF4444" className="mb-4" />
          <Text className="text-[16px] font-bold text-slate-900 text-center mb-2">{error}</Text>
          <Pressable onPress={refresh} className="bg-primary px-6 py-2.5 rounded-full active:opacity-90" style={{ backgroundColor: Colors.primary }}>
            <Text className="text-white font-bold text-[13px]">Thử lại</Text>
          </Pressable>
        </View>
      );
    }

    if (!roomInfo || !roomInfo.room) {
      return (
        <View className="flex-1 px-5 mt-4">
          <View className="py-16 px-6 bg-white rounded-[32px] border border-slate-100 items-center justify-center shadow-sm">
            <View className="h-16 w-16 bg-blue-50 rounded-2xl items-center justify-center mb-6">
              <Ionicons name="business-outline" size={32} color={Colors.primary} />
            </View>
            <Text className="text-slate-900 font-black text-[20px] mb-2 text-center">Bạn chưa ở phòng nào</Text>
            <Text className="text-slate-400 text-[14px] text-center leading-6 mb-6 px-4">
              Bạn chưa có hợp đồng phòng ký túc xá hoạt động vào thời điểm hiện tại. Hãy thực hiện đăng ký phòng nhé.
            </Text>
            <Pressable
              onPress={() => router.navigate("/(student)/rooms" as any)}
              className="bg-primary px-8 py-3.5 rounded-2xl shadow-lg shadow-primary/20"
              style={{ backgroundColor: Colors.primary }}
            >
              <Text className="text-white font-bold text-[15px]">Tìm & Đăng ký phòng</Text>
            </Pressable>
          </View>
          <RoomActionButtons />
          <RecentRegistrations />
        </View>
      );
    }

    const { room, students } = roomInfo;
    return (
      <View className="flex-1 px-5">
        <ActiveRoomCard 
          name={room.name}
          buildingName={room.buildingName}
          floor={room.floor}
          roomTypeName={room.roomTypeName}
          capacity={room.capacity}
          occupiedCount={room.occupiedCount}
          roomStatus={room.roomStatus}
          roommates={students || []}
          currentUserId={userId}
          onChatPress={handleChatWithRoommate}
        />

        <RoomActionButtons />

        <RecentRegistrations />
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <MyRoomHeader />

      <ScrollView 
        className="flex-1 -mt-6" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl 
            refreshing={isRefreshing} 
            onRefresh={handleRefresh} 
            colors={[Colors.primary]} 
          />
        }
      >
        {renderContent()}
      </ScrollView>
    </View>
  );
}
