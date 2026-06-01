import { useCurrentUserRole } from "@/hooks/auth/useCurrentUserRole";
import {
  deleteMessage as apiDeleteMessage,
  sendMessage as apiSendMessage,
  getMessages,
} from "@/services/chat/chat.api";
import { MessageResponse } from "@/services/chat/chat.types";
import { chatSignalRService } from "@/services/chat/chatSignalR.service";
import { useCallback, useEffect, useRef, useState } from "react";

export function useMessages(conversationId: string | null) {
  const { userId: currentUserId } = useCurrentUserRole();
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [userNamesMap, setUserNamesMap] = useState<Record<string, string>>({});

  const typingTimeoutRef = useRef<Record<string, NodeJS.Timeout>>({});
  const isTypingRef = useRef(false);
  const stopTypingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const updateNamesMap = useCallback((newMessages: MessageResponse[]) => {
    setUserNamesMap((prev) => {
      const updated = { ...prev };
      let changed = false;
      newMessages.forEach((msg) => {
        if (msg.senderId && msg.senderName && updated[msg.senderId] !== msg.senderName) {
          updated[msg.senderId] = msg.senderName;
          changed = true;
        }
      });
      return changed ? updated : prev;
    });
  }, []);

  const fetchInitialMessages = useCallback(async () => {
    if (!conversationId) return;
    try {
      setIsLoading(true);
      const data = await getMessages(conversationId, { pageSize: 30 });
      const items = data.items || [];
      setMessages(items.slice().reverse());
      setNextCursor(data.nextCursor || null);
      setHasMore(data.hasMore);
      updateNamesMap(items);
    } catch (error) {

    } finally {
      setIsLoading(false);
    }
  }, [conversationId, updateNamesMap]);

  const refresh = useCallback(async () => {
    if (!conversationId) return;
    try {
      setIsRefreshing(true);
      const data = await getMessages(conversationId, { pageSize: 30 });
      const items = data.items || [];
      setMessages(items.slice().reverse());
      setNextCursor(data.nextCursor || null);
      setHasMore(data.hasMore);
      updateNamesMap(items);
    } catch (error) {

    } finally {
      setIsRefreshing(false);
    }
  }, [conversationId, updateNamesMap]);

  const loadMore = useCallback(async () => {
    if (!conversationId || isLoadingMore || !hasMore || !nextCursor) return;
    try {
      setIsLoadingMore(true);
      const data = await getMessages(conversationId, {
        cursor: nextCursor,
        pageSize: 30,
      });
      const items = data.items || [];
      setMessages((prev) => {
        const filteredNew = items.filter((item) => !prev.some((m) => m.id === item.id));
        return [...prev, ...filteredNew.slice().reverse()];
      });
      setNextCursor(data.nextCursor || null);
      setHasMore(data.hasMore);
      updateNamesMap(items);
    } catch (error) {

    } finally {
      setIsLoadingMore(false);
    }
  }, [conversationId, isLoadingMore, hasMore, nextCursor, updateNamesMap]);

  const send = useCallback(
    async (content: string, files?: string[]) => {
      if (!conversationId) return;
      const tempId = `temp-${Date.now()}`;

      const tempMessage: MessageResponse = {
        id: tempId,
        conversationId,
        senderId: currentUserId || "",
        content,
        mediaUrls: files || [],
        createdAt: new Date().toISOString(),
        status: "sending",
      };

      setMessages((prev) => [tempMessage, ...prev]);

      try {
        const result = await apiSendMessage(conversationId, { content, files });
        setMessages((prev) =>
          prev.map((m) => (m.id === tempId ? { ...result, status: "sent" } : m))
        );
        updateNamesMap([result]);
        return result;
      } catch (error) {

        setMessages((prev) =>
          prev.map((m) => (m.id === tempId ? { ...m, status: "failed" } : m))
        );
        throw error;
      }
    },
    [conversationId, currentUserId, updateNamesMap]
  );

  const retry = useCallback(
    async (tempId: string, content: string, files?: string[]) => {
      if (!conversationId) return;

      setMessages((prev) =>
        prev.map((m) => (m.id === tempId ? { ...m, status: "sending" } : m))
      );

      try {
        const result = await apiSendMessage(conversationId, { content, files });
        setMessages((prev) =>
          prev.map((m) => (m.id === tempId ? { ...result, status: "sent" } : m))
        );
        updateNamesMap([result]);
        return result;
      } catch (error) {

        setMessages((prev) =>
          prev.map((m) => (m.id === tempId ? { ...m, status: "failed" } : m))
        );
        throw error;
      }
    },
    [conversationId, updateNamesMap]
  );

  const deleteFailed = useCallback((tempId: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== tempId));
  }, []);

  const revoke = useCallback(
    async (messageId: string) => {
      if (!conversationId) return;
      try {
        await apiDeleteMessage(conversationId, messageId);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === messageId
              ? { ...m, isDeleted: true, content: "", mediaUrls: [] }
              : m
          )
        );
      } catch (error) {

        throw error;
      }
    },
    [conversationId]
  );

  const triggerTyping = useCallback(() => {
    if (!conversationId) return;

    if (!isTypingRef.current) {
      isTypingRef.current = true;
      chatSignalRService.typing(conversationId);
    }

    if (stopTypingTimeoutRef.current) {
      clearTimeout(stopTypingTimeoutRef.current);
    }

    stopTypingTimeoutRef.current = setTimeout(() => {
      if (isTypingRef.current) {
        isTypingRef.current = false;
        chatSignalRService.stopTyping(conversationId);
      }
    }, 3000);
  }, [conversationId]);

  useEffect(() => {
    if (!conversationId) return;

    let isMounted = true;
    async function joinHubGroup() {
      if (!chatSignalRService.isConnected) {
        try {
          await chatSignalRService.connect();
        } catch (e) {

        }
      }
      if (chatSignalRService.isConnected && conversationId) {
        await chatSignalRService.joinConversation(conversationId);
      }
    }

    joinHubGroup();

    const unsubMessage = chatSignalRService.onMessageReceived((msg: MessageResponse) => {
      if (!isMounted) return;
      if (msg.conversationId === conversationId) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === msg.id)) return prev;
          return [msg, ...prev];
        });
        updateNamesMap([msg]);
      }
    });

    const unsubDelete = chatSignalRService.onMessageDeleted((payload) => {
      if (!isMounted) return;
      if (payload.conversationId === conversationId) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === payload.messageId
              ? { ...m, isDeleted: true, content: "", mediaUrls: [] }
              : m
          )
        );
      }
    });

    const unsubTyping = chatSignalRService.onUserTyping((payload) => {
      if (!isMounted) return;
      if (payload.conversationId === conversationId && payload.userId !== currentUserId) {
        setTypingUsers((prev) => {
          if (prev.includes(payload.userId)) return prev;
          return [...prev, payload.userId];
        });

        if (typingTimeoutRef.current[payload.userId]) {
          clearTimeout(typingTimeoutRef.current[payload.userId]);
        }
        typingTimeoutRef.current[payload.userId] = setTimeout(() => {
          if (isMounted) {
            setTypingUsers((prev) => prev.filter((id) => id !== payload.userId));
          }
        }, 5000);
      }
    });

    const unsubStopTyping = chatSignalRService.onUserStopTyping((payload) => {
      if (!isMounted) return;
      if (payload.conversationId === conversationId && payload.userId !== currentUserId) {
        setTypingUsers((prev) => prev.filter((id) => id !== payload.userId));
        if (typingTimeoutRef.current[payload.userId]) {
          clearTimeout(typingTimeoutRef.current[payload.userId]);
          delete typingTimeoutRef.current[payload.userId];
        }
      }
    });

    fetchInitialMessages();

    return () => {
      isMounted = false;
      unsubMessage();
      unsubDelete();
      unsubTyping();
      unsubStopTyping();

      if (stopTypingTimeoutRef.current) {
        clearTimeout(stopTypingTimeoutRef.current);
      }
      Object.values(typingTimeoutRef.current).forEach(clearTimeout);
    };
  }, [conversationId, currentUserId, fetchInitialMessages, updateNamesMap]);

  return {
    messages,
    isLoading,
    isLoadingMore,
    isRefreshing,
    hasMore,
    typingUsers,
    userNamesMap,
    refresh,
    loadMore,
    send,
    retry,
    deleteFailed,
    revoke,
    triggerTyping,
  };
}
