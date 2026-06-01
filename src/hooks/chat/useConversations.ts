import { useCurrentUserRole } from "@/hooks/auth/useCurrentUserRole";
import {
  createDirectConversation,
  createGroupConversation,
  getConversations,
} from "@/services/chat/chat.api";
import { ConversationItem, MessageResponse } from "@/services/chat/chat.types";
import { chatSignalRService } from "@/services/chat/chatSignalR.service";
import { useCallback, useEffect, useState } from "react";

export function useConversations(q?: string) {
  const { userId } = useCurrentUserRole();
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const fetchList = useCallback(async (showRefreshing = false, silent = false) => {
    try {
      if (silent) {
      } else if (showRefreshing) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setIsError(false);

      const items = await getConversations(q);
      setConversations(items || []);
    } catch (error) {

      setIsError(true);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [q]);

  const createDirect = useCallback(
    async (targetUserId: string) => {
      try {
        const result = await createDirectConversation({ targetUserId });
        await fetchList();
        if (chatSignalRService.isConnected) {
          await chatSignalRService.joinConversation(result.id);
        }
        return result;
      } catch (error) {

        throw error;
      }
    },
    [fetchList]
  );

  const createGroup = useCallback(
    async (name: string, memberIds: string[]) => {
      try {
        const result = await createGroupConversation({ name, memberIds });
        await fetchList();
        if (chatSignalRService.isConnected) {
          await chatSignalRService.joinConversation(result.id);
        }
        return result;
      } catch (error) {

        throw error;
      }
    },
    [fetchList]
  );

  const refresh = useCallback(() => {
    fetchList(true);
  }, [fetchList]);

  useEffect(() => {
    let isMounted = true;

    async function initSignalR() {
      try {
        if (!chatSignalRService.isConnected) {
          await chatSignalRService.connect();
        }
      } catch (error) {

      }
    }

    initSignalR();

    const unsubStatus = chatSignalRService.onStatusChanged((status) => {
      if (isMounted) {
        setIsConnected(status);
      }
    });

    const unsubMessage = chatSignalRService.onMessageReceived((msg: MessageResponse) => {
      if (!isMounted) return;

      setConversations((prev) => {
        const index = prev.findIndex((c) => c.id === msg.conversationId);

        if (index > -1) {
          const updatedList = [...prev];
          const conv = updatedList[index];
          updatedList[index] = {
            ...conv,
            lastMessage: msg.content,
            lastMessageAt: msg.createdAt,
          };
          const [movedConv] = updatedList.splice(index, 1);
          return [movedConv, ...updatedList];
        } else {
          fetchList();
          return prev;
        }
      });
    });

    const unsubDelete = chatSignalRService.onMessageDeleted((payload) => {
      if (!isMounted) return;
      fetchList();
    });
    fetchList();

    return () => {
      isMounted = false;
      unsubStatus();
      unsubMessage();
      unsubDelete();
    };
  }, [fetchList]);

  useEffect(() => {
    fetchList(false, true);
  }, [q, fetchList]);

  return {
    conversations,
    isLoading,
    isRefreshing,
    isError,
    isConnected,
    createDirect,
    createGroup,
    refresh,
    refetch: fetchList,
  };
}
