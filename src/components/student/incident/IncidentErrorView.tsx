import React from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";

interface Props {
  onRetry: () => void;
}

export function IncidentErrorView({ onRetry }: Props) {
  return (
    <View className="flex-1 justify-center items-center py-20 px-6">
      <View className="w-20 h-20 bg-red-50 rounded-full items-center justify-center mb-4">
        <Ionicons name="alert-circle-outline" size={40} color="#EF4444" />
      </View>
      <Text className="text-lg font-bold text-slate-900 mb-2">Đã xảy ra lỗi</Text>
      <Text className="text-slate-500 text-center mb-6 leading-relaxed">
        Không thể tải danh sách sự cố. Vui lòng kiểm tra kết nối mạng và thử lại.
      </Text>
      <Pressable
        onPress={onRetry}
        className="px-6 py-3 rounded-full bg-primary active:opacity-80"
        style={{ backgroundColor: Colors.primary }}
      >
        <Text className="text-white font-bold">Thử lại</Text>
      </Pressable>
    </View>
  );
}
