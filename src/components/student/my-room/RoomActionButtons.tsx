import { Colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

export function RoomActionButtons() {
  const router = useRouter();

  return (
    <View className="mt-6 flex-row gap-4">
      <Pressable 
        onPress={() => router.push("/(student)/contract")}
        className="flex-1 bg-white p-4 rounded-[20px] items-center"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.05,
          shadowRadius: 12,
          elevation: 2,
          borderWidth: 1,
          borderColor: Colors.border,
        }}
      >
        <View className="h-12 w-12 rounded-full bg-blue-50 items-center justify-center mb-3">
          <Ionicons name="document-text" size={24} color={Colors.primary} />
        </View>
        <Text className="text-[13px] font-bold text-slate-900 text-center">Hợp đồng</Text>
      </Pressable>

      <Pressable 
        onPress={() => router.push("/(student)/invoices")}
        className="flex-1 bg-white p-4 rounded-[20px] items-center"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.05,
          shadowRadius: 12,
          elevation: 2,
          borderWidth: 1,
          borderColor: Colors.border,
        }}
      >
        <View className="h-12 w-12 rounded-full bg-amber-50 items-center justify-center mb-3">
          <Ionicons name="receipt" size={24} color="#F59E0B" />
        </View>
        <Text className="text-[13px] font-bold text-slate-900 text-center">Hóa đơn</Text>
      </Pressable>

      <Pressable 
        onPress={() => router.push("/(student)/incidents")}
        className="flex-1 bg-white p-4 rounded-[20px] items-center"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.05,
          shadowRadius: 12,
          elevation: 2,
          borderWidth: 1,
          borderColor: Colors.border,
        }}
      >
        <View className="h-12 w-12 rounded-full bg-red-50 items-center justify-center mb-3">
          <Ionicons name="warning" size={24} color="#EF4444" />
        </View>
        <Text className="text-[13px] font-bold text-slate-900 text-center">Sự cố</Text>
      </Pressable>
    </View>
  );
}
