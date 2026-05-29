import { ApiResponse } from "../base.types";
import { http } from "../http";
import {
  CancelInvoiceResponse,
  ConfirmPaymentResponse,
  CreateInvoiceRequest,
  CreateInvoiceResponse,
  FinancialSummaryResponse,
  GetFinancialSummaryParams,
  GetManagerInvoicesParams,
  GetStudentInvoicesParams,
  GetUtilityHistoryParams,
  LastReadingsResponse,
  ManagerInvoiceDetail,
  ManagerInvoiceResponse,
  PaymentProcessResponse,
  StudentInvoiceResponse,
  StudentInvoiceStatus,
  UtilityHistoryResponse
} from "./billing.types";

// --- Manager Billing APIs ---
export async function createInvoice(data: CreateInvoiceRequest) {
  const response = await http.post<ApiResponse<CreateInvoiceResponse>>("/api/billing/invoices", data);
  return response.data;
}

export async function getManagerInvoices(params: GetManagerInvoicesParams) {
  const response = await http.get<ApiResponse<ManagerInvoiceResponse[]>>("/api/billing/invoices", { params });
  return response.data;
}

export async function getLastReadings(roomId: string): Promise<{ electricity: number, water: number }> {
  const response = await http.get<ApiResponse<LastReadingsResponse>>(`/api/billing/rooms/${roomId}/last-readings`);
  const data = response.data.data;
  return {
    electricity: data ? data.electricityOldIndex : 0,
    water: data ? data.waterOldIndex : 0,
  };
}

export async function updateInvoiceStatus(id: string) {
  const response = await http.patch<ApiResponse<ConfirmPaymentResponse>>(`/api/billing/invoices/${id}/payment`);
  return response.data;
}

export async function cancelInvoice(id: string) {
  const response = await http.delete<ApiResponse<CancelInvoiceResponse>>(`/api/billing/invoices/${id}`);
  return response.data;
}

export async function getInvoiceDetails(id: string) {
  const response = await http.get<ApiResponse<ManagerInvoiceDetail>>(`/api/billing/invoices/${id}`);
  return response.data;
}

export async function getFinancialSummary(params: GetFinancialSummaryParams) {
  const response = await http.get<ApiResponse<FinancialSummaryResponse>>("/api/billing/reports/financial-summary", {
    params
  });
  return response.data;
}

// --- Student Billing APIs ---
export async function getStudentInvoices(params: GetStudentInvoicesParams) {
  const response = await http.get<ApiResponse<StudentInvoiceResponse[]>>("/api/billing/invoices/me", {
    params
  });
  return response.data;
}

export async function getStudentInvoiceDetail(id: string) {
  const response = await http.get<ApiResponse<ManagerInvoiceDetail>>(`/api/billing/invoices/me/${id}`);
  return response.data;
}

export async function processInvoicePayment(id: string) {
  const response = await http.post<ApiResponse<PaymentProcessResponse>>(`/api/student/invoices/${id}/pay`);
  return response.data;
}

export async function checkPaymentStatus(orderId: string) {
  const response = await http.get<ApiResponse<{ status: StudentInvoiceStatus }>>(`/api/student/invoices/payment-status/${orderId}`);
  return response.data;
}

export async function getUtilityHistory(params: GetUtilityHistoryParams) {
  const response = await http.get<ApiResponse<UtilityHistoryResponse[]>>("/api/billing/reports/me/utility-history", { params });
  return response.data;
}
