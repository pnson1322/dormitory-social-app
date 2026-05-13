import { AppButton } from "@/components/AppButton";
import { DraggableFAB } from "@/components/common/DraggableFAB";
import { RoomCardSkeleton } from "@/components/manager/room/RoomCardSkeleton";
import { RoomListFilters } from "@/components/manager/room/RoomListFilters";
import { RoomListHeader } from "@/components/manager/room/RoomListHeader";
import { RoomCard } from "@/components/room/RoomCard";
import { RoomStatusSheet } from "@/components/room/RoomStatusSheet";
import { useToast } from "@/components/toast/ToastProvider";
import { Colors } from "@/constants/colors";
import { subscribeRoomListRefresh } from "@/hooks/room/roomRefreshBus";
import { useRoomDetails } from "@/hooks/room/useRoomDetails";
import { useRoomFormOptions } from "@/hooks/room/useRoomFormOptions";
import { useRooms } from "@/hooks/room/useRooms";
import { useUpdateRoomStatus } from "@/hooks/room/useUpdateRoomStatus";
import { RoomItem, RoomStatus } from "@/services/room/room.types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View
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
    meta,
    search,
    status,
    roomTypeId,
    buildingId,
    loading,
    refreshing,
    loadingMore,
    filtering,
    error,
    hasAnyFilter,
    setSearch,
    setStatus,
    setRoomTypeId,
    setBuildingId,
    refetch,
    loadMore,
  } = useRooms();

  const { roomTypes, buildings } = useRoomFormOptions();

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
    if (hasAnyFilter) {
      if (search.trim().length > 0) return `${meta.totalItems} phòng tìm thấy`;
      if (status === "AVAILABLE") return `${meta.totalItems} phòng còn trống`;
      if (status === "FULL") return `${meta.totalItems} phòng đã đầy`;
      if (status === "MAINTENANCE") return `${meta.totalItems} phòng đang bảo trì`;
      return `${meta.totalItems} phòng thỏa mãn bộ lọc`;
    }
    return `${counts.Total} phòng trong hệ thống`;
  }, [hasAnyFilter, search, status, counts.Total, meta.totalItems]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <View className="flex-1">
        <RoomListHeader search={search} onSearchChange={setSearch} />

        <RoomListFilters 
          counts={counts} 
          status={status} 
          onStatusChange={setStatus} 
          roomTypeId={roomTypeId}
          onRoomTypeChange={setRoomTypeId}
          roomTypes={roomTypes}
          buildingId={buildingId}
          onBuildingChange={setBuildingId}
          buildings={buildings}
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

        <DraggableFAB 
          onPress={() => router.push("/(manager)/create-room")} 
        />

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
