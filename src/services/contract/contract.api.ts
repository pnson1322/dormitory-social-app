import { http } from "../http";
import { GetStudentContractResponse } from "./contract.types";

export const contractApi = {
  getMyContract: async (): Promise<GetStudentContractResponse> => {
    const response = await http.get<GetStudentContractResponse>("/api/student/contract/my-contract");
    return response.data;
  },
};
