import { FullscreenImageViewer } from "@/components/common/FullscreenImageViewer";
import { Colors } from "@/constants/colors";
import { LocalComment } from "@/hooks/community/usePostInteraction";
import useProfile from "@/hooks/profile/useProfile";
import { PostResponse } from "@/services/community/community.types";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { useRef, useState } from "react";
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
import { CommentItem } from "./CommentItem";
import { PostDetailActionsBar } from "./PostDetailActionsBar";
import { PostDetailAuthorRow } from "./PostDetailAuthorRow";
import { PostRenderingStrategy } from "./PostRenderingStrategy";

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
  getInitials: (nameOrId: string) => string;
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

  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-slate-100">
          <Pressable onPress={onClose} className="p-1 rounded-full active:bg-slate-100">
            <Ionicons name="arrow-back-outline" size={24} color={Colors.textPrimary} />
          </Pressable>
          <Text className="font-bold text-[17px] flex-1 text-center mr-6" style={{ color: Colors.textPrimary }}>
            Bài viết của Sinh viên
          </Text>
        </View>

        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1" keyboardVerticalOffset={0}>
          <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 20 }}>
            <PostDetailAuthorRow post={post} strategy={strategy} formatDate={formatDate} getInitials={getInitials} />

            <Text className="text-[16px] leading-6 mb-4" style={{ color: Colors.textPrimary }}>
              {post.content}
            </Text>

            {strategy.renderCustomContent && strategy.renderCustomContent(post)}

            {post.mediaUrls && post.mediaUrls.length > 0 && (
              <View className="mt-2 rounded-xl overflow-hidden gap-2">
                {post.mediaUrls.map((url, index) => (
                  <Pressable key={index} onPress={() => { setViewerIndex(index); setViewerVisible(true); }} className="active:opacity-95">
                    <Image source={{ uri: url }} style={{ width: "100%", height: 256 }} className="rounded-lg" contentFit="cover" transition={200} />
                  </Pressable>
                ))}
              </View>
            )}

            <PostDetailActionsBar
              isLiked={isLiked}
              likesCount={likesCount}
              commentsCount={commentsCount}
              onLike={handleLikeToggle}
              onCommentFocus={() => inputRef.current?.focus()}
              onReport={onReportPress}
            />

            <Text className="font-bold text-[15px] mt-4 mb-3" style={{ color: Colors.textPrimary }}>
              Bình luận gần đây
            </Text>

            {hasMoreComments && (
              <Pressable onPress={loadMoreComments} className="py-2.5 mb-4 items-center justify-center bg-slate-50 rounded-xl active:bg-slate-100/80">
                <Text className="text-[13px] font-semibold text-blue-600">Xem các bình luận trước...</Text>
              </Pressable>
            )}

            {isLoadingComments ? (
              <View className="py-8 items-center justify-center">
                <ActivityIndicator size="small" color={Colors.primary} />
              </View>
            ) : commentsList.length === 0 ? (
              <View className="py-8 items-center justify-center">
                <Text className="text-[14px]" style={{ color: Colors.textSecondary }}>
                  Chưa có bình luận nào. Hãy là người đầu tiên!
                </Text>
              </View>
            ) : (
              commentsList.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  profileId={profile?.id}
                  onLike={handleLikeComment}
                  onEdit={startEditComment}
                  onDelete={handleDeleteComment}
                />
              ))
            )}
          </ScrollView>

          {editingCommentId !== null && (
            <View className="bg-blue-50/70 px-4 py-2 border-t border-slate-100 flex-row justify-between items-center">
              <View className="flex-row items-center">
                <Ionicons name="create" size={14} color={Colors.primary} style={{ marginRight: 6 }} />
                <Text className="text-[14px] text-slate-600 font-medium">Đang chỉnh sửa bình luận...</Text>
              </View>
              <Pressable onPress={cancelEditComment} className="px-2.5 py-1 rounded-lg bg-slate-200/80 active:bg-slate-300">
                <Text className="text-[13px] font-bold text-slate-600">Hủy</Text>
              </Pressable>
            </View>
          )}

          <FullscreenImageViewer
            visible={viewerVisible}
            images={post.mediaUrls || []}
            initialIndex={viewerIndex}
            onClose={() => setViewerVisible(false)}
          />

          <View className="border-t border-slate-100 px-4 py-2.5 bg-white flex-row items-center">
            <TextInput
              ref={inputRef}
              value={commentText}
              onChangeText={setCommentText}
              placeholder={editingCommentId ? "Chỉnh sửa bình luận..." : "Viết bình luận..."}
              placeholderTextColor={Colors.textSecondary}
              className="flex-1 bg-slate-100 rounded-full px-4 py-2.5 text-[14px]"
              style={{ color: Colors.textPrimary }}
              maxLength={2000}
            />
            <Pressable
              onPress={handleSendComment}
              disabled={!commentText.trim()}
              className="ml-2.5 w-9 h-9 rounded-full items-center justify-center bg-blue-600 disabled:opacity-40"
              style={commentText.trim() ? { backgroundColor: Colors.primary } : {}}
            >
              <Ionicons name={editingCommentId ? "checkmark" : "send"} size={16} color="#FFFFFF" />
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}
