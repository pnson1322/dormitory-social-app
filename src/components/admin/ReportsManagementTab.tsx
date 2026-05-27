import { ReportItemCard } from "@/components/admin/ReportItemCard";
import { PostCard } from "@/components/student/community/PostCard";
import { useToast } from "@/components/toast/ToastProvider";
import { Colors } from "@/constants/colors";
import { useAdminReports } from "@/hooks/admin/useAdminReports";
import { getPostDetail } from "@/services/community/community.api";
import { PostResponse, ReportStatus } from "@/services/community/community.types";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, Text, TouchableOpacity, View } from "react-native";

const STATUS_FILTERS: { label: string; value: ReportStatus | "All" }[] = [
  { label: "Chờ xử lý", value: "Pending" },
  { label: "Đã duyệt", value: "Reviewed" },
  { label: "Đã bỏ qua", value: "Dismissed" },
  { label: "Tất cả", value: "All" },
];

export function ReportsManagementTab() {
  const { showToast } = useToast();
  const { reports, isLoading, isRefreshing, selectedStatus, setSelectedStatus, refresh, loadMore, handleReview } =
    useAdminReports();

  const [selectedPost, setSelectedPost] = useState<PostResponse | null>(null);
  const [isLoadingPost, setIsLoadingPost] = useState(false);

  const handleViewPost = async (postId: string) => {
    setIsLoadingPost(true);
    try {
      const detail = await getPostDetail(postId);
      setSelectedPost(detail);
    } catch {
      showToast({
        type: "error",
        title: "Không thể xem bài đăng",
        message: "Bài viết này không tồn tại hoặc đã bị xóa khỏi hệ thống.",
      });
    } finally {
      setIsLoadingPost(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <View className="flex-row px-5 py-2 bg-white border-b border-slate-100 flex-wrap gap-2">
        {STATUS_FILTERS.map(({ label, value }) => {
          const active = selectedStatus === value;
          return (
            <TouchableOpacity
              key={value}
              onPress={() => setSelectedStatus(value)}
              activeOpacity={0.8}
              className="px-3.5 py-1.5 rounded-full border"
              style={{
                backgroundColor: active ? Colors.primary : "#F8FAFC",
                borderColor: active ? Colors.primary : "#E2E8F0",
              }}
            >
              <Text className="text-[12px] font-bold" style={{ color: active ? "#FFFFFF" : "#64748B" }}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {isLoading && reports.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text className="text-slate-400 text-[14px] mt-3 font-semibold">Đang tải danh sách báo cáo...</Text>
        </View>
      ) : (
        <FlatList
          data={reports}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ReportItemCard
              item={item}
              isLoadingPost={isLoadingPost}
              onViewPost={handleViewPost}
              onReview={handleReview}
            />
          )}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={refresh} colors={[Colors.primary]} tintColor={Colors.primary} />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.2}
          ListFooterComponent={() =>
            isLoading && reports.length > 0 ? (
              <View className="py-4 justify-center items-center">
                <ActivityIndicator size="small" color={Colors.primary} />
              </View>
            ) : (
              <View className="h-10" />
            )
          }
          ListEmptyComponent={() => (
            <View className="py-20 px-6 items-center justify-center bg-white rounded-3xl border border-slate-100/50 shadow-sm mt-4">
              <Ionicons name="flag-outline" size={48} color="#94A3B8" style={{ marginBottom: 12 }} />
              <Text className="text-slate-800 font-bold text-[17px] mb-1">Không có báo cáo</Text>
              <Text className="text-slate-400 text-[13px] text-center">
                Không tìm thấy báo cáo vi phạm nào trong chuyên mục này.
              </Text>
            </View>
          )}
        />
      )}

      {selectedPost && (
        <View style={{ position: "absolute", opacity: 0, width: 0, height: 0, overflow: "hidden" }}>
          <PostCard
            post={selectedPost}
            canHide={true}
            onHide={refresh}
            onPinSuccess={refresh}
            autoOpenDetail={true}
            onCloseDetail={() => setSelectedPost(null)}
          />
        </View>
      )}
    </View>
  );
}
