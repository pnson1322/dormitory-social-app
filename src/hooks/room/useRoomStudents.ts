import { getApiErrorMessage } from "@/services/apiError";
import { checkoutStudent, getRoomStudents } from "@/services/booking/booking.api";
import { StudentRoommate } from "@/services/booking/booking.types";
import { useCallback, useEffect, useState } from "react";

export function useRoomStudents(roomId?: string) {
  const [students, setStudents] = useState<StudentRoommate[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = useCallback(
    async (opts?: { refreshing?: boolean }) => {
      if (!roomId) {
        setLoading(false);
        return;
      }

      try {
        if (opts?.refreshing) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError(null);
        const data = await getRoomStudents(roomId);
        setStudents(data?.students || []);
      } catch (err) {
        setError(getApiErrorMessage(err));
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [roomId],
  );

  const refetch = useCallback(async () => {
    await fetchStudents({ refreshing: true });
  }, [fetchStudents]);

  const handleCheckout = useCallback(
    async (userId: string): Promise<boolean> => {
      try {
        await checkoutStudent(userId);
        await fetchStudents({ refreshing: true });
        return true;
      } catch (err) {
        throw new Error(getApiErrorMessage(err));
      }
    },
    [fetchStudents],
  );

  useEffect(() => {
    void fetchStudents();
  }, [fetchStudents]);

  return {
    students,
    loading,
    refreshing,
    error,
    refetch,
    checkout: handleCheckout,
  };
}
