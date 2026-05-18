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
  electricity: UtilityReading;
  water: UtilityReading;
  otherFees: ServiceFee[];
  totalAmount: number;
};

export type InvoiceSummary = {
  id: string;
  roomId: string;
  roomName: string;
  totalAmount: number;
  status: "PENDING" | "PAID";
  createdAt: string;
  electricity?: { consumption: number; amount: number };
  water?: { consumption: number; amount: number };
  otherFeesTotal?: number;
};

// --- Student Billing Types ---
export type StudentInvoiceStatus = "UNPAID" | "PAID";

export type StudentInvoiceCategory = "MONTHLY" | "REGISTRATION" | "SERVICE" | "OTHER";

export type FeeType = "ROOM" | "ELECTRICITY" | "WATER" | "SERVICE" | "DEPOSIT" | "OTHER";

export type StudentInvoiceBreakdown = {
  id?: string;
  label: string;
  amount: number;
  type: FeeType;
  metadata?: {
    lastReading?: number;
    currentReading?: number;
    consumption?: number;
    unitPrice?: number;
  };
};

export type StudentInvoice = {
  id: string;
  title: string;
  amount: number;
  dueDate: string;
  status: StudentInvoiceStatus;
  paidDate?: string;
  category: StudentInvoiceCategory;
  typeLabel: string; 
  description?: string;
  breakdown?: StudentInvoiceBreakdown[];
};

export type GetStudentInvoicesParams = {
  Page?: number;
  PageSize?: number;
  Status?: StudentInvoiceStatus;
  Search?: string;
  Category?: StudentInvoiceCategory;
};

export type PaymentProcessResponse = {
  paymentUrl: string;
  orderId: string;
};

