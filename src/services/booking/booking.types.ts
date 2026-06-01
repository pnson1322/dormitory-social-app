export type RegistrationStatus = "PENDING" | "ACTIVE" | "COMPLETED" | "CANCELLED";

export type BookingFee = {
  id: string;
  feeName: string;
  amount: number;
  isRefundable: boolean;
};

export type RegistrationItem = {
  bookingId: string;
  roomId: string;
  userId: string;
  termName: string;
  startDate: string;
  endDate: string;
  numberOfMonths: number;
  pricePerMonth: number;
  basePrice: number;
  totalPrice: number;
  status: RegistrationStatus;
  createdAt: string;
  updatedAt: string;
  fees: BookingFee[];
};

export type GetRegistrationHistoryParams = {
  userId?: string; 
};

export type FeeTemplate = {
  id: string;
  feeCode: string;
  feeName: string;
  amount: number;
  description: string;
  isMandatory: boolean;
  isRefundable: boolean;
};

export type CreateBookingPayload = {
  roomId: string;
  userId: string;
  termName: string;
  selectedOptionalFeeCodes: string[] | null;
};

export type CreateBookingResponse = {
  bookingId: string;
  status: string;
  totalPrice: number;
  message: string;
};

export type RoomDetailInfo = {
  id: string;
  name: string;
  buildingId: string;
  buildingName: string;
  floor: number;
  capacity: number;
  occupiedCount: number;
  occupancyPercent: number;
  description: string;
  roomStatus: string;
  roomTypeId: string;
  roomTypeName: string;
  basePrice: number;
  amenities: string[];
};

export type StudentRoommate = {
  studentId: string;
  bookingId: string;
  status: string;
  termName: string;
  startDate: string;
  endDate: string;
  fullName: string | null;
  studentCode: string | null;
  email: string | null;
  phoneNumber: string | null;
  gender: string | null;
  dateOfBirth: string | null;
  avatarUrl: string | null;
  studentYear: string | null;
  school: string | null;
  faculty: string | null;
  profileExists: boolean;
};

export type StudentRoomResponse = {
  roomId: string;
  room: RoomDetailInfo;
  totalStudents: number;
  students: StudentRoommate[];
};
