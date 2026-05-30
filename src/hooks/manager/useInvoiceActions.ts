import { useState } from "react";
import { cancelInvoice, updateInvoiceStatus } from "@/services/billing/billing.api";

export function useInvoiceActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const confirmPayment = async (invoiceId: string) => {
    try {
      setLoading(true);
      setError(null);
      await updateInvoiceStatus(invoiceId);
      return true;
    } catch (err) {
      setError("Không thể cập nhật trạng thái thanh toán.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleCancelInvoice = async (invoiceId: string) => {
    try {
      setLoading(true);
      setError(null);
      await cancelInvoice(invoiceId);
      return true;
    } catch (err) {
      setError("Không thể hủy hóa đơn này.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    confirmPayment,
    handleCancelInvoice,
    loading,
    error,
  };
}
