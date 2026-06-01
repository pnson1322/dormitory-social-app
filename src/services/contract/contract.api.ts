import { http } from "../http";
import {
  GetRoomTypeContractTemplateResponse,
  GetStudentContractResponse
} from "./contract.types";

export const contractApi = {
  getMyContract: async (): Promise<GetStudentContractResponse> => {
    const response = await http.get<GetStudentContractResponse>("/api/billing/contracts/me");
    console.log(response.data);
    return response.data;
  },

  getRoomTypeContractTemplate: async (
    roomTypeId: string,
    effectiveDate?: string
  ): Promise<GetRoomTypeContractTemplateResponse> => {
    const response = await http.get<GetRoomTypeContractTemplateResponse>(
      `/api/billing/contract-templates/room-types/${roomTypeId}`,
      {
        params: effectiveDate ? { effectiveDate } : undefined,
      }
    );
    return response.data;
  },
};

