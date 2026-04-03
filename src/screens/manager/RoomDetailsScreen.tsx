import { AppButton } from "@/components/AppButton";
import { RoomDetailOverviewCard } from "@/components/room/RoomDetailOverviewCard";
import { RoomResidentsPlaceholderCard } from "@/components/room/RoomResidentsPlaceholderCard";
import { RoomStatusInlineCard } from "@/components/room/RoomStatusInlineCard";
import { useToast } from "@/components/toast/ToastProvider";
import { Colors } from "@/constants/colors";
import { useRoomDetails } from "@/hooks/room/useRoomDetails";
import { useUpdateRoomStatus } from "@/hooks/room/useUpdateRoomStatus";
import { RoomStatus } from "@/services/room.api";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
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

export function RoomDetailsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();

  const { id, roomStatus: roomStatusParam } = useLocalSearchParams<{
    id: string;
    roomStatus?: RoomStatus;
  }>();

  const { room, loading, refreshing, error, refetch, setRoom } = useRoomDetails(
    typeof id === "string" ? id : undefined,
  );

  const { loading: updatingStatus, submit } = useUpdateRoomStatus();

  const [selectedStatus, setSelectedStatus] = useState<RoomStatus>("AVAILABLE");

  useFocusEffect(
    useCallback(() => {
      void refetch();
    }, [refetch]),
  );

  useEffect(() => {
    if (!roomStatusParam) return;

    setSelectedStatus(roomStatusParam);

    setRoom((prev) =>
      prev
        ? {
            ...prev,
            roomStatus: roomStatusParam,
          }
        : prev,
    );
  }, [roomStatusParam, setRoom]);

  useEffect(() => {
    if (room?.roomStatus) {
      setSelectedStatus(room.roomStatus);
    }
  }, [room?.roomStatus]);

  async function handleSaveStatus() {
    if (!room) return;

    await submit(room, selectedStatus, {
      onSuccess: async () => {
        showToast({
          type: "success",
          title: "Cập nhật thành công",
          message: "Trạng thái phòng đã được cập nhật.",
        });

        setRoom((prev) =>
          prev
            ? {
                ...prev,
                roomStatus: selectedStatus,
              }
            : prev,
        );

        await refetch();
      },
      onError: (message) => {
        showToast({
          type: "error",
          title: "Cập nhật thất bại",
          message,
        });
      },
    });
  }

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!room) {
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
              onPress={() => router.back()}
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
            className="text-center text-[16px] font-semibold"
            style={{ color: Colors.textPrimary }}
          >
            {error || "Không tải được chi tiết phòng."}
          </Text>

          <Pressable
            onPress={() => void refetch()}
            className="mt-4 h-12 items-center justify-center rounded-2xl px-5"
            style={{ backgroundColor: Colors.primary }}
          >
            <Text className="font-bold text-white">Thử lại</Text>
          </Pressable>
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
            onPress={() => router.back()}
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
            refreshing={refreshing}
            onRefresh={() => void refetch()}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-5">
          <RoomDetailOverviewCard room={room} />

          <RoomResidentsPlaceholderCard />

          <RoomStatusInlineCard
            value={selectedStatus}
            onChange={setSelectedStatus}
          />

          <AppButton
            title="Lưu trạng thái"
            onPress={() => void handleSaveStatus()}
            loading={updatingStatus}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
