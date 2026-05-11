import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

type Props = {
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
};

export function RegistrationDetailRow({ label, value, icon }: Props) {
  return (
    <View className="flex-row items-center justify-between">
      <View className="flex-row items-center">
        <Ionicons name={icon} size={18} color="#64748B" />
        <Text className="ml-2 text-slate-500 font-medium">{label}</Text>
      </View>
      <Text className="text-slate-900 font-bold">{value}</Text>
    </View>
  );
}
