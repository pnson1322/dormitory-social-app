import { AnnouncementForm } from "@/components/admin/AnnouncementForm";
import { ContentManagementHeader } from "@/components/admin/ContentManagementHeader";
import { ContentManagementTabs } from "@/components/admin/ContentManagementTabs";
import { ReportsManagementTab } from "@/components/admin/ReportsManagementTab";
import { AppButton } from "@/components/AppButton";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { PostCard } from "@/components/student/community/PostCard";
import { PostCardSkeleton } from "@/components/student/community/PostCardSkeleton";
import { Colors } from "@/constants/colors";
import { useAdminContentManagement } from "@/hooks/admin/useAdminContentManagement";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function ContentManagementScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const {
    activeTab,
    setActiveTab,
    postFilter,
    setPostFilter,

    posts,
    pinnedPosts,
    isLoading,
    isRefreshing,
    isError,
    loadMore,
    refresh,

    announcementContent,
    setAnnouncementContent,
    isPinned,
    setIsPinned,
    images,
    isCreatingAnnouncement,
    handlePickImage,
    handleRemoveImage,
    handlePublishAnnouncement,

    postToHide,
    confirmModalVisible,
    isHidingPost,
    initiateHidePost,
    cancelHidePost,
    confirmHidePost,
  } = useAdminContentManagement();

  const renderPostsTab = () => {
    if (isError && posts.length === 0) {
      return (
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center", alignItems: "center", padding: 24 }}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refresh} tintColor={Colors.primary} />}
        >
          <View className="w-16 h-16 rounded-full bg-red-50 justify-center items-center mb-4">
            <Ionicons name="cloud-offline-outline" size={32} color="#EF4444" />
          </View>
          <Text className="text-slate-800 font-bold text-[18px] mb-2">Không thể tải bài viết</Text>
          <Text className="text-slate-400 text-[14px] text-center mb-6 leading-5">
            Đã xảy ra lỗi khi tải bài viết từ máy chủ. Vui lòng kéo xuống để thử lại hoặc bấm nút bên dưới.
          </Text>
          <AppButton title="Tải lại" onPress={refresh} size="compact" />
        </ScrollView>
      );
    }

    if (isLoading && posts.length === 0) {
      return (
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <PostCardSkeleton />
          <PostCardSkeleton />
          <PostCardSkeleton />
        </ScrollView>
      );
    }

    const displayedPosts = posts;

    return (
      <View style={{ flex: 1 }}>
        <View className="flex-row px-5 py-2.5 bg-white border-b border-slate-100 gap-3">
          <TouchableOpacity
            onPress={() => setPostFilter("all")}
            activeOpacity={0.8}
            className="px-4 py-2 rounded-xl flex-row items-center border"
            style={{
              backgroundColor: postFilter === "all" ? Colors.primary : "#F8FAFC",
              borderColor: postFilter === "all" ? Colors.primary : "#E2E8F0",
            }}
          >
            <Ionicons
              name="grid-outline"
              size={14}
              color={postFilter === "all" ? "#FFFFFF" : "#64748B"}
              style={{ marginRight: 6 }}
            />
            <Text className="text-[12px] font-bold" style={{ color: postFilter === "all" ? "#FFFFFF" : "#64748B" }}>
              Tất cả bài viết
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setPostFilter("hidden")}
            activeOpacity={0.8}
            className="px-4 py-2 rounded-xl flex-row items-center border"
            style={{
              backgroundColor: postFilter === "hidden" ? Colors.primary : "#F8FAFC",
              borderColor: postFilter === "hidden" ? Colors.primary : "#E2E8F0",
            }}
          >
            <Ionicons
              name="eye-off-outline"
              size={14}
              color={postFilter === "hidden" ? "#FFFFFF" : "#64748B"}
              style={{ marginRight: 6 }}
            />
            <Text className="text-[12px] font-bold" style={{ color: postFilter === "hidden" ? "#FFFFFF" : "#64748B" }}>
              Bài viết đã ẩn
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={displayedPosts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PostCard
              post={item}
              canHide={true}
              onHide={() => initiateHidePost(item)}
              onPinSuccess={refresh}
            />
          )}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 12,
            paddingBottom: 40,
          }}
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
          ListHeaderComponent={() => {
            if (postFilter === "all" && pinnedPosts && pinnedPosts.length > 0) {
              return (
                <View className="mb-4">
                  <View className="flex-row items-center mb-2 px-1">
                    <AntDesign
                      name="pushpin"
                      size={15}
                      color="#64748B"
                      style={{ marginRight: 6 }}
                    />
                    <Text className="text-[15px] font-bold text-slate-800">
                      Bài viết được ghim
                    </Text>
                  </View>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 10 }}
                    className="flex-row"
                  >
                    {pinnedPosts.map((post) => (
                      <View
                        key={post.id}
                        style={{ width: width - 40 }}
                        className="mr-3"
                      >
                        <PostCard
                          post={post}
                          canHide={true}
                          onHide={() => initiateHidePost(post)}
                          onPinSuccess={refresh}
                        />
                      </View>
                    ))}
                  </ScrollView>
                  <View className="h-[1px] bg-slate-200/50 mt-2 mb-4" />
                </View>
              );
            }
            return null;
          }}
          ListFooterComponent={() => {
            if (isLoading && displayedPosts.length > 0) {
              return (
                <View className="py-4 justify-center items-center">
                  <ActivityIndicator size="small" color={Colors.primary} />
                </View>
              );
            }
            return <View className="h-10" />;
          }}
          ListEmptyComponent={() => (
            <View className="py-20 px-6 items-center justify-center bg-white rounded-3xl border border-slate-100/50 shadow-sm mt-4">
              <Ionicons
                name={postFilter === "all" ? "chatbubbles-outline" : "eye-off-outline"}
                size={48}
                color="#94A3B8"
                style={{ marginBottom: 12 }}
              />
              <Text className="text-slate-800 font-bold text-[17px] mb-1">
                {postFilter === "all" ? "Bản tin trống" : "Không có bài viết ẩn"}
              </Text>
              <Text className="text-slate-400 text-[13px] text-center mb-5">
                {postFilter === "all"
                  ? "Hiện tại không có bài đăng nào của sinh viên trên dòng thời gian."
                  : "Không tìm thấy bài viết nào bị ẩn."}
              </Text>
              <AppButton title="Làm mới" onPress={refresh} size="compact" />
            </View>
          )}
        />
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <ContentManagementHeader topInset={insets.top} />
      <ContentManagementTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <View style={{ flex: 1 }}>
        {activeTab === "posts" ? (
          renderPostsTab()
        ) : activeTab === "announcement" ? (
          <AnnouncementForm
            announcementContent={announcementContent}
            setAnnouncementContent={setAnnouncementContent}
            isPinned={isPinned}
            setIsPinned={setIsPinned}
            images={images}
            isCreatingAnnouncement={isCreatingAnnouncement}
            handlePickImage={handlePickImage}
            handleRemoveImage={handleRemoveImage}
            handlePublishAnnouncement={handlePublishAnnouncement}
          />
        ) : (
          <ReportsManagementTab />
        )}
      </View>

      <ConfirmModal
        visible={confirmModalVisible}
        title={postToHide?.isHidden ? "XÁC NHẬN HIỂN THỊ LẠI" : "CẢNH BÁO MỨC ĐỘ CAO"}
        message={
          postToHide?.isHidden
            ? `Bạn đang thực hiện hiển thị lại bài viết của ${postToHide?.authorName || "sinh viên"} trên dòng thời gian.\n\nBài viết sẽ xuất hiện trở lại với tất cả thành viên khác.`
            : `Bạn đang thực hiện gỡ bài viết của ${postToHide?.authorName || "sinh viên"} khỏi dòng thời gian.\n\nBài viết sẽ bị ẩn hoàn toàn với tất cả thành viên khác.`
        }
        confirmLabel={postToHide?.isHidden ? "Hiện bài" : "Gỡ bài"}
        cancelLabel="Hủy"
        type={postToHide?.isHidden ? "primary" : "danger"}
        onConfirm={confirmHidePost}
        onCancel={cancelHidePost}
        loading={isHidingPost}
      />
    </View>
  );
}
