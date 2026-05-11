import { AppButton } from "@/components/AppButton";
import { Colors } from "@/constants/colors";
import { RegistrationItem, RegistrationStatus } from "@/hooks/student/useRegistrationHistory";
import { RegistrationDetailRow } from "./RegistrationDetailRow";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";

type Props = {
  visible: boolean;
  item: RegistrationItem | null;
  onClose: () => void;
};

const STATUS_CONFIG: Record<RegistrationStatus, { label: string; color: string; bg: string; icon: keyof typeof Ionicons.glyphMap }> = {
  PENDING: { label: "Đang chờ duyệt", color: "#F59E0B", bg: "#FEF3C7", icon: "time" },
  APPROVED: { label: "Đã phê duyệt", color: "#10B981", bg: "#D1FAE5", icon: "checkmark-circle" },
  REJECTED: { label: "Đã từ chối", color: "#EF4444", bg: "#FEE2E2", icon: "close-circle" },
  CANCELLED: { label: "Đã hủy bỏ", color: "#6B7280", bg: "#F3F4F6", icon: "remove-circle" },
};

const TYPE_LABELS = {
  NEW: "Đăng ký mới",
  RENEW: "Gia hạn hợp đồng",
  TRANSFER: "Chuyển phòng",
};

export function RegistrationDetailModal({ visible, item, onClose }: Props) {
  if (!item) return null;

  const status = STATUS_CONFIG[item.status];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end">
        <Pressable 
          className="absolute inset-0 bg-black/40" 
          onPress={onClose} 
        />
        
        <View 
          className="bg-white rounded-t-[40px] px-6 pt-3 pb-10"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -10 },
            shadowOpacity: 0.1,
            shadowRadius: 20,
            elevation: 20,
          }}
        >
          <View className="items-center mb-6">
            <View className="h-1.5 w-12 rounded-full bg-slate-200" />
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="flex-row justify-between items-start mb-6">
              <View className="flex-1">
                <Text className="text-[24px] font-black text-slate-900">Chi tiết yêu cầu</Text>
                <Text className="text-slate-500 font-bold mt-1 uppercase tracking-widest text-[12px]">
                  Mã số: {item.id}
                </Text>
              </View>
              <View className="h-14 w-14 rounded-2xl bg-blue-50 items-center justify-center">
                <Ionicons name="document-text" size={28} color={Colors.primary} />
              </View>
            </View>

            <View className="bg-slate-50 rounded-3xl p-5 mb-6 border border-slate-100">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-slate-500 font-bold">Trạng thái</Text>
                <View className="px-4 py-1.5 rounded-full flex-row items-center" style={{ backgroundColor: status.bg }}>
                  <Ionicons name={status.icon} size={16} color={status.color} className="mr-1.5" />
                  <Text className="text-[13px] font-black uppercase" style={{ color: status.color }}>
                    {status.label}
                  </Text>
                </View>
              </View>
              
              <View className="h-[1px] bg-slate-200/50 w-full mb-4" />
              
              <View className="gap-y-4">
                <RegistrationDetailRow label="Loại yêu cầu" value={TYPE_LABELS[item.type]} icon="layers-outline" />
                <RegistrationDetailRow label="Phòng đăng ký" value={`Phòng ${item.roomName}`} icon="home-outline" />
                <RegistrationDetailRow label="Tòa nhà" value={item.buildingName} icon="business-outline" />
                <RegistrationDetailRow label="Ngày gửi" value={item.requestDate} icon="calendar-outline" />
              </View>
            </View>

            <Text className="text-[16px] font-bold text-slate-900 mb-3 px-1">Ghi chú từ sinh viên</Text>
            <View className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-8">
              <Text className="text-slate-600 leading-5">
                {item.note || "Không có ghi chú nào được để lại cho yêu cầu này."}
              </Text>
            </View>

            <AppButton title="Đóng" onPress={onClose} variant="secondary" />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
