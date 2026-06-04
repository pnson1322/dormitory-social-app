import { createInvoice, getInvoiceDetails, getLastReadings } from "@/services/billing/billing.api";
import { ServiceFee } from "@/services/billing/billing.types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getApiErrorMessage } from "@/services/apiError";

export type ConsumptionInfo = {
  lastReading: number;
  currentReading: number;
  consumption: number;
};

export function useUtilityManagement() {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [lastReadings, setLastReadings] = useState({ electricity: 0, water: 0 });
  const [currentReadings, setCurrentReadings] = useState({ electricity: 0, water: 0 });
  const [otherFees, setOtherFees] = useState<ServiceFee[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingReadings, setFetchingReadings] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReadings = useCallback(async (id: string) => {
    try {
      setFetchingReadings(true);
      const data = await getLastReadings(id);
      setLastReadings(data);
      setCurrentReadings(data); 
    } catch (err) {

    } finally {
      setFetchingReadings(false);
    }
  }, []);

  const fetchInvoiceDetailsForEdit = useCallback(async (invoiceId: string) => {
    try {
      setFetchingReadings(true);
      const response = await getInvoiceDetails(invoiceId);
      const data = response.data;
      if (data) {
        setRoomId(data.roomId);
        setLastReadings({
          electricity: data.electricityOldIndex,
          water: data.waterOldIndex
        });
        setCurrentReadings({
          electricity: data.electricityNewIndex,
          water: data.waterNewIndex
        });
        setOtherFees(data.surcharges.map(s => ({ id: s.id, name: s.name, amount: s.amount })));
      }
    } catch (err) {
      setError(getApiErrorMessage(err, "Không thể tải thông tin hóa đơn."));
    } finally {
      setFetchingReadings(false);
    }
  }, []);

  useEffect(() => {
  }, [roomId, fetchReadings]);

  const electricity: ConsumptionInfo = useMemo(() => {
    const consumption = Math.max(0, currentReadings.electricity - lastReadings.electricity);
    return {
      lastReading: lastReadings.electricity,
      currentReading: currentReadings.electricity,
      consumption,
    };
  }, [lastReadings.electricity, currentReadings.electricity]);

  const water: ConsumptionInfo = useMemo(() => {
    const consumption = Math.max(0, currentReadings.water - lastReadings.water);
    return {
      lastReading: lastReadings.water,
      currentReading: currentReadings.water,
      consumption,
    };
  }, [lastReadings.water, currentReadings.water]);

  const otherFeesTotal = useMemo(() => {
    return otherFees.reduce((acc, fee) => acc + fee.amount, 0);
  }, [otherFees]);

  const isValid = useMemo(() => {
    return (
      roomId !== null &&
      currentReadings.electricity >= lastReadings.electricity &&
      currentReadings.water >= lastReadings.water &&
      (currentReadings.electricity > lastReadings.electricity || 
       currentReadings.water > lastReadings.water || 
       otherFees.length > 0)
    );
  }, [currentReadings, lastReadings, roomId, otherFees]);

  const addOtherFee = (name: string, amount: number) => {
    const newFee: ServiceFee = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      amount,
    };
    setOtherFees(prev => [...prev, newFee]);
  };

  const removeOtherFee = (id: string) => {
    setOtherFees(prev => prev.filter(f => f.id !== id));
  };

  const resetForm = useCallback(() => {
    setRoomId(null);
    setLastReadings({ electricity: 0, water: 0 });
    setCurrentReadings({ electricity: 0, water: 0 });
    setOtherFees([]);
    setError(null);
  }, []);

  const submitInvoice = async (isUpdate = false, invoiceId?: string): Promise<true | string> => {
    if (!isValid || !roomId) return "Thông tin hóa đơn không hợp lệ.";

    try {
      setLoading(true);
      setError(null);
      await createInvoice({
        roomId,
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        electricityIndex: electricity.currentReading,
        waterIndex: water.currentReading,
        surcharges: otherFees.map(f => ({ name: f.name, amount: f.amount })),
      });
      return true;
    } catch (err) {
      const msg = getApiErrorMessage(err, `Không thể ${isUpdate ? "cập nhật" : "tạo"} hóa đơn. Vui lòng thử lại.`);
      setError(msg);
      return msg;
    } finally {
      setLoading(false);
    }
  };

  return {
    roomId,
    setRoomId,
    lastReadings,
    currentReadings,
    setCurrentReadings,
    electricity,
    water,
    otherFees,
    addOtherFee,
    removeOtherFee,
    otherFeesTotal,
    isValid,
    loading,
    fetchingReadings,
    error,
    submitInvoice,
    resetForm,
    fetchReadings,
    fetchInvoiceDetailsForEdit,
  };
}
