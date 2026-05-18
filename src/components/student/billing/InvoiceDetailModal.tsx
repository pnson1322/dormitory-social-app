import React, { useEffect, useRef } from "react";
import { Modal, View, Text, Pressable, ScrollView, Animated, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import { formatCurrency } from "@/utils/room";
import { Invoice } from "@/hooks/student/useStudentInvoices";
import { AppButton } from "@/components/AppButton";

const { height } = Dimensions.get("window");

type Props = {
  visible: boolean;
  invoice: Invoice | null;
  onClose: () => void;
};

export function InvoiceDetailModal({ visible, invoice, onClose }: Props) {
  const slideAnim = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }).start();
    } else {
      slideAnim.setValue(height);
    }
  }, [visible]);

  if (!invoice) return null;

  const isPaid = invoice.status === "PAID";

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 justify-end bg-black/50">
        <Pressable className="absolute inset-0" onPress={onClose} />
        
        <Animated.View 
          className="bg-white rounded-t-[32px] px-6 pb-10 pt-6"
          style={{ 
            maxHeight: "85%",
            transform: [{ translateY: slideAnim }]
          }}
        >
          <View className="items-center mb-6">
            <View className="h-1.5 w-12 rounded-full bg-slate-200" />
          </View>

          <View className="flex-row justify-between items-start mb-6">
            <View className="flex-1">
              <Text className="text-[24px] font-black text-slate-900">{invoice.title}</Text>

            </View>
            <Pressable 
              onPress={onClose}
              className="h-10 w-10 bg-slate-100 rounded-full items-center justify-center"
            >
              <Ionicons name="close" size={24} color={Colors.textPrimary} />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} className="mb-6">
            <View 
              className={`p-4 rounded-2xl flex-row items-center mb-6 ${
                isPaid ? "bg-emerald-50" : "bg-amber-50"
              }`}
            >
              <Ionicons 
                name={isPaid ? "checkmark-circle" : "alert-circle"} 
                size={24} 
                color={isPaid ? "#10B981" : "#F59E0B"} 
              />
              <View className="ml-3">
                <Text className={`font-bold text-[15px] ${isPaid ? "text-emerald-700" : "text-amber-700"}`}>
                  {isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
                </Text>
                <Text className="text-slate-500 text-[13px]">
                  {isPaid ? `Vào lúc ${invoice.paidDate}` : `Hạn chót: ${invoice.dueDate}`}
                </Text>
              </View>
            </View>

            <Text className="text-[13px] font-bold text-slate-400 uppercase tracking-widest mb-4">Chi tiết khoản phí</Text>
            
            <View className="bg-slate-50 rounded-3xl p-5 mb-6">
              {invoice.breakdown?.map((item, index) => (
                <View 
                  key={index} 
                  className={`flex-row justify-between py-3 ${
                    index !== (invoice.breakdown?.length || 0) - 1 ? "border-b border-slate-100" : ""
                  }`}
                >
                  <Text className="text-slate-600 font-medium">{item.label}</Text>
                  <Text className="text-slate-900 font-bold">{formatCurrency(item.amount)}</Text>
                </View>
              ))}
              
              <View className="mt-4 pt-4 border-t border-slate-200 flex-row justify-between items-center">
                <Text className="text-slate-900 font-black text-[18px]">Tổng cộng</Text>
                <Text className="text-primary font-black text-[22px]">
                  {formatCurrency(invoice.amount)}
                </Text>
              </View>
            </View>

            {!isPaid && (
              <View className="flex-row items-center p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <Ionicons name="information-circle" size={20} color={Colors.primary} />
                <Text className="ml-2 flex-1 text-[13px] text-blue-700 font-medium">
                  Vui lòng thanh toán trước hạn định để tránh bị gián đoạn các dịch vụ tại ký túc xá.
                </Text>
              </View>
            )}
          </ScrollView>

          {!isPaid && (
            <AppButton 
              title="Thanh toán ngay" 
              onPress={() => {}} 
            />
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}
