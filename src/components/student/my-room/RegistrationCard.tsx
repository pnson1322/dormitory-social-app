import { RegistrationItem } from "@/hooks/student/useRegistrationHistory";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

type Props = {
  item: RegistrationItem;
  onPress: (item: RegistrationItem) => void;
};

function getStatusConfig(status: string) {
  switch (status) {
    case "APPROVED": return { label: "Đã duyệt",  color: "#10B981", bg: "#D1FAE5" };
    case "PENDING":  return { label: "Chờ duyệt", color: "#F59E0B", bg: "#FEF3C7" };
    case "REJECTED": return { label: "Từ chối",   color: "#EF4444", bg: "#FEE2E2" };
    default:         return { label: "Đã hủy",    color: "#6B7280", bg: "#F3F4F6" };
  }
}

export function RegistrationCard({ item, onPress }: Props) {
  const status = getStatusConfig(item.status);
  const dateStr = new Date(item.createdAt).toLocaleDateString("vi-VN");

  return (
    <Pressable
      onPress={() => onPress(item)}
      style={{
        backgroundColor: "white",
        borderRadius: 20,
        overflow: "hidden",
        flexDirection: "row",
        elevation: 2,
        shadowColor: "#0F172A",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
      }}
    >
      <View style={{ width: 5, backgroundColor: status.color }} />

      <View style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 16 }}>
        <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 10 }}>
          <Text
            style={{
              flex: 1,
              fontSize: 16,
              fontWeight: "800",
              color: "#0F172A",
              lineHeight: 22,
              marginRight: 8,
            }}
            numberOfLines={2}
          >
            {item.termName}
          </Text>
          <Ionicons name="chevron-forward" size={18} color="#CBD5E1" style={{ marginTop: 2 }} />
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: status.bg,
              borderRadius: 20,
              paddingHorizontal: 9,
              paddingVertical: 3,
            }}
          >
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: status.color,
                marginRight: 5,
              }}
            />
            <Text style={{ fontSize: 11, fontWeight: "800", color: status.color }}>
              {status.label}
            </Text>
          </View>

          <Text style={{ fontSize: 12, color: "#CBD5E1" }}>•</Text>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Ionicons name="calendar-outline" size={12} color="#94A3B8" />
            <Text style={{ fontSize: 12, color: "#94A3B8", fontWeight: "500" }}>{dateStr}</Text>
          </View>

          <Text style={{ fontSize: 12, color: "#CBD5E1" }}>•</Text>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Ionicons name="time-outline" size={12} color="#94A3B8" />
            <Text style={{ fontSize: 12, color: "#94A3B8", fontWeight: "500" }}>
              {item.numberOfMonths} tháng
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
