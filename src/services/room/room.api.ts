import { http } from "@/services/http";
import { ApiResponse, PagingMeta } from "@/services/base.types";
import {
  BuildingItem,
  CreateRoomBody,
  GetRoomsParams,
  RoomCountData,
  RoomDetail,
  RoomItem,
  RoomTypeItem,
  UpdateRoomBody,
} from "./room.types";

export async function getRooms(params?: GetRoomsParams) {
  const { data } = await http.get<ApiResponse<RoomItem[]>>("/api/rooms", {
    params,
  });

  return {
    items: data.data,
    meta: data.meta as PagingMeta,
  };
}

export async function getRoomsCount() {
  const { data } =
    await http.get<ApiResponse<RoomCountData>>("/api/rooms/count");
  return data.data;
}

export async function getRoomById(id: string) {
  const { data } = await http.get<ApiResponse<RoomDetail>>(`/api/rooms/${id}`);
  return data.data;
}

export async function createRoom(body: CreateRoomBody) {
  const { data } = await http.post<ApiResponse<RoomDetail>>("/api/rooms", body);
  return data.data;
}

export async function updateRoom(id: string, body: UpdateRoomBody) {
  await http.put(`/api/rooms/${id}`, body);
}

export async function getBuildings() {
  const { data } = await http.get<ApiResponse<BuildingItem[]>>(
    "/api/rooms/buildings",
  );
  return data.data;
}

export async function getRoomTypes() {
  const { data } = await http.get<ApiResponse<RoomTypeItem[]>>(
    "/api/rooms/roomtypes",
  );
  return data.data;
}
