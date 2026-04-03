import { getApiErrorMessage } from "@/services/apiError";
import { createRoom, RoomDetail } from "@/services/room.api";
import { useMemo, useState } from "react";

function isPositiveInteger(value: string) {
  return /^[1-9]\d*$/.test(value);
}

type TouchedState = {
  buildingId: boolean;
  name: boolean;
  floor: boolean;
  roomTypeId: boolean;
};

const DEFAULT_TOUCHED: TouchedState = {
  buildingId: false,
  name: false,
  floor: false,
  roomTypeId: false,
};

export function useCreateRoom() {
  const [buildingId, setBuildingId] = useState("");
  const [name, setName] = useState("");
  const [floor, setFloor] = useState("");
  const [roomTypeId, setRoomTypeId] = useState("");

  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState<TouchedState>(DEFAULT_TOUCHED);

  const nameTrim = name.trim();
  const floorTrim = floor.trim();

  const buildingErr = !touched.buildingId
    ? null
    : !buildingId
      ? "Vui lòng chọn tòa."
      : null;

  const nameErr = !touched.name
    ? null
    : !nameTrim
      ? "Vui lòng nhập tên phòng."
      : null;

  const floorErr = !touched.floor
    ? null
    : !floorTrim
      ? "Vui lòng nhập tầng."
      : !isPositiveInteger(floorTrim)
        ? "Tầng phải là số nguyên dương."
        : null;

  const roomTypeErr = !touched.roomTypeId
    ? null
    : !roomTypeId
      ? "Vui lòng chọn loại phòng."
      : null;

  const isFormValid = useMemo(() => {
    return (
      !!buildingId && !!nameTrim && isPositiveInteger(floorTrim) && !!roomTypeId
    );
  }, [buildingId, nameTrim, floorTrim, roomTypeId]);

  function markAllTouched() {
    setTouched({
      buildingId: true,
      name: true,
      floor: true,
      roomTypeId: true,
    });
  }

  function reset() {
    setBuildingId("");
    setName("");
    setFloor("");
    setRoomTypeId("");
    setTouched(DEFAULT_TOUCHED);
  }

  async function submit(opts?: {
    onSuccess?: (room: RoomDetail) => void;
    onError?: (message: string) => void;
  }) {
    markAllTouched();

    if (!isFormValid) {
      opts?.onError?.("Vui lòng kiểm tra lại thông tin.");
      return;
    }

    try {
      setLoading(true);

      const room = await createRoom({
        buildingId,
        name: nameTrim,
        floor: Number(floorTrim),
        roomTypeId,
      });

      opts?.onSuccess?.(room);
    } catch (err) {
      opts?.onError?.(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return {
    buildingId,
    name,
    floor,
    roomTypeId,
    loading,

    buildingErr,
    nameErr,
    floorErr,
    roomTypeErr,
    isFormValid,

    setBuildingId,
    setName,
    setFloor,
    setRoomTypeId,
    setTouched,
    reset,

    submit,
  };
}
