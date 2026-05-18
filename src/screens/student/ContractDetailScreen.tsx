import { ContractSkeleton } from "@/components/student/contract/ContractSkeleton";
import { ContractSummaryCard } from "@/components/student/contract/ContractSummaryCard";
import { ContractTemplateSection } from "@/components/student/contract/ContractTemplateSection";
import { Colors } from "@/constants/colors";
import { useStudentContract } from "@/hooks/student/useStudentContract";
import { formatCurrency } from "@/utils/room";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Dimensions, Pressable, RefreshControl, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export function ContractDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { contract, loading, refreshing, onRefresh } = useStudentContract();

  if (loading) {
    return <ContractSkeleton />;
  }

  const renderEmptyState = () => (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <View 
        className="px-5 pb-4 pt-4 bg-primary"
        style={{ paddingTop: insets.top + 10 }}
      >
        <View className="flex-row items-center">
          <Pressable
            onPress={() => router.back()}
            className="h-10 w-10 items-center justify-center rounded-full bg-white/15 mr-3"
          >
            <Ionicons name="arrow-back" size={20} color="white" />
          </Pressable>
          <Text className="text-[24px] font-extrabold text-white">Hợp đồng</Text>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 40 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />
        }
      >
        <View className="items-center">
          <View className="w-48 h-48 bg-slate-100 rounded-full items-center justify-center mb-8">
            <MaterialCommunityIcons name="file-document-remove-outline" size={80} color={Colors.textSecondary} />
          </View>
          <Text className="text-[20px] font-black text-slate-900 text-center mb-2">
            Chưa có hợp đồng
          </Text>
          <Text className="text-[15px] text-slate-500 text-center leading-6 mb-8">
            Hiện tại bạn chưa có hợp đồng thuê phòng nào được kích hoạt. Vui lòng liên hệ quản lý nếu có thắc mắc.
          </Text>
          
          <Pressable 
            onPress={() => onRefresh()}
            className="bg-primary px-8 py-4 rounded-2xl shadow-lg shadow-primary/30"
          >
            <Text className="text-white font-bold text-[16px]">Kiểm tra lại</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );

  if (!contract) {
    return renderEmptyState();
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
            onPress={() => router.back()}
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
          className="bg-white rounded-[24px] p-6 mb-6"
          style={{
            borderWidth: 1,
            borderColor: Colors.border,
          }}
        >
          <View className="flex-row items-center mb-4">
            <View className="w-8 h-8 rounded-full bg-amber-100 items-center justify-center mr-3">
              <MaterialCommunityIcons name="cash-multiple" size={18} color="#D97706" />
            </View>
            <Text className="text-[16px] font-bold text-slate-900">Thông tin tài chính</Text>
          </View>
          
          <View className="flex-row justify-between mb-4">
            <Text className="text-slate-500">Giá thuê hàng tháng</Text>
            <Text className="font-bold text-slate-900">{formatCurrency(contract.monthlyPrice)}</Text>
          </View>
          
          <View className="flex-row justify-between mb-4">
            <Text className="text-slate-500">Tiền đặt cọc</Text>
            <Text className="font-bold text-slate-900">{formatCurrency(contract.deposit)}</Text>
          </View>
          
          <View className="h-[1px] bg-slate-100 w-full mb-4" />
          
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-slate-500 text-[13px]">Trạng thái cọc</Text>
              <Text className="font-bold text-emerald-600 text-[15px]">Đã thanh toán</Text>
            </View>
            <MaterialCommunityIcons name="check-decagram" size={24} color="#059669" />
          </View>
        </View>

        {contract.contractTemplateId && (
          <ContractTemplateSection templateId={contract.contractTemplateId} />
        )}

        <Text className="text-[13px] text-slate-400 text-center mt-8 italic px-4 leading-5">
          Bản hợp đồng số hóa có giá trị pháp lý tương đương bản giấy theo quy định của Ký túc xá và Pháp luật Việt Nam.
        </Text>
      </ScrollView>
    </View>
  );
}
