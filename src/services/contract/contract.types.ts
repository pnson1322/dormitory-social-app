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
  student: {
    studentId: string;
    fullName: string | null;
  };
  room: {
    roomId: string;
    roomNumber: string;
    buildingCode: string | null;
    floor: number | null;
    roomTypeId: string | null;
    roomTypeName: string | null;
    capacity: number | null;
    status: string | null;
  } | null;
  booking: {
    bookingId: string;
    termName: string;
    startDate: string;
    endDate: string;
    numberOfMonths: number;
    monthlyRent: number;
    baseRentTotal: number;
    bookingFeeTotal: number;
    totalBookingAmount: number;
    status: string;
    fees?: {
      id: string;
      feeName: string;
      amount: number;
      isRefundable: boolean;
    }[];
  } | null;
  latestInvoiceId: string | null;
  contractTemplateId: string;
  roomTypeId: string | null;
  code: string;
  name: string;
  version: number;
  content: string;
  effectiveFrom: string;
  effectiveTo: string | null;
  source: string;
}

export type GetStudentContractResponse = ApiResponse<StudentContract | null>;

export interface RoomTypeContractTemplate {
  contractTemplateId: string;
  roomTypeId: string | null;
  code: string;
  name: string;
  version: number;
  content: string;
  effectiveFrom: string;
  effectiveTo: string | null;
  source: string;
}

export type GetRoomTypeContractTemplateResponse = ApiResponse<RoomTypeContractTemplate | null>;

