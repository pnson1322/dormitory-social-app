import { useToast } from "@/components/toast/ToastProvider";
import { useCommunityActions } from "@/hooks/community/useCommunityActions";
import { useCommunityPosts } from "@/hooks/community/useCommunityPosts";
import { useHiddenPosts } from "@/hooks/community/useHiddenPosts";
import { PostResponse } from "@/services/community/community.types";
import * as ImagePicker from "expo-image-picker";
import { useCallback, useState } from "react";

export type AdminTab = "posts" | "announcement" | "reports";

export function useAdminContentManagement() {
  const [activeTab, setActiveTab] = useState<AdminTab>("posts");
  const [postFilter, setPostFilter] = useState<"all" | "hidden">("all");
  const { showToast } = useToast();

  const { createAnnouncement, hidePost, isSubmitting: isActionSubmitting } = useCommunityActions();
  const postsHook = useCommunityPosts({ pageSize: 15 });
  const hiddenPostsHook = useHiddenPosts({ pageSize: 15, enabled: postFilter === "hidden" });

  const [announcementContent, setAnnouncementContent] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [isCreatingAnnouncement, setIsCreatingAnnouncement] = useState(false);

  const [postToHide, setPostToHide] = useState<PostResponse | null>(null);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [isHidingPost, setIsHidingPost] = useState(false);

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      showToast({
        type: "error",
        title: "Quyền truy cập",
        message: "Cần cấp quyền truy cập thư viện để tải ảnh lên.",
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 5 - images.length,
      quality: 0.7,
    });

    if (!result.canceled) {
      const newUris = result.assets.map((asset) => asset.uri);
      setImages((prev) => [...prev, ...newUris].slice(0, 5));
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handlePublishAnnouncement = async () => {
    if (!announcementContent.trim()) {
      showToast({
        type: "error",
        title: "Lỗi nội dung",
        message: "Vui lòng nhập nội dung thông báo.",
      });
      return;
    }

    setIsCreatingAnnouncement(true);
    try {
      const result = await createAnnouncement(announcementContent.trim(), isPinned, images);
      if (result) {
        setAnnouncementContent("");
        setIsPinned(false);
        setImages([]);

        postsHook.refresh();
        hiddenPostsHook.refresh();
        setActiveTab("posts");
      }
    } catch (error) {

    } finally {
      setIsCreatingAnnouncement(false);
    }
  };

  const initiateHidePost = useCallback((post: PostResponse) => {
    setPostToHide(post);
    setConfirmModalVisible(true);
  }, []);

  const cancelHidePost = useCallback(() => {
    setPostToHide(null);
    setConfirmModalVisible(false);
  }, []);

  const confirmHidePost = async () => {
    if (!postToHide) return;

    setIsHidingPost(true);
    try {
      const result = await hidePost(postToHide.id);
      if (result) {
        setConfirmModalVisible(false);
        setPostToHide(null);
        postsHook.refresh();
        hiddenPostsHook.refresh();
      }
    } catch (error) {

    } finally {
      setIsHidingPost(false);
    }
  };

  const refresh = useCallback(() => {
    if (postFilter === "hidden") {
      hiddenPostsHook.refresh();
    } else {
      postsHook.refresh();
    }
  }, [postFilter, postsHook.refresh, hiddenPostsHook.refresh]);

  const loadMore = useCallback(() => {
    if (postFilter === "hidden") {
      hiddenPostsHook.loadMore();
    } else {
      postsHook.loadMore();
    }
  }, [postFilter, postsHook.loadMore, hiddenPostsHook.loadMore]);

  return {
    activeTab,
    setActiveTab,
    postFilter,
    setPostFilter,

    posts: postFilter === "hidden" ? hiddenPostsHook.hiddenPosts : postsHook.posts,
    pinnedPosts: postsHook.pinnedPosts,
    isLoading: postFilter === "hidden" ? hiddenPostsHook.isLoading : postsHook.isLoading,
    isRefreshing: postFilter === "hidden" ? hiddenPostsHook.isRefreshing : postsHook.isRefreshing,
    isError: postFilter === "hidden" ? hiddenPostsHook.isError : postsHook.isError,
    loadMore,
    refresh,
    hasMore: postFilter === "hidden" ? hiddenPostsHook.hasMore : postsHook.hasMore,

    announcementContent,
    setAnnouncementContent,
    isPinned,
    setIsPinned,
    images,
    isCreatingAnnouncement,
    handlePickImage,
    handleRemoveImage,
    handlePublishAnnouncement,

    postToHide,
    confirmModalVisible,
    isHidingPost,
    initiateHidePost,
    cancelHidePost,
    confirmHidePost,
  };
}
