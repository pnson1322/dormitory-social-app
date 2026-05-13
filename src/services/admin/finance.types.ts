export type FilterType = 'MONTH' | 'QUARTER' | 'YEAR';

export type FilterPeriod = {
  type: FilterType;
  month?: number;
  year: number;
};

export type RevenueChart = {
  labels: string[];
  datasets: {
    data: number[];
  }[];
};

export type DebtChartItem = {
  name: string;
  population: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
};

export type DebtRatioData = DebtChartItem[];

export type FinancialStats = {
  totalRevenue: number;
  totalDebt: number;
  paidInvoices: number;
  pendingInvoices: number;
  revenueChart: RevenueChart;
  debtChart: DebtRatioData;
};

export type GetFinancialStatsParams = {
  type: FilterType;
  month?: number;
  year: number;
};
