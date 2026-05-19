import React from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export function IncidentEmptyState() {
  return (
    <View className="flex-1 justify-center items-center py-20 px-4">
      <View className="w-20 h-20 bg-slate-50 rounded-full items-center justify-center mb-4">
        <Ionicons name="checkmark-done-circle-outline" size={40} color="#94A3B8" />
      </View>
      <Text className="text-lg font-bold text-slate-900 mb-2">Không có sự cố nào</Text>
      <Text className="text-slate-400 text-center leading-relaxed">
        Hiện tại không ghi nhận báo cáo sự cố nào thuộc nhóm này.
      </Text>
    </View>
  );
}
