import { useToast } from "@/components/toast/ToastProvider";
import { createAnnouncement, createPost, hidePost } from "@/services/community/community.api";
import { CreateAnnouncementRequest, CreatePostRequest } from "@/services/community/community.types";
import { useState } from "react";

export function useCommunityActions() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const handleCreatePost = async (content: string, postType: string, files?: string[]) => {
    try {
      setIsSubmitting(true);
      const payload: CreatePostRequest = {
        content,
        postType,
        files,
      };
      const result = await createPost(payload);
      showToast({
        type: "success",
        title: "Thành công",
        message: "Bài đăng của bạn đã được chia sẻ.",
      });
      return result;
    } catch (error: any) {

      showToast({
        type: "error",
        title: "Thất bại",
        message: error?.response?.data?.title || "Không thể đăng bài viết.",
      });
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateAnnouncement = async (content: string, isPinned?: boolean, files?: string[]) => {
    try {
      setIsSubmitting(true);
      const payload: CreateAnnouncementRequest = {
        content,
        isPinned,
        files,
      };
      const result = await createAnnouncement(payload);
      showToast({
        type: "success",
        title: "Thành công",
        message: "Thông báo đã được đăng thành công.",
      });
      return result;
    } catch (error: any) {

      showToast({
        type: "error",
        title: "Thất bại",
        message: error?.response?.data?.title || "Không thể đăng thông báo.",
      });
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleHidePost = async (id: string) => {
    try {
      setIsSubmitting(true);
      const result = await hidePost(id);
      showToast({
        type: "success",
        title: "Thành công",
        message: "Bài viết đã được ẩn.",
      });
      return result;
    } catch (error: any) {

      showToast({
        type: "error",
        title: "Thất bại",
        message: error?.response?.data?.title || "Không thể ẩn bài viết.",
      });
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    createPost: handleCreatePost,
    createAnnouncement: handleCreateAnnouncement,
    hidePost: handleHidePost,
  };
}
