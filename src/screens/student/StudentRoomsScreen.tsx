import { AppButton } from "@/components/AppButton";
import { RoomSearchBox } from "@/components/room/RoomSearchBox";
import { StudentRoomHeader } from "@/components/student/layout/StudentRoomHeader";
import { StudentRoomCard } from "@/components/student/room/StudentRoomCard";
import { StudentRoomCardSkeleton } from "@/components/student/room/StudentRoomCardSkeleton";
import { StudentRoomEmptyState } from "@/components/student/room/StudentRoomEmptyState";
import { StudentRoomFiltersView } from "@/components/student/room/StudentRoomFilters";
import { Colors } from "@/constants/colors";
import { useStudentRooms } from "@/hooks/student/useStudentRooms";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { ActivityIndicator, FlatList, RefreshControl, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function StudentRoomsScreen() {
  const router = useRouter();
  const {
    items,
    loading,
    refreshing,
    loadingMore,
    error,
    filters,
    setFilters,
    refetch,
    loadMore,
    buildings,
    roomTypes,
    meta,
    hasAnyFilter,
  } = useStudentRooms();

  const resultText = useMemo(() => {
    if (hasAnyFilter) {
      if (filters.search.trim().length > 0) return `${meta.totalItems} phòng tìm thấy`;
      if (filters.status === "AVAILABLE") return `${meta.totalItems} phòng còn trống`;
      if (filters.status === "FULL") return `${meta.totalItems} phòng đã đầy`;
      if (filters.status === "MAINTENANCE") return `${meta.totalItems} phòng đang bảo trì`;
      return `${meta.totalItems} phòng thỏa mãn bộ lọc`;
    }
    return `${meta.totalItems} phòng trong hệ thống`;
  }, [hasAnyFilter, filters.search, filters.status, meta.totalItems]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <View className="flex-1">
        <StudentRoomHeader />

        <View className="-mt-10 px-5 mb-5">
          <RoomSearchBox 
            value={filters.search} 
            onChangeText={(text) => setFilters({ ...filters, search: text })} 
          />
        </View>

        <StudentRoomFiltersView 
          filters={filters}
          buildings={buildings}
          roomTypes={roomTypes}
          onChangeFilters={setFilters}
        />

        <View className="px-5 mb-4">
          <Text className="text-[16px] font-bold" style={{ color: Colors.textPrimary }}>
            {resultText}
          </Text>
        </View>

        {error && items.length === 0 ? (
          <View className="flex-1 items-center justify-center px-10">
            <Text className="text-center text-[18px] font-semibold mb-8" style={{ color: Colors.textPrimary }}>
              {error}
            </Text>

            <AppButton 
              title="Thử lại" 
              onPress={refetch} 
              loading={loading || refreshing} 
              size="compact"
            />

          </View>
        ) : loading ? (
          <View className="flex-1 px-5 pt-10 pb-[100px] gap-4">
            <StudentRoomCardSkeleton />
            <StudentRoomCardSkeleton />
            <StudentRoomCardSkeleton />
          </View>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            className="flex-1"
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingBottom: 100,
              gap: 16,
            }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={refetch} />
            }
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            ListEmptyComponent={<StudentRoomEmptyState />}
            ListFooterComponent={
              loadingMore ? (
                <View className="py-4">
                  <ActivityIndicator color={Colors.primary} />
                </View>
              ) : null
            }
            renderItem={({ item }) => (
              <StudentRoomCard
                item={item}
                onPress={() => router.push(`/(student)/rooms/${item.id}`)}
              />
            )}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
