import { Colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";

interface PostDetailActionsBarProps {
  isLiked: boolean;
  likesCount: number;
  commentsCount: number;
  onLike: () => void;
  onCommentFocus: () => void;
  onReport: () => void;
}

export function PostDetailActionsBar({
  isLiked,
  likesCount,
  commentsCount,
  onLike,
  onCommentFocus,
  onReport,
}: PostDetailActionsBarProps) {
  return (
    <>
      <View className="flex-row items-center justify-between py-3 mt-4 border-t border-slate-100">
        <View className="flex-row items-center">
          <View className="w-5 h-5 rounded-full bg-red-500 justify-center items-center mr-1.5">
            <Ionicons name="heart" size={11} color="#FFFFFF" />
          </View>
          <Text className="text-[13px]" style={{ color: Colors.textSecondary }}>{likesCount}</Text>
        </View>
        <Text className="text-[13px]" style={{ color: Colors.textSecondary }}>
          {commentsCount} bình luận
        </Text>
      </View>

      <View
        className="border-t border-b flex-row items-center justify-between py-1"
        style={{ borderColor: Colors.border, height: 49 }}
      >
        <Pressable
          onPress={onLike}
          className="flex-row items-center justify-center flex-1 rounded-lg active:bg-slate-50"
          style={{ height: 38 }}
        >
          <Ionicons
            name={isLiked ? "heart" : "heart-outline"}
            size={22}
            color={isLiked ? "#EF4444" : Colors.textSecondary}
          />
          <Text
            className="text-[13px] font-semibold ml-2"
            style={{ color: isLiked ? "#EF4444" : Colors.textSecondary }}
          >
            Thích
          </Text>
        </Pressable>

        <Pressable
          onPress={onCommentFocus}
          className="flex-row items-center justify-center flex-1 rounded-lg active:bg-slate-50"
          style={{ height: 38 }}
        >
          <Ionicons name="chatbubble-outline" size={20} color={Colors.textSecondary} />
          <Text className="text-[13px] font-semibold ml-2" style={{ color: Colors.textSecondary }}>
            Bình luận
          </Text>
        </Pressable>

        <View style={{ width: 1.5, height: 28, backgroundColor: "#CBD5E1", marginHorizontal: 8 }} />

        <Pressable
          onPress={onReport}
          className="rounded-lg active:bg-slate-100 items-center justify-center"
          style={{ width: 38, height: 38 }}
        >
          <Ionicons name="alert-circle-outline" size={22} color={Colors.textSecondary} />
        </Pressable>
      </View>
    </>
  );
}
