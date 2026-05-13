import { contractApi } from "@/services/contract/contract.api";
import { Contract } from "@/services/contract/contract.types";
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
        setContract(response.data);
      }
    } catch (error) {
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
