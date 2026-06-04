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
      const status = err?.response?.status;
      const msg = getApiErrorMessage(err, "");
      const msgLower = msg.toLowerCase();
      const isNoBooking = 
        status === 404 || 
        msgLower.includes("no active") ||
        msgLower.includes("no booking") ||
        msgLower.includes("not found");

      if (isNoBooking) {
        setRoomInfo(null);
        setError(null);
      } else {
        setError(msg || "Không thể tải thông tin phòng của bạn.");
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
