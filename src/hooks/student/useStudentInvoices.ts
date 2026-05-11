import { useEffect, useMemo, useState, useCallback } from "react";

export type InvoiceStatus = "UNPAID" | "PAID";

export type InvoiceBreakdown = {
  label: string;
  amount: number;
};

export type Invoice = {
  id: string;
  title: string;
  amount: number;
  dueDate: string;
  status: InvoiceStatus;
  paidDate?: string;
  type: string;
  breakdown?: InvoiceBreakdown[];
};

const PAGE_SIZE = 10;

const GENERATE_MOCK_DATA = (page: number, status: InvoiceStatus): Invoice[] => {
  const start = (page - 1) * PAGE_SIZE;
  return Array.from({ length: PAGE_SIZE }).map((_, i) => ({
    id: `INV-${status}-${start + i + 1}`,
    title: `Hóa đơn tháng ${12 - ((start + i) % 12)}/2026`,
    amount: 1200000 + Math.floor(Math.random() * 500000),
    dueDate: `2026-${12 - ((start + i) % 12)}-15`,
    status: status,
    paidDate: status === "PAID" ? `2026-${12 - ((start + i) % 12)}-10` : undefined,
    type: "Phòng & Dịch vụ",
    breakdown: [
      { label: "Tiền phòng", amount: 1200000 },
      { label: "Dịch vụ khác", amount: Math.floor(Math.random() * 300000) },
    ],
  }));
};

export function useStudentInvoices() {
  const [activeTab, setActiveTab] = useState<InvoiceStatus>("UNPAID");
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadInvoices = useCallback(async (p: number, isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else if (p === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const newData = GENERATE_MOCK_DATA(p, activeTab);
      
      if (isRefresh || p === 1) {
        setInvoices(newData);
      } else {
        setInvoices((prev) => [...prev, ...newData]);
      }

      setHasMore(p < 5); 
    } catch (err) {
      setError("Không thể tải danh sách hóa đơn. Vui lòng thử lại.");
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, [activeTab]);

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    loadInvoices(1);
  }, [activeTab, loadInvoices]);

  const onRefresh = () => {
    setPage(1);
    setHasMore(true);
    loadInvoices(1, true);
  };

  const onLoadMore = () => {
    if (!loadingMore && hasMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadInvoices(nextPage);
    }
  };

  const isOverdue = (dateString: string) => {
    return new Date(dateString) < new Date();
  };

  return {
    activeTab,
    setActiveTab,
    invoices,
    loading,
    refreshing,
    loadingMore,
    hasMore,
    error,
    onRefresh,
    onLoadMore,
    isOverdue,
  };
}
