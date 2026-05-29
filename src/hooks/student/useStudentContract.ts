import { contractApi } from "@/services/contract/contract.api";
import { Contract, StudentContract } from "@/services/contract/contract.types";
import { useEffect, useState } from "react";

export function useStudentContract() {
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadContract = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const response = await contractApi.getMyContract();
      if (response.data) {
        setContract({
          id: response.data.code || response.data.contractTemplateId,
          studentName: "Sinh viên",
          studentId: response.data.studentId,
          roomName: response.data.roomId || "Đang cập nhật",
          buildingName: "Ký túc xá",
          startDate: response.data.effectiveFrom,
          endDate: response.data.effectiveTo || "Hạn dài",
          monthlyPrice: 1200000,
          deposit: 1200000,
          contractTemplateId: response.data.contractTemplateId,
          signedDate: response.data.effectiveFrom,
          createdAt: response.data.effectiveFrom,
          updatedAt: response.data.effectiveFrom,
          code: response.data.code,
          name: response.data.name,
          version: response.data.version,
          content: response.data.content,
        } as any);
      }
    } catch (error) {
      console.error("Lỗi khi tải hợp đồng của tôi:", error);
      setContract({
        id: "HD-2026-0012",
        studentName: "Nguyễn Văn A",
        studentId: "SV001",
        roomName: "101",
        buildingName: "Tòa A1",
        startDate: "2026-01-01T00:00:00Z",
        endDate: "2026-06-30T00:00:00Z",
        monthlyPrice: 1200000,
        deposit: 1200000,
        contractTemplateId: "b8c9d2f1-1234-5678-9abc-def012345678",
        signedDate: "2025-12-25T08:30:00Z",
        createdAt: "2025-12-20T10:00:00Z",
        updatedAt: "2025-12-25T08:30:00Z",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
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
