import { useState, useEffect } from "react";
import { getStudentInvoiceDetail } from "@/services/billing/billing.api";
import { ManagerInvoiceDetail } from "@/services/billing/billing.types";

export function useStudentInvoiceDetail(invoiceId?: string, visible?: boolean) {
  const [detail, setDetail] = useState<ManagerInvoiceDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      if (visible && invoiceId) {
        try {
          setLoading(true);
          const res = await getStudentInvoiceDetail(invoiceId);
          if (res.data) {
            setDetail(res.data);
          }
        } catch (e) {
          console.log("Error loading student invoice details:", e);
          setDetail(null);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchDetail();
  }, [invoiceId, visible]);

  return {
    detail,
    loading,
    setDetail,
  };
}
