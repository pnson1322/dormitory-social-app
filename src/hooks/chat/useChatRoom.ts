import { useToast } from "@/components/toast/ToastProvider";
import { useCurrentUserRole } from "@/hooks/auth/useCurrentUserRole";
import { useConversations } from "@/hooks/chat/useConversations";
import { useMessages } from "@/hooks/chat/useMessages";
import { addMemberToGroup } from "@/services/chat/chat.api";
import { getUsers } from "@/services/user/user.api";
import { UserItem } from "@/services/user/user.types";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { chatMetadataCache } from "@/utils/chatMetadataCache";
import { FlatList, Keyboard } from "react-native";

export function useChatRoom(conversationId: string) {
  const router = useRouter();
  const { showToast } = useToast();
  const { userId: currentUserId, isAdminOrManager } = useCurrentUserRole();
  const { conversations } = useConversations();

  const conversation = conversations.find((c) => c.id === conversationId);

  const {
    messages,
    isLoading,
    isLoadingMore,
    hasMore,
    typingUsers,
    loadMore,
    send,
    retry,
    deleteFailed,
    revoke,
    triggerTyping,
  } = useMessages(conversationId);

  const [inputMessage, setInputMessage] = useState("");
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);

  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [revokeModalVisible, setRevokeModalVisible] = useState(false);
  const [selectedMessageIdToRevoke, setSelectedMessageIdToRevoke] = useState<string | null>(null);

  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerImages, setViewerImages] = useState<string[]>([]);
  const [viewerIndex, setViewerIndex] = useState(0);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const flatListRef = useRef<FlatList>(null);

  const isGroup = conversation?.type === "Group";

  const cachedMetadata = chatMetadataCache.get(conversationId);

  const otherMemberMsg = messages.find(
    (m) => m.senderId !== currentUserId && m.senderName
  );

  if (otherMemberMsg && otherMemberMsg.senderName && !cachedMetadata) {
    chatMetadataCache.set(conversationId, {
      name: otherMemberMsg.senderName,
      avatarUrl: otherMemberMsg.senderAvatar,
    });
  }

  const chatName =
    conversation?.name ||
    cachedMetadata?.name ||
    otherMemberMsg?.senderName ||
    (isGroup ? "Nhóm chat" : "Hội thoại");

  const avatarUrl =
    conversation?.avatarUrl !== undefined && conversation.avatarUrl !== null
      ? conversation.avatarUrl
      : cachedMetadata?.avatarUrl || otherMemberMsg?.senderAvatar || null;

  const handlePickImages = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== ImagePicker.PermissionStatus.GRANTED) {
        showToast({
          type: "info",
          title: "Quyền truy cập",
          message: "Ứng dụng cần quyền truy cập thư viện ảnh để gửi hình ảnh.",
        });
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets) {
        const uris = result.assets.map((asset) => asset.uri);
        setSelectedImages((prev) => [...prev, ...uris]);
      }
    } catch (e) {
      console.error("[ChatRoomScreen] Pick images failed:", e);
    }
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSend = async () => {
    const trimmedText = inputMessage.trim();
    if (selectedImages.length > 0 && !trimmedText) {
      showToast({
        type: "info",
        title: "Nhắc nhở",
        message: "Vui lòng nhập thêm tin nhắn văn bản khi gửi ảnh.",
      });
      return;
    }
    if (!trimmedText && selectedImages.length === 0) return;

    try {
      setIsSending(true);
      const textToSend = trimmedText;
      const imagesToSend = [...selectedImages];

      setInputMessage("");
      setSelectedImages([]);

      await send(textToSend, imagesToSend);
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    } catch (err) {
      console.error("[ChatRoomScreen] Send message failed:", err);
      showToast({
        type: "error",
        title: "Gửi thất bại",
        message: "Gửi tin nhắn thất bại, vui lòng thử lại.",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleLongPressMessage = (messageId: string, senderId: string) => {
    if (senderId !== currentUserId) return;
    setSelectedMessageIdToRevoke(messageId);
    setRevokeModalVisible(true);
  };

  const confirmRevokeMessage = async (messageId: string) => {
    try {
      await revoke(messageId);
      showToast({
        type: "success",
        title: "Thu hồi thành công",
        message: "Tin nhắn đã được thu hồi.",
      });
    } catch (err) {
      console.error("[ChatRoomScreen] Revoke failed:", err);
      showToast({
        type: "error",
        title: "Thu hồi thất bại",
        message: "Không thể thu hồi tin nhắn lúc này.",
      });
    }
  };

  const openAddMemberModal = async () => {
    setIsAddMemberModalOpen(true);
    try {
      setIsLoadingUsers(true);
      const data = await getUsers({ PageSize: 100 });
      setUsers(data.items || []);
    } catch (err) {
      console.error(err);
      showToast({
        type: "error",
        title: "Lỗi tải dữ liệu",
        message: "Không thể tải danh sách người dùng.",
      });
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleAddUserToGroup = async (user: UserItem) => {
    try {
      setIsAddingMember(true);
      await addMemberToGroup(conversationId, user.id);
      showToast({
        type: "success",
        title: "Thành công",
        message: `Đã thêm ${user.fullName} vào nhóm.`,
      });
      setIsAddMemberModalOpen(false);
    } catch (err) {
      console.error(err);
      showToast({
        type: "error",
        title: "Thêm thành viên thất bại",
        message: "Không thể thêm thành viên này hoặc họ đã có trong nhóm.",
      });
    } finally {
      setIsAddingMember(false);
    }
  };

  const handleZoomImage = (urls: string[], initialIndex: number) => {
    setViewerImages(urls);
    setViewerIndex(initialIndex);
    setViewerVisible(true);
  };

  const getTypingText = () => {
    if (typingUsers.length === 0) return "";
    if (typingUsers.length === 1) return `${typingUsers[0]} đang nhập...`;
    return "Nhiều người đang nhập... ";
  };

  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowScrollToBottom(offsetY > 300);
  };

  const scrollToBottom = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  return {
    router,
    currentUserId,
    isAdminOrManager,
    conversation,
    messages,
    isLoading,
    isLoadingMore,
    typingUsers,
    loadMore,
    triggerTyping,
    inputMessage,
    setInputMessage,
    selectedImages,
    isSending,
    isAddMemberModalOpen,
    setIsAddMemberModalOpen,
    users,
    isLoadingUsers,
    isAddingMember,
    revokeModalVisible,
    setRevokeModalVisible,
    selectedMessageIdToRevoke,
    setSelectedMessageIdToRevoke,
    keyboardVisible,
    viewerVisible,
    setViewerVisible,
    viewerImages,
    viewerIndex,
    flatListRef,
    isGroup,
    chatName,
    avatarUrl,
    handlePickImages,
    handleRemoveImage,
    handleSend,
    handleLongPressMessage,
    confirmRevokeMessage,
    openAddMemberModal,
    handleAddUserToGroup,
    handleZoomImage,
    getTypingText,
    retry,
    deleteFailed,
    showScrollToBottom,
    handleScroll,
    scrollToBottom,
  };
}
