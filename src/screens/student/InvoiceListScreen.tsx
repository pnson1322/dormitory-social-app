import { InvoiceAnalytics } from "@/components/student/billing/InvoiceAnalytics";
import { InvoiceDetailModal } from "@/components/student/billing/InvoiceDetailModal";
import { InvoiceHeader } from "@/components/student/billing/InvoiceHeader";
import { InvoiceItem } from "@/components/student/billing/InvoiceItem";
import { InvoiceItemSkeleton } from "@/components/student/billing/InvoiceItemSkeleton";
import { Colors } from "@/constants/colors";
import { Invoice, useStudentInvoices } from "@/hooks/student/useStudentInvoices";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { FlatList, RefreshControl, Text, View, ActivityIndicator } from "react-native";
import { AppButton } from "@/components/AppButton";
export function InvoiceListScreen() {
  const { 
    activeTab, 
    setActiveTab, 
    invoices, 
    isOverdue, 
    loading, 
    refreshing, 
    loadingMore,
    error,
    onRefresh,
    onLoadMore,
    utilityHistory,
    loadingHistory
  } = useStudentInvoices();

  useFocusEffect(
    useCallback(() => {
      onRefresh();
    }, [])
  );
  
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredInvoices = useMemo(() => {
    if (!searchQuery) return invoices;
    return invoices.filter(inv => 
      inv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [invoices, searchQuery]);

  const handleInvoicePress = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setModalVisible(true);
  };

  const renderFooter = () => {
    if (!loadingMore) return <View className="h-20" />;
    return (
      <View className="py-6 items-center">
        <ActivityIndicator color={Colors.primary} />
        <Text className="text-slate-400 text-[12px] font-bold mt-2 uppercase tracking-widest">
          Đang tải thêm...
        </Text>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <InvoiceHeader 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {error && invoices.length === 0 ? (
        <View className="flex-1 items-center justify-center px-10">
          <View className="h-20 w-20 rounded-full bg-red-50 items-center justify-center mb-4">
            <Ionicons name="alert-circle-outline" size={40} color="#EF4444" />
          </View>
          <Text className="text-[18px] font-black text-slate-900 text-center">{error}</Text>
          <View className="w-full mt-6">
            <AppButton title="Thử lại" onPress={onRefresh} />
          </View>
        </View>
      ) : (
        <FlatList
          data={(loading ? [1, 2, 3, 4, 5] : filteredInvoices) as any[]}
          keyExtractor={(item, index) => loading ? `skeleton-${index}` : `${(item as Invoice).id}-${index}`}
          renderItem={({ item }) => {
            if (loading) return <InvoiceItemSkeleton />;
            const invoice = item as Invoice;
            return (
              <InvoiceItem 
                item={invoice} 
                overdue={invoice.status.toLowerCase() === "unpaid" && isOverdue(invoice.dueDate)} 
                onPress={() => handleInvoicePress(invoice)}
              />
            );
          }}
          contentContainerStyle={{ padding: 20 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />
          }
          ListHeaderComponent={
            activeTab === "PAID" ? (
              <InvoiceAnalytics 
                data={utilityHistory} 
                loading={loadingHistory} 
                error={error ? "Không thể tải lịch sử điện nước." : null} 
              />
            ) : null
          }
          ListFooterComponent={renderFooter}
          onEndReached={onLoadMore}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={
            !loading ? (
              <View className="items-center justify-center py-20">
                <View className="h-24 w-24 rounded-full bg-slate-100 items-center justify-center mb-4">
                  <Ionicons name="checkmark-circle-outline" size={48} color="#94A3B8" />
                </View>
                <Text className="text-[16px] font-bold text-slate-900">Không có hóa đơn nào</Text>
                <Text className="text-[14px] text-slate-500 mt-2 text-center">
                  {searchQuery ? "Không tìm thấy kết quả phù hợp" : `Bạn không có hóa đơn nào ${activeTab === "UNPAID" ? "cần thanh toán" : "đã thanh toán"}.`}
                </Text>
              </View>
            ) : null
          }
        />
      )}

      <InvoiceDetailModal 
        visible={modalVisible} 
        invoice={selectedInvoice} 
        onClose={() => setModalVisible(false)} 
        onPaymentSubmitted={onRefresh}
      />
    </View>
  );
}
