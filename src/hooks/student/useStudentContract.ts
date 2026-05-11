import { useState, useEffect } from "react";

export type Contract = {
  id: string;
  studentName: string;
  studentId: string;
  roomName: string;
  buildingName: string;
  startDate: string;
  endDate: string;
  monthlyPrice: number;
  deposit: number;
  status: "ACTIVE" | "EXPIRED" | "TERMINATED";
  signedDate: string;
};

const MOCK_CONTRACT: Contract = {
  id: "HD-2026-0012",
  studentName: "Nguyễn Văn A",
  studentId: "SV001",
  roomName: "101",
  buildingName: "Tòa A1",
  startDate: "01/01/2026",
  endDate: "30/06/2026",
  monthlyPrice: 1200000,
  deposit: 1200000,
  status: "ACTIVE",
  signedDate: "25/12/2025",
};

export function useStudentContract() {
  const [contract, setContract] = useState<Contract | null>(MOCK_CONTRACT);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadContract = (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setRefreshing(false);
    }, 1500);
  };

  useEffect(() => {
    loadContract();
  }, []);

  const onRefresh = () => {
    loadContract(true);
  };

  return {
    contract,
    loading,
    refreshing,
    onRefresh,
  };
}
