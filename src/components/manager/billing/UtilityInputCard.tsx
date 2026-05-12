import { Colors } from "@/constants/colors";
import { formatCurrency } from "@/utils/room";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TextInput, View } from "react-native";

type Props = {
  type: "electricity" | "water";
  lastReading: number;
  currentReading: number;
  onChange: (val: number) => void;
  unitPrice: number;
};

export function UtilityInputCard({ type, lastReading, currentReading, onChange, unitPrice }: Props) {
  const isElectricity = type === "electricity";
  const label = isElectricity ? "Điện" : "Nước";
  const unit = isElectricity ? "kWh" : "m³";
  const icon = isElectricity ? "flash" : "water";
  const color = isElectricity ? "#F59E0B" : "#3B82F6";
  const bg = isElectricity ? "bg-amber-50" : "bg-blue-50";

  const consumption = Math.max(0, currentReading - lastReading);
  const total = consumption * unitPrice;
  const isInvalid = currentReading < lastReading;

  return (
    <View className="bg-white rounded-[24px] p-5 mb-4 border border-slate-100 shadow-sm">
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <View className={`h-10 w-10 rounded-xl ${bg} items-center justify-center mr-3`}>
            <Ionicons name={icon} size={20} color={color} />
          </View>
          <Text className="text-[18px] font-bold text-slate-900">Chỉ số {label}</Text>
        </View>
        <View className="px-3 py-1 bg-slate-100 rounded-lg">
          <Text className="text-[12px] font-bold text-slate-500">{formatCurrency(unitPrice)}/{unit}</Text>
        </View>
      </View>

      <View className="flex-row gap-4 mb-4">
        <View className="flex-1">
          <Text className="text-[12px] font-bold text-slate-400 uppercase mb-2">Số cũ ({unit})</Text>
          <View className="h-12 bg-slate-50 rounded-xl justify-center px-4 border border-slate-100">
            <Text className="text-slate-900 font-bold">{lastReading}</Text>
          </View>
        </View>

        <View className="flex-1">
          <Text className={`text-[12px] font-bold uppercase mb-2 ${isInvalid ? "text-red-500" : "text-slate-400"}`}>
            Số mới ({unit})
          </Text>
          <TextInput
            className={`h-12 bg-white rounded-xl px-4 font-bold text-slate-900 border ${
              isInvalid ? "border-red-500 bg-red-50" : "border-slate-200"
            }`}
            keyboardType="numeric"
            value={currentReading.toString()}
            onChangeText={(text) => onChange(parseInt(text || "0"))}
          />
        </View>
      </View>

      {isInvalid && (
        <View className="flex-row items-center mb-4">
          <Ionicons name="alert-circle" size={16} color="#EF4444" />
          <Text className="ml-1 text-[12px] text-red-500 font-medium">Số mới không được nhỏ hơn số cũ</Text>
        </View>
      )}

      <View className="flex-row justify-between items-center pt-4 border-t border-slate-100">
        <View>
          <Text className="text-slate-500 text-[13px]">Tiêu thụ: <Text className="font-bold text-slate-900">{consumption} {unit}</Text></Text>
        </View>
        <Text className="text-primary font-black text-[18px]">{formatCurrency(total)}</Text>
      </View>
    </View>
  );
}
