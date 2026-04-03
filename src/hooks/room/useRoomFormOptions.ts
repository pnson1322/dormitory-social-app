import { getApiErrorMessage } from "@/services/apiError";
import {
  BuildingItem,
  getBuildings,
  getRoomTypes,
  RoomTypeItem,
} from "@/services/room.api";
import { useEffect, useState } from "react";

export function useRoomFormOptions() {
  const [buildings, setBuildings] = useState<BuildingItem[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomTypeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchOptions() {
    try {
      setLoading(true);
      setError(null);

      const [buildingRes, roomTypeRes] = await Promise.all([
        getBuildings(),
        getRoomTypes(),
      ]);

      setBuildings(buildingRes.filter((x) => x.isActive));
      setRoomTypes(roomTypeRes);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void fetchOptions();
  }, []);

  return {
    buildings,
    roomTypes,
    loading,
    error,
    refetch: fetchOptions,
  };
}
