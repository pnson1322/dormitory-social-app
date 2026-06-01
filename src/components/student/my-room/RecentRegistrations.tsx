import { RegistrationDetailModal } from "@/components/student/history/RegistrationDetailModal";
import { RegistrationCard } from "@/components/student/my-room/RegistrationCard";
import { Colors } from "@/constants/colors";
import { RegistrationItem, useRegistrationHistory } from "@/hooks/student/useRegistrationHistory";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, LayoutAnimation, Platform, Pressable, Text, UIManager, View } from "react-native";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export function RecentRegistrations() {
  const { items, loading, onRefresh } = useRegistrationHistory();
  const [expanded, setExpanded] = useState(false);
  const [selectedItem, setSelectedItem] = useState<RegistrationItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      onRefresh();
    }, [])
  );

  const displayItems = expanded ? items : items.slice(0, 3);
  const hasMore = items.length > 3;

  const handlePress = (item: RegistrationItem) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <View className="mt-8 pb-20">
      <View className="flex-row justify-between items-center mb-5 px-1">
        <Text className="text-[22px] font-black text-slate-900">Lịch sử đăng ký</Text>
        {hasMore && (
          <Pressable
            onPress={toggleExpand}
            className="flex-row items-center bg-slate-100 px-3 py-1.5 rounded-full"
          >
            <Text className="text-slate-600 font-bold text-[13px] mr-1">
              {expanded ? "Thu gọn" : "Xem tất cả"}
            </Text>
            <Ionicons
              name={expanded ? "chevron-up" : "chevron-down"}
              size={14}
              color="#64748B"
            />
          </Pressable>
        )}
      </View>

      {loading ? (
        <View className="py-12 items-center bg-white rounded-3xl border border-slate-100">
          <ActivityIndicator color={Colors.primary} />
          <Text className="mt-3 text-slate-400 font-medium">Đang tải lịch sử...</Text>
        </View>
      ) : items.length > 0 ? (
        <View style={{ gap: 12 }}>
          {displayItems.map((item) => (
            <RegistrationCard
              key={item.bookingId}
              item={item}
              onPress={handlePress}
            />
          ))}
        </View>
      ) : (
        <View className="mt-4 py-16 px-10 rounded-[40px] bg-slate-50 border-2 border-slate-300 border-dashed items-center">
          <View
            className="h-20 w-20 rounded-full bg-white items-center justify-center mb-6 shadow-sm"
            style={{ elevation: 3 }}
          >
            <Ionicons name="receipt-outline" size={36} color="#64748B" />
          </View>
          <Text className="text-slate-800 font-black text-[18px]">Chưa có dữ liệu lịch sử</Text>
          <Text className="text-slate-500 text-[14px] mt-2 text-center leading-6 px-6">
            Các yêu cầu đăng ký phòng của bạn sẽ được hiển thị danh sách tại đây sau khi bạn thực hiện đăng ký
          </Text>
        </View>
      )}

      <RegistrationDetailModal
        visible={modalVisible}
        item={selectedItem}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}
