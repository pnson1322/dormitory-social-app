import { http } from "../http";
import { GetContractTemplateResponse, GetStudentContractResponse } from "./contract.types";

export const contractApi = {
  getMyContract: async (): Promise<GetStudentContractResponse> => {
    const response = await http.get<GetStudentContractResponse>("/api/billing/contracts/me");
    console.log(response.data);
    return response.data;
  },

  getContractTemplate: async (templateId: string): Promise<GetContractTemplateResponse> => {
    const response = await http.get<GetContractTemplateResponse>(`/api/student/contract/template/${templateId}`);
    return response.data;
  },
};

