import { getRegistrationHistory } from "@/services/booking/booking.api";
import { RegistrationItem, RegistrationStatus } from "@/services/booking/booking.types";
import { useCallback, useEffect, useState } from "react";

export type { RegistrationItem, RegistrationStatus };

// ─── MOCK DATA (xóa khi có API thật) ────────────────────────────────────────
const MOCK_DATA: RegistrationItem[] = [
  {
    bookingId: "3fa85f64-5717-4562-b3fc-2c963f66af01",
    roomId:    "room-id-001",
    userId:    "user-id-001",
    termName:  "Học kỳ 2 - Năm học 2024-2025",
    startDate: "2025-02-01T00:00:00.000Z",
    endDate:   "2025-07-31T00:00:00.000Z",
    numberOfMonths: 6,
    pricePerMonth:  1200000,
    basePrice:      7200000,
    totalPrice:     7200000,
    status: "APPROVED",
    createdAt: "2025-01-15T08:30:00.000Z",
    updatedAt: "2025-01-18T10:00:00.000Z",
    fees: [
      { id: "fee-01", feeName: "Phí vệ sinh", amount: 50000, isRefundable: false },
      { id: "fee-02", feeName: "Tiền đặt cọc", amount: 1200000, isRefundable: true },
    ],
  },
  {
    bookingId: "3fa85f64-5717-4562-b3fc-2c963f66af02",
    roomId:    "room-id-002",
    userId:    "user-id-001",
    termName:  "Học kỳ 1 - Năm học 2025-2026",
    startDate: "2025-09-01T00:00:00.000Z",
    endDate:   "2026-01-31T00:00:00.000Z",
    numberOfMonths: 5,
    pricePerMonth:  1300000,
    basePrice:      6500000,
    totalPrice:     6700000,
    status: "PENDING",
    createdAt: "2025-08-10T14:20:00.000Z",
    updatedAt: "2025-08-10T14:20:00.000Z",
    fees: [
      { id: "fee-03", feeName: "Phí vệ sinh", amount: 50000, isRefundable: false },
      { id: "fee-04", feeName: "Phí điện nước tháng đầu", amount: 150000, isRefundable: false },
      { id: "fee-05", feeName: "Tiền đặt cọc", amount: 1300000, isRefundable: true },
    ],
  },
  {
    bookingId: "3fa85f64-5717-4562-b3fc-2c963f66af03",
    roomId:    "room-id-003",
    userId:    "user-id-001",
    termName:  "Học kỳ 2 - Năm học 2023-2024",
    startDate: "2024-02-01T00:00:00.000Z",
    endDate:   "2024-06-30T00:00:00.000Z",
    numberOfMonths: 5,
    pricePerMonth:  1100000,
    basePrice:      5500000,
    totalPrice:     5500000,
    status: "REJECTED",
    createdAt: "2024-01-20T09:00:00.000Z",
    updatedAt: "2024-01-22T11:30:00.000Z",
    fees: [],
  },
  {
    bookingId: "3fa85f64-5717-4562-b3fc-2c963f66af04",
    roomId:    "room-id-001",
    userId:    "user-id-001",
    termName:  "Học kỳ 1 - Năm học 2024-2025",
    startDate: "2024-09-01T00:00:00.000Z",
    endDate:   "2025-01-31T00:00:00.000Z",
    numberOfMonths: 5,
    pricePerMonth:  1200000,
    basePrice:      6000000,
    totalPrice:     6200000,
    status: "CANCELLED",
    createdAt: "2024-08-05T07:45:00.000Z",
    updatedAt: "2024-08-07T08:00:00.000Z",
    fees: [
      { id: "fee-06", feeName: "Tiền đặt cọc", amount: 1200000, isRefundable: true },
    ],
  },
];
// ─────────────────────────────────────────────────────────────────────────────

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
      //setItems(data.length > 0 ? data : MOCK_DATA); // dùng mock khi API chưa có data
      setItems(MOCK_DATA)
    } catch (err: any) {
      // setError(err?.message || "Không thể tải lịch sử đăng ký.");
      // Dùng mock khi API lỗi (dev mode)
      setItems(MOCK_DATA);
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
