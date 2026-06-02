// --- Manager Billing Types ---
export type UtilityReading = {
  lastReading: number;
  currentReading: number;
  consumption: number;
  unitPrice: number;
  total: number;
};

export type ServiceFee = {
  id: string;
  name: string;
  amount: number;
};

export type CreateInvoiceRequest = {
  roomId: string;
  month: number;
  year: number;
  electricityIndex: number;
  waterIndex: number;
  surcharges: {
    name: string;
    amount: number;
  }[];
};

export type CreateInvoiceResponse = {
  invoiceId: string;
  roomId: string;
  studentId: string;
  month: number;
  year: number;
  roomCapacity: number;
  electricityOldIndex: number;
  electricityNewIndex: number;
  electricityUsage: number;
  electricitySubtotal: number;
  electricityVatAmount: number;
  electricityAmount: number;
  waterOldIndex: number;
  waterNewIndex: number;
  waterUsage: number;
  waterAmount: number;
  surchargeTotal: number;
  totalAmount: number;
  status: string;
};

export type UtilityTierSnapshot = {
  tierName: string;
  fromUsage: number;
  toUsage: number | null;
  usage: number;
  unitPrice: number;
  amount: number;
};

export type Surcharge = {
  id: string;
  name: string;
  amount: number;
  createdAt: string;
};

export type ManagerInvoiceDetail = {
  invoiceId: string;
  roomId: string;
  studentId: string;
  month: number;
  year: number;
  electricityOldIndex: number;
  electricityNewIndex: number;
  electricityUsage: number;
  electricityTierSnapshot: UtilityTierSnapshot[];
  electricityAmount: number;
  waterOldIndex: number;
  waterNewIndex: number;
  waterUsage: number;
  waterTierSnapshot: UtilityTierSnapshot[];
  waterAmount: number;
  surcharges: Surcharge[];
  surchargeTotal: number;
  totalAmount: number;
  status: string;
  paidAt: string | null;
  updatedByUserId: string | null;
  contractTemplateId: string | null;
  buildingBankAccount?: {
    bankCode: string;
    accountNumber: string;
    accountName: string;
  } | null;
  createdAt: string;
  updatedAt: string;
};

export type InvoiceSummary = {
  id: string;
  roomId: string;
  roomName: string;
  totalAmount: number;
  status: InvoiceStatus;
  createdAt: string;
  electricity?: { consumption: number; amount: number };
  water?: { consumption: number; amount: number };
  otherFeesTotal?: number;
};



export type GetStudentInvoicesParams = {
  year?: number;
  month?: number;
  status?: string | number;
  page?: number;
  pageSize?: number;
};

export type StudentInvoiceResponse = {
  invoiceId: string;
  roomId: string;
  month: number;
  year: number;
  totalAmount: number;
  status: string;
  paidAt: string | null;
  createdAt: string;
};

export type ConfirmPaymentResponse = {
  invoiceId: string;
  status: string;
  paidAt: string;
  updatedByUserId: string;
  totalAmount: number;
};

export type GetFinancialSummaryParams = {
  periodType: "month" | "quarter" | "year";
  year: number;
  month?: number;
  quarter?: number;
};

export type FinancialSummaryResponse = {
  periodType: string;
  year: number;
  month: number | null;
  quarter: number | null;
  totalRevenue: number;
  totalOutstanding: number;
  paidInvoiceCount: number;
  unpaidInvoiceCount: number;
};

export type LastReadingsResponse = {
  roomId: string;
  roomNumber: string;
  buildingCode: string;
  floor: number;
  electricityOldIndex: number;
  waterOldIndex: number;
  hasPreviousInvoice: boolean;
  sourceInvoiceId: string | null;
  sourceMonth: number | null;
  sourceYear: number | null;
  sourceCreatedAt: string | null;
};

export type GetUtilityHistoryParams = {
  year?: number;
  limit?: number;
};

export type UtilityHistoryResponse = {
  month: number;
  year: number;
  electricityAmount: number;
  waterAmount: number;
};

export type InvoiceStatus = "Unpaid" | "WaitForConfirm" | "Paid" | "Canceled";

export type InvoiceBreakdown = {
  label: string;
  amount: number;
};

export type Invoice = {
  id: string;
  title: string;
  amount: number;
  dueDate: string;
  status: InvoiceStatus;
  paidDate?: string;
  type: string;
  breakdown?: InvoiceBreakdown[];
};

export type UtilityHistoryData = {
  month: string;
  electricity: number;
  water: number;
};

export type CancelInvoiceResponse = {
  invoiceId: string;
  status: string;
  canceledAt: string;
  updatedByUserId: string;
};

export type GetManagerInvoicesParams = {
  buildingCode?: string;
  floor?: number;
  year?: number;
  month?: number;
  status?: string;
  page?: number;
  pageSize?: number;
};

export type ManagerInvoiceResponse = {
  invoiceId: string;
  roomId: string;
  buildingCode: string | null;
  floor: number | null;
  studentId: string;
  month: number;
  year: number;
  totalAmount: number;
  status: string;
  paidAt: string | null;
  createdAt: string;
};

