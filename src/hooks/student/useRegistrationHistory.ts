import { useState, useEffect, useCallback } from "react";

export type RegistrationStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

export type RegistrationItem = {
  id: string;
  roomName: string;
  buildingName: string;
  requestDate: string;
  status: RegistrationStatus;
  note?: string;
  type: "NEW" | "RENEW" | "TRANSFER";
};

const PAGE_SIZE = 10;

const GENERATE_MOCK_DATA = (page: number): RegistrationItem[] => {
  const start = (page - 1) * PAGE_SIZE;
  const statuses: RegistrationStatus[] = ["APPROVED", "REJECTED", "CANCELLED", "PENDING"];
  const types: ("NEW" | "RENEW" | "TRANSFER")[] = ["NEW", "RENEW", "TRANSFER"];

  return Array.from({ length: PAGE_SIZE }).map((_, i) => ({
    id: `REG-${start + i + 1000}`,
    roomName: `${100 + (start + i)}`,
    buildingName: "Tòa A1",
    requestDate: `2026-0${5 - Math.floor((start + i) / 5)}-${10 + (i % 15)}`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    type: types[Math.floor(Math.random() * types.length)],
    note: i % 3 === 0 ? "Ghi chú mẫu về việc đăng ký phòng ký túc xá." : undefined,
  }));
};

export function useRegistrationHistory() {
  const [items, setItems] = useState<RegistrationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async (p: number, isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else if (p === 1) setLoading(true);
    else setLoadingMore(true);

    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const newData = GENERATE_MOCK_DATA(p);

      if (isRefresh || p === 1) {
        setItems(newData);
      } else {
        setItems((prev) => [...prev, ...newData]);
      }

      setHasMore(p < 3); 
    } catch (err) {
      setError("Không thể tải lịch sử đăng ký.");
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    loadData(1);
  }, [loadData]);

  const onRefresh = () => {
    setPage(1);
    setHasMore(true);
    loadData(1, true);
  };

  const onLoadMore = () => {
    if (!loadingMore && hasMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadData(nextPage);
    }
  };

  return {
    items,
    loading,
    refreshing,
    loadingMore,
    hasMore,
    error,
    onRefresh,
    onLoadMore,
  };
}
