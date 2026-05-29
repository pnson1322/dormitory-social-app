import { ApiResponse } from "../base.types";

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
  contractTemplateId: string;
  signedDate: string | null; 
  createdAt: string;
  updatedAt: string;
}

export interface StudentContract {
  studentId: string;
  latestInvoiceId: string | null;
  roomId: string | null;
  contractTemplateId: string;
  code: string;
  name: string;
  version: number;
  content: string;
  effectiveFrom: string;
  effectiveTo: string | null;
  source: string;
}

export type GetStudentContractResponse = ApiResponse<StudentContract | null>;

export interface ContractTemplate {
  id: string;
  code: string;
  name: string;
  version: number;
  content: string;
  isActive: boolean;
  effectiveFrom: string;
  effectiveTo: string | null;
  createdAt: string;
  updatedAt: string;
}

export type GetContractTemplateResponse = ApiResponse<ContractTemplate | null>;
