import React, { memo } from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import { Contract } from "@/services/contract/contract.types";

type Props = {
  contract: Contract;
};

export const ContractSummaryCard = memo(function ContractSummaryCard({ contract }: Props) {
  return (
    <View 
      className="bg-white rounded-[24px] p-6 mb-6"
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
      <View className="items-center mb-6 border-b border-slate-100 pb-6">
        <View className="h-16 w-16 rounded-full bg-primary/10 items-center justify-center mb-4">
          <Ionicons name="document-text" size={32} color={Colors.primary} />
        </View>
        <Text className="text-[20px] font-black text-slate-900 text-center mb-2">
          Hợp đồng Thuê phòng
        </Text>
        <View className="bg-emerald-50 px-3 py-1 rounded-full">
          <Text className="text-emerald-600 font-bold text-[12px]">ĐANG CÓ HIỆU LỰC</Text>
        </View>
      </View>

      <View className="gap-5">
        <View>
          <Text className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-1">Mã hợp đồng</Text>
          <Text className="text-[16px] font-bold text-slate-900">{contract.id}</Text>
        </View>

        <View className="flex-row">
          <View className="flex-1">
            <Text className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-1">Bên thuê (Sinh viên)</Text>
            <Text className="text-[16px] font-bold text-slate-900">{contract.studentName}</Text>
            <Text className="text-[14px] text-slate-500">{contract.studentId}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-1">Phòng đăng ký</Text>
            <Text className="text-[16px] font-bold text-slate-900">Phòng {contract.roomName}</Text>
            <Text className="text-[14px] text-slate-500">{contract.buildingName}</Text>
          </View>
        </View>

        <View className="flex-row">
          <View className="flex-1">
            <Text className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-1">Ngày bắt đầu</Text>
            <Text className="text-[16px] font-bold text-slate-900">{contract.startDate}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-1">Ngày kết thúc</Text>
            <Text className="text-[16px] font-bold text-slate-900">{contract.endDate}</Text>
          </View>
        </View>
      </View>
    </View>
  );
});
