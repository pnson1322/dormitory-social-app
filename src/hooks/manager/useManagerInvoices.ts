import { useState, useEffect, useCallback } from "react";
import { InvoiceSummary } from "@/services/billing/billing.types";

const PAGE_SIZE = 10;

const GENERATE_MOCK_INVOICES = (page: number): InvoiceSummary[] => {
  const start = (page - 1) * PAGE_SIZE;
  return Array.from({ length: PAGE_SIZE }).map((_, i) => ({
    id: `INV-${start + i + 5000}`,
    roomId: `ROOM-${start + i % 20}`,
    roomName: `${100 + (start + i % 20)}`,
    totalAmount: 1500000 + Math.floor(Math.random() * 1000000),
    status: i % 3 === 0 ? "PAID" : "PENDING",
    createdAt: `2026-05-${20 - Math.floor((start + i) / 5)}`,
    electricity: { consumption: 150 + i, amount: 500000 + i * 1000 },
    water: { consumption: 20 + i, amount: 300000 + i * 500 },
    otherFeesTotal: 100000,
  }));
};

export function useManagerInvoices() {
  const [items, setItems] = useState<InvoiceSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const stats = {
    pending: 12,
    revenue: 14823917,
  };

  const loadData = useCallback(async (p: number, isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else if (p === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const newData = GENERATE_MOCK_INVOICES(p);

      if (isRefresh || p === 1) {
        setItems(newData);
      } else {
        setItems(prev => [...prev, ...newData]);
      }

      setHasMore(p < 5);
    } catch (err) {
      setError("Không thể tải danh sách hóa đơn.");
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
    stats,
    onRefresh,
    onLoadMore,
  };
}
