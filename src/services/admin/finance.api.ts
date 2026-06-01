import { ApiResponse } from '@/services/base.types';
import { http } from '@/services/http';
import { FinancialStats, GetFinancialStatsParams } from './finance.types';

export async function getFinancialStats(params: GetFinancialStatsParams) {
  const { data } = await http.get<ApiResponse<FinancialStats>>('/api/billing/reports/financial-summary', {
    params,
  });
  return data.data;
}
