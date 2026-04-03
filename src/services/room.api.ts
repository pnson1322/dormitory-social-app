import { http } from "@/services/http";

export type RoomStatus = "AVAILABLE" | "FULL" | "MAINTENANCE";

type ApiResponse<T> = {
  data: T;
  meta: any;
};

export type PagingMeta = {
  totalItems: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
};

export type RoomCountData = {
  AVAILABLE: number;
  FULL: number;
  MAINTENANCE: number;
  Total: number;
};

export type RoomItem = {
  id: string;
  name: string;
  buildingId: string;
  buildingName: string;
  floor: number;
  capacity: number;
  occupiedCount: number;
  occupancyPercent: number;
  roomStatus: RoomStatus;
  roomTypeId: string;
  roomTypeName: string;
  basePrice: number;
};

export type RoomDetail = {
  id: string;
  name: string;
  buildingId: string;
  buildingName: string;
  floor: number;
  capacity: number;
  occupiedCount: number;
  occupancyPercent: number;
  roomStatus: RoomStatus;
  roomTypeId: string;
  roomTypeName: string;
  basePrice: number;
};

export type BuildingItem = {
  id: string;
  zoneName: string;
  code: string;
  name: string;
  genderRestriction: string;
  totalFloors: number;
  isActive: boolean;
};

export type RoomTypeItem = {
  id: string;
  name: string;
  capacity: number;
  basePrice: number;
  amenities: string[];
};

export type GetRoomsParams = {
  Search?: string;
  BuildingId?: string;
  RoomStatus?: RoomStatus | "";
  Page?: number;
  PageSize?: number;
};

export type CreateRoomBody = {
  buildingId: string;
  name: string;
  floor: number;
  roomTypeId: string;
};

export type UpdateRoomBody = {
  buildingId: string;
  name: string;
  floor: number;
  roomTypeId: string;
  roomStatus: RoomStatus;
};

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
