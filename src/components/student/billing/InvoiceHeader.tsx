import { Colors } from "@/constants/colors";
import { InvoiceStatus } from "@/hooks/student/useStudentInvoices";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  activeTab: InvoiceStatus;
  setActiveTab: (tab: InvoiceStatus) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

export function InvoiceHeader({ activeTab, setActiveTab, searchQuery, setSearchQuery }: Props) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
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
  );
}
