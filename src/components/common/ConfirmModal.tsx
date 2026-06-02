import { AppButton } from "@/components/AppButton";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, Pressable, Text, View } from "react-native";

type Props = {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  type?: "danger" | "primary" | "success";
  loading?: boolean;
};

export function ConfirmModal({
  visible,
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = "Xác nhận",
  cancelLabel = "Hủy",
  type = "primary",
  loading = false,
}: Props) {
  const iconName = type === "danger" ? "alert-circle" : type === "success" ? "checkmark-circle" : "help-circle";
  const color = type === "danger" ? "#EF4444" : type === "success" ? "#10B981" : "#3B82F6";
  const bg = type === "danger" ? "#FEF2F2" : type === "success" ? "#F0FDF4" : "#EFF6FF";

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 justify-center items-center bg-black/50 px-6">
        <View className="bg-white rounded-[32px] w-full p-6 items-center">
          <View className="h-16 w-16 rounded-full items-center justify-center mb-4" style={{ backgroundColor: bg }}>
            <Ionicons name={iconName} size={32} color={color} />
          </View>
          
          <Text className="text-[20px] font-black text-slate-900 text-center mb-2">{title}</Text>
          <Text className="text-slate-500 text-center mb-8 leading-5">{message}</Text>

          <View className="flex-row gap-3 w-full">
            <View className="flex-1">
              <AppButton 
                title={cancelLabel} 
                onPress={onCancel} 
                variant="secondary" 
                disabled={loading}
              />
            </View>
            <View className="flex-1">
              <AppButton 
                title={confirmLabel} 
                onPress={onConfirm} 
                loading={loading}
                style={{ backgroundColor: color }}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
