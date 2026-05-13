import { InvoiceCardSkeleton } from "@/components/manager/billing/InvoiceCardSkeleton";
import { DraggableFAB } from "@/components/common/DraggableFAB";
import { ManagerInvoiceDetailModal } from "@/components/manager/billing/ManagerInvoiceDetailModal";
import { Colors } from "@/constants/colors";
import { useManagerInvoices } from "@/hooks/manager/useManagerInvoices";
import { InvoiceSummary } from "@/services/billing/billing.types";
import { formatCurrency } from "@/utils/room";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, FlatList, Pressable, RefreshControl, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function InvoiceManagerListScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { items, loading, refreshing, loadingMore, onRefresh, onLoadMore, stats, error } = useManagerInvoices();
  
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceSummary | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

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
          <View className="flex-row items-center justify-between mb-6">
            <View>
              <Text className="text-[32px] font-black text-white">
                Hóa đơn
              </Text>
              <Text className="text-white/70 font-bold mt-1">Theo dõi thu chi & chốt số</Text>
            </View>
          </View>

          <View className="flex-row gap-4">
            <View className="flex-1 bg-white/10 p-4 rounded-3xl border border-white/20">
              <View className="flex-row items-center mb-1">
                <Ionicons name="time-outline" size={14} color="#FBBF24" />
                <Text className="text-[12px] font-black text-white/60 uppercase ml-1">Chờ thu</Text>
              </View>
              <Text className="text-[24px] font-black text-white">{stats.pending}</Text>
            </View>
            <View className="flex-1 bg-white/10 p-4 rounded-3xl border border-white/20">
              <View className="flex-row items-center mb-1">
                <Ionicons name="wallet-outline" size={14} color="#34D399" />
                <Text className="text-[12px] font-black text-white/60 uppercase ml-1">Đã thu</Text>
              </View>
              <Text className="text-[18px] font-black text-white" numberOfLines={1}>{formatCurrency(stats.revenue)}</Text>
            </View>
          </View>
        </LinearGradient>
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
                <View className={`mt-2 px-3 py-1 rounded-full ${item.status === "PAID" ? "bg-emerald-50" : "bg-amber-50"}`}>
                  <Text className={`text-[10px] font-black uppercase tracking-wider ${item.status === "PAID" ? "text-emerald-600" : "text-amber-600"}`}>
                    {item.status === "PAID" ? "Đã trả" : "Chưa thu"}
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
