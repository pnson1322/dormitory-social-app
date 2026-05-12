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
