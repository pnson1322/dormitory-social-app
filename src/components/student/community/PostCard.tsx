import { Colors } from "@/constants/colors";
import { useCurrentUserRole } from "@/hooks/auth/useCurrentUserRole";
import { usePostInteraction } from "@/hooks/community/usePostInteraction";
import { PostResponse } from "@/services/community/community.types";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { useState } from "react";
import { Text, View } from "react-native";
import { PostCardActions } from "./PostCardActions";
import { PostCardHeader } from "./PostCardHeader";
import { PostDetailModal } from "./PostDetailModal";
import { PostStrategyFactory } from "./PostRenderingStrategy";
import { ReportPostModal } from "./ReportPostModal";

interface PostCardProps {
  post: PostResponse;
  onHide?: (id: string) => void;
  canHide?: boolean;
  onPinSuccess?: () => void;
}

export function PostCard({ post, onHide, canHide = false, onPinSuccess }: PostCardProps) {
  const strategy = PostStrategyFactory.getStrategy(post.postType);

  const {
    isLiked,
    likesCount,
    commentsCount,
    commentText,
    setCommentText,
    commentsList,
    isLoadingComments,
    isHiding,
    isPinned,
    isPinning,
    handleLikeToggle,
    handleSendComment,
    handleHide,
    handlePinToggle,
    formatDate,
    getInitials,
    fetchComments,
    fetchPostDetail,
    editingCommentId,
    handleDeleteComment,
    startEditComment,
    cancelEditComment,
    handleLikeComment,
    hasMoreComments,
    loadMoreComments,
  } = usePostInteraction(post, onHide);

  const { isAdminOrManager } = useCurrentUserRole();

  const handlePin = async () => {
    await handlePinToggle(onPinSuccess);
  };

  const renderMedia = () => {
    const urls = post.mediaUrls;
    if (!urls || urls.length === 0) return null;

    if (urls.length === 1) {
      return (
        <View className="mt-3 rounded-xl overflow-hidden">
          <Image
            source={{ uri: urls[0] }}
            className="w-full h-56 rounded-xl"
            contentFit="cover"
            transition={200}
          />
        </View>
      );
    }

    if (urls.length === 2) {
      return (
        <View className="mt-3 flex-row justify-between">
          <Image
            source={{ uri: urls[0] }}
            style={{ width: "49%", aspectRatio: 1 }}
            className="rounded-xl"
            contentFit="cover"
            transition={200}
          />
          <Image
            source={{ uri: urls[1] }}
            style={{ width: "49%", aspectRatio: 1 }}
            className="rounded-xl"
            contentFit="cover"
            transition={200}
          />
        </View>
      );
    }

    const remainingCount = urls.length - 3;
    return (
      <View className="mt-3 flex-row justify-between h-48">
        <Image
          source={{ uri: urls[0] }}
          style={{ width: "63%", height: "100%" }}
          className="rounded-l-xl"
          contentFit="cover"
          transition={200}
        />
        <View
          className="justify-between"
          style={{ width: "35%", height: "100%" }}
        >
          <Image
            source={{ uri: urls[1] }}
            style={{ width: "100%", height: "48%" }}
            className="rounded-tr-xl"
            contentFit="cover"
            transition={200}
          />
          <View style={{ width: "100%", height: "48%" }} className="relative">
            <Image
              source={{ uri: urls[2] }}
              style={{ width: "100%", height: "100%" }}
              className="rounded-br-xl"
              contentFit="cover"
              transition={200}
            />
            {remainingCount > 0 && (
              <View
                className="absolute inset-0 bg-black/45 rounded-br-xl justify-center items-center"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                }}
              >
                <Text className="text-white font-extrabold text-[17px]">
                  +{remainingCount}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  const [showReportModal, setShowReportModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const handleOpenDetail = () => {
    fetchPostDetail();
    fetchComments();
    setShowDetailModal(true);
  };

  return (
    <View
      style={{
        position: "relative",
        overflow: "visible",
        paddingHorizontal: 8,
        paddingVertical: 9,
      }}
    >
      <View
        className="bg-white rounded-2xl pt-4 px-4 pb-0 border"
        style={{
          borderColor: strategy.getCardBorderColor(),
        }}
      >
        <PostCardHeader
          authorId={post.authorId}
          createdAt={post.createdAt}
          strategy={strategy}
          canHide={canHide}
          onHide={onHide}
          isHiding={isHiding}
          handleHide={handleHide}
          formatDate={formatDate}
          getInitials={getInitials}
          onPress={handleOpenDetail}
          avatarUrl={post.avatarUrl}
          authorName={post.authorName}
          canPin={isAdminOrManager}
          isPinned={isPinned}
          isPinning={isPinning}
          onPin={handlePin}
        />

        <Text
          numberOfLines={2}
          onPress={handleOpenDetail}
          className="text-[15px] leading-6"
          style={{ color: Colors.textPrimary }}
        >
          {post.content}
        </Text>

        {strategy.renderCustomContent && strategy.renderCustomContent(post)}

        {renderMedia()}

        <View className="flex-row items-center justify-between pb-2.5 mt-2">
          <View className="flex-row items-center">
            <View className="w-4 h-4 rounded-full bg-red-500 justify-center items-center mr-1.5">
              <Ionicons name="heart" size={9} color="#FFFFFF" />
            </View>
            <Text
              className="text-[12px]"
              style={{ color: Colors.textSecondary }}
            >
              {likesCount}
            </Text>
          </View>
          <Text className="text-[12px]" style={{ color: Colors.textSecondary }}>
            {commentsCount} bình luận
          </Text>
        </View>

        <PostCardActions
          isLiked={isLiked}
          likesCount={likesCount}
          handleLikeToggle={handleLikeToggle}
          onCommentPress={handleOpenDetail}
          commentsCount={commentsCount}
          onReportPress={() => setShowReportModal(true)}
        />
      </View>

      {post.isPinned && (
        <View
          className="rounded-full bg-red-500 items-center justify-center border-2 border-white z-30"
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 28,
            height: 28,
          }}
        >
          <AntDesign name="pushpin" size={13} color="#FFFFFF" />
        </View>
      )}

      <ReportPostModal
        visible={showReportModal}
        postId={post.id}
        onClose={() => setShowReportModal(false)}
      />

      <PostDetailModal
        visible={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        post={post}
        strategy={strategy}
        isLiked={isLiked}
        likesCount={likesCount}
        handleLikeToggle={handleLikeToggle}
        commentsList={commentsList}
        commentsCount={commentsCount}
        isLoadingComments={isLoadingComments}
        commentText={commentText}
        setCommentText={setCommentText}
        handleSendComment={handleSendComment}
        formatDate={formatDate}
        getInitials={getInitials}
        onReportPress={() => {
          setShowDetailModal(false);
          setShowReportModal(true);
        }}
        editingCommentId={editingCommentId}
        handleDeleteComment={handleDeleteComment}
        startEditComment={startEditComment}
        cancelEditComment={cancelEditComment}
        hasMoreComments={hasMoreComments}
        loadMoreComments={loadMoreComments}
        handleLikeComment={handleLikeComment}
      />
    </View>
  );
}
