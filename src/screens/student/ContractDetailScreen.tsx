import { ContractSkeleton } from "@/components/student/contract/ContractSkeleton";
import { ContractSummaryCard } from "@/components/student/contract/ContractSummaryCard";
import { Colors } from "@/constants/colors";
import { useStudentContract } from "@/hooks/student/useStudentContract";
import { formatCurrency } from "@/utils/room";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View, RefreshControl } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function ContractDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { contract, loading, refreshing, onRefresh } = useStudentContract();

  if (loading) {
    return <ContractSkeleton />;
  }

  if (!contract) {
    return (
      <View className="flex-1 items-center justify-center px-10">
        <Text className="text-slate-500 text-center">Không tìm thấy thông tin hợp đồng.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <View 
        className="px-5 pb-4 pt-4 bg-primary"
        style={{ 
          paddingTop: insets.top + 10,
        }}
      >
        <View className="flex-row items-center">
          <Pressable
            onPress={() => router.navigate("/(student)/my-room")}
            className="h-10 w-10 items-center justify-center rounded-full bg-white/15 mr-3"
          >
            <Ionicons name="arrow-back" size={20} color="white" />
          </Pressable>

          <Text className="text-[24px] font-extrabold text-white">
            Chi tiết Hợp đồng
          </Text>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />
        }
      >
        <ContractSummaryCard contract={contract} />

        <View 
          className="bg-white rounded-[24px] p-6"
          style={{
            borderWidth: 1,
            borderColor: Colors.border,
          }}
        >
          <Text className="text-[16px] font-bold text-slate-900 mb-4">Thông tin tài chính</Text>
          
          <View className="flex-row justify-between mb-3">
            <Text className="text-slate-500">Giá phòng / tháng</Text>
            <Text className="font-bold text-slate-900">{formatCurrency(contract.monthlyPrice)}</Text>
          </View>
          
          <View className="flex-row justify-between mb-3">
            <Text className="text-slate-500">Tiền đặt cọc</Text>
            <Text className="font-bold text-slate-900">{formatCurrency(contract.deposit)}</Text>
          </View>
          
          <View className="flex-row justify-between pt-3 border-t border-slate-100">
            <Text className="text-slate-500 font-bold">Trạng thái cọc</Text>
            <Text className="font-bold text-emerald-600">Đã thu</Text>
          </View>
        </View>

        <Text className="text-[13px] text-slate-400 text-center mt-6 italic px-4">
          Bản hợp đồng số hóa có giá trị pháp lý tương đương bản giấy theo quy định của Ký túc xá.
        </Text>
      </ScrollView>
    </View>
  );
}
