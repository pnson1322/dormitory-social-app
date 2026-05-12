import { Colors } from "@/constants/colors";
import { ServiceFee } from "@/services/billing/billing.types";
import { formatCurrency } from "@/utils/room";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

type Props = {
  fees: ServiceFee[];
  onAdd: (name: string, amount: number) => void;
  onRemove: (id: string) => void;
};

export function ServiceFeeManager({ fees, onAdd, onRemove }: Props) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  const handleAdd = () => {
    if (!name || !amount) return;
    onAdd(name, parseInt(amount));
    setName("");
    setAmount("");
  };

  return (
    <View className="bg-white rounded-[24px] p-5 mb-4 border border-slate-100 shadow-sm">
      <Text className="text-[18px] font-bold text-slate-900 mb-4">Các phụ phí khác</Text>

      {fees.length > 0 ? (
        <View className="mb-6 gap-3">
          {fees.map((fee) => (
            <View key={fee.id} className="flex-row items-center justify-between bg-slate-50 p-3 rounded-xl">
              <View className="flex-1">
                <Text className="font-bold text-slate-800">{fee.name}</Text>
                <Text className="text-[13px] text-slate-500">{formatCurrency(fee.amount)}</Text>
              </View>
              <Pressable onPress={() => onRemove(fee.id)} className="h-8 w-8 items-center justify-center">
                <Ionicons name="trash-outline" size={18} color="#EF4444" />
              </Pressable>
            </View>
          ))}
        </View>
      ) : null}

      <View className="flex-row gap-2">
        <TextInput
          placeholder="Tên phí (v/d: Vệ sinh)"
          className="flex-[2] h-11 bg-slate-50 rounded-xl px-4 text-slate-900 border border-slate-200"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          placeholder="Số tiền"
          className="flex-1 h-11 bg-slate-50 rounded-xl px-4 text-slate-900 border border-slate-200"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
        <Pressable 
          onPress={handleAdd}
          className="h-11 w-11 bg-primary rounded-xl items-center justify-center active:opacity-80"
        >
          <Ionicons name="add" size={24} color="white" />
        </Pressable>
      </View>
    </View>
  );
}
