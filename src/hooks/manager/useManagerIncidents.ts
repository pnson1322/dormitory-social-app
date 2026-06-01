import { useToast } from "@/components/toast/ToastProvider";
import { getIncidents, updateIncidentStatus } from "@/services/incident/incident.api";
import { IncidentResponse } from "@/services/incident/incident.types";
import { useCallback, useEffect, useState } from "react";

export type ManagerTabStatus = "Pending" | "InProgress" | "Resolved" | "Rejected";

export function useManagerIncidents() {
  const [incidentsMap, setIncidentsMap] = useState<Record<ManagerTabStatus, IncidentResponse[]>>({
    Pending: [],
    InProgress: [],
    Resolved: [],
    Rejected: [],
  });

  const [loadingMap, setLoadingMap] = useState<Record<ManagerTabStatus, boolean>>({
    Pending: false,
    InProgress: false,
    Resolved: false,
    Rejected: false,
  });

  const [pageMap, setPageMap] = useState<Record<ManagerTabStatus, number>>({
    Pending: 1,
    InProgress: 1,
    Resolved: 1,
    Rejected: 1,
  });

  const [hasMoreMap, setHasMoreMap] = useState<Record<ManagerTabStatus, boolean>>({
    Pending: true,
    InProgress: true,
    Resolved: true,
    Rejected: true,
  });

  const [errorMap, setErrorMap] = useState<Record<ManagerTabStatus, boolean>>({
    Pending: false,
    InProgress: false,
    Resolved: false,
    Rejected: false,
  });

  const { showToast } = useToast();
  const PAGE_SIZE = 15;

  const fetchIncidents = useCallback(async (status: ManagerTabStatus, pageNum: number, isAppend: boolean) => {
    try {
      setLoadingMap(prev => ({ ...prev, [status]: true }));
      setErrorMap(prev => ({ ...prev, [status]: false }));

      const data = await getIncidents({
        status,
        page: pageNum,
        pageSize: PAGE_SIZE,
      });

      const newItems = Array.isArray(data) ? data : [];

      setIncidentsMap(prev => ({
        ...prev,
        [status]: isAppend ? [...prev[status], ...newItems] : newItems,
      }));

      setHasMoreMap(prev => ({
        ...prev,
        [status]: newItems.length === PAGE_SIZE,
      }));

      setPageMap(prev => ({
        ...prev,
        [status]: pageNum,
      }));
    } catch (error) {

      setErrorMap(prev => ({ ...prev, [status]: true }));

      if (!isAppend) {
        setIncidentsMap(prev => ({ ...prev, [status]: [] }));
      }

      showToast({
        type: "error",
        title: "Lỗi kết nối",
        message: `Không thể tải danh sách sự cố thuộc cột ${
          status === "Pending"
            ? "Mới"
            : status === "InProgress"
            ? "Đang xử lý"
            : status === "Resolved"
            ? "Đã xong"
            : "Từ chối"
        }.`,
      });
    } finally {
      setLoadingMap(prev => ({ ...prev, [status]: false }));
    }
  }, [showToast]);

  const refreshStatus = useCallback((status: ManagerTabStatus) => {
    fetchIncidents(status, 1, false);
  }, [fetchIncidents]);

  const loadMoreStatus = useCallback((status: ManagerTabStatus) => {
    if (loadingMap[status] || !hasMoreMap[status] || (incidentsMap[status] || []).length === 0) return;
    fetchIncidents(status, pageMap[status] + 1, true);
  }, [loadingMap, hasMoreMap, pageMap, incidentsMap, fetchIncidents]);

  useEffect(() => {
    fetchIncidents("Pending", 1, false);
    fetchIncidents("InProgress", 1, false);
    fetchIncidents("Resolved", 1, false);
    fetchIncidents("Rejected", 1, false);
  }, []);

  const handleUpdateStatus = useCallback(async (incidentId: string, currentStatus: ManagerTabStatus, targetStatus: ManagerTabStatus) => {
    const itemToMove = incidentsMap[currentStatus].find(item => item.id === incidentId);
    if (!itemToMove) return;

    const updateLocalState = () => {
      setIncidentsMap(prev => {
        const sourceList = prev[currentStatus].filter(item => item.id !== incidentId);
        const updatedItem = { ...itemToMove, status: targetStatus };
        const destList = [updatedItem, ...prev[targetStatus]];

        return {
          ...prev,
          [currentStatus]: sourceList,
          [targetStatus]: destList,
        };
      });
    };

    try {
      await updateIncidentStatus(incidentId, targetStatus);
      updateLocalState();

      const label = targetStatus === "InProgress" ? "Đang xử lý" : "Đã hoàn thành";
      showToast({
        type: "success",
        title: "Thành công",
        message: `Đã chuyển sự cố sang trạng thái "${label}".`,
      });
    } catch (error) {

      showToast({
        type: "error",
        title: "Thất bại",
        message: "Không thể cập nhật trạng thái sự cố. Vui lòng kiểm tra lại kết nối.",
      });
    }
  }, [incidentsMap, showToast]);

  const handleRejectIncident = useCallback(async (incidentId: string, currentStatus: ManagerTabStatus) => {
    const itemToMove = incidentsMap[currentStatus].find(item => item.id === incidentId);
    if (!itemToMove) return;

    const updateLocalState = () => {
      setIncidentsMap(prev => {
        const sourceList = prev[currentStatus].filter(item => item.id !== incidentId);
        const updatedItem = { ...itemToMove, status: "Rejected" as const };
        const destList = [updatedItem, ...prev["Rejected"]];
        return {
          ...prev,
          [currentStatus]: sourceList,
          Rejected: destList,
        };
      });
    };

    try {
      await updateIncidentStatus(incidentId, "Rejected");
      updateLocalState();

      showToast({
        type: "success",
        title: "Thành công",
        message: "Đã từ chối báo cáo sự cố.",
      });
    } catch (error) {

      showToast({
        type: "error",
        title: "Thất bại",
        message: "Không thể từ chối báo cáo sự cố. Vui lòng kiểm tra lại kết nối.",
      });
    }
  }, [incidentsMap, showToast]);

  return {
    incidentsMap,
    loadingMap,
    hasMoreMap,
    errorMap,
    refreshStatus,
    loadMoreStatus,
    updateStatus: handleUpdateStatus,
    rejectIncident: handleRejectIncident,
  };
}
