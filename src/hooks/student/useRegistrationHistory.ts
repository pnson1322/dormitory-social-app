import { getRegistrationHistory } from "@/services/booking/booking.api";
import { RegistrationItem, RegistrationStatus } from "@/services/booking/booking.types";
import { useCallback, useEffect, useState } from "react";
import { getApiErrorMessage } from "@/services/apiError";

export type { RegistrationItem, RegistrationStatus };

export function useRegistrationHistory(userId?: string) {
  const [items, setItems] = useState<RegistrationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    setError(null);

    try {
      const data = await getRegistrationHistory(
        userId ? { userId } : undefined
      );
      const normalized = (data ?? []).map((item) => ({
        ...item,
        status: item.status?.toUpperCase() as any,
      }));
      setItems(normalized);
    } catch (err: any) {
      setError(getApiErrorMessage(err, "Không thể tải lịch sử đăng ký."));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [userId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = () => {
    loadData(true);
  };

  return {
    items,
    loading,
    refreshing,
    error,
    onRefresh,
    loadingMore: false,
    hasMore: false,
    onLoadMore: () => {},
  };
}
