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

