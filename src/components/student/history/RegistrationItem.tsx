import { Colors } from "@/constants/colors";
import { RegistrationItem as RegistrationType, RegistrationStatus } from "@/hooks/student/useRegistrationHistory";
import { Ionicons } from "@expo/vector-icons";
import React, { memo } from "react";
import { Pressable, Text, View } from "react-native";

type Props = {
  item: RegistrationType;
  onPress?: () => void;
};

const STATUS_CONFIG: Record<RegistrationStatus, { label: string; color: string; bg: string; icon: keyof typeof Ionicons.glyphMap }> = {
  PENDING: { label: "Đang chờ", color: "#F59E0B", bg: "#FEF3C7", icon: "time" },
  APPROVED: { label: "Đã duyệt", color: "#10B981", bg: "#D1FAE5", icon: "checkmark-circle" },
  REJECTED: { label: "Từ chối", color: "#EF4444", bg: "#FEE2E2", icon: "close-circle" },
  CANCELLED: { label: "Đã hủy", color: "#6B7280", bg: "#F3F4F6", icon: "remove-circle" },
};

const TYPE_LABELS = {
  NEW: "Đăng ký mới",
  RENEW: "Gia hạn",
  TRANSFER: "Chuyển phòng",
};

export const RegistrationItem = memo(function RegistrationItem({ item, onPress }: Props) {
  const status = STATUS_CONFIG[item.status];

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
        borderColor: Colors.border,
      }}
    >
      <View className="flex-row justify-between items-start mb-4">
        <View className="flex-row items-center flex-1 mr-2">
          <View className="h-10 w-10 rounded-full bg-slate-100 items-center justify-center mr-3">
            <Ionicons name="home" size={20} color={Colors.primary} />
          </View>
          <View className="flex-1">
            <Text className="text-[16px] font-bold text-slate-900" numberOfLines={1}>
              Phòng {item.roomName}
            </Text>
            <Text className="text-[13px] text-slate-500 mt-0.5">{TYPE_LABELS[item.type]}</Text>
          </View>
        </View>
        
        <View className="px-3 py-1 rounded-full flex-row items-center" style={{ backgroundColor: status.bg }}>
          <Ionicons name={status.icon} size={14} color={status.color} className="mr-1" />
          <Text className="text-[11px] font-bold uppercase" style={{ color: status.color }}>
            {status.label}
          </Text>
        </View>
      </View>

      <View className="h-[1px] bg-slate-100 w-full mb-4" />

      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center">
          <Ionicons name="calendar-outline" size={14} color="#94A3B8" />
          <Text className="text-[13px] text-slate-500 ml-1.5">{item.requestDate}</Text>
        </View>
        <Text className="text-[12px] font-bold text-slate-400">ID: {item.id}</Text>
      </View>

      {item.note && (
        <View className="mt-4 p-3 bg-slate-50 rounded-xl">
          <Text className="text-[12px] text-slate-500 italic" numberOfLines={2}>
            "{item.note}"
          </Text>
        </View>
      )}
    </Pressable>
  );
});
