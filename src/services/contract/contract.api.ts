import { http } from "../http";
import { GetStudentContractResponse, GetContractTemplateResponse } from "./contract.types";

export const contractApi = {
  getMyContract: async (): Promise<GetStudentContractResponse> => {
    const response = await http.get<GetStudentContractResponse>("/api/student/contract/my-contract");
    return response.data;
  },

  getContractTemplate: async (templateId: string): Promise<GetContractTemplateResponse> => {
    const response = await http.get<GetContractTemplateResponse>(`/api/student/contract/template/${templateId}`);
    return response.data;
  },
};

