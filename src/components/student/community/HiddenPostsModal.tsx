import { PostCard } from "@/components/student/community/PostCard";
import { Colors } from "@/constants/colors";
import { useHiddenPosts } from "@/hooks/community/useHiddenPosts";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  FlatList,
  Modal,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface HiddenPostsModalProps {
  visible: boolean;
  onClose: () => void;
  onHide: (id: string) => Promise<void> | void;
  onPinSuccess: () => void;
}

export function HiddenPostsModal({
  visible,
  onClose,
  onHide,
  onPinSuccess,
}: HiddenPostsModalProps) {
  const insets = useSafeAreaInsets();
  const {
    hiddenPosts,
    isLoading,
    isRefreshing,
    refresh,
    loadMore,
    hasMore,
  } = useHiddenPosts({ enabled: visible });

  const handleItemHideToggle = async (id: string) => {
    await onHide(id);
    refresh();
  };

  return (
    <Modal visible={visible} onRequestClose={onClose} animationType="slide">
      <View style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
        <View
          className="px-4 pb-3 flex-row items-center justify-between shadow-sm"
          style={{
            paddingTop: insets.top > 0 ? insets.top + 6 : 12,
            backgroundColor: Colors.primary,
          }}
        >
          <View style={{ width: 40, alignItems: "flex-start" }}>
            <TouchableOpacity
              onPress={onClose}
              className="h-10 w-10 items-center justify-center rounded-full bg-white/15"
            >
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <Text className="text-[18px] font-bold text-white text-center flex-1" numberOfLines={1}>
            Bài viết đã ẩn của tôi
          </Text>
          <View style={{ width: 40 }} />
        </View>

        <FlatList
          data={hiddenPosts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PostCard post={item} onHide={handleItemHideToggle} canHide={true} onPinSuccess={onPinSuccess} />
          )}
          contentContainerStyle={{ paddingHorizontal: 12, paddingTop: 12, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={refresh}
              colors={[Colors.primary]}
              tintColor={Colors.primary}
            />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.2}
          ListFooterComponent={() =>
            isLoading && hiddenPosts.length > 0 ? (
              <View className="py-4 items-center justify-center">
                <ActivityIndicator size="small" color={Colors.primary} />
              </View>
            ) : null
          }
          ListEmptyComponent={() => {
            if (isLoading && hiddenPosts.length === 0) {
              return (
                <View className="py-20 items-center justify-center">
                  <ActivityIndicator size="large" color={Colors.primary} />
                </View>
              );
            }
            return (
              <View className="py-20 px-6 items-center justify-center bg-white rounded-3xl border border-slate-100/50 shadow-sm mt-4 mx-4">
                <Ionicons name="eye-off-outline" size={48} color="#94A3B8" style={{ marginBottom: 12 }} />
                <Text className="text-slate-800 font-bold text-[17px] mb-1">Không có bài viết ẩn</Text>
                <Text className="text-slate-400 text-[13px] text-center">
                  Bạn chưa ẩn bài viết nào của bản thân.
                </Text>
              </View>
            );
          }}
        />
      </View>
    </Modal>
  );
}

