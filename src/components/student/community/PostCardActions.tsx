import { Colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";

interface PostCardActionsProps {
  isLiked: boolean;
  likesCount: number;
  handleLikeToggle: () => Promise<void>;
  onCommentPress: () => void;
  commentsCount: number;
  onReportPress: () => void;
}

export function PostCardActions({
  isLiked,
  likesCount,
  handleLikeToggle,
  onCommentPress,
  commentsCount,
  onReportPress,
}: PostCardActionsProps) {
  return (
    <View
      className="mt-1 border-t flex-row items-center justify-between"
      style={{ borderColor: Colors.border, height: 49 }}
    >
      <Pressable
        onPress={handleLikeToggle}
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
        onPress={onCommentPress}
        className="flex-row items-center justify-center flex-1 rounded-lg active:bg-slate-50"
        style={{ height: 38 }}
      >
        <Ionicons
          name="chatbubble-outline"
          size={20}
          color={Colors.textSecondary}
        />
        <Text
          className="text-[13px] font-semibold ml-2"
          style={{ color: Colors.textSecondary }}
        >
          Bình luận
        </Text>
      </Pressable>

      <View
        style={{
          width: 1.5,
          height: 28,
          backgroundColor: "#CBD5E1",
          marginHorizontal: 8,
        }}
      />

      <Pressable
        onPress={onReportPress}
        className="rounded-lg active:bg-slate-100 items-center justify-center"
        style={{ width: 38, height: 38 }}
      >
        <Ionicons
          name="alert-circle-outline"
          size={22}
          color={Colors.textSecondary}
        />
      </Pressable>
    </View>
  );
}
