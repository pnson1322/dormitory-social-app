import { AppButton } from "@/components/AppButton";
import { RoomCard } from "@/components/room/RoomCard";
import { RoomStatusSheet } from "@/components/room/RoomStatusSheet";
import { RoomCardSkeleton } from "@/components/manager/room/RoomCardSkeleton";
import { RoomListHeader } from "@/components/manager/room/RoomListHeader";
import { RoomListFilters } from "@/components/manager/room/RoomListFilters";
import { useToast } from "@/components/toast/ToastProvider";
import { Colors } from "@/constants/colors";
import { subscribeRoomListRefresh } from "@/hooks/room/roomRefreshBus";
import { useRoomDetails } from "@/hooks/room/useRoomDetails";
import { useRooms } from "@/hooks/room/useRooms";
import { useUpdateRoomStatus } from "@/hooks/room/useUpdateRoomStatus";
import { RoomItem, RoomStatus } from "@/services/room/room.types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export function RoomsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();

  const {
    items,
    counts,
    search,
    status,
    loading,
    refreshing,
    loadingMore,
    filtering,
    error,
    setSearch,
    setStatus,
    refetch,
    loadMore,
  } = useRooms();

  const { loading: updatingStatus, submit } = useUpdateRoomStatus();

  const [selectedRoom, setSelectedRoom] = useState<RoomItem | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<RoomStatus>("AVAILABLE");

  const roomDetails = useRoomDetails(selectedRoom?.id);

  useEffect(() => {
    const unsubscribe = subscribeRoomListRefresh(() => {
      void refetch({ silent: true });
    });
    return unsubscribe;
  }, [refetch]);

  useEffect(() => {
    if (selectedRoom) {
      setSelectedStatus(selectedRoom.roomStatus);
    }
  }, [selectedRoom]);

  useEffect(() => {
    if (roomDetails.room?.roomStatus) {
      setSelectedStatus(roomDetails.room.roomStatus);
    }
  }, [roomDetails.room?.roomStatus]);

  const handleConfirmStatus = async () => {
    if (!roomDetails.room) return;

    await submit(roomDetails.room, selectedStatus, {
      onSuccess: async () => {
        showToast({
          type: "success",
          title: "Cập nhật thành công",
          message: "Trạng thái phòng đã được cập nhật.",
        });
        setSelectedRoom(null);
        await refetch({ silent: true });
      },
      onError: (message) => {
        showToast({
          type: "error",
          title: "Cập nhật thất bại",
          message,
        });
      },
    });
  };

  const statusChanged = !!selectedRoom && selectedStatus !== selectedRoom.roomStatus;

  const resultText = useMemo(() => {
    const keyword = search.trim();
    if (keyword.length > 0) return `${items.length} phòng tìm thấy`;
    if (status === "AVAILABLE") return `${counts.AVAILABLE} phòng còn trống`;
    if (status === "FULL") return `${counts.FULL} phòng đã đầy`;
    if (status === "MAINTENANCE") return `${counts.MAINTENANCE} phòng đang bảo trì`;
    return `${counts.Total} phòng trong hệ thống`;
  }, [search, status, counts, items.length]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <View className="flex-1">
        <RoomListHeader search={search} onSearchChange={setSearch} />

        <RoomListFilters 
          counts={counts} 
          status={status} 
          onStatusChange={setStatus} 
          resultText={resultText}
          filtering={filtering}
        />

        {loading ? (
          <View className="px-5">
            {Array.from({ length: 4 }).map((_, i) => <RoomCardSkeleton key={i} />)}
          </View>
        ) : error ? (
          <View className="flex-1 items-center justify-center px-6">
            <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
            <Text className="text-center text-[16px] font-bold mt-4 mb-6 text-slate-900">{error}</Text>
            <AppButton title="Thử lại" onPress={() => void refetch({ refreshing: true })} />
          </View>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120, gap: 16 }}
            renderItem={({ item }) => (
              <RoomCard
                item={item}
                onPressChangeStatus={() => setSelectedRoom(item)}
                onPressDetails={() => router.push({ pathname: "/(manager)/room-details/[id]", params: { id: item.id } })}
              />
            )}
            onEndReached={() => void loadMore()}
            onEndReachedThreshold={0.4}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => void refetch({ refreshing: true })} />}
            ListEmptyComponent={
              <View className="items-center py-10 bg-white rounded-3xl border border-slate-100">
                <Ionicons name="business-outline" size={48} color="#CBD5E1" />
                <Text className="mt-4 text-slate-400 font-bold">Không tìm thấy phòng phù hợp</Text>
              </View>
            }
            ListFooterComponent={loadingMore ? <ActivityIndicator size="small" color={Colors.primary} className="py-4" /> : null}
            showsVerticalScrollIndicator={false}
          />
        )}

        <Pressable
          onPress={() => router.push("/(manager)/create-room")}
          className="absolute right-5 h-16 w-16 items-center justify-center rounded-full shadow-lg shadow-blue-500/30"
          style={{ bottom: 24 + insets.bottom, backgroundColor: Colors.primary }}
        >
          <Ionicons name="add" size={32} color="#FFFFFF" />
        </Pressable>

        <RoomStatusSheet
          visible={!!selectedRoom}
          roomName={selectedRoom?.name}
          value={selectedStatus}
          loading={updatingStatus || roomDetails.loading}
          confirmDisabled={!statusChanged}
          onChange={setSelectedStatus}
          onClose={() => setSelectedRoom(null)}
          onConfirm={() => void handleConfirmStatus()}
        />
      </View>
    </SafeAreaView>
  );
}
