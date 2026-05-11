import { InvoiceAnalytics } from "@/components/student/billing/InvoiceAnalytics";
import { InvoiceDetailModal } from "@/components/student/billing/InvoiceDetailModal";
import { InvoiceItem } from "@/components/student/billing/InvoiceItem";
import { InvoiceItemSkeleton } from "@/components/student/billing/InvoiceItemSkeleton";
import { Colors } from "@/constants/colors";
import { Invoice, useStudentInvoices } from "@/hooks/student/useStudentInvoices";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, Pressable, RefreshControl, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MOCK_ANALYTICS = [
  { month: "Th 1", electricity: 320000, water: 120000 },
  { month: "Th 2", electricity: 380000, water: 150000 },
  { month: "Th 3", electricity: 310000, water: 110000 },
  { month: "Th 4", electricity: 420000, water: 180000 },
  { month: "Th 5", electricity: 390000, water: 140000 },
];

export function InvoiceListScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { 
    activeTab, 
    setActiveTab, 
    invoices, 
    isOverdue, 
    loading, 
    refreshing, 
    onRefresh 
  } = useStudentInvoices();
  
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

  const emptyText = activeTab === "UNPAID" ? "cần thanh toán" : "đã thanh toán";

  const handleInvoicePress = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setModalVisible(true);
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <View 
        className="px-5 pb-4 pt-4 bg-white"
        style={{ 
          paddingTop: insets.top + 10,
          borderBottomWidth: 1,
          borderBottomColor: Colors.border
        }}
      >
        <View className="flex-row items-center mb-6">
          <Pressable
            onPress={() => router.navigate("/(student)/my-room")}
            className="h-10 w-10 items-center justify-center rounded-full bg-slate-100 mr-3"
          >
            <Ionicons name="arrow-back" size={20} color={Colors.textPrimary} />
          </Pressable>
          <Text className="text-[24px] font-extrabold text-slate-900">
            Hóa đơn & Thanh toán
          </Text>
        </View>

        <View className="flex-row bg-slate-100 rounded-2xl p-1 mb-4">
          <Pressable
            onPress={() => setActiveTab("UNPAID")}
            className={`flex-1 py-2.5 items-center rounded-xl ${activeTab === "UNPAID" ? "bg-white" : ""}`}
            style={activeTab === "UNPAID" ? {
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2
            } : {}}
          >
            <Text className={`font-bold ${activeTab === "UNPAID" ? "text-primary" : "text-slate-500"}`}>
              Chưa thanh toán
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setActiveTab("PAID")}
            className={`flex-1 py-2.5 items-center rounded-xl ${activeTab === "PAID" ? "bg-white" : ""}`}
            style={activeTab === "PAID" ? {
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2
            } : {}}
          >
            <Text className={`font-bold ${activeTab === "PAID" ? "text-primary" : "text-slate-500"}`}>
              Đã thanh toán
            </Text>
          </Pressable>
        </View>

        <View className="flex-row items-center bg-slate-100 rounded-2xl px-4 h-12">
          <Ionicons name="search" size={18} color="#94A3B8" />
          <TextInput
            placeholder="Tìm kiếm hóa đơn..."
            className="flex-1 ml-2 text-[15px] text-slate-900 h-full"
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <Pressable onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={18} color="#94A3B8" />
            </Pressable>
          ) : null}
        </View>
      </View>

      <FlatList
        data={(loading ? [1, 2, 3] : filteredInvoices) as any[]}
        keyExtractor={(item, index) => loading ? `skeleton-${index}` : (item as Invoice).id}
        renderItem={({ item }) => {
          if (loading) return <InvoiceItemSkeleton />;
          const invoice = item as Invoice;
          return (
            <InvoiceItem 
              item={invoice} 
              overdue={invoice.status === "UNPAID" && isOverdue(invoice.dueDate)} 
              onPress={() => handleInvoicePress(invoice)}
            />
          );
        }}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />
        }
        ListHeaderComponent={
          !loading && activeTab === "PAID" ? <InvoiceAnalytics data={MOCK_ANALYTICS} /> : null
        }
        ListEmptyComponent={
          !loading ? (
            <View className="items-center justify-center py-20">
              <View className="h-24 w-24 rounded-full bg-slate-100 items-center justify-center mb-4">
                <Ionicons name="checkmark-circle-outline" size={48} color="#94A3B8" />
              </View>
              <Text className="text-[16px] font-bold text-slate-900">Không có hóa đơn nào</Text>
              <Text className="text-[14px] text-slate-500 mt-2 text-center">
                {searchQuery ? "Không tìm thấy kết quả phù hợp" : `Bạn không có hóa đơn nào ${emptyText}.`}
              </Text>
            </View>
          ) : null
        }
      />
      <InvoiceDetailModal 
        visible={modalVisible} 
        invoice={selectedInvoice} 
        onClose={() => setModalVisible(false)} 
      />
    </View>
  );
}
