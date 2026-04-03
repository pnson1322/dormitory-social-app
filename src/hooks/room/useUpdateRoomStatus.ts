import { getApiErrorMessage } from "@/services/apiError";
import { RoomDetail, RoomStatus, updateRoom } from "@/services/room.api";
import { useState } from "react";

export function useUpdateRoomStatus() {
  const [loading, setLoading] = useState(false);

  async function submit(
    room: RoomDetail,
    status: RoomStatus,
    opts?: {
      onSuccess?: () => void;
      onError?: (message: string) => void;
    },
  ) {
    try {
      setLoading(true);

      await updateRoom(room.id, {
        buildingId: room.buildingId,
        name: room.name,
        floor: room.floor,
        roomTypeId: room.roomTypeId,
        roomStatus: status,
      });

      opts?.onSuccess?.();
    } catch (err) {
      opts?.onError?.(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    submit,
  };
}
