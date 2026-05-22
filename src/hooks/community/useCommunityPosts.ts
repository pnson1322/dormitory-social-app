import { getCommunityPosts } from "@/services/community/community.api";
import { PostResponse } from "@/services/community/community.types";
import { useCallback, useEffect, useState } from "react";

export function useCommunityPosts(initialParams?: { postType?: string; pageSize?: number }) {
  const [pinnedPosts, setPinnedPosts] = useState<PostResponse[]>([]);
  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isError, setIsError] = useState(false);
  const [postType, setPostType] = useState<string | undefined>(initialParams?.postType);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = initialParams?.pageSize || 20;

  const fetchPosts = useCallback(async (cursor: string | null, type?: string, isAppend = false) => {
    try {
      if (isAppend) {
        setIsLoading(true);
      } else {
        setIsRefreshing(true);
      }
      setIsError(false);

      const data = await getCommunityPosts({
        Cursor: cursor || undefined,
        PostType: type || undefined,
        PageSize: pageSize,
      });

      if (isAppend) {
        setPosts((prev) => [...prev, ...(data.items || [])]);
      } else {
        setPinnedPosts(data.pinned || []);
        setPosts(data.items || []);
      }

      setNextCursor(data.nextCursor);
      setHasMore(data.hasMore);
    } catch (error) {
      console.error("Failed to fetch community posts:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [pageSize]);

  const handlePostTypeChange = useCallback((newPostType: string | undefined) => {
    setPostType(newPostType);
    setNextCursor(null);
    fetchPosts(null, newPostType, false);
  }, [fetchPosts]);

  const loadMore = useCallback(() => {
    if (isLoading || isRefreshing || !hasMore || !nextCursor) return;
    fetchPosts(nextCursor, postType, true);
  }, [isLoading, isRefreshing, hasMore, nextCursor, postType, fetchPosts]);

  const refresh = useCallback(() => {
    setNextCursor(null);
    fetchPosts(null, postType, false);
  }, [postType, fetchPosts]);

  useEffect(() => {
    fetchPosts(null, postType, false);
  }, []);

  return {
    pinnedPosts,
    posts,
    isLoading,
    isRefreshing,
    isError,
    postType,
    setPostType: handlePostTypeChange,
    loadMore,
    refresh,
    hasMore,
  };
}
