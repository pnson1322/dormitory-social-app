import { AppButton } from "@/components/AppButton";
import { InvoiceCalculationCard } from "@/components/manager/billing/InvoiceCalculationCard";
import { ServiceFeeManager } from "@/components/manager/billing/ServiceFeeManager";
import { UtilityInputCard } from "@/components/manager/billing/UtilityInputCard";
import { useToast } from "@/components/toast/ToastProvider";
import { Colors } from "@/constants/colors";
import { useUtilityManagement } from "@/hooks/manager/useUtilityManagement";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useMemo } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function CreateRoomInvoiceScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const { roomId, roomName, isEdit, invoiceId } = useLocalSearchParams();
  const editing = isEdit === "true";

  const {
    setRoomId,
    currentReadings,
    setCurrentReadings,
    lastReadings,
    electricity,
    water,
    otherFees,
    addOtherFee,
    removeOtherFee,
    otherFeesTotal,
    isValid,
    loading,
    fetchingReadings,
    error,
    submitInvoice,
    resetForm,
    fetchReadings,
    fetchInvoiceDetailsForEdit,
  } = useUtilityManagement();

  useFocusEffect(
    useCallback(() => {
      if (editing && invoiceId) {
        fetchInvoiceDetailsForEdit(invoiceId as string);
      } else if (roomId) {
        setRoomId(roomId as string);
        fetchReadings(roomId as string);
      }

      return () => {
        resetForm();
      };
    }, [roomId, editing, invoiceId, setRoomId, resetForm, fetchReadings, fetchInvoiceDetailsForEdit])
  );

  const isFormComplete = useMemo(() => {
    return (
      isValid && 
      (currentReadings.electricity > 0 || currentReadings.water > 0) &&
      !fetchingReadings
    );
  }, [isValid, currentReadings, fetchingReadings]);

  const handleSubmit = async () => {
    const result = await submitInvoice(editing, invoiceId as string);
    if (result === true) {
      showToast({
        type: "success",
        title: "Thành công",
        message: editing 
          ? `Hóa đơn phòng ${roomName} đã được cập nhật.`
          : `Hóa đơn phòng ${roomName} đã được tạo thành công.`
      });
      router.navigate("/(manager)/invoices");
    } else {
      showToast({
        type: "error",
        title: "Lỗi",
        message: result || "Không thể tạo hóa đơn."
      });
    }
  };

  if (fetchingReadings) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator color={Colors.primary} size="large" />
        <Text className="mt-4 text-slate-400 font-bold uppercase tracking-widest text-[12px]">
          {editing ? "Đang tải dữ liệu hóa đơn..." : "Đang lấy chỉ số cũ..."}
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
      <View 
        className="px-5 pb-4 pt-4 bg-white"
        style={{ 
          paddingTop: insets.top + 10,
          borderBottomWidth: 1,
          borderBottomColor: Colors.border,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          elevation: 3,
        }}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Pressable
              onPress={() => router.navigate("/(manager)/invoices/select-room")}
              className="h-10 w-10 items-center justify-center rounded-full bg-slate-100 mr-3"
            >
              <Ionicons name="arrow-back" size={20} color={Colors.textPrimary} />
            </Pressable>
            <View>
              <Text className="text-[20px] font-black text-slate-900">
                {editing ? "Chỉnh sửa hóa đơn" : `Chốt số phòng ${roomName}`}
              </Text>
              <Text className="text-[13px] text-slate-400 font-bold uppercase tracking-widest">
                Phòng {roomName} • Kỳ: {new Date().getMonth() + 1}/{new Date().getFullYear()}
              </Text>
            </View>
          </View>
          <View className="h-12 w-12 rounded-2xl bg-blue-50 items-center justify-center">
            <Ionicons name={editing ? "create" : "flash"} size={24} color={Colors.primary} />
          </View>
        </View>
      </View>

      <ScrollView 
        className="flex-1 px-5 pt-6" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <SectionTitle title="Tiêu thụ năng lượng" icon="speedometer-outline" />
        <UtilityInputCard 
          type="electricity"
          lastReading={lastReadings.electricity}
          currentReading={currentReadings.electricity}
          onChange={(val) => setCurrentReadings(prev => ({ ...prev, electricity: val }))}
        />

        <UtilityInputCard 
          type="water"
          lastReading={lastReadings.water}
          currentReading={currentReadings.water}
          onChange={(val) => setCurrentReadings(prev => ({ ...prev, water: val }))}
        />

        <SectionTitle title="Dịch vụ bổ sung" icon="apps-outline" />
        <ServiceFeeManager 
          fees={otherFees}
          onAdd={addOtherFee}
          onRemove={removeOtherFee}
        />

        <SectionTitle title="Tạm tính" icon="calculator-outline" />
        <InvoiceCalculationCard 
          electricityConsumption={electricity.consumption}
          waterConsumption={water.consumption}
          otherFeesTotal={otherFeesTotal}
        />

        <AppButton 
          title={editing ? "Lưu thay đổi" : "Xác nhận tạo hóa đơn"} 
          onPress={handleSubmit} 
          loading={loading}
          disabled={!isFormComplete || loading}
          style={!isFormComplete ? { backgroundColor: "#CBD5E1" } : {}}
        />
        
        {!isFormComplete && !loading && (
          <View className="mt-4 p-4 bg-red-50 rounded-2xl border border-red-100 flex-row items-center">
            <Ionicons name="alert-circle" size={18} color="#EF4444" />
            <Text className="ml-2 text-red-600 font-bold text-[13px] flex-1">
              Vui lòng nhập chỉ số mới hợp lệ (≥ chỉ số cũ) để tiếp tục.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function SectionTitle({ title, icon }: { title: string; icon: keyof typeof Ionicons.glyphMap }) {
  return (
    <View className="flex-row items-center mb-4 px-1 mt-2">
      <Ionicons name={icon} size={18} color="#64748B" />
      <Text className="ml-2 text-[15px] font-black text-slate-500 uppercase tracking-wider">{title}</Text>
    </View>
  );
}
