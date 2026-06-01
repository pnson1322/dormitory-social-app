export type RoomStatus = "AVAILABLE" | "FULL" | "MAINTENANCE";

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
  description: string;
  amenities: string[];
};


export type BuildingItem = {
  id: string;
  zoneName: string;
  code: string;
  name: string;
  genderRestriction: string;
  totalFloors: number;
  isActive: boolean;
  bankCode?: string;
  accountNumber?: string;
  accountName?: string;
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
  RoomTypeId?: string;
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
