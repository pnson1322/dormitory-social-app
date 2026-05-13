import { ApiResponse } from "../base.types";

export type ContractStatus = "ACTIVE" | "EXPIRED" | "TERMINATED" | "WAITING_SIGN";

export interface Contract {
  id: string;
  studentName: string;
  studentId: string;
  roomName: string;
  buildingName: string;
  startDate: string; 
  endDate: string;  
  monthlyPrice: number;
  deposit: number;
  status: ContractStatus;
  signedDate: string | null; 
  contractUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export type GetStudentContractResponse = ApiResponse<Contract | null>;
