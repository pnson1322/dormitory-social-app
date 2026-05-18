import { AppButton } from "@/components/AppButton";
import { Colors } from "@/constants/colors";
import { RegistrationItem, RegistrationStatus } from "@/hooks/student/useRegistrationHistory";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Modal, Pressable, ScrollView, Text, View } from "react-native";
import { RegistrationDetailRow } from "./RegistrationDetailRow";

const { height } = Dimensions.get("window");

type Props = {
  visible: boolean;
  item: RegistrationItem | null;
  onClose: () => void;
};

const STATUS_CONFIG: Record<RegistrationStatus, { label: string; color: string; bg: string; icon: keyof typeof Ionicons.glyphMap }> = {
  PENDING: { label: "Đang chờ duyệt", color: "#F59E0B", bg: "#FEF3C7", icon: "time" },
  ACTIVE: { label: "Đang hoạt động", color: "#10B981", bg: "#D1FAE5", icon: "home" },
  COMPLETED: { label: "Đã hoàn thành", color: "#8B5CF6", bg: "#EDE9FE", icon: "flag" },
  CANCELLED: { label: "Đã hủy", color: "#6B7280", bg: "#F3F4F6", icon: "remove-circle" },
};


export function RegistrationDetailModal({ visible, item, onClose }: Props) {
  const [shouldRender, setShouldRender] = useState(visible);
  
  const slideAnim = useRef(new Animated.Value(height)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
      Animated.parallel([
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 50,
          friction: 9,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShouldRender(false);
      });
    }
  }, [visible]);

  if (!item && !shouldRender) return null;

  const handleClose = () => {
    onClose();
  };

  const status = item ? STATUS_CONFIG[item.status] : null;

  return (
    <Modal
      visible={shouldRender}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <View className="flex-1 justify-end">
        <Animated.View 
          className="absolute inset-0 bg-black/40" 
          style={{ opacity: backdropAnim }}
        >
          <Pressable className="flex-1" onPress={handleClose} />
        </Animated.View>
        
        <Animated.View 
          className="bg-white rounded-t-[40px] px-6 pt-3 pb-10"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -10 },
            shadowOpacity: 0.1,
            shadowRadius: 20,
            elevation: 20,
            transform: [{ translateY: slideAnim }]
          }}
        >
          <View className="items-center mb-6">
            <View className="h-1.5 w-12 rounded-full bg-slate-200" />
          </View>

          {item && status && (
            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="flex-row justify-between items-start mb-6">
                <View className="flex-1">
                  <Text className="text-[24px] font-black text-slate-900">Chi tiết đăng ký</Text>
                  <Text className="text-slate-400 font-medium mt-1 text-[13px]">{item.termName}</Text>
                </View>
                <View className="h-14 w-14 rounded-2xl bg-blue-50 items-center justify-center">
                  <Ionicons name="document-text" size={28} color={Colors.primary} />
                </View>
              </View>

              <View className="bg-slate-50 rounded-3xl p-5 mb-4 border border-slate-100">
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
                  <RegistrationDetailRow label="Học kỳ" value={item.termName} icon="school-outline" />
                  <RegistrationDetailRow
                    label="Ngày bắt đầu"
                    value={new Date(item.startDate).toLocaleDateString("vi-VN")}
                    icon="calendar-outline"
                  />
                  <RegistrationDetailRow
                    label="Ngày kết thúc"
                    value={new Date(item.endDate).toLocaleDateString("vi-VN")}
                    icon="calendar-clear-outline"
                  />
                  <RegistrationDetailRow
                    label="Số tháng"
                    value={`${item.numberOfMonths} tháng`}
                    icon="time-outline"
                  />
                  <RegistrationDetailRow
                    label="Ngày gửi yêu cầu"
                    value={new Date(item.createdAt).toLocaleDateString("vi-VN")}
                    icon="send-outline"
                  />
                </View>
              </View>

              <View className="bg-slate-50 rounded-3xl p-5 mb-4 border border-slate-100">
                <Text className="text-slate-500 font-bold mb-4">Chi phí</Text>
                <View className="h-[1px] bg-slate-200/50 w-full mb-4" />
                <View className="gap-y-3">
                  <View className="flex-row justify-between">
                    <Text className="text-slate-500">Giá / tháng</Text>
                    <Text className="font-bold text-slate-900">{item.pricePerMonth.toLocaleString("vi-VN")} đ</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-slate-500">Giá gốc</Text>
                    <Text className="font-bold text-slate-900">{item.basePrice.toLocaleString("vi-VN")} đ</Text>
                  </View>
                  <View className="h-[1px] bg-slate-200/50 w-full" />
                  <View className="flex-row justify-between">
                    <Text className="font-black text-slate-900">Tổng cộng</Text>
                    <Text className="font-black text-blue-600 text-[16px]">{item.totalPrice.toLocaleString("vi-VN")} đ</Text>
                  </View>
                </View>
              </View>

              {item.fees && item.fees.length > 0 && (
                <View className="bg-slate-50 rounded-3xl p-5 mb-6 border border-slate-100">
                  <Text className="text-slate-500 font-bold mb-4">Phí phát sinh</Text>
                  <View className="h-[1px] bg-slate-200/50 w-full mb-4" />
                  <View className="gap-y-3">
                    {item.fees.map((fee) => (
                      <View key={fee.id} className="flex-row justify-between items-center">
                        <View>
                          <Text className="text-slate-700 font-medium">{fee.feeName}</Text>
                          <Text className="text-[11px] text-slate-400">{fee.isRefundable ? "Có hoàn lại" : "Không hoàn lại"}</Text>
                        </View>
                        <Text className="font-bold text-slate-900">{fee.amount.toLocaleString("vi-VN")} đ</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              <AppButton title="Đóng" onPress={handleClose} variant="secondary" />
            </ScrollView>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}
