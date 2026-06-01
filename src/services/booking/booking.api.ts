import { ApiResponse } from "../base.types";
import { http } from "../http";
import { CreateBookingPayload, CreateBookingResponse, FeeTemplate, GetRegistrationHistoryParams, RegistrationItem } from "./booking.types";

export async function getRegistrationHistory(params?: GetRegistrationHistoryParams) {
  const { data } = await http.get<ApiResponse<RegistrationItem[]>>("/api/bookings", { 
    params 
  });
  return data.data;
}

export async function getFeeTemplates() {
  const { data } = await http.get<ApiResponse<FeeTemplate[]>>("/api/bookings/fee-templates");
  return data.data;
}

export async function createBooking(payload: CreateBookingPayload) {
  const { data } = await http.post<ApiResponse<CreateBookingResponse>>("/api/bookings", payload);
  return data.data;
}
