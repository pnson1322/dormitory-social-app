import { useToast } from "@/components/toast/ToastProvider";
import { getReports, reviewReport } from "@/services/community/community.api";
import { ReportResponse, ReportStatus } from "@/services/community/community.types";
import { useCallback, useEffect, useState } from "react";

export function useAdminReports() {
  const [reports, setReports] = useState<ReportResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<ReportStatus | "All">("Pending");
  const { showToast } = useToast();

  const fetchReports = useCallback(
    async (pageNum: number, isRefresh = false) => {
      try {
        if (isRefresh) {
          setIsRefreshing(true);
        } else {
          setIsLoading(true);
        }

        const params = {
          status: selectedStatus === "All" ? undefined : selectedStatus,
          page: pageNum,
          pageSize: 15,
        };

        const result = await getReports(params);
        if (isRefresh) {
          setReports(result.items || []);
        } else {
          setReports((prev) => {
            const existingIds = new Set(prev.map(r => r.id));
            const newItems = (result.items || []).filter(r => !existingIds.has(r.id));
            return [...prev, ...newItems];
          });
        }

        setHasMore(result.meta ? pageNum < result.meta.totalPages : false);
        setPage(pageNum);
      } catch (error) {
        console.error("Failed to fetch reports:", error);
        showToast({
          type: "error",
          title: "Lỗi tải báo cáo",
          message: "Không thể tải danh sách báo cáo vi phạm.",
        });
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [selectedStatus, showToast]
  );

  const refresh = useCallback(() => {
    fetchReports(1, true);
  }, [fetchReports]);

  const loadMore = useCallback(() => {
    if (isLoading || isRefreshing || !hasMore) return;
    fetchReports(page + 1);
  }, [isLoading, isRefreshing, hasMore, page, fetchReports]);

  const handleReview = useCallback(
    async (reportId: string, status: "Reviewed" | "Dismissed") => {
      try {
        await reviewReport(reportId, { status });
        
        setReports((prev) => {
          const targetReport = prev.find((r) => r.id === reportId);
          if (!targetReport) return prev;
          
          const targetPostId = targetReport.postId;
          return prev.map((r) => (r.postId === targetPostId ? { ...r, status } : r));
        });

        showToast({
          type: "success",
          title: "Thành công",
          message: status === "Reviewed"
            ? "Đã duyệt báo cáo vi phạm."
            : "Đã bỏ qua báo cáo.",
        });
      } catch (error: any) {
        console.error("Failed to review report:", error);
        showToast({
          type: "error",
          title: "Thất bại",
          message: error?.response?.data?.title || "Không thể xử lý báo cáo.",
        });
      }
    },
    [showToast]
  );

  useEffect(() => {
    refresh();
  }, [selectedStatus]);

  return {
    reports,
    isLoading,
    isRefreshing,
    hasMore,
    selectedStatus,
    setSelectedStatus,
    refresh,
    loadMore,
    handleReview,
  };
}
