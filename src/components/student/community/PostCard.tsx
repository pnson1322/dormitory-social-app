import { Colors } from "@/constants/colors";
import { useCurrentUserRole } from "@/hooks/auth/useCurrentUserRole";
import { usePostInteraction } from "@/hooks/community/usePostInteraction";
import useProfile from "@/hooks/profile/useProfile";
import { PostResponse } from "@/services/community/community.types";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import { PostCardActions } from "./PostCardActions";
import { PostCardHeader } from "./PostCardHeader";
import { PostDetailModal } from "./PostDetailModal";
import { PostStrategyFactory } from "./PostRenderingStrategy";
import { ReportPostModal } from "./ReportPostModal";
import { FullscreenImageViewer } from "@/components/common/FullscreenImageViewer";
import { PostMediaGrid } from "@/components/community/PostMediaGrid";

interface PostCardProps {
  post: PostResponse;
  onHide?: (id: string) => void;
  canHide?: boolean;
  onPinSuccess?: () => void;
  autoOpenDetail?: boolean;
  onCloseDetail?: () => void;
}

export function PostCard({
  post,
  onHide,
  canHide = false,
  onPinSuccess,
  autoOpenDetail = false,
  onCloseDetail,
}: PostCardProps) {
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
    postDetail,
    editingCommentId,
    handleDeleteComment,
    startEditComment,
    cancelEditComment,
    handleLikeComment,
    hasMoreComments,
    loadMoreComments,
  } = usePostInteraction(post, onHide);

  const { isAdminOrManager, userId } = useCurrentUserRole();
  const { profile } = useProfile();
  const [isExpanded, setIsExpanded] = useState(false);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const isMyPost = !!(
    post.authorId && (
      (profile?.id && post.authorId.toLowerCase() === profile.id.toLowerCase()) ||
      (userId && post.authorId.toLowerCase() === userId.toLowerCase())
    )
  );

  const handleImagePress = (index: number) => {
    setViewerIndex(index);
    setViewerVisible(true);
  };

  const handlePin = async () => {
    await handlePinToggle(onPinSuccess);
  };

  const [showReportModal, setShowReportModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const handleOpenDetail = () => {
    fetchPostDetail();
    fetchComments();
    setShowDetailModal(true);
  };

  useEffect(() => {
    if (autoOpenDetail) {
      handleOpenDetail();
    }
  }, [autoOpenDetail]);

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
          canHide={canHide && (isMyPost || isAdminOrManager)}
          onHide={onHide}
          isHiding={isHiding}
          handleHide={handleHide}
          formatDate={formatDate}
          getInitials={getInitials}
          onPress={handleOpenDetail}
          avatarUrl={isMyPost ? (profile?.avatarUrl || post.avatarUrl || undefined) : (post.avatarUrl || undefined)}
          authorName={isMyPost ? (profile?.fullName || post.authorName) : post.authorName}
          canPin={isAdminOrManager}
          isPinned={isPinned}
          isPinning={isPinning}
          onPin={handlePin}
          isHidden={post.isHidden}
        />

        <View>
          <Text
            numberOfLines={isExpanded ? undefined : 2}
            className="text-[15px] leading-6"
            style={{ color: Colors.textPrimary }}
          >
            {post.content}
          </Text>
          {post.content.length > 90 && (
            <Text
              onPress={() => setIsExpanded(!isExpanded)}
              className="text-blue-600 text-[13px] mt-1 font-semibold"
            >
              {isExpanded ? "Thu gọn" : "Xem thêm"}
            </Text>
          )}
        </View>

        {strategy.renderCustomContent && strategy.renderCustomContent(post)}

        <PostMediaGrid mediaUrls={post.mediaUrls} onImagePress={handleImagePress} />

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
          <Text
            onPress={handleOpenDetail}
            className="text-[12px]"
            style={{ color: Colors.textSecondary }}
          >
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
        onClose={() => {
          setShowDetailModal(false);
          onCloseDetail?.();
        }}
        post={postDetail || post}
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

      <FullscreenImageViewer
        visible={viewerVisible}
        images={post.mediaUrls || []}
        initialIndex={viewerIndex}
        onClose={() => setViewerVisible(false)}
      />
    </View>
  );
}
