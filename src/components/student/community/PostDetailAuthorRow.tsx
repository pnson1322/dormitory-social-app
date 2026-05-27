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
}

export function PostDetailAuthorRow({ post, strategy, formatDate, getInitials }: PostDetailHeaderProps) {
  const [avatarError, setAvatarError] = useState(false);

  return (
    <View className="flex-row items-center mt-4 mb-3">
      {isValidAvatarUrl(post.avatarUrl) && !avatarError ? (
        <Image
          source={{ uri: post.avatarUrl }}
          onError={() => setAvatarError(true)}
          className="w-11 h-11 rounded-full mr-3"
          contentFit="cover"
          transition={150}
        />
      ) : (
        <View
          className="w-11 h-11 rounded-full justify-center items-center mr-3"
          style={{ backgroundColor: Colors.primary + "15" }}
        >
          <Text className="font-bold text-[16px]" style={{ color: Colors.primary }}>
            {getInitials(post.authorName || post.authorId)}
          </Text>
        </View>
      )}
      <View className="flex-1">
        <Text className="font-bold text-[16px]" style={{ color: Colors.textPrimary }}>
          {post.authorName || "Sinh viên KTX"}
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
