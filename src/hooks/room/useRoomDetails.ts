import { getApiErrorMessage } from "@/services/apiError";
import { getRoomById, RoomDetail } from "@/services/room.api";
import { useCallback, useEffect, useState } from "react";

export function useRoomDetails(roomId?: string) {
  const [room, setRoom] = useState<RoomDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRoom = useCallback(
    async (opts?: { refreshing?: boolean }) => {
      if (!roomId) {
        setError("Không tìm thấy mã phòng.");
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

        const data = await getRoomById(roomId);
        setRoom(data);
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
    await fetchRoom({ refreshing: true });
  }, [fetchRoom]);

  useEffect(() => {
    void fetchRoom();
  }, [fetchRoom]);

  return {
    room,
    loading,
    refreshing,
    error,
    refetch,
    setRoom,
  };
}
