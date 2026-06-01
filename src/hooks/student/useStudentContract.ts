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
      if (response.data && response.data.room) {
        const studentInfo = response.data.student;
        const roomInfo = response.data.room;
        const bookingInfo = response.data.booking;

        const monthlyPrice = bookingInfo ? bookingInfo.monthlyRent : 0;
        const deposit = bookingInfo?.fees?.find(
          f => f.feeName.toLowerCase().includes("cọc") || f.feeName.toLowerCase().includes("deposit")
        )?.amount ?? monthlyPrice;

        setContract({
          id: response.data.code || response.data.contractTemplateId,
          studentName: studentInfo.fullName || "Sinh viên",
          studentId: studentInfo.studentId,
          roomName: `Phòng ${roomInfo.roomNumber}`,
          buildingName: roomInfo.buildingCode ? `Tòa ${roomInfo.buildingCode}` : "Ký túc xá",
          startDate: response.data.effectiveFrom,
          endDate: response.data.effectiveTo || "Hạn dài",
          monthlyPrice,
          deposit,
          contractTemplateId: response.data.contractTemplateId,
          signedDate: response.data.effectiveFrom,
          createdAt: response.data.effectiveFrom,
          updatedAt: response.data.effectiveFrom,
          code: response.data.code,
          name: response.data.name,
          version: response.data.version,
          content: response.data.content,
        } as any);
      } else {
        setContract(null);
      }
    } catch (error) {
      console.error("Lỗi khi tải hợp đồng của tôi:", error);
      setContract(null);
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
