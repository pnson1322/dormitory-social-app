import { getMyRoomDetails as getStudentRoomDetailsApi } from "@/services/booking/booking.api";
import { StudentRoomResponse } from "@/services/booking/booking.types";
import { useEffect, useState, useCallback } from "react";
import { getApiErrorMessage } from "@/services/apiError";

export function useMyRoom() {
  const [roomInfo, setRoomInfo] = useState<StudentRoomResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoomDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getStudentRoomDetailsApi();
      setRoomInfo(data || null);
    } catch (err: any) {
      if (err?.response?.status === 404) {
        setRoomInfo(null);
      } else {
        setError(getApiErrorMessage(err, "Không thể tải thông tin phòng của bạn."));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoomDetails();
  }, [fetchRoomDetails]);

  return {
    roomInfo,
    loading,
    error,
    refresh: fetchRoomDetails,
  };
}
