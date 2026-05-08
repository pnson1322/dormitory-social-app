import { getRoomById } from "@/services/room/room.api";
import { RoomDetail } from "@/services/room/room.types";
import { useCallback, useEffect, useState } from "react";

export function useStudentRoomDetails(roomId?: string) {
  const [room, setRoom] = useState<RoomDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    if (!roomId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await getRoomById(roomId);
      setRoom(data);
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi");
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  useEffect(() => {
    void fetchDetail();
  }, [fetchDetail]);

  return {
    room,
    loading,
    error,
    refetch: fetchDetail,
  };
}


