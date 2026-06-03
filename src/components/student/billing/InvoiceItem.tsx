import { Colors } from "@/constants/colors";
import { Invoice } from "@/hooks/student/useStudentInvoices";
import { formatCurrency } from "@/utils/room";
import { formatDateToDisplay, formatDateTime } from "@/utils/date";
import { Ionicons } from "@expo/vector-icons";
import React, { memo } from "react";
import { Pressable, Text, View } from "react-native";

type Props = {
  item: Invoice;
  overdue: boolean;
  onPress?: () => void;
};

const getStatusStyles = (status: string, overdue: boolean) => {
  switch (status.toLowerCase()) {
    case "paid":
      return {
        bg: "bg-emerald-50",
        badgeBg: "bg-emerald-100",
        badgeText: "text-emerald-700",
        iconColor: "#10B981",
        label: "ĐÃ THANH TOÁN",
        dateLabel: "Ngày thanh toán",
      };
    case "waitforconfirm":
    case "wait_for_confirm":
      return {
        bg: "bg-blue-50",
        badgeBg: "bg-blue-100",
        badgeText: "text-blue-700",
        iconColor: "#3B82F6",
        label: "ĐANG CHỜ DUYỆT",
        dateLabel: "Hạn thanh toán",
      };
    case "canceled":
      return {
        bg: "bg-slate-50",
        badgeBg: "bg-slate-100",
        badgeText: "text-slate-500",
        iconColor: "#64748B",
        label: "ĐÃ HỦY",
        dateLabel: "Hạn thanh toán",
      };
    case "unpaid":
    default:
      if (overdue) {
        return {
          bg: "bg-red-50",
          badgeBg: "bg-red-100",
          badgeText: "text-red-700",
          iconColor: "#EF4444",
          label: "QUÁ HẠN",
          dateLabel: "Hạn thanh toán",
        };
      }
      return {
        bg: "bg-amber-50",
        badgeBg: "bg-amber-100",
        badgeText: "text-amber-700",
        iconColor: "#F59E0B",
        label: "CHỜ THANH TOÁN",
        dateLabel: "Hạn thanh toán",
      };
  }
};

export const InvoiceItem = memo(function InvoiceItem({ item, overdue, onPress }: Props) {
  const statusStyles = getStatusStyles(item.status, overdue);

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
            className={`h-10 w-10 rounded-full items-center justify-center mr-3 ${statusStyles.bg}`}
          >
            <Ionicons 
              name="receipt" 
              size={20} 
              color={statusStyles.iconColor} 
            />
          </View>
          <View className="flex-1">
            <Text className="text-[16px] font-bold text-slate-900" numberOfLines={1}>{item.title}</Text>
            <Text className="text-[13px] text-slate-500 mt-0.5">{item.type}</Text>
          </View>
        </View>
        
        <View className={`px-2.5 py-1 rounded-full ${statusStyles.badgeBg}`}>
          <Text className={`text-[11px] font-bold ${statusStyles.badgeText}`}>
            {statusStyles.label}
          </Text>
        </View>
      </View>

      <View className="h-[1px] bg-slate-100 w-full my-3" />

      <View className="flex-row justify-between items-end">
        <View>
          <Text className="text-[12px] text-slate-400 font-medium mb-1">
            {statusStyles.dateLabel}
          </Text>
          <Text className={`text-[14px] font-bold ${overdue ? "text-red-500" : "text-slate-700"}`}>
            {item.status.toLowerCase() === "paid"
              ? formatDateTime(item.paidDate ?? null)
              : formatDateToDisplay(item.dueDate)}
            {overdue && " (Quá hạn)"}
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-[12px] text-slate-400 font-medium mb-1">Tổng tiền</Text>
          <Text className={`text-[18px] font-black ${item.status.toLowerCase() === "unpaid" ? "text-primary" : "text-slate-900"}`}>
            {formatCurrency(item.amount)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
});
