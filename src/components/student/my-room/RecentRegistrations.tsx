import { Colors } from "@/constants/colors";
import { useRegistrationHistory } from "@/hooks/student/useRegistrationHistory";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

export function RecentRegistrations() {
  const router = useRouter();
  const { items, loading } = useRegistrationHistory();

  const previewItems = items.slice(0, 2);

  return (
    <View className="mt-6 pb-10">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-[20px] font-bold text-slate-900">Lịch sử đăng ký</Text>
        <Pressable onPress={() => router.push("/(student)/registration-history")}>
          <Text className="text-primary font-bold">Xem tất cả</Text>
        </Pressable>
      </View>

      {loading ? (
        <View className="py-10 items-center">
          <ActivityIndicator color={Colors.primary} />
        </View>
      ) : previewItems.length > 0 ? (
        <View className="gap-3">
          {previewItems.map((item) => (
            <Pressable 
              key={item.id}
              onPress={() => router.push("/(student)/registration-history")}
              className="bg-white p-4 rounded-2xl border border-slate-100 flex-row items-center justify-between"
            >
              <View className="flex-row items-center">
                <View className="h-10 w-10 rounded-full bg-slate-50 items-center justify-center mr-3">
                  <Ionicons name="time-outline" size={18} color={Colors.primary} />
                </View>
                <View>
                  <Text className="font-bold text-slate-900">Phòng {item.roomName}</Text>
                  <Text className="text-[12px] text-slate-500">{item.requestDate}</Text>
                </View>
              </View>
              <View className="flex-row items-center">
                <Text className="text-[12px] font-bold text-primary mr-1">
                  {item.status === "APPROVED" ? "Đã duyệt" : item.status === "PENDING" ? "Đang chờ" : "Từ chối"}
                </Text>
                <Ionicons name="chevron-forward" size={14} color={Colors.primary} />
              </View>
            </Pressable>
          ))}
        </View>
      ) : (
        <View className="p-5 rounded-3xl bg-slate-50 border border-slate-100 border-dashed items-center py-10">
          <Ionicons name="time-outline" size={32} color="#CBD5E1" />
          <Text className="text-slate-400 font-medium mt-3">Chưa có dữ liệu lịch sử</Text>
        </View>
      )}
    </View>
  );
}
