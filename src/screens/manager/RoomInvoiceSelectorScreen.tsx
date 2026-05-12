import { RoomSelector } from "@/components/manager/billing/RoomSelector";
import { Colors } from "@/constants/colors";
import { useRooms } from "@/hooks/room/useRooms";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function RoomInvoiceSelectorScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const { 
    items, 
    loading, 
    error, 
    refetch, 
    search, 
    setSearch, 
    loadMore, 
    loadingMore 
  } = useRooms();

  const handleSelect = (roomId: string) => {
    const room = items.find(r => r.id === roomId);
    router.push({
      pathname: "/(manager)/invoices/create",
      params: { roomId, roomName: room?.name || "" }
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <View 
        className="px-5 pb-6 pt-4 bg-white"
        style={{ 
          paddingTop: insets.top + 10,
          borderBottomWidth: 1,
          borderBottomColor: Colors.border
        }}
      >
        <View className="flex-row items-center mb-6">
          <Pressable
            onPress={() => router.navigate("/(manager)/invoices")}
            className="h-10 w-10 items-center justify-center rounded-full bg-slate-100 mr-3"
          >
            <Ionicons name="arrow-back" size={20} color={Colors.textPrimary} />
          </Pressable>
          <Text className="text-[24px] font-extrabold text-slate-900">
            Chọn phòng chốt số
          </Text>
        </View>

        <Text className="text-slate-500 font-medium">
          Vui lòng chọn phòng để bắt đầu nhập chỉ số điện, nước và tạo hóa đơn.
        </Text>
      </View>

      <View className="flex-1 px-5 pt-6">
        {loading && items.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator color={Colors.primary} size="large" />
            <Text className="mt-4 text-slate-400 font-bold uppercase tracking-widest text-[12px]">Đang tải danh sách phòng...</Text>
          </View>
        ) : error ? (
          <View className="flex-1 items-center justify-center">
            <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
            <Text className="mt-4 text-slate-900 font-bold text-center px-10">{error}</Text>
            <Pressable onPress={() => refetch()} className="mt-6 bg-primary px-8 py-3 rounded-xl">
              <Text className="text-white font-bold">Thử lại</Text>
            </Pressable>
          </View>
        ) : (
          <RoomSelector 
            rooms={items} 
            selectedRoomId={null} 
            onSelect={handleSelect}
            search={search}
            onSearchChange={setSearch}
            onLoadMore={loadMore}
            loadingMore={loadingMore}
          />
        )}
      </View>
    </View>
  );
}
