import { AppSelect } from "@/components/AppSelect";
import { DraggableFAB } from "@/components/common/DraggableFAB";
import { InvoiceCardSkeleton } from "@/components/manager/billing/InvoiceCardSkeleton";
import { ManagerInvoiceDetailModal } from "@/components/manager/billing/ManagerInvoiceDetailModal";
import { Colors } from "@/constants/colors";
import { useManagerInvoices } from "@/hooks/manager/useManagerInvoices";
import { InvoiceSummary } from "@/services/billing/billing.types";
import { formatCurrency } from "@/utils/room";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, FlatList, LayoutAnimation, Platform, Pressable, RefreshControl, Text, TouchableOpacity, UIManager, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export function InvoiceManagerListScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { 
    items, 
    loading, 
    refreshing, 
    loadingMore, 
    onRefresh, 
    onLoadMore, 
    error,
    status,
    setStatus,
    buildingCode,
    setBuildingCode,
    floor,
    setFloor,
    year,
    setYear,
    month,
    setMonth,
    buildings
  } = useManagerInvoices();
  
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceSummary | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const handleInvoicePress = (invoice: InvoiceSummary) => {
    setSelectedInvoice(invoice);
    setModalVisible(true);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
      <View style={{ zIndex: 10 }}>
        <LinearGradient
          colors={["#1E40AF", "#3B82F6"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="px-5 pb-8 pt-4"
          style={{ 
            paddingTop: insets.top + 10,
            borderBottomLeftRadius: 40,
            borderBottomRightRadius: 40,
          }}
        >
          <View className="flex-row items-center mb-6">
            <Pressable
              onPress={() => router.navigate("/(manager)/menu" as any)}
              className="mr-4 h-11 w-11 items-center justify-center rounded-full bg-white/15"
            >
              <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
            </Pressable>
            <View className="flex-1">
              <Text className="text-[32px] font-black text-white">
                Hóa đơn
              </Text>
              <Text className="text-white/70 font-bold mt-1">Theo dõi thu chi & chốt số</Text>
            </View>
          </View>


        </LinearGradient>
      </View>

      <View className="bg-white py-3 border-b border-slate-100 shadow-sm px-5">
        <View className="flex-row bg-slate-100 p-1 rounded-2xl mb-3">
          {[
            { label: "Tất cả", value: "" },
            { label: "Chưa thu", value: "Unpaid" },
            { label: "Chờ duyệt", value: "WaitForConfirm" },
            { label: "Đã thu", value: "Paid" },
          ].map((tab) => {
            const isActive = status === tab.value;
            return (
              <Pressable
                key={tab.value}
                onPress={() => setStatus(tab.value)}
                className={`flex-1 py-2.5 rounded-xl items-center justify-center ${
                  isActive ? "bg-white shadow-sm" : ""
                }`}
              >
                <Text className={`text-[13px] font-bold ${isActive ? "text-blue-600" : "text-slate-500"}`}>
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Pressable 
          onPress={() => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setShowAdvancedFilters(!showAdvancedFilters);
          }}
          className="flex-row items-center justify-between py-2 border-t border-slate-100 mt-1"
        >
          <View className="flex-row items-center">
            <Ionicons name="funnel-outline" size={16} color={Colors.primary} />
            <Text className="text-[13px] font-black text-slate-700 ml-2">Bộ lọc chi tiết</Text>
            {(buildingCode || floor !== null || month !== null || year !== null) ? (
              <View className="bg-blue-100 h-5 px-2 rounded-full items-center justify-center ml-2">
                <Text className="text-[10px] font-black text-blue-700">Đang lọc</Text>
              </View>
            ) : null}
          </View>
          <View className="flex-row items-center">
            {(buildingCode || floor !== null || month !== null || year !== null) ? (
              <Pressable 
                onPress={(e) => {
                  e.stopPropagation();
                  setBuildingCode("");
                  setFloor(null);
                  setMonth(null);
                  setYear(null);
                }}
                className="mr-3"
              >
                <Text className="text-[12px] font-bold text-slate-400">Đặt lại</Text>
              </Pressable>
            ) : null}
            <Ionicons 
              name={showAdvancedFilters ? "chevron-up" : "chevron-down"} 
              size={18} 
              color="#64748B" 
            />
          </View>
        </Pressable>

        {showAdvancedFilters && (
          <View className="mt-3 gap-y-4 pt-3 border-t border-slate-100">
            <View className="flex-row gap-4">
              <View className="flex-1">
                <AppSelect
                  label="Tòa nhà"
                  value={buildingCode}
                  placeholder="Tất cả tòa"
                  options={[
                    { label: "Tất cả tòa", value: "" },
                    ...buildings.map(b => ({ label: b.name, value: b.code }))
                  ]}
                  onSelect={(val) => {
                    setBuildingCode(val);
                    setFloor(null);
                  }}
                />
              </View>
              <View className="flex-1">
                <AppSelect
                  label="Tầng"
                  value={floor !== null ? String(floor) : ""}
                  placeholder="Tất cả tầng"
                  options={[
                    { label: "Tất cả tầng", value: "" },
                    ...Array.from({ 
                      length: buildings.find(b => b.code === buildingCode)?.totalFloors || 10 
                    }).map((_, idx) => ({ 
                      label: `Tầng ${idx + 1}`, 
                      value: String(idx + 1) 
                    }))
                  ]}
                  onSelect={(val) => setFloor(val === "" ? null : Number(val))}
                />
              </View>
            </View>

            <View className="flex-row gap-4">
              <View className="flex-1">
                <AppSelect
                  label="Tháng"
                  value={month !== null ? String(month) : ""}
                  placeholder="Tất cả tháng"
                  options={[
                    { label: "Tất cả tháng", value: "" },
                    ...Array.from({ length: 12 }).map((_, idx) => ({ 
                      label: `Tháng ${idx + 1}`, 
                      value: String(idx + 1) 
                    }))
                  ]}
                  onSelect={(val) => setMonth(val === "" ? null : Number(val))}
                />
              </View>
              <View className="flex-1">
                <AppSelect
                  label="Năm"
                  value={year !== null ? String(year) : ""}
                  placeholder="Tất cả năm"
                  options={[
                    { label: "Tất cả năm", value: "" },
                    { label: "Năm 2025", value: "2025" },
                    { label: "Năm 2026", value: "2026" },
                    { label: "Năm 2027", value: "2027" }
                  ]}
                  onSelect={(val) => setYear(val === "" ? null : Number(val))}
                />
              </View>
            </View>
          </View>
        )}
      </View>

      {loading && items.length === 0 ? (
        <View className="pt-6">
          {Array.from({ length: 5 }).map((_, i) => <InvoiceCardSkeleton key={i} />)}
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-10">
          <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
          <Text className="text-[18px] font-bold text-slate-900 mt-4 text-center">{error}</Text>
          <TouchableOpacity 
            onPress={onRefresh} 
            className="mt-6 bg-blue-600 px-8 py-3 rounded-2xl shadow-lg shadow-blue-500/30"
          >
            <Text className="text-white font-bold">Thử lại</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              onPress={() => handleInvoicePress(item)}
              activeOpacity={0.7}
              className="bg-white mx-5 p-4 rounded-[30px] mb-4 border border-slate-100 flex-row items-center justify-between shadow-sm"
            >
              <View className="flex-row items-center flex-1">
                <View className="h-14 w-14 rounded-2xl bg-slate-50 items-center justify-center mr-4">
                  <View className="h-11 w-11 rounded-xl bg-blue-50 items-center justify-center">
                    <Ionicons name="receipt" size={24} color={Colors.primary} />
                  </View>
                </View>
                <View className="flex-1">
                  <Text className="text-[18px] font-black text-slate-900">Phòng {item.roomName}</Text>
                  <View className="flex-row items-center mt-1">
                    <Text className="text-[13px] text-slate-400 font-bold">{item.id}</Text>
                    <View className="h-1 w-1 rounded-full bg-slate-200 mx-2" />
                    <Text className="text-[13px] text-slate-400 font-medium">{item.createdAt}</Text>
                  </View>
                </View>
              </View>
              <View className="items-end ml-2">
                <Text className="text-[18px] font-black text-slate-900">{formatCurrency(item.totalAmount)}</Text>
                <View className={`mt-2 px-3 py-1 rounded-full ${
                  item.status.toLowerCase() === "paid" ? "bg-emerald-50" :
                  item.status.toLowerCase() === "waitforconfirm" || item.status.toLowerCase() === "wait_for_confirm" ? "bg-blue-50" :
                  item.status.toLowerCase() === "canceled" ? "bg-slate-100" : "bg-amber-50"
                }`}>
                  <Text className={`text-[10px] font-black uppercase tracking-wider ${
                    item.status.toLowerCase() === "paid" ? "text-emerald-600" :
                    item.status.toLowerCase() === "waitforconfirm" || item.status.toLowerCase() === "wait_for_confirm" ? "text-blue-600" :
                    item.status.toLowerCase() === "canceled" ? "text-slate-600" : "text-amber-600"
                  }`}>
                    {
                      item.status.toLowerCase() === "paid" ? "Đã trả" :
                      item.status.toLowerCase() === "waitforconfirm" || item.status.toLowerCase() === "wait_for_confirm" ? "Chờ duyệt" :
                      item.status.toLowerCase() === "canceled" ? "Đã hủy" : "Chưa thu"
                    }
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingTop: 24, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />
          }
          onEndReached={onLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={loadingMore ? <ActivityIndicator color={Colors.primary} className="py-4" /> : null}
          ListEmptyComponent={
            <View className="items-center justify-center py-20 px-10">
              <View className="h-24 w-24 rounded-full bg-slate-100 items-center justify-center mb-6">
                <Ionicons name="document-text-outline" size={48} color="#CBD5E1" />
              </View>
              <Text className="text-[18px] font-bold text-slate-900 text-center">Chưa có hóa đơn nào được tạo</Text>
              <Text className="text-slate-400 text-center mt-2 leading-5">Dữ liệu tháng này đang trống. Nhấn "+" để bắt đầu chốt số.</Text>
            </View>
          }
        />
      )}

      <ManagerInvoiceDetailModal
        visible={modalVisible}
        invoice={selectedInvoice}
        onClose={() => setModalVisible(false)}
        onRefresh={onRefresh}
      />

      <DraggableFAB 
        onPress={() => router.push("/(manager)/invoices/select-room")} 
      />
    </View>
  );
}
