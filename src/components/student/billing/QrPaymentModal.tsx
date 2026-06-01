import { useToast } from "@/components/toast/ToastProvider";
import { Colors } from "@/constants/colors";
import { formatCurrency } from "@/utils/room";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, Clipboard, Dimensions, Image, Modal, Pressable, Text, View } from "react-native";

const { height } = Dimensions.get("window");

type Props = {
  visible: boolean;
  onClose: () => void;
  amount: number;
  memo: string;
  bankCode?: string;
  accountNumber?: string;
  accountName?: string;
  onConfirm: () => void;
  isConfirming?: boolean;
};

export function QrPaymentModal({
  visible,
  onClose,
  amount,
  memo,
  bankCode = "",
  accountNumber = "",
  accountName = "",
  onConfirm,
  isConfirming = false,
}: Props) {
  const { showToast } = useToast();

  const handleCopy = (text: string, fieldName: string) => {
    if (!text) return;
    Clipboard.setString(text);
    showToast({
      type: "success",
      title: "Đã sao chép",
      message: `Đã sao chép ${fieldName} vào bộ nhớ tạm.`,
    });
  };
  
  const cleanBankCode = (bankCode || "").trim().toUpperCase();
  const cleanAccountNumber = (accountNumber || "").trim();
  const cleanAccountName = (accountName || "").trim();
  
  const qrUrl = cleanBankCode && cleanAccountNumber 
    ? `https://img.vietqr.io/image/${cleanBankCode}-${cleanAccountNumber}-compact.png?amount=${amount}&addInfo=${encodeURIComponent(
        memo
      )}&accountName=${encodeURIComponent(cleanAccountName)}`
    : "";

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 justify-end bg-black/60">
        <Pressable className="absolute inset-0" onPress={onClose} />
        
        <View 
          className="bg-white rounded-t-[32px] px-6 pb-10 pt-6"
          style={{ maxHeight: "90%" }}
        >
          <View className="items-center mb-4">
            <View className="h-1.5 w-12 rounded-full bg-slate-200" />
          </View>

          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-[20px] font-black text-slate-900">Thanh toán chuyển khoản</Text>
            <Pressable 
              onPress={onClose}
              className="h-10 w-10 bg-slate-100 rounded-full items-center justify-center"
            >
              <Ionicons name="close" size={20} color={Colors.textPrimary} />
            </Pressable>
          </View>

          <View className="items-center mb-6">
            <Text className="text-slate-500 text-[13px] text-center mb-4">
              {qrUrl 
                ? "Quét mã QR dưới đây bằng ứng dụng ngân hàng của bạn để thanh toán tự động"
                : "Tòa nhà chưa cấu hình thông tin tài khoản thanh toán. Vui lòng liên hệ ban quản lý."}
            </Text>
            
            <View className="p-3 border-2 border-dashed border-blue-200 rounded-3xl bg-slate-50">
              {qrUrl ? (
                <Image 
                  source={{ uri: qrUrl }} 
                  className="w-56 h-56 rounded-2xl" 
                  resizeMode="contain" 
                />
              ) : (
                <View className="w-56 h-56 items-center justify-center bg-slate-100 rounded-2xl">
                  <Ionicons name="card-outline" size={48} color="#94A3B8" />
                  <Text className="text-[11px] text-slate-400 text-center mt-2 px-4">
                    Chưa có thông tin chuyển khoản
                  </Text>
                </View>
              )}
            </View>
          </View>

          <Text className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-3">
            Thông tin chuyển khoản
          </Text>

          <View className="bg-slate-50 rounded-2xl p-4 mb-6 border border-slate-100">
            <View className="flex-row justify-between py-2 border-b border-slate-100/50">
              <Text className="text-slate-500 text-[13px]">Ngân hàng</Text>
              <Text className="text-slate-850 font-bold text-[13px]">{cleanBankCode || "Chưa thiết lập"}</Text>
            </View>

            <View className="flex-row justify-between items-center py-2 border-b border-slate-100/50">
              <Text className="text-slate-500 text-[13px]">Số tài khoản</Text>
              {cleanAccountNumber ? (
                <Pressable 
                  onPress={() => handleCopy(cleanAccountNumber, "số tài khoản")}
                  className="flex-row items-center"
                >
                  <Text className="text-slate-900 font-bold text-[13px] mr-1">{cleanAccountNumber}</Text>
                  <Ionicons name="copy-outline" size={14} color={Colors.primary} />
                </Pressable>
              ) : (
                <Text className="text-slate-400 text-[13px]">Chưa thiết lập</Text>
              )}
            </View>

            <View className="flex-row justify-between py-2 border-b border-slate-100/50">
              <Text className="text-slate-500 text-[13px]">Chủ tài khoản</Text>
              <Text className="text-slate-900 font-bold text-[13px]">{cleanAccountName || "Chưa thiết lập"}</Text>
            </View>

            <View className="flex-row justify-between py-2 border-b border-slate-100/50">
              <Text className="text-slate-500 text-[13px]">Số tiền</Text>
              <Text className="text-blue-600 font-black text-[14px]">{formatCurrency(amount)}</Text>
            </View>

            <View className="flex-row justify-between items-center py-2">
              <Text className="text-slate-500 text-[13px]">Nội dung chuyển khoản</Text>
              <Pressable 
                onPress={() => handleCopy(memo, "nội dung chuyển khoản")}
                className="flex-row items-center"
              >
                <Text className="text-slate-900 font-bold text-[13px] mr-1" numberOfLines={1}>{memo}</Text>
                <Ionicons name="copy-outline" size={14} color={Colors.primary} />
              </Pressable>
            </View>
          </View>

          <View className="flex-row gap-3">
            <Pressable 
              onPress={onClose}
              className="flex-1 py-3.5 bg-slate-100 rounded-2xl items-center justify-center"
            >
              <Text className="text-slate-650 font-bold text-[14px]">Hủy</Text>
            </Pressable>
            <Pressable 
              onPress={onConfirm}
              disabled={isConfirming}
              className="flex-[2] py-3.5 bg-blue-650 rounded-2xl items-center justify-center flex-row"
              style={{ backgroundColor: Colors.primary }}
            >
              {isConfirming ? (
                <ActivityIndicator color="#FFFFFF" size="small" className="mr-2" />
              ) : (
                <Ionicons name="checkmark-circle-outline" size={18} color="#FFFFFF" className="mr-1.5" />
              )}
              <Text className="text-white font-bold text-[14px]">Xác nhận đã chuyển khoản</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
