import { AppButton } from "@/components/AppButton";
import { QrPaymentModal } from "@/components/student/billing/QrPaymentModal";
import { useToast } from "@/components/toast/ToastProvider";
import { Colors } from "@/constants/colors";
import { useStudentInvoiceDetail } from "@/hooks/student/useStudentInvoiceDetail";
import { Invoice } from "@/hooks/student/useStudentInvoices";
import { contractApi } from "@/services/contract/contract.api";
import { getBuildings } from "@/services/room/room.api";
import { confirmStudentPayment } from "@/services/billing/billing.api";
import { getApiErrorMessage } from "@/services/apiError";
import { formatCurrency } from "@/utils/room";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Animated, Dimensions, Modal, Pressable, ScrollView, Text, View } from "react-native";

const { height } = Dimensions.get("window");

type Props = {
  visible: boolean;
  invoice: Invoice | null;
  onClose: () => void;
  onPaymentSubmitted?: () => void;
};

export function InvoiceDetailModal({ visible, invoice, onClose, onPaymentSubmitted }: Props) {
  const slideAnim = useRef(new Animated.Value(height)).current;
  const { detail, loading, setDetail } = useStudentInvoiceDetail(invoice?.id, visible);
  const { showToast } = useToast();

  const [showQrModal, setShowQrModal] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [bankInfo, setBankInfo] = useState<{
    bankCode?: string;
    accountNumber?: string;
    accountName?: string;
  } | null>(null);

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
      setDetail(null);
      setBankInfo(null);
      setShowQrModal(false);
    }
  }, [visible, setDetail]);

  useEffect(() => {
    if (detail?.buildingBankAccount?.bankCode && detail?.buildingBankAccount?.accountNumber) {
      setBankInfo({
        bankCode: detail.buildingBankAccount.bankCode,
        accountNumber: detail.buildingBankAccount.accountNumber,
        accountName: detail.buildingBankAccount.accountName,
      });
      return;
    }

    const fetchBankDetails = async () => {
      if (visible && invoice) {
        try {
          const contractRes = await contractApi.getMyContract();
          const buildingCode = contractRes.data?.room?.buildingCode;

          if (buildingCode) {
            const buildings = await getBuildings();
            const match = buildings.find(
              (b) => b.code.toUpperCase() === buildingCode.toUpperCase()
            );
            if (match) {
              setBankInfo({
                bankCode: match.bankCode,
                accountNumber: match.accountNumber,
                accountName: match.accountName,
              });
              return;
            }
          }
        } catch (e) {
          console.log("Error loading building bank details:", e);
        }
      }
    };
    fetchBankDetails();
  }, [visible, invoice, detail]);

  if (!visible || !invoice) return null;

  const isPaid = invoice.status.toLowerCase() === "paid";
  const isPending = invoice.status.toLowerCase() === "waitforconfirm" || invoice.status.toLowerCase() === "wait_for_confirm";
  const isCanceled = invoice.status.toLowerCase() === "canceled";

  const handleConfirmPayment = async () => {
    try {
      setIsPaying(true);
      await confirmStudentPayment(invoice.id);
      showToast({
        type: "success",
        title: "Đã gửi xác nhận",
        message: "Yêu cầu thanh toán hóa đơn đang được Manager phê duyệt.",
      });
      setShowQrModal(false);
      onClose();
      onPaymentSubmitted?.();
    } catch (e) {
      showToast({
        type: "error",
        title: "Lỗi thanh toán",
        message: getApiErrorMessage(e),
      });
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <>
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
              {(() => {
                let bgClass = "bg-amber-50";
                let textClass = "text-amber-700";
                let iconName: any = "alert-circle";
                let iconColor = "#F59E0B";
                let statusLabel = "Chưa thanh toán";
                let statusDesc = `Hạn chót: ${invoice.dueDate}`;

                if (isPaid) {
                  bgClass = "bg-emerald-50";
                  textClass = "text-emerald-700";
                  iconName = "checkmark-circle";
                  iconColor = "#10B981";
                  statusLabel = "Đã thanh toán";
                  statusDesc = invoice.paidDate ? `Vào lúc ${invoice.paidDate}` : "Hóa đơn đã được thanh toán.";
                } else if (isPending) {
                  bgClass = "bg-blue-50";
                  textClass = "text-blue-700";
                  iconName = "time";
                  iconColor = "#3B82F6";
                  statusLabel = "Đang chờ duyệt";
                  statusDesc = "Hệ thống đang kiểm tra giao dịch chuyển khoản.";
                } else if (isCanceled) {
                  bgClass = "bg-slate-50";
                  textClass = "text-slate-500";
                  iconName = "close-circle";
                  iconColor = "#64748B";
                  statusLabel = "Đã hủy";
                  statusDesc = "Hóa đơn này đã được hủy bỏ.";
                }

                return (
                  <View className={`p-4 rounded-2xl flex-row items-center mb-6 ${bgClass}`}>
                    <Ionicons name={iconName} size={24} color={iconColor} />
                    <View className="ml-3">
                      <Text className={`font-bold text-[15px] ${textClass}`}>
                        {statusLabel}
                      </Text>
                      <Text className="text-slate-500 text-[13px]">
                        {statusDesc}
                      </Text>
                    </View>
                  </View>
                );
              })()}

              <Text className="text-[13px] font-bold text-slate-400 uppercase tracking-widest mb-4">Chi tiết khoản phí</Text>
              
              <View className="bg-slate-50 rounded-3xl p-5 mb-6">
                {loading ? (
                  <View className="py-8 items-center justify-center">
                    <ActivityIndicator color={Colors.primary} size="small" />
                    <Text className="mt-2 text-slate-400 text-[13px]">Đang tải chi tiết khoản phí...</Text>
                  </View>
                ) : (
                  <>
                    {(detail 
                      ? [
                          { label: `Tiền điện (${detail.electricityUsage} kWh)`, amount: detail.electricityAmount },
                          { label: `Tiền nước (${detail.waterUsage} m³)`, amount: detail.waterAmount },
                          ...detail.surcharges.map(s => ({ label: s.name, amount: s.amount }))
                        ]
                      : (invoice.breakdown || [
                          { label: "Tiền phòng", amount: invoice.amount },
                        ])
                    ).map((item, index, arr) => (
                      <View 
                        key={index} 
                        className={`flex-row justify-between py-3 ${
                          index !== arr.length - 1 ? "border-b border-slate-100" : ""
                        }`}
                      >
                        <Text className="text-slate-650 font-medium">{item.label}</Text>
                        <Text className="text-slate-900 font-bold">{formatCurrency(item.amount)}</Text>
                      </View>
                    ))}
                    
                    <View className="mt-4 pt-4 border-t border-slate-200 flex-row justify-between items-center">
                      <Text className="text-slate-900 font-black text-[18px]">Tổng cộng</Text>
                      <Text className="text-primary font-black text-[22px]">
                        {formatCurrency(detail ? detail.totalAmount : invoice.amount)}
                      </Text>
                    </View>
                  </>
                )}
              </View>

              {invoice.status.toLowerCase() === "unpaid" && (
                <View className="flex-row items-center p-4 bg-blue-50 rounded-2xl border border-blue-100">
                  <Ionicons name="information-circle" size={20} color={Colors.primary} />
                  <Text className="ml-2 flex-1 text-[13px] text-blue-700 font-medium">
                    Vui lòng thanh toán trước hạn định để tránh bị gián đoạn các dịch vụ tại ký túc xá.
                  </Text>
                </View>
              )}
            </ScrollView>

            {invoice.status.toLowerCase() === "unpaid" && (
              <AppButton 
                title="Thanh toán ngay" 
                onPress={() => setShowQrModal(true)} 
              />
            )}
            {isPending && (
              <AppButton 
                title="Đang chờ xác nhận thanh toán" 
                disabled
                onPress={() => {}}
              />
            )}
          </Animated.View>
        </View>
      </Modal>

      <QrPaymentModal
        visible={showQrModal}
        onClose={() => setShowQrModal(false)}
        amount={detail ? detail.totalAmount : invoice.amount}
        memo={`HD${invoice.id.substring(0, 8).toUpperCase()}`}
        bankCode={bankInfo?.bankCode}
        accountNumber={bankInfo?.accountNumber}
        accountName={bankInfo?.accountName}
        onConfirm={handleConfirmPayment}
        isConfirming={isPaying}
      />
    </>
  );
}
