import { Colors } from "@/constants/colors";
import { CommentResponse } from "@/services/community/community.types";
import { getInitials, formatDate, isValidAvatarUrl } from "@/utils/communityUtils";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { useState, useEffect } from "react";
import { Pressable, Text, View } from "react-native";

interface CommentItemProps {
  comment: CommentResponse;
  profileId?: string;
  onLike: (id: string) => void;
  onEdit: (id: string, content: string) => void;
  onDelete: (id: string) => void;
}

export function CommentItem({
  comment,
  profileId,
  onLike,
  onEdit,
  onDelete,
}: CommentItemProps) {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [comment.id, comment.avatarUrl]);

  const avatarValid = isValidAvatarUrl(comment.avatarUrl) && !imageError;

  return (
    <View className="flex-row mb-4 items-start">
      {avatarValid ? (
        <Image
          source={{ uri: comment.avatarUrl }}
          onError={() => setImageError(true)}
          className="w-8 h-8 rounded-full mr-2.5 mt-1"
          contentFit="cover"
          transition={150}
        />
      ) : (
        <View
          className="w-8 h-8 rounded-full justify-center items-center mr-2.5 mt-1"
          style={{ backgroundColor: Colors.primary + "15" }}
        >
          <Text className="font-bold text-[12px]" style={{ color: Colors.primary }}>
            {getInitials(comment.authorName || comment.authorId)}
          </Text>
        </View>
      )}

      <View className="flex-1">
        <View className="flex-1 bg-slate-50 p-3 rounded-2xl">
          <View className="flex-row items-center justify-between mb-1">
            <Text
              className="text-[14px] font-bold"
              style={{ color: Colors.textPrimary }}
            >
              {comment.authorName || "Sinh viên KTX"}
            </Text>
            <Text
              className="text-[12px]"
              style={{ color: Colors.textSecondary }}
            >
              {formatDate(comment.createdAt)}
            </Text>
          </View>
          <Text
            className="text-[14px] leading-5"
            style={{ color: Colors.textPrimary }}
          >
            {comment.content}
          </Text>

          <View className="flex-row items-center mt-2 pt-2 border-t border-slate-200/50 gap-4">
            <Pressable
              onPress={() => onLike(comment.id)}
              className="flex-row items-center active:opacity-60"
            >
              <Ionicons
                name={comment.isLikedByMe ? "heart" : "heart-outline"}
                size={14}
                color={comment.isLikedByMe ? "#EF4444" : Colors.textSecondary}
                style={{ marginRight: 3 }}
              />
              <Text
                className="text-[13px] font-bold"
                style={{
                  color: comment.isLikedByMe ? "#EF4444" : Colors.textSecondary,
                }}
              >
                {comment.likeCount && comment.likeCount > 0
                  ? `${comment.likeCount} Thích`
                  : "Thích"}
              </Text>
            </Pressable>

            {comment.authorId === profileId && (
              <>
                <Pressable
                  onPress={() => onEdit(comment.id, comment.content)}
                  className="flex-row items-center active:opacity-60"
                >
                  <Ionicons
                    name="create-outline"
                    size={14}
                    color={Colors.primary}
                    style={{ marginRight: 3 }}
                  />
                  <Text
                    className="text-[13px] font-bold"
                    style={{ color: Colors.primary }}
                  >
                    Sửa
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => onDelete(comment.id)}
                  className="flex-row items-center active:opacity-60"
                >
                  <Ionicons
                    name="trash-outline"
                    size={14}
                    color="#EF4444"
                    style={{ marginRight: 3 }}
                  />
                  <Text className="text-[13px] font-bold text-red-500">
                    Xóa
                  </Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}
