import { RoomSearchBox } from "@/components/room/RoomSearchBox";
import { StudentRoomCard } from "@/components/student/room/StudentRoomCard";
import { StudentRoomCardSkeleton } from "@/components/student/room/StudentRoomCardSkeleton";
import { StudentRoomFiltersView } from "@/components/student/room/StudentRoomFilters";
import { StudentRoomHeader } from "@/components/student/layout/StudentRoomHeader";
import { StudentRoomEmptyState } from "@/components/student/room/StudentRoomEmptyState";

import { AppButton } from "@/components/AppButton";
import { Colors } from "@/constants/colors";
import { useStudentRooms } from "@/hooks/student/useStudentRooms";
import { useRouter } from "expo-router";
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
  } = useStudentRooms();

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
              paddingTop: 10,
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
