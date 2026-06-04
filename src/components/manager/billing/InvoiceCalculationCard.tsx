import { formatCurrency } from "@/utils/room";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

type Props = {
  electricityConsumption: number;
  waterConsumption: number;
  otherFeesTotal: number;
};

export function InvoiceCalculationCard({ electricityConsumption, waterConsumption, otherFeesTotal }: Props) {
  return (
    <View className="bg-slate-900 rounded-[24px] p-6 mb-4">
      <Text className="text-white font-bold uppercase tracking-widest text-[12px] mb-4">Tổng kết hóa đơn</Text>
      
      <View className="gap-y-3">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <View className="h-7 w-7 rounded-lg bg-amber-500/20 items-center justify-center mr-2">
              <Ionicons name="flash" size={14} color="#F59E0B" />
            </View>
            <Text className="text-white/80 font-medium">Tiền điện</Text>
          </View>
          <Text className="text-white font-bold">{electricityConsumption} kWh</Text>
        </View>

        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <View className="h-7 w-7 rounded-lg bg-blue-500/20 items-center justify-center mr-2">
              <Ionicons name="water" size={14} color="#3B82F6" />
            </View>
            <Text className="text-white/80 font-medium">Tiền nước</Text>
          </View>
          <Text className="text-white font-bold">{waterConsumption} m³</Text>
        </View>

        {otherFeesTotal > 0 && (
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center">
              <View className="h-7 w-7 rounded-lg bg-purple-500/20 items-center justify-center mr-2">
                <Ionicons name="layers" size={14} color="#8B5CF6" />
              </View>
              <Text className="text-white/80 font-medium">Phụ phí khác</Text>
            </View>
            <Text className="text-white font-bold">{formatCurrency(otherFeesTotal)}</Text>
          </View>
        )}
      </View>

      <View className="h-[1px] bg-white/10 w-full my-4" />

      <View className="p-3 rounded-xl bg-white/5 flex-row items-start">
        <Ionicons name="information-circle" size={18} color="#94A3B8" style={{ marginTop: 1 }} />
        <View className="ml-2 flex-1">
          <Text className="text-white/60 text-[12px] font-medium leading-[18px]">
            Tổng hóa đơn được tính theo giá bậc thang dựa trên sức chứa phòng. Tiền điện sẽ cộng thêm VAT 8%. Giá nước đã bao gồm thuế/phí. Số tiền chính xác sẽ được hệ thống tính sau khi xác nhận.
          </Text>
        </View>
      </View>
    </View>
  );
}
