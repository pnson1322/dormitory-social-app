import { useState, useEffect, useCallback } from "react";
import { getManagerInvoices, getFinancialSummary } from "@/services/billing/billing.api";
import { InvoiceSummary } from "@/services/billing/billing.types";

const PAGE_SIZE = 10;

export function useManagerInvoices() {
  const [items, setItems] = useState<InvoiceSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ pending: 0, revenue: 0 });

  const loadStats = useCallback(async () => {
    try {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;
      const summaryRes = await getFinancialSummary({
        periodType: "month",
        year: currentYear,
        month: currentMonth
      });
      if (summaryRes.data) {
        setStats({
          pending: summaryRes.data.unpaidInvoiceCount,
          revenue: summaryRes.data.totalRevenue,
        });
      }
    } catch (err) {
      console.log("Error fetching manager financial stats:", err);
    }
  }, []);

  const loadData = useCallback(async (p: number, isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else if (p === 1) setLoading(true);
    else setLoadingMore(true);

    setError(null);

    if (p === 1) {
      loadStats();
    }

    try {
      const response = await getManagerInvoices({
        page: p,
        pageSize: PAGE_SIZE,
      });

      const mappedData: InvoiceSummary[] = (response.data || []).map((item) => ({
        id: item.invoiceId,
        roomId: item.roomId,
        roomName: item.buildingCode ? `${item.buildingCode}-${item.floor}` : item.roomId.substring(0, 6).toUpperCase(),
        totalAmount: item.totalAmount,
        status: item.status.toUpperCase() === "PAID" ? "PAID" : "PENDING",
        createdAt: new Date(item.createdAt).toLocaleDateString("vi-VN"),
      }));

      if (isRefresh || p === 1) {
        setItems(mappedData);
      } else {
        setItems(prev => [...prev, ...mappedData]);
      }

      setHasMore(mappedData.length === PAGE_SIZE);
    } catch (err) {
      console.log("Error fetching manager invoices:", err);
      setError("Không thể tải danh sách hóa đơn.");
      if (p === 1 || isRefresh) {
        setItems([]);
      }
      setHasMore(false);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, [loadStats]);

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
