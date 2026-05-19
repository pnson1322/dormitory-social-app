import { getMyIncidents } from "@/services/incident/incident.api";
import { IncidentResponse } from "@/services/incident/incident.types";
import { useCallback, useEffect, useState } from "react";

export function useIncidents(roomId: string, initialParams?: { status?: string; pageSize?: number }) {
  const [incidents, setIncidents] = useState<IncidentResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [status, setStatus] = useState<string | undefined>(initialParams?.status);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = initialParams?.pageSize || 20;

  const fetchIncidents = useCallback(async (pageNum: number, currentStatus?: string, isAppend = false) => {
    if (!roomId) return;
    try {
      setIsLoading(true);
      setIsError(false);
      const data = await getMyIncidents({ 
        roomId, 
        status: currentStatus, 
        page: pageNum, 
        pageSize 
      });
      const newIncidents = Array.isArray(data) ? data : [];
      
      setHasMore(newIncidents.length === pageSize);

      if (isAppend) {
        setIncidents((prev) => [...prev, ...newIncidents]);
      } else {
        setIncidents(newIncidents);
      }
    } catch (error) {
      console.error("Failed to fetch incidents:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [roomId, pageSize]);

  const handleStatusChange = useCallback((newStatus: string | undefined) => {
    setStatus(newStatus);
    setPage(1);
    fetchIncidents(1, newStatus, false);
  }, [fetchIncidents]);

  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchIncidents(nextPage, status, true);
  }, [isLoading, hasMore, page, status, fetchIncidents]);

  const refresh = useCallback(() => {
    setPage(1);
    fetchIncidents(1, status, false);
  }, [status, fetchIncidents]);

  useEffect(() => {
    fetchIncidents(1, status, false);
  }, [roomId]);

  return {
    incidents,
    isLoading,
    isError,
    status,
    setStatus: handleStatusChange,
    loadMore,
    refresh,
    hasMore,
  };
}
