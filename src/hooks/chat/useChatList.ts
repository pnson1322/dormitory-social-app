import { useState, useEffect, useCallback } from "react";
import { useRouter, useFocusEffect } from "expo-router";
import { useCurrentUserRole } from "@/hooks/auth/useCurrentUserRole";
import { useConversations } from "@/hooks/chat/useConversations";
import { getUsers } from "@/services/user/user.api";
import { UserItem } from "@/services/user/user.types";
import { chatMetadataCache } from "@/utils/chatMetadataCache";

type FilterType = "all" | "direct" | "group";

export function useChatList() {
  const router = useRouter();
  const { isAdminOrManager } = useCurrentUserRole();

  const {
    conversations,
    isLoading,
    isRefreshing,
    refresh,
    refetch,
    createDirect,
    createGroup,
  } = useConversations();

  useFocusEffect(
    useCallback(() => {
      refetch(false, true);
    }, [refetch])
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isCreatingChat, setIsCreatingChat] = useState(false);

  const fetchUsersList = useCallback(async () => {
    try {
      setIsLoadingUsers(true);
      const data = await getUsers({ PageSize: 100 });
      setUsers(data.items || []);
    } catch (error) {
      console.error("[ChatListScreen] Fetch users failed:", error);
    } finally {
      setIsLoadingUsers(false);
    }
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      fetchUsersList();
    }
  }, [isModalOpen, fetchUsersList]);

  const handleStartDirectChat = async (targetUser: UserItem) => {
    try {
      setIsCreatingChat(true);
      const res = await createDirect(targetUser.id);
      chatMetadataCache.set(res.id, {
        name: targetUser.fullName || targetUser.email || "Người dùng",
        avatarUrl: targetUser.avatarUrl,
      });
      setIsModalOpen(false);
      router.push(`/chat/${res.id}`);
    } catch (err) {
      console.error("[ChatListScreen] Start direct chat failed:", err);
    } finally {
      setIsCreatingChat(false);
    }
  };

  const handleCreateGroupChat = async (name: string, members: string[]) => {
    try {
      setIsCreatingChat(true);
      const res = await createGroup(name.trim(), members);
      setIsModalOpen(false);
      router.push(`/chat/${res.id}`);
    } catch (err) {
      console.error("[ChatListScreen] Create group chat failed:", err);
    } finally {
      setIsCreatingChat(false);
    }
  };

  const filteredConversations = conversations.filter((c) => {
    const matchesSearch =
      c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeFilter === "all") return matchesSearch;
    if (activeFilter === "direct") return matchesSearch && c.type === "Direct";
    if (activeFilter === "group") return matchesSearch && c.type === "Group";
    return matchesSearch;
  });

  return {
    router,
    isAdminOrManager,
    isLoading,
    isRefreshing,
    refresh,
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    isSearchFocused,
    setIsSearchFocused,
    isModalOpen,
    setIsModalOpen,
    users,
    isLoadingUsers,
    isCreatingChat,
    handleStartDirectChat,
    handleCreateGroupChat,
    filteredConversations,
  };
}
