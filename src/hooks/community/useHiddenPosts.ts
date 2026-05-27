import { getHiddenPosts } from "@/services/community/community.api";
import { PostResponse } from "@/services/community/community.types";
import { useCallback, useEffect, useState } from "react";

export function useHiddenPosts(initialParams?: { pageSize?: number; enabled?: boolean }) {
  const [hiddenPosts, setHiddenPosts] = useState<PostResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isError, setIsError] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = initialParams?.pageSize || 20;
  const enabled = initialParams?.enabled ?? true;

  const fetchHiddenPosts = useCallback(
    async (cursor: string | null, isAppend = false) => {
      try {
        if (isAppend) {
          setIsLoading(true);
        } else {
          setIsRefreshing(true);
        }
        setIsError(false);

        const data = await getHiddenPosts({
          cursor: cursor || undefined,
          pageSize,
        });

        if (isAppend) {
          setHiddenPosts((prev) => [...prev, ...(data.items || [])]);
        } else {
          setHiddenPosts(data.items || []);
        }

        setNextCursor(data.nextCursor);
        setHasMore(data.hasMore);
      } catch (error) {
        console.error("Failed to fetch hidden posts:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [pageSize]
  );

  const loadMore = useCallback(() => {
    if (isLoading || isRefreshing || !hasMore || !nextCursor) return;
    fetchHiddenPosts(nextCursor, true);
  }, [isLoading, isRefreshing, hasMore, nextCursor, fetchHiddenPosts]);

  const refresh = useCallback(() => {
    setNextCursor(null);
    fetchHiddenPosts(null, false);
  }, [fetchHiddenPosts]);

  useEffect(() => {
    if (enabled) {
      fetchHiddenPosts(null, false);
    }
  }, [enabled]);

  return {
    hiddenPosts,
    isLoading,
    isRefreshing,
    isError,
    loadMore,
    refresh,
    hasMore,
    setHiddenPosts,
  };
}
