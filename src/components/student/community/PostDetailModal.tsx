import { Colors } from "@/constants/colors";
import { LocalComment } from "@/hooks/community/usePostInteraction";
import { PostResponse } from "@/services/community/community.types";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { useRef } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PostRenderingStrategy } from "./PostRenderingStrategy";

import useProfile from "@/hooks/profile/useProfile";

interface PostDetailModalProps {
  visible: boolean;
  onClose: () => void;
  post: PostResponse;
  strategy: PostRenderingStrategy;
  isLiked: boolean;
  likesCount: number;
  handleLikeToggle: () => Promise<void>;
  commentsList: LocalComment[];
  commentsCount: number;
  isLoadingComments: boolean;
  commentText: string;
  setCommentText: (text: string) => void;
  handleSendComment: () => Promise<void>;
  formatDate: (dateString: string) => string;
  getInitials: (authorId: string) => string;
  onReportPress: () => void;
  editingCommentId: string | null;
  handleDeleteComment: (commentId: string) => void;
  startEditComment: (commentId: string, currentContent: string) => void;
  cancelEditComment: () => void;
  hasMoreComments: boolean;
  loadMoreComments: () => Promise<void>;
  handleLikeComment: (commentId: string) => Promise<void>;
}

export function PostDetailModal({
  visible,
  onClose,
  post,
  strategy,
  isLiked,
  likesCount,
  handleLikeToggle,
  commentsList,
  commentsCount,
  isLoadingComments,
  commentText,
  setCommentText,
  handleSendComment,
  formatDate,
  getInitials,
  onReportPress,
  editingCommentId,
  handleDeleteComment,
  startEditComment,
  cancelEditComment,
  hasMoreComments,
  loadMoreComments,
  handleLikeComment,
}: PostDetailModalProps) {
  const inputRef = useRef<TextInput>(null);
  const { profile } = useProfile();

  const focusCommentInput = () => {
    inputRef.current?.focus();
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-slate-100">
          <Pressable
            onPress={onClose}
            className="p-1 rounded-full active:bg-slate-100"
          >
            <Ionicons
              name="arrow-back-outline"
              size={24}
              color={Colors.textPrimary}
            />
          </Pressable>
          <Text
            className="font-bold text-[17px] flex-1 text-center mr-6"
            style={{ color: Colors.textPrimary }}
          >
            Bài viết của Sinh viên
          </Text>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        >
          <ScrollView
            className="flex-1 px-4"
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            <View className="flex-row items-center mt-4 mb-3">
              {post.avatarUrl ? (
                <Image
                  source={{ uri: post.avatarUrl }}
                  className="w-11 h-11 rounded-full mr-3"
                  contentFit="cover"
                  transition={150}
                />
              ) : (
                <View
                  className="w-11 h-11 rounded-full justify-center items-center mr-3"
                  style={{ backgroundColor: Colors.primary + "15" }}
                >
                  <Text
                    className="font-bold text-[16px]"
                    style={{ color: Colors.primary }}
                  >
                    {getInitials(post.authorId)}
                  </Text>
                </View>
              )}
              <View className="flex-1">
                <Text
                  className="font-bold text-[16px]"
                  style={{ color: Colors.textPrimary }}
                >
                  {post.authorName || "Sinh viên KTX"}
                </Text>
                <Text
                  className="text-[13px] mt-0.5"
                  style={{ color: Colors.textSecondary }}
                >
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
                <Text
                  className="text-[11px] font-bold"
                  style={{ color: strategy.getBadgeColor() }}
                >
                  {strategy.getBadgeLabel()}
                </Text>
              </View>
            </View>

            <Text
              className="text-[16px] leading-6 mb-4"
              style={{ color: Colors.textPrimary }}
            >
              {post.content}
            </Text>

            {strategy.renderCustomContent && strategy.renderCustomContent(post)}

            {post.mediaUrls && post.mediaUrls.length > 0 && (
              <View className="mt-2 rounded-xl overflow-hidden gap-2">
                {post.mediaUrls.map((url, index) => (
                  <Image
                    key={index}
                    source={{ uri: url }}
                    className="w-full h-64 rounded-lg"
                    contentFit="cover"
                    transition={200}
                  />
                ))}
              </View>
            )}

            <View className="flex-row items-center justify-between py-3 mt-4 border-t border-slate-100">
              <View className="flex-row items-center">
                <View className="w-5 h-5 rounded-full bg-red-500 justify-center items-center mr-1.5">
                  <Ionicons name="heart" size={11} color="#FFFFFF" />
                </View>
                <Text className="text-[13px]" style={{ color: Colors.textSecondary }}>
                  {likesCount}
                </Text>
              </View>
              <Text
                className="text-[13px]"
                style={{ color: Colors.textSecondary }}
              >
                {commentsCount} bình luận
              </Text>
            </View>

            <View
              className="border-t border-b flex-row items-center justify-between py-1"
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
                onPress={focusCommentInput}
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

            <Text
              className="font-bold text-[15px] mt-4 mb-3"
              style={{ color: Colors.textPrimary }}
            >
              Bình luận gần đây
            </Text>

            {hasMoreComments && (
              <Pressable
                onPress={loadMoreComments}
                className="py-2.5 mb-4 items-center justify-center bg-slate-50 rounded-xl active:bg-slate-100/80"
              >
                <Text className="text-[13px] font-semibold text-blue-600">
                  Xem các bình luận trước...
                </Text>
              </Pressable>
            )}

            {isLoadingComments ? (
              <View className="py-8 items-center justify-center">
                <ActivityIndicator size="small" color={Colors.primary} />
              </View>
            ) : commentsList.length === 0 ? (
              <View className="py-8 items-center justify-center">
                <Text
                  className="text-[14px]"
                  style={{ color: Colors.textSecondary }}
                >
                  Chưa có bình luận nào. Hãy là người đầu tiên!
                </Text>
              </View>
            ) : (
              commentsList.map((comment) => {
                const commenterInitials = comment.authorName
                  ? comment.authorName
                      .split(" ")
                      .pop()
                      ?.slice(0, 2)
                      .toUpperCase() || "SV"
                  : "SV";

                return (
                  <View key={comment.id} className="flex-row mb-4 items-start">
                    {comment.avatarUrl ? (
                      <Image
                        source={{ uri: comment.avatarUrl }}
                        className="w-8 h-8 rounded-full mr-2.5 mt-1"
                        contentFit="cover"
                        transition={150}
                      />
                    ) : (
                      <View
                        className="w-8 h-8 rounded-full justify-center items-center mr-2.5 mt-1"
                        style={{ backgroundColor: Colors.primary + "15" }}
                      >
                        <Text
                          className="font-bold text-[12px]"
                          style={{ color: Colors.primary }}
                        >
                          {commenterInitials}
                        </Text>
                      </View>
                    )}
                    <View className="flex-1 bg-slate-50 p-3 rounded-2xl">
                      <View className="flex-row items-center justify-between mb-1">
                        <Text
                          className="text-[13px] font-bold"
                          style={{ color: Colors.textPrimary }}
                        >
                          {comment.authorName || "Sinh viên KTX"}
                        </Text>
                        <Text
                          className="text-[11px]"
                          style={{ color: Colors.textSecondary }}
                        >
                          {formatDate(comment.createdAt)}
                        </Text>
                      </View>
                      <Text
                        className="text-[13px] leading-5"
                        style={{ color: Colors.textPrimary }}
                      >
                        {comment.content}
                      </Text>

                      <View className="flex-row items-center mt-2 pt-2 border-t border-slate-200/50 gap-4">
                        <Pressable
                          onPress={() => handleLikeComment(comment.id)}
                          className="flex-row items-center active:opacity-60"
                        >
                          <Ionicons
                            name={
                              comment.isLikedByMe ? "heart" : "heart-outline"
                            }
                            size={13}
                            color={
                              comment.isLikedByMe
                                ? "#EF4444"
                                : Colors.textSecondary
                            }
                            style={{ marginRight: 3 }}
                          />
                          <Text
                            className="text-[11px] font-bold"
                            style={{
                              color: comment.isLikedByMe
                                ? "#EF4444"
                                : Colors.textSecondary,
                            }}
                          >
                            {comment.likeCount && comment.likeCount > 0
                              ? `${comment.likeCount} Thích`
                              : "Thích"}
                          </Text>
                        </Pressable>

                        {comment.authorId === profile?.id && (
                          <>
                            <Pressable
                              onPress={() =>
                                startEditComment(comment.id, comment.content)
                              }
                              className="flex-row items-center active:opacity-60"
                            >
                              <Ionicons
                                name="create-outline"
                                size={13}
                                color={Colors.primary}
                                style={{ marginRight: 3 }}
                              />
                              <Text
                                className="text-[11px] font-bold"
                                style={{ color: Colors.primary }}
                              >
                                Sửa
                              </Text>
                            </Pressable>
                            <Pressable
                              onPress={() => handleDeleteComment(comment.id)}
                              className="flex-row items-center active:opacity-60"
                            >
                              <Ionicons
                                name="trash-outline"
                                size={13}
                                color="#EF4444"
                                style={{ marginRight: 3 }}
                              />
                              <Text className="text-[11px] font-bold text-red-500">
                                Xóa
                              </Text>
                            </Pressable>
                          </>
                        )}
                      </View>
                    </View>
                  </View>
                );
              })
            )}
          </ScrollView>

          {editingCommentId !== null && (
            <View className="bg-blue-50/70 px-4 py-2 border-t border-slate-100 flex-row justify-between items-center">
              <View className="flex-row items-center">
                <Ionicons
                  name="create"
                  size={14}
                  color={Colors.primary}
                  style={{ marginRight: 6 }}
                />
                <Text className="text-[12.5px] text-slate-600 font-medium">
                  Đang chỉnh sửa bình luận...
                </Text>
              </View>
              <Pressable
                onPress={cancelEditComment}
                className="px-2.5 py-1 rounded-lg bg-slate-200/80 active:bg-slate-300"
              >
                <Text className="text-[11px] font-bold text-slate-600">
                  Hủy
                </Text>
              </Pressable>
            </View>
          )}

          <View className="border-t border-slate-100 px-4 py-2.5 bg-white flex-row items-center">
            <TextInput
              ref={inputRef}
              value={commentText}
              onChangeText={setCommentText}
              placeholder={
                editingCommentId
                  ? "Chỉnh sửa bình luận..."
                  : "Viết bình luận..."
              }
              placeholderTextColor={Colors.textSecondary}
              className="flex-1 bg-slate-100 rounded-full px-4 py-2.5 text-[14px]"
              style={{ color: Colors.textPrimary }}
              maxLength={2000}
            />
            <Pressable
              onPress={handleSendComment}
              disabled={!commentText.trim()}
              className="ml-2.5 w-9 h-9 rounded-full items-center justify-center bg-blue-600 disabled:opacity-40"
              style={
                commentText.trim() ? { backgroundColor: Colors.primary } : {}
              }
            >
              <Ionicons
                name={editingCommentId ? "checkmark" : "send"}
                size={16}
                color="#FFFFFF"
              />
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}
