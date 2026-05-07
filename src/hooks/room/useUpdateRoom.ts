import { getApiErrorMessage } from "@/services/apiError";
import { updateRoom } from "@/services/room/room.api";
import { RoomDetail } from "@/services/room/room.types";
import { useState } from "react";

type SubmitPayload = {
  buildingId: string;
  name: string;
  floor: number;
  roomTypeId: string;
  roomStatus: RoomDetail["roomStatus"];
};

export function useUpdateRoom() {
  const [loading, setLoading] = useState(false);

  async function submit(
    roomId: string,
    payload: SubmitPayload,
    opts?: {
      onSuccess?: () => void;
      onError?: (message: string) => void;
    },
  ) {
    try {
      setLoading(true);

      await updateRoom(roomId, payload);

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
