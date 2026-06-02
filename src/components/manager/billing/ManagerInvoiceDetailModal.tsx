import { AppButton } from "@/components/AppButton";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { Colors } from "@/constants/colors";
import { useInvoiceActions } from "@/hooks/manager/useInvoiceActions";
import { InvoiceSummary } from "@/services/billing/billing.types";
import { formatCurrency } from "@/utils/room";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Modal, Pressable, ScrollView, Text, View } from "react-native";

const { height } = Dimensions.get("window");

type Props = {
  visible: boolean;
  invoice: InvoiceSummary | null;
  onClose: () => void;
  onRefresh: () => void;
};

export function ManagerInvoiceDetailModal({ visible, invoice, onClose, onRefresh }: Props) {
  const router = useRouter();
  const { confirmPayment, handleCancelInvoice, loading } = useInvoiceActions();
  const [showConfirmPaid, setShowConfirmPaid] = useState(false);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  
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
  }, [visible, slideAnim]);

  if (!invoice) return null;

  const isPaid = invoice.status.toLowerCase() === "paid";
  const isPendingConfirm = invoice.status.toLowerCase() === "waitforconfirm" || invoice.status.toLowerCase() === "wait_for_confirm";
  const isCanceled = invoice.status.toLowerCase() === "canceled";

  const handlePaid = async () => {
    const success = await confirmPayment(invoice.id);
    if (success) {
      setShowConfirmPaid(false);
      onRefresh();
      onClose();
    }
  };

  const handleCancel = async () => {
    const success = await handleCancelInvoice(invoice.id);
    if (success) {
      setShowConfirmCancel(false);
      onRefresh();
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 justify-end bg-black/50">
        <Pressable className="absolute inset-0" onPress={onClose} />
        
        <Animated.View 
          className="bg-white rounded-t-[40px] px-6 pt-3 pb-10"
          style={{ 
            maxHeight: "90%",
            transform: [{ translateY: slideAnim }]
          }}
        >
          <View className="items-center mb-6">
            <View className="h-1.5 w-12 rounded-full bg-slate-200" />
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="flex-row justify-between items-start mb-6">
              <View className="flex-1">
                <Text className="text-[26px] font-black text-slate-900">Chi tiết hóa đơn</Text>
                <Text className="text-slate-400 font-bold mt-1 uppercase tracking-widest text-[12px]">
                  MÃ: {invoice.id}
                </Text>
              </View>
              <Pressable 
                onPress={() => {
                  onClose();
                  router.push({
                    pathname: "/(manager)/invoices/create",
                    params: { 
                      roomId: invoice.roomId, 
                      roomName: invoice.roomName,
                      isEdit: "true",
                      invoiceId: invoice.id
                    }
                  });
                }}
                className="h-12 w-12 rounded-[20px] bg-blue-50 items-center justify-center active:bg-blue-100"
              >
                <Ionicons name="create-outline" size={24} color={Colors.primary} />
              </Pressable>
            </View>

            <View className="bg-slate-50 rounded-[32px] p-6 mb-6 border border-slate-100">
              <View className="flex-row items-center justify-between mb-6">
                <Text className="text-slate-500 font-bold">Phòng</Text>
                <Text className="text-slate-900 font-black text-[20px]">Phòng {invoice.roomName}</Text>
              </View>
              
              <View className="flex-row items-center justify-between mb-8">
                <Text className="text-slate-500 font-bold">Trạng thái</Text>
                <View className={`px-4 py-2 rounded-full ${
                  isPaid ? "bg-emerald-50" :
                  isPendingConfirm ? "bg-blue-50" :
                  isCanceled ? "bg-slate-100" : "bg-amber-50"
                }`}>
                  <Text className={`text-[12px] font-black uppercase tracking-wider ${
                    isPaid ? "text-emerald-600" :
                    isPendingConfirm ? "text-blue-600" :
                    isCanceled ? "text-slate-600" : "text-amber-600"
                  }`}>
                    {
                      isPaid ? "Đã thanh toán" :
                      isPendingConfirm ? "Chờ xác nhận" :
                      isCanceled ? "Đã hủy" : "Đang chờ thu"
                    }
                  </Text>
                </View>
              </View>

              <View className="gap-y-4 mb-8">
                <Text className="text-[14px] font-black text-slate-400 uppercase tracking-tighter mb-1">Chi tiết tiêu thụ</Text>
                
                {invoice.electricity && (
                  <DetailRow 
                    label="Tiền điện" 
                    value={formatCurrency(invoice.electricity.amount)} 
                    subValue={`${invoice.electricity.consumption} kWh`} 
                    icon="flash" 
                    iconColor="#F59E0B"
                  />
                )}
                
                {invoice.water && (
                  <DetailRow 
                    label="Tiền nước" 
                    value={formatCurrency(invoice.water.amount)} 
                    subValue={`${invoice.water.consumption} m³`} 
                    icon="water" 
                    iconColor="#3B82F6"
                  />
                )}

                {invoice.otherFeesTotal ? (
                  <DetailRow 
                    label="Phụ phí dịch vụ" 
                    value={formatCurrency(invoice.otherFeesTotal)} 
                    icon="layers" 
                    iconColor="#8B5CF6"
                  />
                ) : null}
              </View>

              <View className="h-[1px] bg-slate-200/50 w-full mb-6 border-dashed border-[1px] border-slate-300" />

              <View className="flex-row items-center justify-between">
                <Text className="text-slate-900 font-bold text-[18px]">Tổng số tiền</Text>
                <Text className="text-primary font-black text-[26px]">{formatCurrency(invoice.totalAmount)}</Text>
              </View>
            </View>

            {!isPaid && !isCanceled && (
              <View className="gap-y-3 mb-4">
                <AppButton 
                  title="Xác nhận đã thu tiền" 
                  onPress={() => setShowConfirmPaid(true)} 
                  style={{ backgroundColor: "#10B981" }}
                />
                <AppButton 
                  title="Hủy hóa đơn này" 
                  onPress={() => setShowConfirmCancel(true)} 
                  variant="secondary"
                  style={{ backgroundColor: "#FEE2E2" }}
                />
              </View>
            )}

            <AppButton title="Đóng" onPress={onClose} variant="secondary" />
          </ScrollView>
        </Animated.View>
      </View>

      <ConfirmModal
        visible={showConfirmPaid}
        title="Xác nhận thu tiền?"
        message={`Hệ thống sẽ chuyển trạng thái hóa đơn phòng ${invoice.roomName} sang Đã thanh toán. Bạn có chắc chắn?`}
        onConfirm={handlePaid}
        onCancel={() => setShowConfirmPaid(false)}
        type="success"
        confirmLabel="Xác nhận thu"
        loading={loading}
      />

      <ConfirmModal
        visible={showConfirmCancel}
        title="Hủy hóa đơn?"
        message="Hành động này sẽ xóa vĩnh viễn hóa đơn. Bạn nên kiểm tra kỹ trước khi thực hiện."
        onConfirm={handleCancel}
        onCancel={() => setShowConfirmCancel(false)}
        type="danger"
        confirmLabel="Xác nhận hủy"
        loading={loading}
      />
    </Modal>
  );
}

function DetailRow({ label, value, subValue, icon, iconColor }: { label: string; value: string; subValue?: string; icon: keyof typeof Ionicons.glyphMap; iconColor: string }) {
  return (
    <View className="flex-row items-center justify-between">
      <View className="flex-row items-center">
        <View className="h-8 w-8 rounded-lg items-center justify-center mr-3" style={{ backgroundColor: `${iconColor}15` }}>
          <Ionicons name={icon} size={16} color={iconColor} />
        </View>
        <View>
          <Text className="text-slate-700 font-bold">{label}</Text>
          {subValue && <Text className="text-[12px] text-slate-400 font-medium">{subValue}</Text>}
        </View>
      </View>
      <Text className="text-slate-900 font-black">{value}</Text>
    </View>
  );
}
