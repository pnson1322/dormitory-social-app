import { getFeeTemplates } from "@/services/booking/booking.api";
import { FeeTemplate } from "@/services/booking/booking.types";
import { useEffect, useState } from "react";
import { getApiErrorMessage } from "@/services/apiError";

export function useFeeTemplates() {
  const [fees, setFees] = useState<FeeTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function loadFees() {
      try {
        setLoading(true);
        const data = await getFeeTemplates();
        if (mounted) {
          setFees(data);
        }
      } catch (err: any) {
        if (mounted) {
          setError(getApiErrorMessage(err, "Không thể tải danh sách phí"));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadFees();

    return () => {
      mounted = false;
    };
  }, []);

  return { fees, loading, error };
}
