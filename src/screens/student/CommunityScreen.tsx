import { AntDesign, Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DraggableFAB } from "@/components/common/DraggableFAB";
import { CreatePostModal } from "@/components/student/community/CreatePostModal";
import { HiddenPostsModal } from "@/components/student/community/HiddenPostsModal";
import { PostCard } from "@/components/student/community/PostCard";
import { PostCardSkeleton } from "@/components/student/community/PostCardSkeleton";
import { Colors } from "@/constants/colors";
import { useCurrentUserRole } from "@/hooks/auth/useCurrentUserRole";
import { useCommunityActions } from "@/hooks/community/useCommunityActions";
import { useCommunityPosts } from "@/hooks/community/useCommunityPosts";
import useProfile from "@/hooks/profile/useProfile";
import { getInitials, isValidAvatarUrl } from "@/utils/communityUtils";

type FilterTab = {
  key: string | undefined;
  label: string;
  icon: "apps-outline" | "chatbubble-ellipses-outline" | "search-outline" | "megaphone-outline";
};

const FILTER_TABS: FilterTab[] = [
  { key: undefined, label: "Tất cả", icon: "apps-outline" },
  { key: "General", label: "Thảo luận", icon: "chatbubble-ellipses-outline" },
  { key: "LostAndFound", label: "Thất lạc", icon: "search-outline" },
  { key: "Announcement", label: "Thông báo", icon: "megaphone-outline" },
];

export function CommunityScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [hiddenPostsModalVisible, setHiddenPostsModalVisible] = useState(false);
  const { profile } = useProfile();
  const { userId } = useCurrentUserRole();

  const { pinnedPosts, posts, isLoading, isRefreshing, isError, postType, setPostType, loadMore, refresh } =
    useCommunityPosts({ pageSize: 10 });

  const { createPost, hidePost } = useCommunityActions();

  const handleCreatePostSubmit = async (content: string, type: string, files: string[]) => {
    const result = await createPost(content, type, files);
    if (result) {
      refresh();
      return true;
    }
    return false;
  };

  const handleHidePost = async (id: string) => {
    const result = await hidePost(id);
    if (result) refresh();
  };

  const renderHeader = () => {
    const initials = getInitials(profile?.fullName);
    return (
      <View className="mb-2">
        <View className="bg-white rounded-2xl p-4 mb-4 border border-slate-100 flex-row items-center shadow-sm">
          <View 
            style={{ width: 40, height: 40, borderRadius: 20, marginRight: 12, position: "relative", overflow: "hidden" }}
          >
            <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, justifyContent: "center", alignItems: "center", backgroundColor: Colors.primary + "15" }}>
              <Text className="font-bold text-[15px]" style={{ color: Colors.primary }}>{initials}</Text>
            </View>

            {isValidAvatarUrl(profile?.avatarUrl || undefined) && (
              <Image
                source={{ uri: profile?.avatarUrl || undefined }}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  width: "100%",
                  height: "100%",
                  borderRadius: 20,
                }}
                contentFit="cover"
                transition={150}
              />
            )}
          </View>
          <Pressable
            onPress={() => setCreateModalVisible(true)}
            className="flex-1 bg-slate-50 rounded-full px-4 py-2.5 border border-slate-200 active:bg-slate-100"
          >
            <Text numberOfLines={1} className="text-[14px] text-slate-400">Bạn đang nghĩ gì thế? Chia sẻ ngay...</Text>
          </Pressable>
          <Pressable onPress={() => setCreateModalVisible(true)} className="ml-3 p-2 rounded-full active:bg-slate-100">
            <Ionicons name="images-outline" size={20} color={Colors.primary} />
          </Pressable>
        </View>

        {pinnedPosts.filter((p) => !p.isHidden).length > 0 && (
          <View className="mb-4">
            <View className="flex-row items-center mb-2 px-2">
              <AntDesign name="pushpin" size={15} color={Colors.textSecondary} style={{ marginRight: 6 }} />
              <Text className="text-[15px] font-bold text-slate-800">Thông báo được ghim</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingLeft: 8, paddingRight: 20 }}
            >
              {pinnedPosts
                .filter((p) => !p.isHidden)
                .map((post) => (
                  <View key={post.id} style={{ width: width - 40 }} className="mr-3">
                    <PostCard post={post} onHide={handleHidePost} canHide={true} onPinSuccess={refresh} />
                  </View>
                ))}
            </ScrollView>
            <View className="h-[1px] bg-slate-200/50 mt-4 mx-2" />
          </View>
        )}

        <View className="flex-row items-center mb-1 px-2">
          <Ionicons name="newspaper-outline" size={16} color={Colors.textSecondary} style={{ marginRight: 6 }} />
          <Text className="text-[15px] font-bold text-slate-800">Bản tin chung</Text>
        </View>
      </View>
    );
  };

  const renderFooter = () => {
    if (isLoading && posts.length > 0) {
      return (
        <View className="px-1">
          <PostCardSkeleton />
        </View>
      );
    }
    return <View className="h-20" />;
  };

  const renderError = () => (
    <View className="py-16 px-6 items-center justify-center bg-white rounded-2xl border border-slate-100">
      <Ionicons name="wifi-outline" size={48} color="#94A3B8" style={{ marginBottom: 12 }} />
      <Text className="text-slate-800 font-bold text-[17px] mb-1">Không thể tải bản tin</Text>
      <Text className="text-slate-400 text-[13px] text-center mb-5">
        Đã có lỗi xảy ra khi kết nối đến máy chủ. Vui lòng kiểm tra lại mạng.
      </Text>
      <Pressable onPress={refresh} className="px-6 py-2.5 rounded-full active:opacity-90" style={{ backgroundColor: Colors.primary }}>
        <Text className="text-white text-[13px] font-bold">Thử lại</Text>
      </Pressable>
    </View>
  );

  const renderEmpty = () => (
    <View className="py-16 px-6 items-center justify-center bg-white rounded-2xl border border-slate-100">
      <Ionicons name="newspaper-outline" size={48} color="#94A3B8" style={{ marginBottom: 12 }} />
      <Text className="text-slate-800 font-bold text-[17px] mb-1">Chưa có bài đăng nào</Text>
      <Text className="text-slate-400 text-[13px] text-center mb-5">
        Hãy là người đầu tiên chia sẻ câu chuyện hoặc thông tin hữu ích trong ký túc xá nhé!
      </Text>
      <Pressable
        onPress={() => setCreateModalVisible(true)}
        className="px-6 py-2.5 rounded-full active:opacity-90"
        style={{ backgroundColor: Colors.primary }}
      >
        <Text className="text-white text-[13px] font-bold">Đăng bài ngay</Text>
      </Pressable>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <LinearGradient
        colors={[Colors.primary, Colors.primaryLight]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          paddingHorizontal: 20,
          paddingTop: insets.top + 10,
          paddingBottom: 28,
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
        }}
      >
        <View className="flex-row items-center justify-between">
          <Text className="text-[28px] font-extrabold text-white">Cộng đồng KTX</Text>
          <TouchableOpacity
            onPress={() => setHiddenPostsModalVisible(true)}
            className="w-10 h-10 items-center justify-center rounded-full bg-white/15 active:bg-white/25"
          >
            <Ionicons name="eye-off-outline" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <Text className="mt-2 text-[15px] text-white/90">Kết nối, thảo luận và chia sẻ thông tin ký túc xá</Text>
      </LinearGradient>

      <View className="mt-3.5 mb-2.5 z-20">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 4 }}>
          {FILTER_TABS.map((tab) => {
            const isSelected = postType === tab.key;
            return (
              <Pressable
                key={tab.key || "all"}
                onPress={() => setPostType(tab.key)}
                className="flex-row items-center px-4 py-2.5 rounded-full mr-2.5 border shadow-sm"
                style={{
                  backgroundColor: isSelected ? Colors.primary : "#FFFFFF",
                  borderColor: isSelected ? Colors.primary : Colors.border,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 3,
                  elevation: 2,
                }}
              >
                <Ionicons name={tab.icon} size={14} color={isSelected ? "#FFFFFF" : Colors.textSecondary} style={{ marginRight: 6 }} />
                <Text className="text-[13px] font-bold" style={{ color: isSelected ? "#FFFFFF" : Colors.textSecondary }}>
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <View style={{ flex: 1 }}>
        {isError ? (
          <View className="p-5">{renderError()}</View>
        ) : isLoading || isRefreshing ? (
          <ScrollView contentContainerStyle={{ padding: 20 }} showsVerticalScrollIndicator={false}>
            <PostCardSkeleton />
            <PostCardSkeleton />
            <PostCardSkeleton />
          </ScrollView>
        ) : (
          <FlatList
            data={posts.filter((p) => !p.isHidden)}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <PostCard post={item} onHide={handleHidePost} canHide={true} onPinSuccess={refresh} />
            )}
            contentContainerStyle={{ paddingHorizontal: 12, paddingTop: 6, paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={refresh} colors={[Colors.primary]} tintColor={Colors.primary} />
            }
            onEndReached={loadMore}
            onEndReachedThreshold={0.2}
            ListHeaderComponent={renderHeader}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={renderEmpty}
          />
        )}
      </View>

      <DraggableFAB onPress={() => setCreateModalVisible(true)} />

      <CreatePostModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        onSubmit={handleCreatePostSubmit}
      />

      <HiddenPostsModal
        visible={hiddenPostsModalVisible}
        onClose={() => setHiddenPostsModalVisible(false)}
        onHide={handleHidePost}
        onPinSuccess={refresh}
      />
    </View>
  );
}
