import { useState, useEffect, useCallback } from 'react';
import { getApiErrorMessage } from '@/services/apiError';
import { FinancialStats, FilterPeriod, GetFinancialStatsParams } from '@/services/admin/finance.types';
import { getFinancialStats } from '@/services/admin/finance.api';

export function useAdminFinance() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<FinancialStats | null>(null);
  const [filter, setFilter] = useState<FilterPeriod>({
    type: "MONTH",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (selectedFilter: GetFinancialStatsParams) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getFinancialStats(selectedFilter);
      setStats(data);
    } catch (err) {
      setError(getApiErrorMessage(err, "Không thể tải dữ liệu thống kê."));

    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(filter);
  }, [filter, fetchData]);

  return {
    loading,
    stats,
    filter,
    setFilter,
    error,
    refresh: () => fetchData(filter),
  };
}
