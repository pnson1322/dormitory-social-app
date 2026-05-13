import { ApiResponse } from "../base.types";
import { http } from "../http";
import { RegistrationItem, GetRegistrationHistoryParams } from "./booking.types";

export async function getRegistrationHistory(params?: GetRegistrationHistoryParams) {
  const { data } = await http.get<ApiResponse<RegistrationItem[]>>("/api/bookings", { 
    params 
  });
  return data.data;
}
