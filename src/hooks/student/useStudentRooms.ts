import { PagingMeta } from "@/services/base.types";
import { 
  getBuildings, 
  getRooms, 
  getRoomTypes 
} from "@/services/room/room.api";
import { 
  BuildingItem, 
  GetRoomsParams, 
  RoomItem, 
  RoomTypeItem 
} from "@/services/room/room.types";
import { useCallback, useEffect, useRef, useState } from "react";

const PAGE_SIZE = 10;

export type StudentRoomFilters = {
  search: string;
  buildingId: string;
  roomTypeId: string;
  status: string;
};

export function useStudentRooms() {
  const [items, setItems] = useState<RoomItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [buildings, setBuildings] = useState<BuildingItem[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomTypeItem[]>([]);

  const [meta, setMeta] = useState<PagingMeta>({
    totalItems: 0,
    pageSize: PAGE_SIZE,
    currentPage: 1,
    totalPages: 0,
    hasPrevious: false,
    hasNext: false,
  });
  
  const [filters, setFilters] = useState<StudentRoomFilters>({
    search: "",
    buildingId: "",
    roomTypeId: "",
    status: "",
  });

  const requestIdRef = useRef(0);

  const fetchRooms = useCallback(async (page: number, isRefresh = false) => {
    const requestId = ++requestIdRef.current;
    
    if (isRefresh) setRefreshing(true);
    else if (page === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      setError(null);

      const params: GetRoomsParams = {
        Search: filters.search || undefined,
        BuildingId: filters.buildingId || undefined,
        RoomTypeId: filters.roomTypeId || undefined,
        RoomStatus: (filters.status as any) || undefined,
        Page: page,
        PageSize: PAGE_SIZE,
      };


      const result = await getRooms(params);

      if (requestId !== requestIdRef.current) return;

      setItems(prev => page === 1 ? result.items : [...prev, ...result.items]);
      setMeta(result.meta);
    } catch (err: any) {
      setError(err?.message || "Không thể tải danh sách phòng.");
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
      }
    }
  }, [filters]);

  const fetchInitialData = useCallback(async () => {
    try {
      const [bData, rtData] = await Promise.all([
        getBuildings(),
        getRoomTypes()
      ]);
      setBuildings(bData);
      setRoomTypes(rtData);
    } catch (err) {
      console.error("Failed to fetch room metadata", err);
    }
  }, []);

  useEffect(() => {
    void fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => {
    void fetchRooms(1);
  }, [fetchRooms]);

  const loadMore = useCallback(() => {
    if (loadingMore || !meta.hasNext) return;
    void fetchRooms(meta.currentPage + 1);
  }, [loadingMore, meta, fetchRooms]);

  return {
    items,
    loading,
    refreshing,
    loadingMore,
    error,
    meta,
    filters,
    setFilters,
    refetch: () => void fetchRooms(1, true),
    loadMore,
    buildings,
    roomTypes,
  };
}


