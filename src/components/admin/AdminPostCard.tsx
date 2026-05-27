import { Colors } from "@/constants/colors";
import { PostResponse } from "@/services/community/community.types";
import { getInitials, formatDate, isValidAvatarUrl } from "@/utils/communityUtils";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { useState, useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import { FullscreenImageViewer } from "@/components/common/FullscreenImageViewer";
import { PostMediaGrid } from "@/components/community/PostMediaGrid";

interface AdminPostCardProps {
  post: PostResponse;
  onHide: () => void;
}

export function AdminPostCard({ post, onHide }: AdminPostCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [avatarError, setAvatarError] = useState(false);

  useEffect(() => {
    setAvatarError(false);
  }, [post.id]);

  const handleImagePress = (index: number) => {
    setViewerIndex(index);
    setViewerVisible(true);
  };

  const getBadgeInfo = (type: string) => {
    switch (type) {
      case "General":
        return { label: "Thảo luận", icon: "chatbubble-ellipses-outline", color: "#3B82F6", bg: "#EFF6FF" };
      case "LostAndFound":
        return { label: "Tìm đồ thất lạc", icon: "search-outline", color: "#14B8A6", bg: "#F0FDFA" };
      case "Announcement":
        return { label: "Thông báo", icon: "megaphone-outline", color: "#F59E0B", bg: "#FEF3C7" };
      default:
        return { label: "Bài viết", icon: "document-text-outline", color: "#64748B", bg: "#F1F5F9" };
    }
  };

  const badge = getBadgeInfo(post.postType);

  return (
    <View className="bg-white rounded-2xl p-4 mb-4 border border-slate-100 shadow-sm">
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center flex-1">
          {isValidAvatarUrl(post.avatarUrl) && !avatarError ? (
            <Image source={{ uri: post.avatarUrl }} onError={() => setAvatarError(true)} className="w-10 h-10 rounded-full mr-3" contentFit="cover" transition={150} />
          ) : (
            <View
              className="w-10 h-10 rounded-full justify-center items-center mr-3"
              style={{ backgroundColor: Colors.primary + "15" }}
            >
              <Text className="font-bold text-[14px]" style={{ color: Colors.primary }}>
                {getInitials(post.authorName || post.authorId)}
              </Text>
            </View>
          )}
          <View className="flex-1">
            <Text className="font-semibold text-[15px] text-slate-800" numberOfLines={1}>
              {post.authorName || "Sinh viên ẩn danh"}
            </Text>
            <Text className="text-[12px] text-slate-400 mt-0.5">{formatDate(post.createdAt)}</Text>
          </View>
        </View>

        <View
          className="flex-row items-center px-2.5 py-1 rounded-full"
          style={{ backgroundColor: badge.bg }}
        >
          <Ionicons name={badge.icon as any} size={11} color={badge.color} style={{ marginRight: 4 }} />
          <Text className="text-[10px] font-bold" style={{ color: badge.color }}>
            {badge.label}
          </Text>
        </View>
      </View>

      <View>
        <Text
          className="text-[14px] text-slate-700 leading-5"
          numberOfLines={isExpanded ? undefined : 4}
        >
          {post.content}
        </Text>
        {post.content.length > 150 && (
          <Text
            onPress={() => setIsExpanded(!isExpanded)}
            className="text-blue-600 text-[12px] mt-1 font-semibold"
          >
            {isExpanded ? "Thu gọn" : "Xem thêm"}
          </Text>
        )}
      </View>

      <PostMediaGrid mediaUrls={post.mediaUrls} onImagePress={handleImagePress} />

      <View className="flex-row items-center justify-between mt-4 pt-3 border-t border-slate-50">
        <View className="flex-row items-center gap-4">
          <View className="flex-row items-center">
            <Ionicons name="heart-outline" size={16} color="#64748B" style={{ marginRight: 4 }} />
            <Text className="text-[12px] text-slate-500 font-semibold">{post.likeCount || 0}</Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="chatbubble-outline" size={15} color="#64748B" style={{ marginRight: 4 }} />
            <Text className="text-[12px] text-slate-500 font-semibold">{post.commentCount || 0}</Text>
          </View>
          {post.isPinned && (
            <View className="flex-row items-center bg-red-50 px-2 py-0.5 rounded-md">
              <Ionicons name="pin" size={11} color="#EF4444" style={{ marginRight: 3 }} />
              <Text className="text-[9px] font-bold text-red-500">ĐÃ GHIM</Text>
            </View>
          )}
          {post.isHidden && (
            <View className="flex-row items-center bg-slate-100 px-2 py-0.5 rounded-md">
              <Ionicons name="eye-off" size={11} color="#64748B" style={{ marginRight: 3 }} />
              <Text className="text-[9px] font-bold text-slate-500">ĐÃ ẨN</Text>
            </View>
          )}
        </View>

        <Pressable
          onPress={onHide}
          className={`flex-row items-center px-3 py-1.5 rounded-xl border ${
            post.isHidden
              ? "bg-emerald-50 active:bg-emerald-100 border-emerald-100"
              : "bg-red-50 active:bg-red-100 border-red-100"
          }`}
        >
          <Ionicons
            name={post.isHidden ? "eye-outline" : "eye-off-outline"}
            size={14}
            color={post.isHidden ? "#10B981" : "#EF4444"}
            style={{ marginRight: 5 }}
          />
          <Text
            className={`text-[12px] font-bold ${
              post.isHidden ? "text-emerald-600" : "text-red-600"
            }`}
          >
            {post.isHidden ? "Hiện bài" : "Gỡ bài"}
          </Text>
        </Pressable>
      </View>

      <FullscreenImageViewer
        visible={viewerVisible}
        images={post.mediaUrls || []}
        initialIndex={viewerIndex}
        onClose={() => setViewerVisible(false)}
      />
    </View>
  );
}
