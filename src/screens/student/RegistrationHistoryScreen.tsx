import { RegistrationItem } from "@/components/student/history/RegistrationItem";
import { RegistrationItemSkeleton } from "@/components/student/history/RegistrationItemSkeleton";
import { RegistrationDetailModal } from "@/components/student/history/RegistrationDetailModal";
import { Colors } from "@/constants/colors";
import { useRegistrationHistory, RegistrationItem as RegistrationType } from "@/hooks/student/useRegistrationHistory";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { FlatList, Pressable, RefreshControl, Text, View, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppButton } from "@/components/AppButton";

export function RegistrationHistoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    items,
    loading,
    refreshing,
    loadingMore,
    hasMore,
    error,
    onRefresh,
    onLoadMore,
  } = useRegistrationHistory();

  const [selectedItem, setSelectedItem] = useState<RegistrationType | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleItemPress = (item: RegistrationType) => {
    setSelectedItem(item);
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
      <View 
        className="px-5 pb-4 pt-4 bg-white"
        style={{ 
          paddingTop: insets.top + 10,
          borderBottomWidth: 1,
          borderBottomColor: Colors.border
        }}
      >
        <View className="flex-row items-center">
          <Pressable
            onPress={() => router.navigate("/(student)/my-room")}
            className="h-10 w-10 items-center justify-center rounded-full bg-slate-100 mr-3"
          >
            <Ionicons name="arrow-back" size={20} color={Colors.textPrimary} />
          </Pressable>
          <Text className="text-[24px] font-extrabold text-slate-900">
            Lịch sử đăng ký
          </Text>
        </View>
      </View>

      {error && items.length === 0 ? (
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
          data={(loading ? [1, 2, 3, 4, 5] : items) as any[]}
          keyExtractor={(item, index) => loading ? `skeleton-${index}` : (item as RegistrationType).id}
          renderItem={({ item }) => {
            if (loading) return <RegistrationItemSkeleton />;
            return (
              <RegistrationItem 
                item={item as RegistrationType} 
                onPress={() => handleItemPress(item as RegistrationType)}
              />
            );
          }}
          contentContainerStyle={{ padding: 20 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />
          }
          ListFooterComponent={renderFooter}
          onEndReached={onLoadMore}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={
            !loading ? (
              <View className="items-center justify-center py-20">
                <View className="h-24 w-24 rounded-full bg-slate-100 items-center justify-center mb-4">
                  <Ionicons name="time-outline" size={48} color="#94A3B8" />
                </View>
                <Text className="text-[16px] font-bold text-slate-900">Chưa có dữ liệu</Text>
                <Text className="text-[14px] text-slate-500 mt-2 text-center">
                  Bạn chưa có yêu cầu đăng ký phòng nào trong lịch sử.
                </Text>
              </View>
            ) : null
          }
        />
      )}

      <RegistrationDetailModal
        visible={modalVisible}
        item={selectedItem}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}
