import { useEffect, useState, useCallback } from "react";
import { getStudentInvoices, getUtilityHistory } from "@/services/billing/billing.api";
import { Invoice, InvoiceStatus, UtilityHistoryData } from "@/services/billing/billing.types";
export type { Invoice, InvoiceStatus, UtilityHistoryData };

const PAGE_SIZE = 10;

export function useStudentInvoices() {
  const [activeTab, setActiveTab] = useState<InvoiceStatus>("UNPAID");
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [utilityHistory, setUtilityHistory] = useState<UtilityHistoryData[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const loadUtilityHistory = useCallback(async () => {
    try {
      setLoadingHistory(true);
      const response = await getUtilityHistory({ limit: 6 });
      if (response.data) {
        const mapped = response.data.map(item => ({
          month: `Th ${item.month}`,
          electricity: item.electricityAmount,
          water: item.waterAmount
        }));
        const sorted = [...mapped].sort((a, b) => {
          const m1 = parseInt(a.month.replace("Th ", ""), 10);
          const m2 = parseInt(b.month.replace("Th ", ""), 10);
          return m1 - m2;
        });
        setUtilityHistory(sorted);
      }
    } catch (e) {
      console.log("Error loading utility history:", e);
      setUtilityHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  const loadInvoices = useCallback(async (p: number, isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else if (p === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    setError(null);

    if (p === 1) {
      loadUtilityHistory();
    }

    try {
      const response = await getStudentInvoices({
        status: activeTab === "PAID" ? "Paid" : "Unpaid",
        page: p,
        pageSize: PAGE_SIZE,
      });

      const mappedData: Invoice[] = (response.data || []).map((item) => ({
        id: item.invoiceId,
        title: `Hóa đơn tháng ${item.month}/${item.year}`,
        amount: item.totalAmount,
        dueDate: `${item.year}-${String(item.month).padStart(2, "0")}-15`,
        status: item.status.toUpperCase() === "PAID" ? "PAID" : "UNPAID",
        paidDate: item.paidAt || undefined,
        type: "Phòng & Dịch vụ",
      }));

      if (isRefresh || p === 1) {
        setInvoices(mappedData);
      } else {
        setInvoices((prev) => [...prev, ...mappedData]);
      }

      setHasMore(mappedData.length === PAGE_SIZE);
    } catch (err) {
      console.log("Error loading real invoices:", err);
      setError("Không thể tải danh sách hóa đơn. Vui lòng thử lại.");
      if (p === 1 || isRefresh) {
        setInvoices([]);
      }
      setHasMore(false);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, [activeTab, loadUtilityHistory]);

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
    utilityHistory,
    loadingHistory
  };
}
