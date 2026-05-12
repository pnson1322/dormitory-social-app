import { formatCurrency } from "@/utils/room";
import React from "react";
import { Text, View } from "react-native";

type Props = {
  electricityTotal: number;
  waterTotal: number;
  otherFeesTotal: number;
  totalAmount: number;
};

export function InvoiceCalculationCard({ electricityTotal, waterTotal, otherFeesTotal, totalAmount }: Props) {
  return (
    <View className="bg-slate-900 rounded-[24px] p-6 mb-8">
      <Text className="text-white font-bold uppercase tracking-widest text-[12px] mb-4">Tổng kết hóa đơn</Text>
      
      <View className="gap-y-3">
        <Row label="Tiền điện" value={electricityTotal} />
        <Row label="Tiền nước" value={waterTotal} />
        <Row label="Phụ phí khác" value={otherFeesTotal} />
      </View>

      <View className="h-[1px] bg-white/10 w-full my-4" />

      <View className="flex-row justify-between items-center">
        <Text className="text-white text-[18px] font-bold">Tổng thanh toán</Text>
        <Text className="text-white text-[24px] font-black">{formatCurrency(totalAmount)}</Text>
      </View>
    </View>
  );
}

function Row({ label, value }: { label: string; value: number }) {
  return (
    <View className="flex-row justify-between items-center">
      <Text className="text-white/80 font-medium">{label}</Text>
      <Text className="text-white font-bold">{formatCurrency(value)}</Text>
    </View>
  );
}
