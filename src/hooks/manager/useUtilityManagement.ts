import { createInvoice, getInvoiceDetails, getLastReadings } from "@/services/billing/billing.api";
import { ServiceFee, UtilityReading } from "@/services/billing/billing.types";
import { useCallback, useEffect, useMemo, useState } from "react";

const ELECTRICITY_PRICE = 3500; 
const WATER_PRICE = 15000;    

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
      console.error(err);
    } finally {
      setFetchingReadings(false);
    }
  }, []);

  const fetchInvoiceDetailsForEdit = useCallback(async (invoiceId: string) => {
    try {
      setFetchingReadings(true);
      const data = await getInvoiceDetails(invoiceId);
      setRoomId(data.roomId);
      setLastReadings({
        electricity: data.electricity.lastReading,
        water: data.water.lastReading
      });
      setCurrentReadings({
        electricity: data.electricity.currentReading,
        water: data.water.currentReading
      });
      setOtherFees(data.otherFees);
    } catch (err) {
      setError("Không thể tải thông tin hóa đơn.");
    } finally {
      setFetchingReadings(false);
    }
  }, []);

  useEffect(() => {
  }, [roomId, fetchReadings]);

  const electricity: UtilityReading = useMemo(() => {
    const consumption = Math.max(0, currentReadings.electricity - lastReadings.electricity);
    return {
      lastReading: lastReadings.electricity,
      currentReading: currentReadings.electricity,
      consumption,
      unitPrice: ELECTRICITY_PRICE,
      total: consumption * ELECTRICITY_PRICE,
    };
  }, [lastReadings.electricity, currentReadings.electricity]);

  const water: UtilityReading = useMemo(() => {
    const consumption = Math.max(0, currentReadings.water - lastReadings.water);
    return {
      lastReading: lastReadings.water,
      currentReading: currentReadings.water,
      consumption,
      unitPrice: WATER_PRICE,
      total: consumption * WATER_PRICE,
    };
  }, [lastReadings.water, currentReadings.water]);

  const otherFeesTotal = useMemo(() => {
    return otherFees.reduce((acc, fee) => acc + fee.amount, 0);
  }, [otherFees]);

  const totalAmount = useMemo(() => {
    return electricity.total + water.total + otherFeesTotal;
  }, [electricity.total, water.total, otherFeesTotal]);

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

  const submitInvoice = async (isUpdate = false, invoiceId?: string) => {
    if (!isValid || !roomId) return;

    try {
      setLoading(true);
      setError(null);
      await createInvoice({
        roomId,
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        electricity,
        water,
        otherFees,
        totalAmount,
      });
      return true;
    } catch (err) {
      setError(`Không thể ${isUpdate ? "cập nhật" : "tạo"} hóa đơn. Vui lòng thử lại.`);
      return false;
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
    totalAmount,
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

