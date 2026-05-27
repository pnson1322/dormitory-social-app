import { useToast } from "@/components/toast/ToastProvider";
import useProfile from "@/hooks/profile/useProfile";
import {
  createComment,
  deleteComment,
  getComments,
  getPostDetail,
  likeComment,
  likePost,
  updateComment,
  pinPost,
} from "@/services/community/community.api";
import {
  CommentResponse,
  PostResponse,
} from "@/services/community/community.types";
import { useCallback, useState } from "react";
import { Alert, Keyboard } from "react-native";
import { formatDate, getInitials } from "@/utils/communityUtils";

export type LocalComment = CommentResponse;

export function usePostInteraction(
  post: PostResponse,
  onHide?: (id: string) => void,
) {
  const { showToast } = useToast();
  const { profile } = useProfile();

  const [isLiked, setIsLiked] = useState(post.isLikedByMe ?? false);
  const [likesCount, setLikesCount] = useState(post.likeCount ?? 0);
  const [commentsCount, setCommentsCount] = useState(post.commentCount ?? 0);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentsList, setCommentsList] = useState<LocalComment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [isHiding, setIsHiding] = useState(false);
  const [isPinned, setIsPinned] = useState(post.isPinned ?? false);
  const [isPinning, setIsPinning] = useState(false);

  const [commentsCursor, setCommentsCursor] = useState<string | null>(null);
  const [hasMoreComments, setHasMoreComments] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [postDetail, setPostDetail] = useState<PostResponse | null>(null);

  const fetchPostDetail = useCallback(async () => {
    setIsLoadingDetail(true);
    try {
      const detail = await getPostDetail(post.id);
      if (detail) {
        setPostDetail(detail);
        if (detail.likeCount !== undefined) setLikesCount(detail.likeCount);
        if (detail.commentCount !== undefined)
          setCommentsCount(detail.commentCount);
        if (detail.isLikedByMe !== undefined) setIsLiked(detail.isLikedByMe);
      }
    } catch (error) {
      console.error("Failed to fetch post detail:", error);
    } finally {
      setIsLoadingDetail(false);
    }
  }, [post.id]);

  const fetchComments = useCallback(async () => {
    setIsLoadingComments(true);
    try {
      const response = await getComments(post.id, { pageSize: 15 });
      setCommentsList(response.items);
      setCommentsCursor(response.nextCursor);
      setHasMoreComments(response.hasMore);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
      showToast({
        type: "error",
        title: "Lỗi tải bình luận",
        message: "Không thể tải danh sách bình luận. Vui lòng thử lại.",
      });
    } finally {
      setIsLoadingComments(false);
    }
  }, [post.id, showToast]);

  const loadMoreComments = useCallback(async () => {
    if (!hasMoreComments || !commentsCursor || isLoadingComments) return;
    try {
      const response = await getComments(post.id, {
        cursor: commentsCursor,
        pageSize: 15,
      });
      setCommentsList((prev) => [...prev, ...response.items]);
      setCommentsCursor(response.nextCursor);
      setHasMoreComments(response.hasMore);
    } catch (error) {
      console.error("Failed to fetch more comments:", error);
    }
  }, [post.id, commentsCursor, hasMoreComments, isLoadingComments]);

  const handleLikeToggle = async () => {
    const originalLiked = isLiked;
    const originalCount = likesCount;

    setIsLiked(!originalLiked);
    setLikesCount(originalLiked ? originalCount - 1 : originalCount + 1);

    try {
      const response = await likePost(post.id);
      setIsLiked(response.isLiked);
      setLikesCount(response.likeCount);
    } catch (error) {
      console.error("Failed to toggle like on post:", error);
      setIsLiked(originalLiked);
      setLikesCount(originalCount);
      showToast({
        type: "error",
        title: "Lỗi tương tác",
        message: "Không thể thực hiện thích bài viết. Vui lòng thử lại.",
      });
    }
  };

  const handleSendComment = async () => {
    if (!commentText.trim()) return;

    const trimmedCommentText = commentText.trim();
    setCommentText("");
    Keyboard.dismiss();

    try {
      if (editingCommentId) {
        const updated = await updateComment(post.id, editingCommentId, {
          content: trimmedCommentText,
        });
        setCommentsList((prev) =>
          prev.map((c) =>
            c.id === editingCommentId
              ? { ...c, content: updated.content, updatedAt: updated.updatedAt }
              : c,
          ),
        );
        setEditingCommentId(null);
        showToast({
          type: "success",
          title: "Thành công",
          message: "Bình luận đã được cập nhật.",
        });
      } else {
        const newComment = await createComment(post.id, {
          content: trimmedCommentText,
        });
        const fullyMappedComment: LocalComment = {
          ...newComment,
          authorName: profile?.fullName || "Tôi",
          avatarUrl: profile?.avatarUrl || undefined,
        };
        setCommentsList((prev) => [...prev, fullyMappedComment]);
        setCommentsCount((prev) => prev + 1);
        showToast({
          type: "success",
          title: "Thành công",
          message: "Bình luận đã được gửi.",
        });
      }
    } catch (error) {
      showToast({
        type: "error",
        title: "Lỗi bình luận",
        message: editingCommentId
          ? "Cập nhật bình luận thất bại."
          : "Bình luận thất bại. Vui lòng gửi lại.",
      });
    }
  };

  const handleDeleteComment = useCallback(
    (commentId: string) => {
      Alert.alert(
        "Xóa bình luận",
        "Bạn có chắc chắn muốn xóa bình luận này không?",
        [
          { text: "Hủy", style: "cancel" },
          {
            text: "Xóa",
            style: "destructive",
            onPress: async () => {
              try {
                await deleteComment(post.id, commentId);
                setCommentsList((prev) =>
                  prev.filter((c) => c.id !== commentId),
                );
                setCommentsCount((prev) => Math.max(0, prev - 1));
                showToast({
                  type: "success",
                  title: "Thành công",
                  message: "Bình luận đã được xóa thành công.",
                });
              } catch (error) {
                showToast({
                  type: "error",
                  title: "Lỗi",
                  message: "Không thể xóa bình luận. Vui lòng thử lại sau.",
                });
              }
            },
          },
        ],
      );
    },
    [post.id, showToast],
  );

  const startEditComment = useCallback(
    (commentId: string, currentContent: string) => {
      setEditingCommentId(commentId);
      setCommentText(currentContent);
    },
    [],
  );

  const cancelEditComment = useCallback(() => {
    setEditingCommentId(null);
    setCommentText("");
  }, []);

  const handleLikeComment = useCallback(
    async (commentId: string) => {
      let originalLiked = false;
      let originalCount = 0;

      setCommentsList((prev) =>
        prev.map((c) => {
          if (c.id === commentId) {
            originalLiked = c.isLikedByMe ?? false;
            originalCount = c.likeCount ?? 0;
            const nextLiked = !originalLiked;
            const nextCount = nextLiked
              ? originalCount + 1
              : Math.max(0, originalCount - 1);
            return { ...c, isLikedByMe: nextLiked, likeCount: nextCount };
          }
          return c;
        }),
      );

      try {
        const response = await likeComment(post.id, commentId);
        setCommentsList((prev) =>
          prev.map((c) =>
            c.id === commentId
              ? {
                  ...c,
                  isLikedByMe: response.isLiked,
                  likeCount: response.likeCount,
                }
              : c,
          ),
        );
      } catch (error) {
        console.error("Failed to toggle like on comment:", error);
        setCommentsList((prev) =>
          prev.map((c) =>
            c.id === commentId
              ? { ...c, isLikedByMe: originalLiked, likeCount: originalCount }
              : c,
          ),
        );
        showToast({
          type: "error",
          title: "Lỗi tương tác",
          message: "Không thể thực hiện thích bình luận. Vui lòng thử lại.",
        });
      }
    },
    [post.id, showToast],
  );

  const handleHide = async () => {
    if (!onHide) return;
    setIsHiding(true);
    try {
      await onHide(post.id);
    } finally {
      setIsHiding(false);
    }
  };

  const handlePinToggle = async (onSuccess?: () => void) => {
    if (isPinning) return;
    setIsPinning(true);
    try {
      const response = await pinPost(post.id);
      setIsPinned(response.isPinned);
      showToast({
        type: "success",
        title: "Thành công",
        message: response.isPinned
          ? "Bài viết đã được ghim thành công."
          : "Bài viết đã được bỏ ghim.",
      });
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Failed to toggle pin on post:", error);
      showToast({
        type: "error",
        title: "Lỗi tương tác",
        message: error?.response?.data?.title || "Không thể thực hiện ghim bài viết. Vui lòng thử lại.",
      });
    } finally {
      setIsPinning(false);
    }
  };

  return {
    isLiked,
    likesCount,
    commentsCount,
    showComments,
    setShowComments,
    commentText,
    setCommentText,
    commentsList,
    isLoadingComments,
    isLoadingDetail,
    isHiding,
    isPinned,
    isPinning,
    editingCommentId,
    hasMoreComments,
    handleLikeToggle,
    handleSendComment,
    handleDeleteComment,
    startEditComment,
    cancelEditComment,
    handleLikeComment,
    loadMoreComments,
    handleHide,
    handlePinToggle,
    formatDate,
    getInitials,
    fetchComments,
    fetchPostDetail,
    postDetail,
  };
}
