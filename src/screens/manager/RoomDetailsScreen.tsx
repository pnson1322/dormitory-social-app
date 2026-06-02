import { AppButton } from "@/components/AppButton";
import { RoomDetailOverviewCard } from "@/components/room/RoomDetailOverviewCard";
import { RoomEditFormCard } from "@/components/room/RoomEditFormCard";
import { RoomResidentsCard } from "@/components/room/RoomResidentsCard";
import { RoomStatusInlineCard } from "@/components/room/RoomStatusInlineCard";
import { useToast } from "@/components/toast/ToastProvider";
import { Colors } from "@/constants/colors";
import { useRoomDetails } from "@/hooks/room/useRoomDetails";
import { useRoomDetailsEditor } from "@/hooks/room/useRoomDetailsEditor";
import { useRoomStudents } from "@/hooks/room/useRoomStudents";
import { useRoomDetailsLeaveGuard } from "@/hooks/room/useRoomDetailsLeaveGuard";
import { useRoomFormOptions } from "@/hooks/room/useRoomFormOptions";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const AmenityItem = ({ name }: { name: string }) => (
  <View className="flex-row items-center py-2.5">
    <View className="h-6 w-6 items-center justify-center rounded-full" style={{ backgroundColor: Colors.accent + '20' }}>
      <Ionicons name="checkmark" size={14} color={Colors.accent} />
    </View>
    <Text className="ml-3 text-[15px] font-medium" style={{ color: Colors.textPrimary }}>
      {name}
    </Text>
  </View>
);

export function RoomDetailsScreen() {
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { room, loading, refreshing, error, refetch, setRoom } = useRoomDetails(
    typeof id === "string" ? id : undefined,
  );

  const {
    students,
    loading: studentsLoading,
    refreshing: studentsRefreshing,
    error: studentsError,
    refetch: refetchStudents,
    checkout,
  } = useRoomStudents(typeof id === "string" ? id : undefined);

  const {
    buildings,
    roomTypes,
    loading: optionsLoading,
    error: optionsError,
    refetch: refetchOptions,
  } = useRoomFormOptions();

  const editor = useRoomDetailsEditor({
    room,
    buildings,
    roomTypes,
    refetch,
    setRoom,
    showSuccess: () =>
      showToast({
        type: "success",
        title: "Cập nhật thành công",
        message: "Thông tin phòng đã được cập nhật.",
      }),
    showError: (message) =>
      showToast({
        type: "error",
        title: "Cập nhật thất bại",
        message,
      }),
  });

  const { handleBack } = useRoomDetailsLeaveGuard({
    hasChanges: editor.hasChanges,
    loading: editor.saving,
    onDiscard: editor.resetDraftFromRoom,
  });

  useFocusEffect(
    useCallback(() => {
      void refetch();
      void refetchStudents();
    }, [refetch, refetchStudents]),
  );

  if (loading || optionsLoading || studentsLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!room || error || optionsError || !editor.previewRoom) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
        <View
          className="px-5 pb-5"
          style={{
            paddingTop: insets.top + 12,
            backgroundColor: Colors.primary,
          }}
        >
          <View className="flex-row items-center">
            <Pressable
              onPress={handleBack}
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
          <Text className="text-center text-[16px] font-semibold text-textPrimary mb-6">
            {error || optionsError || studentsError || "Không tải được chi tiết phòng."}
          </Text>

          <AppButton 
            title="Thử lại" 
            onPress={() => {
              void refetch();
              void refetchStudents();
              void refetchOptions();
            }} 
            loading={loading || optionsLoading || studentsLoading} 
          />
        </View>
      </SafeAreaView>
    );
  }

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
            onPress={handleBack}
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
        className="flex-1 px-5 pt-7"
        contentContainerStyle={{ paddingBottom: 120 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing || studentsRefreshing}
            onRefresh={() => {
              void refetch();
              void refetchStudents();
            }}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-5">
          <RoomDetailOverviewCard room={editor.previewRoom} />

          <RoomEditFormCard
            buildingId={editor.buildingId}
            name={editor.name}
            floor={editor.floor}
            roomTypeId={editor.roomTypeId}
            buildings={buildings}
            roomTypes={roomTypes}
            onChangeBuildingId={editor.setBuildingId}
            onChangeName={editor.setName}
            onChangeFloor={editor.setFloor}
            onChangeRoomTypeId={editor.setRoomTypeId}
          />

          <View className="rounded-[24px] p-5"
            style={{
              backgroundColor: Colors.surface,
              borderWidth: 1,
              borderColor: Colors.border,
            }}>
            <Text className="text-[18px] font-bold mb-4" style={{ color: Colors.textPrimary }}>
              Tiện ích của phòng
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

          <RoomResidentsCard
            students={students}
            loading={studentsLoading}
            onCheckout={async (userId) => {
              try {
                await checkout(userId);
                showToast({
                  type: "success",
                  title: "Check out thành công",
                  message: "Sinh viên đã được check-out khỏi phòng.",
                });
                void refetch();
              } catch (err: any) {
                showToast({
                  type: "error",
                  title: "Check out thất bại",
                  message: err.message || "Đã xảy ra lỗi khi check-out.",
                });
              }
            }}
          />

          <RoomStatusInlineCard
            value={editor.selectedStatus}
            onChange={editor.setSelectedStatus}
          />

          {editor.hasChanges ? (
            <AppButton
              title="Lưu thay đổi"
              onPress={() => void editor.saveChanges()}
              loading={editor.saving}
              disabled={!editor.isFormValid || editor.saving}
            />
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
