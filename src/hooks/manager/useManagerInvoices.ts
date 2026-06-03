import { getManagerInvoices } from "@/services/billing/billing.api";
import { InvoiceSummary } from "@/services/billing/billing.types";
import { getBuildings } from "@/services/room/room.api";
import { BuildingItem } from "@/services/room/room.types";
import { useCallback, useEffect, useRef, useState } from "react";
import { getApiErrorMessage } from "@/services/apiError";

const PAGE_SIZE = 10;

export function useManagerInvoices() {
  const [items, setItems] = useState<InvoiceSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [status, setStatus] = useState<string>("");
  const [buildingCode, setBuildingCode] = useState<string>("");
  const [floor, setFloor] = useState<number | null>(null);
  const [year, setYear] = useState<number | null>(null);
  const [month, setMonth] = useState<number | null>(null);

  const [buildings, setBuildings] = useState<BuildingItem[]>([]);
  const isFetchingRef = useRef(false);
  const requestVersionRef = useRef(0);

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const data = await getBuildings();
        setBuildings(data || []);
      } catch (err) {
        console.log("Error loading buildings list:", err);
      }
    };
    fetchBuildings();
  }, []);

  const loadData = useCallback(async (
    p: number, 
    isRefresh = false, 
    activeStatus = status, 
    activeBuilding = buildingCode,
    activeFloor = floor,
    activeYear = year,
    activeMonth = month
  ) => {
    if (p > 1 && isFetchingRef.current) return;
    
    const version = ++requestVersionRef.current;
    isFetchingRef.current = true;

    if (isRefresh) setRefreshing(true);
    else if (p === 1) {
      setLoading(true);
    }
    else setLoadingMore(true);

    setError(null);

    try {
      const response = await getManagerInvoices({
        page: p,
        pageSize: PAGE_SIZE,
        status: activeStatus || undefined,
        buildingCode: activeBuilding || undefined,
        floor: activeFloor !== null ? activeFloor : undefined,
        year: activeYear !== null ? activeYear : undefined,
        month: activeMonth !== null ? activeMonth : undefined,
      });

      if (version !== requestVersionRef.current) return;

      const mappedData: InvoiceSummary[] = (response.data || []).map((item) => ({
        id: item.invoiceId,
        roomId: item.roomId,
        roomName: item.buildingCode ? `${item.buildingCode}-${item.floor}` : item.roomId.substring(0, 6).toUpperCase(),
        totalAmount: item.totalAmount,
        status: item.status as any,
        createdAt: new Date(item.createdAt).toLocaleDateString("vi-VN"),
      }));

      let hasMoreData = false;
      if (isRefresh || p === 1) {
        setItems(mappedData);
        hasMoreData = mappedData.length === PAGE_SIZE;
      } else {
        setItems(prev => {
          const existingIds = new Set(prev.map(item => item.id));
          const newItems = mappedData.filter(item => !existingIds.has(item.id));
          hasMoreData = newItems.length > 0 && mappedData.length === PAGE_SIZE;
          return [...prev, ...newItems];
        });
      }

      setHasMore(hasMoreData);
    } catch (err) {
      if (version !== requestVersionRef.current) return;
      console.log("Error fetching manager invoices:", err);
      setError(getApiErrorMessage(err, "Không thể tải danh sách hóa đơn."));
      if (p === 1 || isRefresh) {
        setItems([]);
      }
      setHasMore(false);
    } finally {
      if (version === requestVersionRef.current) {
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
        isFetchingRef.current = false;
      }
    }
  }, [status, buildingCode, floor, year, month]);

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    isFetchingRef.current = true;
    loadData(1, false, status, buildingCode, floor, year, month);
  }, [status, buildingCode, floor, year, month, loadData]);

  const onRefresh = () => {
    setPage(1);
    setHasMore(true);
    isFetchingRef.current = true;
    loadData(1, true, status, buildingCode, floor, year, month);
  };

  const onLoadMore = () => {
    if (!loadingMore && hasMore && !loading && !refreshing && !isFetchingRef.current) {
      isFetchingRef.current = true;
      const nextPage = page + 1;
      setPage(nextPage);
      loadData(nextPage, false, status, buildingCode, floor, year, month);
    }
  };


  return {
    items,
    loading,
    refreshing,
    loadingMore,
    hasMore,
    error,
    status,
    setStatus,
    buildingCode,
    setBuildingCode,
    floor,
    setFloor,
    year,
    setYear,
    month,
    setMonth,
    buildings,
    onRefresh,
    onLoadMore,
  };
}
