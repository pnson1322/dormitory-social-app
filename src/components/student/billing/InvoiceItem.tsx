import { Colors } from "@/constants/colors";
import { Invoice } from "@/hooks/student/useStudentInvoices";
import { formatCurrency } from "@/utils/room";
import { Ionicons } from "@expo/vector-icons";
import React, { memo } from "react";
import { Pressable, Text, View } from "react-native";

type Props = {
  item: Invoice;
  overdue: boolean;
  onPress?: () => void;
};

export const InvoiceItem = memo(function InvoiceItem({ item, overdue, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      className="bg-white p-5 rounded-[24px] mb-4 active:opacity-70"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 2,
        borderWidth: 1,
        borderColor: overdue ? "#FECACA" : Colors.border,
      }}
    >
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-row items-center flex-1 mr-2">
          <View 
            className={`h-10 w-10 rounded-full items-center justify-center mr-3 ${
              item.status === "PAID" ? "bg-emerald-50" : overdue ? "bg-red-50" : "bg-amber-50"
            }`}
          >
            <Ionicons 
              name="receipt" 
              size={20} 
              color={item.status === "PAID" ? "#10B981" : overdue ? "#EF4444" : "#F59E0B"} 
            />
          </View>
          <View className="flex-1">
            <Text className="text-[16px] font-bold text-slate-900" numberOfLines={1}>{item.title}</Text>
            <Text className="text-[13px] text-slate-500 mt-0.5">{item.type}</Text>
          </View>
        </View>
        
        <View className={`px-2.5 py-1 rounded-full ${item.status === "PAID" ? "bg-emerald-100" : "bg-amber-100"}`}>
          <Text className={`text-[11px] font-bold ${item.status === "PAID" ? "text-emerald-700" : "text-amber-700"}`}>
            {item.status === "PAID" ? "ĐÃ THANH TOÁN" : "CHỜ THANH TOÁN"}
          </Text>
        </View>
      </View>

      <View className="h-[1px] bg-slate-100 w-full my-3" />

      <View className="flex-row justify-between items-end">
        <View>
          <Text className="text-[12px] text-slate-400 font-medium mb-1">
            {item.status === "PAID" ? "Ngày thanh toán" : "Hạn thanh toán"}
          </Text>
          <Text className={`text-[14px] font-bold ${overdue ? "text-red-500" : "text-slate-700"}`}>
            {item.status === "PAID" ? item.paidDate : item.dueDate}
            {overdue && " (Quá hạn)"}
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-[12px] text-slate-400 font-medium mb-1">Tổng tiền</Text>
          <Text className={`text-[18px] font-black ${item.status === "UNPAID" ? "text-primary" : "text-slate-900"}`}>
            {formatCurrency(item.amount)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
});
