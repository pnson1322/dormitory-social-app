import { Colors } from "@/constants/colors";
import { PostResponse } from "@/services/community/community.types";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { useState } from "react";
import { Text, View } from "react-native";
import { PostRenderingStrategy } from "./PostRenderingStrategy";
import { isValidAvatarUrl } from "@/utils/communityUtils";

interface PostDetailHeaderProps {
  post: PostResponse;
  strategy: PostRenderingStrategy;
  formatDate: (d: string) => string;
  getInitials: (s: string) => string;
  avatarUrl?: string;
  authorName?: string;
}

export function PostDetailAuthorRow({
  post,
  strategy,
  formatDate,
  getInitials,
  avatarUrl,
  authorName,
}: PostDetailHeaderProps) {
  const finalAvatarUrl = avatarUrl !== undefined ? avatarUrl : post.avatarUrl;
  const finalAuthorName = authorName !== undefined ? authorName : post.authorName;

  return (
    <View className="flex-row items-center mt-4 mb-3">
      <View 
        style={{ width: 44, height: 44, borderRadius: 22, marginRight: 12, position: "relative", overflow: "hidden" }}
      >
        <View
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, justifyContent: "center", alignItems: "center", backgroundColor: Colors.primary + "15" }}
        >
          <Text className="font-bold text-[16px]" style={{ color: Colors.primary }}>
            {getInitials(finalAuthorName || post.authorId)}
          </Text>
        </View>

        {isValidAvatarUrl(finalAvatarUrl) && (
          <Image
            source={{ uri: finalAvatarUrl }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: "100%",
              height: "100%",
              borderRadius: 22,
            }}
            contentFit="cover"
            transition={150}
          />
        )}
      </View>
      <View className="flex-1">
        <Text className="font-bold text-[16px]" style={{ color: Colors.textPrimary }}>
          {finalAuthorName || "Sinh viên KTX"}
        </Text>
        <Text className="text-[13px] mt-0.5" style={{ color: Colors.textSecondary }}>
          {formatDate(post.createdAt)}
        </Text>
      </View>
      <View
        className="flex-row items-center px-2.5 py-1 rounded-full"
        style={{ backgroundColor: strategy.getBadgeBgColor() }}
      >
        <Ionicons
          name={strategy.getBadgeIconName()}
          size={12}
          color={strategy.getBadgeColor()}
          style={{ marginRight: 4 }}
        />
        <Text className="text-[11px] font-bold" style={{ color: strategy.getBadgeColor() }}>
          {strategy.getBadgeLabel()}
        </Text>
      </View>
    </View>
  );
}
