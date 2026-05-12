import { CreateInvoiceRequest, InvoiceSummary } from "./billing.types";

export async function createInvoice(data: CreateInvoiceRequest): Promise<{ id: string }> {
  console.log("Creating invoice:", data);
  await new Promise(resolve => setTimeout(resolve, 2000)); 
  return { id: `INV-${Math.floor(Math.random() * 100000)}` };
}

export async function getLastReadings(roomId: string): Promise<{ electricity: number, water: number }> {
  console.log("Fetching last readings for room:", roomId);
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    electricity: 1250, 
    water: 450,
  };
}

export async function updateInvoiceStatus(id: string, status: "PAID" | "PENDING"): Promise<boolean> {
  console.log(`Updating invoice ${id} to ${status}`);
  await new Promise(resolve => setTimeout(resolve, 1500));
  return true;
}

export async function cancelInvoice(id: string): Promise<boolean> {
  console.log(`Cancelling invoice ${id}`);
  await new Promise(resolve => setTimeout(resolve, 1500));
  return true;
}

export async function getInvoiceDetails(id: string): Promise<CreateInvoiceRequest> {
  console.log(`Fetching details for invoice ${id}`);
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    roomId: "ROOM-101",
    month: 5,
    year: 2026,
    electricity: { lastReading: 1200, currentReading: 1350, consumption: 150, unitPrice: 3500, total: 525000 },
    water: { lastReading: 400, currentReading: 425, consumption: 25, unitPrice: 15000, total: 375000 },
    otherFees: [
      { id: "1", name: "Dịch vụ vệ sinh", amount: 100000 },
      { id: "2", name: "Phí bảo vệ", amount: 50000 }
    ],
    totalAmount: 1050000
  };
}
